import { useContext, useState } from 'react';
import { MyContext } from '../../utils/MyContext';

function AgencyBookings() {
  const {
    bookings,
    users,
    packages,
    destinations,
    confirmBooking,
    rejectBooking,
    addBookingPayment,
    getBookingPaymentDetails
  } = useContext(MyContext);

  const [search, setSearch] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [message, setMessage] = useState('');

  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Cash');
  const [paymentDate, setPaymentDate] = useState(() => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  });
  const [paymentNote, setPaymentNote] = useState('');

  // ==================================
  // 1. Get Related Booking Information
  // ==================================

  const getBookingDetails = (booking) => {
    const user = users.find(
      (item) => item.id === booking.userId
    );

    const travelPackage = packages.find(
      (item) => item.id === booking.packageId
    );

    const destination = travelPackage
      ? destinations.find(
          (item) => item.id === travelPackage.destinationId
        )
      : null;

    return {
      user,
      travelPackage,
      destination
    };
  };

  // ==================================
  // 2. Filter Bookings
  // ==================================

  const filteredBookings = bookings.filter((booking) => {
    const { user, travelPackage, destination } =
      getBookingDetails(booking);

    const searchValue = search.toLowerCase();

    const matchesSearch =
      String(booking.id).toLowerCase().includes(searchValue) ||
      (user?.name || '').toLowerCase().includes(searchValue) ||
      (user?.email || '').toLowerCase().includes(searchValue) ||
      (travelPackage?.name || '').toLowerCase().includes(searchValue) ||
      (destination?.name || '').toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedStatus === 'All' ||
      booking.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  // ==================================
  // 3. Booking Actions
  // ==================================

  const handleConfirm = (bookingId) => {
    const confirmed = confirmBooking(bookingId);

    if (confirmed) {
      setMessage('Booking confirmed successfully.');
    } else {
      setMessage(
        'Unable to confirm this booking. It may be invalid or its departure date has passed.'
      );
    }
  };

  const handleReject = (bookingId) => {
    const accepted = window.confirm(
      'Are you sure you want to reject this booking?'
    );

    if (!accepted) {
      return;
    }

    const rejected = rejectBooking(bookingId);

    if (rejected) {
      setMessage('Booking rejected successfully.');
    } else {
      setMessage('Unable to reject this booking.');
    }
  };

  // ==================================
  // 4. Payment Actions
  // ==================================

  const openPaymentForm = (bookingId) => {
    setSelectedBookingId(bookingId);
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setPaymentNote('');
    setMessage('');
  };

  const closePaymentForm = () => {
    setSelectedBookingId(null);
    setPaymentAmount('');
    setPaymentMethod('Cash');
    setPaymentNote('');
  };

  const handleAddPayment = (e) => {
    e.preventDefault();

    if (!selectedBookingId) {
      return;
    }

    const added = addBookingPayment(selectedBookingId, {
      amount: paymentAmount,
      method: paymentMethod,
      date: paymentDate,
      note: paymentNote
    });

    if (added) {
      setMessage('Payment recorded successfully.');
      closePaymentForm();
    } else {
      setMessage(
        'Unable to record payment. Check the amount, date, booking status and remaining balance.'
      );
    }
  };

  // ==================================
  // 5. Format Values
  // ==================================

  const formatDate = (date) => {
    if (!date) {
      return 'Not available';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return 'Not available';
    }

    return parsedDate.toLocaleDateString('en-GB');
  };

  const formatDateTime = (date) => {
    if (!date) {
      return 'Not available';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return 'Not available';
    }

    return parsedDate.toLocaleString('en-GB');
  };

  const formatMAD = (amount) => {
    return `${Number(amount || 0).toLocaleString('en-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} MAD`;
  };

  // ==================================
  // 6. Status Styles
  // ==================================

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'Confirmed':
        return 'bg-green-100 text-green-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      case 'Cancelled':
        return 'bg-gray-100 text-gray-700';

      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPaymentStatusStyle = (status) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';

      case 'Partially Paid':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-red-100 text-red-700';
    }
  };

  // ==================================
  // 7. Statistics
  // ==================================

  const pendingCount = bookings.filter(
    (booking) => booking.status === 'Pending'
  ).length;

  const confirmedCount = bookings.filter(
    (booking) => booking.status === 'Confirmed'
  ).length;

  const rejectedCount = bookings.filter(
    (booking) => booking.status === 'Rejected'
  ).length;

  const cancelledCount = bookings.filter(
    (booking) => booking.status === 'Cancelled'
  ).length;

  const selectedBooking = bookings.find(
    (booking) => booking.id === selectedBookingId
  );

  const selectedPaymentDetails = selectedBooking
    ? getBookingPaymentDetails(selectedBooking.id)
    : null;

  // ==================================
  // 8. Shared Booking Actions
  // ==================================

  const renderBookingActions = (booking, paymentDetails) => {
    if (booking.status === 'Pending') {
      return (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => handleConfirm(booking.id)}
            className="flex-1 rounded-lg bg-green-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-green-700"
          >
            Confirm
          </button>

          <button
            type="button"
            onClick={() => handleReject(booking.id)}
            className="flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-red-700"
          >
            Reject
          </button>
        </div>
      );
    }

    if (
      booking.status === 'Confirmed' &&
      paymentDetails?.remainingAmount > 0
    ) {
      return (
        <button
          type="button"
          onClick={() => openPaymentForm(booking.id)}
          className="w-full rounded-lg bg-teal-700 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-teal-800"
        >
          Record Payment
        </button>
      );
    }

    if (booking.status === 'Confirmed') {
      return (
        <span className="text-xs font-semibold text-green-600">
          Fully Paid
        </span>
      );
    }

    return (
      <span className="text-xs text-gray-400">
        No actions available
      </span>
    );
  };

  // ==================================
  // 9. Payment History
  // ==================================

  const renderPaymentHistory = (paymentDetails) => {
    if (!paymentDetails?.payments?.length) {
      return (
        <p className="mt-2 text-xs text-gray-400">
          No payments recorded.
        </p>
      );
    }

    return (
      <details className="mt-3">
        <summary className="cursor-pointer text-xs font-semibold text-teal-700">
          Payment History ({paymentDetails.payments.length})
        </summary>

        <div className="mt-3 space-y-3 rounded-lg bg-gray-50 p-3">
          {paymentDetails.payments.map((payment) => (
            <div
              key={payment.id}
              className="border-b border-gray-200 pb-3 last:border-0 last:pb-0"
            >
              <p className="font-semibold text-gray-800">
                {formatMAD(payment.amount)}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {payment.method}
              </p>

              <p className="mt-1 text-xs text-gray-500">
                {formatDate(payment.date)}
              </p>

              {payment.note && (
                <p className="mt-1 break-words text-xs text-gray-400">
                  {payment.note}
                </p>
              )}
            </div>
          ))}
        </div>
      </details>
    );
  };

  // ==================================
  // 10. UI
  // ==================================

  return (
    <div className="min-w-0 space-y-6 sm:space-y-8">

      {/* Page Header */}

      <div>
        <span className="mb-3 inline-block rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
          MANAGEMENT
        </span>

        <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
          Booking Management
        </h1>

        <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
          Manage traveler bookings, reservation requests and payments.
        </p>
      </div>

      {/* Statistics */}

      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-5">

        <div className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">
            Total Bookings
          </p>

          <h2 className="mt-2 text-2xl font-bold text-gray-800 sm:text-3xl">
            {bookings.length}
          </h2>
        </div>

        <div className="rounded-xl border border-yellow-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">
            Pending
          </p>

          <h2 className="mt-2 text-2xl font-bold text-yellow-600 sm:text-3xl">
            {pendingCount}
          </h2>
        </div>

        <div className="rounded-xl border border-green-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">
            Confirmed
          </p>

          <h2 className="mt-2 text-2xl font-bold text-green-600 sm:text-3xl">
            {confirmedCount}
          </h2>
        </div>

        <div className="rounded-xl border border-red-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-xs text-gray-500 sm:text-sm">
            Rejected / Cancelled
          </p>

          <h2 className="mt-2 text-2xl font-bold text-red-600 sm:text-3xl">
            {rejectedCount + cancelledCount}
          </h2>
        </div>

      </div>

      {/* Feedback Message */}

      {message && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-teal-100 bg-teal-50 p-4 text-sm text-teal-800">
          <p className="break-words leading-6">
            {message}
          </p>

          <button
            type="button"
            onClick={() => setMessage('')}
            className="shrink-0 rounded-lg px-2 py-1 font-bold transition hover:bg-teal-100"
            aria-label="Close message"
          >
            ✕
          </button>
        </div>
      )}

      {/* Payment Form */}

      {selectedBooking && selectedPaymentDetails && (
        <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm sm:p-6">

          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-600">
                Manual Payment
              </p>

              <h2 className="mt-2 break-words text-lg font-bold text-gray-800 sm:text-xl">
                Record Payment for #{selectedBooking.id}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Remaining balance:
                <span className="font-bold text-orange-600">
                  {' '}{formatMAD(selectedPaymentDetails.remainingAmount)}
                </span>
              </p>
            </div>

            <button
              type="button"
              onClick={closePaymentForm}
              className="w-full rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-auto"
            >
              Close
            </button>

          </div>

          {selectedBooking.status !== 'Confirmed' ||
          selectedPaymentDetails.remainingAmount <= 0 ? (
            <p className="rounded-xl bg-yellow-50 p-4 text-sm leading-6 text-yellow-700">
              This booking cannot receive another payment.
            </p>
          ) : (
            <form onSubmit={handleAddPayment} className="space-y-5">

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Amount (MAD)
                  </label>

                  <input
                    type="number"
                    min="0.01"
                    max={selectedPaymentDetails.remainingAmount}
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    placeholder="Enter payment amount"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Method
                  </label>

                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    required
                    value={paymentDate}
                    onChange={(e) => setPaymentDate(e.target.value)}
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Note (Optional)
                  </label>

                  <input
                    type="text"
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    placeholder="Payment reference or note"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
                  />
                </div>

              </div>

              <div className="flex flex-col gap-3 sm:flex-row">

                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 sm:w-auto"
                >
                  Save Payment
                </button>

                <button
                  type="button"
                  onClick={closePaymentForm}
                  className="w-full rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 sm:w-auto"
                >
                  Cancel
                </button>

              </div>

            </form>
          )}

        </section>
      )}

      {/* Search and Filter */}

      <section className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5">

        <div className="mb-4">
          <h2 className="font-bold text-gray-800">
            Find Bookings
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Search and filter your reservation records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by traveler, email, package or destination..."
            className="min-w-0 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-50"
          >
            <option value="All">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Rejected">Rejected</option>
            <option value="Cancelled">Cancelled</option>
          </select>

        </div>

      </section>

      {/* Mobile Booking Cards: 700px and below */}

      <div className="min-[701px]:hidden space-y-4">

        {filteredBookings.map((booking) => {
          const {
            user,
            travelPackage,
            destination
          } = getBookingDetails(booking);

          const paymentDetails =
            getBookingPaymentDetails(booking.id);

          return (
            <article
              key={booking.id}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >

              <div className="flex flex-col gap-3 border-b border-gray-100 p-4 min-[500px]:flex-row min-[500px]:items-start min-[500px]:justify-between">

                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-400">
                    BOOKING REFERENCE
                  </p>

                  <h3 className="mt-1 break-all text-sm font-bold text-gray-800">
                    #{booking.id}
                  </h3>

                  <p className="mt-1 text-xs text-gray-400">
                    Created: {formatDateTime(booking.createdAt)}
                  </p>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                >
                  {booking.status}
                </span>

              </div>

              <div className="space-y-5 p-4">

                {/* Traveler */}

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Traveler
                  </p>

                  <p className="font-semibold text-gray-800">
                    {user?.name || 'Unknown traveler'}
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-500">
                    {user?.email || 'Email unavailable'}
                  </p>
                </div>

                <div className="border-t border-gray-100" />

                {/* Package */}

                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Travel Package
                  </p>

                  <p className="font-semibold text-gray-800">
                    {travelPackage?.name || 'Package unavailable'}
                  </p>

                  <p className="mt-1 text-sm text-teal-700">
                    {destination?.name || 'Destination unavailable'}
                  </p>
                </div>

                <div className="border-t border-gray-100" />

                {/* Travel Dates */}

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Travel Dates
                  </p>

                  <div className="grid grid-cols-2 gap-3">

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Departure
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDate(booking.departureDate)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Return
                      </p>

                      <p className="mt-1 text-sm font-semibold text-gray-800">
                        {formatDate(booking.returnDate)}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Travelers */}

                <div className="rounded-xl bg-gray-50 p-3">

                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Travelers
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center">

                    <div>
                      <p className="text-xs text-gray-400">
                        Adults
                      </p>

                      <p className="mt-1 font-bold text-gray-800">
                        {booking.adults}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Children
                      </p>

                      <p className="mt-1 font-bold text-gray-800">
                        {booking.children}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">
                        Total
                      </p>

                      <p className="mt-1 font-bold text-teal-700">
                        {Number(booking.adults) + Number(booking.children)}
                      </p>
                    </div>

                  </div>

                </div>

                {/* Payment Summary */}

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Payment Summary
                  </p>

                  <div className="grid grid-cols-1 gap-2 min-[500px]:grid-cols-3">

                    <div className="rounded-xl bg-gray-50 p-3">
                      <p className="text-xs text-gray-400">
                        Total Price
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-gray-800">
                        {formatMAD(paymentDetails?.totalPrice)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-green-50 p-3">
                      <p className="text-xs text-green-700">
                        Paid
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-green-700">
                        {formatMAD(paymentDetails?.amountPaid)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-orange-50 p-3">
                      <p className="text-xs text-orange-700">
                        Remaining
                      </p>

                      <p className="mt-1 break-words text-sm font-bold text-orange-700">
                        {formatMAD(paymentDetails?.remainingAmount)}
                      </p>
                    </div>

                  </div>
                </div>

                {/* Payment Status */}

                <div>
                  <p className="mb-2 text-xs font-semibold text-gray-400">
                    PAYMENT STATUS
                  </p>

                  <span
                    className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusStyle(paymentDetails?.paymentStatus)}`}
                  >
                    {paymentDetails?.paymentStatus || 'Unpaid'}
                  </span>
                </div>

                {renderPaymentHistory(paymentDetails)}

                <div className="border-t border-gray-100" />

                {/* Actions */}

                <div>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Booking Actions
                  </p>

                  {renderBookingActions(booking, paymentDetails)}
                </div>

              </div>

            </article>
          );
        })}

        {filteredBookings.length === 0 && (
          <div className="rounded-2xl border border-gray-100 bg-white px-4 py-12 text-center shadow-sm">
            <div className="mb-3 text-3xl">📋</div>

            <p className="font-semibold text-gray-700">
              No bookings found.
            </p>

            <p className="mt-2 text-sm text-gray-400">
              Try changing your search or status filter.
            </p>
          </div>
        )}

      </div>

      {/* Tablet and Desktop Bookings Table: 701px and above */}

      <div className="hidden min-[701px]:block overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1400px] text-left">

            <thead className="bg-gray-50 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-5 py-4">Booking</th>
                <th className="px-5 py-4">Traveler</th>
                <th className="px-5 py-4">Package</th>
                <th className="px-5 py-4">Travel Dates</th>
                <th className="px-5 py-4">Travelers</th>
                <th className="px-5 py-4">Total Price</th>
                <th className="px-5 py-4">Paid</th>
                <th className="px-5 py-4">Remaining</th>
                <th className="px-5 py-4">Payment Status</th>
                <th className="px-5 py-4">Booking Status</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {filteredBookings.map((booking) => {
                const {
                  user,
                  travelPackage,
                  destination
                } = getBookingDetails(booking);

                const paymentDetails =
                  getBookingPaymentDetails(booking.id);

                return (
                  <tr
                    key={booking.id}
                    className="text-sm text-gray-700 transition hover:bg-gray-50"
                  >

                    <td className="px-5 py-5">
                      <p className="font-semibold text-gray-800">
                        #{booking.id}
                      </p>

                      <p className="mt-1 text-xs text-gray-400">
                        {formatDateTime(booking.createdAt)}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-gray-800">
                        {user?.name || 'Unknown traveler'}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {user?.email || 'Email unavailable'}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-gray-800">
                        {travelPackage?.name || 'Package unavailable'}
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        {destination?.name || 'Destination unavailable'}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <p>
                        <span className="text-gray-400">From:</span>{' '}
                        {formatDate(booking.departureDate)}
                      </p>

                      <p className="mt-1">
                        <span className="text-gray-400">To:</span>{' '}
                        {formatDate(booking.returnDate)}
                      </p>
                    </td>

                    <td className="px-5 py-5">
                      <p>Adults: {booking.adults}</p>

                      <p className="mt-1">
                        Children: {booking.children}
                      </p>

                      <p className="mt-1 font-semibold">
                        Total: {Number(booking.adults) + Number(booking.children)}
                      </p>
                    </td>

                    <td className="px-5 py-5 font-semibold text-gray-800">
                      {formatMAD(paymentDetails?.totalPrice)}
                    </td>

                    <td className="px-5 py-5 font-semibold text-green-700">
                      {formatMAD(paymentDetails?.amountPaid)}
                    </td>

                    <td className="px-5 py-5 font-semibold text-orange-600">
                      {formatMAD(paymentDetails?.remainingAmount)}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getPaymentStatusStyle(paymentDetails?.paymentStatus)}`}
                      >
                        {paymentDetails?.paymentStatus || 'Unpaid'}
                      </span>

                      {renderPaymentHistory(paymentDetails)}
                    </td>

                    <td className="px-5 py-5">
                      <span
                        className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <div className="min-w-32">
                        {renderBookingActions(booking, paymentDetails)}
                      </div>
                    </td>

                  </tr>
                );
              })}

              {filteredBookings.length === 0 && (
                <tr>
                  <td
                    colSpan="11"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    No bookings found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* Results Count */}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500 sm:text-sm">
        <p>
          Showing <strong className="text-gray-700">{filteredBookings.length}</strong> of{' '}
          <strong className="text-gray-700">{bookings.length}</strong> bookings.
        </p>

        <p>
          {selectedStatus === 'All' ? 'All statuses' : selectedStatus}
        </p>
      </div>

    </div>
  );
}

export default AgencyBookings;