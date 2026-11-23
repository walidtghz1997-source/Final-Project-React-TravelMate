
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../utils/MyContext';

function AgencyDashboard() {
  const {
    destinations,
    packages,
    bookings,
    confirmBooking,
    rejectBooking,
    getBookingPaymentDetails
  } = useContext(MyContext);

  const today = new Date();

  // ==================================
  // 1. Format Currency
  // ==================================

  const formatMAD = (amount) => {
    return `${Number(amount || 0).toLocaleString('en-MA', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })} MAD`;
  };

  // ==================================
  // 2. Booking Statistics
  // ==================================

  const pendingBookings = bookings.filter(
    (booking) => booking.status === 'Pending'
  ).length;

  const confirmedBookings = bookings.filter(
    (booking) => booking.status === 'Confirmed'
  ).length;

  // ==================================
  // 3. Financial Statistics
  // ==================================

  const confirmedBookingRecords = bookings.filter(
    (booking) => booking.status === 'Confirmed'
  );

  const confirmedBookingValue = confirmedBookingRecords.reduce(
    (total, booking) => {
      const paymentDetails = getBookingPaymentDetails(booking.id);

      return total + (paymentDetails?.totalPrice || 0);
    },
    0
  );

  const totalCollected = confirmedBookingRecords.reduce(
    (total, booking) => {
      const paymentDetails = getBookingPaymentDetails(booking.id);

      return total + (paymentDetails?.amountPaid || 0);
    },
    0
  );

  const outstandingBalance = confirmedBookingRecords.reduce(
    (total, booking) => {
      const paymentDetails = getBookingPaymentDetails(booking.id);

      return total + (paymentDetails?.remainingAmount || 0);
    },
    0
  );

  const fullyPaidBookings = confirmedBookingRecords.filter(
    (booking) =>
      getBookingPaymentDetails(booking.id)?.paymentStatus === 'Paid'
  ).length;

  const partiallyPaidBookings = confirmedBookingRecords.filter(
    (booking) =>
      getBookingPaymentDetails(booking.id)?.paymentStatus === 'Partially Paid'
  ).length;

  const unpaidBookings = confirmedBookingRecords.filter(
    (booking) =>
      getBookingPaymentDetails(booking.id)?.paymentStatus === 'Unpaid'
  ).length;

  // ==================================
  // 4. Prepare the Last Six Months
  // ==================================

  const monthlyStats = [];
  const monthlyCollectedStats = [];

  for (let i = 5; i >= 0; i--) {
    const monthDate = new Date(
      today.getFullYear(),
      today.getMonth() - i,
      1
    );

    const month = monthDate.getMonth();
    const year = monthDate.getFullYear();

    const monthBookings = bookings.filter((booking) => {
      if (!booking.createdAt) return false;

      const bookingDate = new Date(booking.createdAt);

      if (isNaN(bookingDate.getTime())) return false;

      return (
        bookingDate.getMonth() === month &&
        bookingDate.getFullYear() === year
      );
    });

    const monthPayments = confirmedBookingRecords.reduce(
      (total, booking) => {
        const payments = Array.isArray(booking.payments)
          ? booking.payments
          : [];

        const monthlyPayments = payments.reduce(
          (paymentTotal, payment) => {
            if (!payment.date) {
              return paymentTotal;
            }

            const paymentDate = new Date(`${payment.date}T00:00:00`);

            if (isNaN(paymentDate.getTime())) {
              return paymentTotal;
            }

            const isSameMonth =
              paymentDate.getMonth() === month &&
              paymentDate.getFullYear() === year;

            return isSameMonth
              ? paymentTotal + (Number(payment.amount) || 0)
              : paymentTotal;
          },
          0
        );

        return total + monthlyPayments;
      },
      0
    );

    monthlyStats.push({
      name: monthDate.toLocaleDateString('en-US', {
        month: 'short'
      }),
      total: monthBookings.length
    });

    monthlyCollectedStats.push({
      name: monthDate.toLocaleDateString('en-US', {
        month: 'short'
      }),
      total: monthPayments
    });
  }

  const highestMonthlyBookings = Math.max(
    ...monthlyStats.map((month) => month.total),
    1
  );

  const highestMonthlyCollection = Math.max(
    ...monthlyCollectedStats.map((month) => month.total),
    1
  );

  // ==================================
  // 5. Most Requested Destinations
  // ==================================

  const destinationStats = destinations
    .map((destination) => {
      const destinationPackages = packages.filter(
        (travelPackage) =>
          travelPackage.destinationId === destination.id
      );

      const destinationBookings = bookings.filter((booking) => {
        const bookingPackage = packages.find(
          (travelPackage) =>
            travelPackage.id === booking.packageId
        );

        return (
          bookingPackage &&
          bookingPackage.destinationId === destination.id &&
          ['Pending', 'Confirmed'].includes(booking.status)
        );
      });

      return {
        ...destination,
        bookingsCount: destinationBookings.length,
        packagesCount: destinationPackages.length
      };
    })
    .filter((destination) => destination.bookingsCount > 0)
    .sort((a, b) => b.bookingsCount - a.bookingsCount)
    .slice(0, 5);

  // ==================================
  // 6. Booking Details
  // ==================================

  function getBookingDetails(booking) {
    const travelPackage = packages.find(
      (item) => item.id === booking.packageId
    );

    const destination = destinations.find(
      (item) => item.id === travelPackage?.destinationId
    );

    return {
      travelPackage,
      destination
    };
  }

  function formatDate(date) {
    if (!date) return 'N/A';

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) return 'N/A';

    return parsedDate.toLocaleDateString('en-GB');
  }

  function getStatusStyle(status) {
    switch (status) {
      case 'Confirmed':
        return 'bg-green-100 text-green-700';

      case 'Pending':
        return 'bg-yellow-100 text-yellow-700';

      case 'Rejected':
        return 'bg-red-100 text-red-700';

      case 'Cancelled':
        return 'bg-gray-100 text-gray-600';

      default:
        return 'bg-gray-100 text-gray-600';
    }
  }

  function getPaymentStatusStyle(status) {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700';

      case 'Partially Paid':
        return 'bg-yellow-100 text-yellow-700';

      default:
        return 'bg-red-100 text-red-700';
    }
  }

  // ==================================
  // 7. UI
  // ==================================

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 px-3 py-6 min-[500px]:px-4 sm:px-6 lg:px-10 sm:py-8">
      <div className="mx-auto max-w-7xl min-w-0">

        {/* Page Header */}

        <div className="mb-8 flex min-w-0 flex-col justify-between gap-4 min-[701px]:flex-row min-[701px]:items-center">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-600">
              Admin Management
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Dashboard
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Overview of your travel platform, bookings and financial activity.
            </p>
          </div>

          <div className="flex flex-col gap-3 min-[450px]:flex-row min-[701px]:shrink-0">
            <Link
              to="/admin/destinations"
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
            >
              Manage Destinations
            </Link>

            <Link
              to="/admin/packages"
              className="rounded-xl bg-teal-600 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-700"
            >
              Manage Packages
            </Link>
          </div>
        </div>

        {/* Booking Statistics */}

        <section className="mb-8 grid grid-cols-1 gap-4 min-[450px]:grid-cols-2 xl:grid-cols-4 xl:gap-5">

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Bookings
            </p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900">
              {bookings.length}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              All booking records
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Total Destinations
            </p>

            <h2 className="mt-3 text-3xl font-bold text-teal-600">
              {destinations.length}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Available destinations
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Pending Bookings
            </p>

            <h2 className="mt-3 text-3xl font-bold text-yellow-600">
              {pendingBookings}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Waiting for your decision
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-sm font-medium text-slate-500">
              Confirmed Bookings
            </p>

            <h2 className="mt-3 text-3xl font-bold text-green-600">
              {confirmedBookings}
            </h2>

            <p className="mt-2 text-xs text-slate-400">
              Successfully confirmed
            </p>
          </div>

        </section>

        {/* Financial Overview */}

        <section className="mb-8">

          <div className="mb-5">
            <h2 className="text-xl font-bold text-slate-900">
              Financial Overview
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Financial summary for confirmed bookings only.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 min-[450px]:grid-cols-2 xl:grid-cols-4 xl:gap-5">

            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Confirmed Booking Value
              </p>

              <h3 className="mt-3 break-words text-xl font-bold text-slate-900 sm:text-2xl">
                {formatMAD(confirmedBookingValue)}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Total value of confirmed bookings
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Total Collected
              </p>

              <h3 className="mt-3 break-words text-xl font-bold text-green-600 sm:text-2xl">
                {formatMAD(totalCollected)}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Payments recorded by admin
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Outstanding Balance
              </p>

              <h3 className="mt-3 break-words text-xl font-bold text-orange-600 sm:text-2xl">
                {formatMAD(outstandingBalance)}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Remaining amount to collect
              </p>
            </div>

            <div className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">
              <p className="text-sm font-medium text-slate-500">
                Fully Paid Bookings
              </p>

              <h3 className="mt-3 text-2xl font-bold text-teal-600">
                {fullyPaidBookings}
              </h3>

              <p className="mt-2 text-xs text-slate-400">
                Confirmed bookings paid in full
              </p>
            </div>

          </div>

          {/* Payment Status Summary */}

          <div className="mt-5 grid grid-cols-1 gap-4 min-[450px]:grid-cols-2">

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">
                Partially Paid Bookings
              </p>

              <h3 className="mt-2 text-2xl font-bold text-yellow-600">
                {partiallyPaidBookings}
              </h3>
            </div>

            <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
              <p className="text-sm text-slate-500">
                Unpaid Bookings
              </p>

              <h3 className="mt-2 text-2xl font-bold text-red-600">
                {unpaidBookings}
              </h3>
            </div>

          </div>

        </section>

        {/* Monthly Bookings */}

        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Monthly Bookings
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Booking activity during the last six months, based on booking creation date.
            </p>
          </div>

          <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-2 min-[500px]:h-64 min-[500px]:gap-4 sm:gap-6">
            {monthlyStats.map((month, index) => (
              <div
                key={`${month.name}-${index}`}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2 min-[500px]:gap-3"
              >
                <span className="text-xs font-semibold text-slate-700 sm:text-sm">
                  {month.total}
                </span>

                <div
                  className="w-full max-w-16 rounded-t-lg bg-teal-500 transition-all"
                  style={{
                    height: `${Math.max(
                      (month.total / highestMonthlyBookings) * 100,
                      month.total > 0 ? 5 : 0
                    )}%`
                  }}
                />

                <span className="text-xs font-medium text-slate-500">
                  {month.name}
                </span>
              </div>
            ))}
          </div>

        </section>

        {/* Monthly Collected Payments */}

        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Monthly Collected Payments
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Actual payments recorded during the last six months.
            </p>
          </div>

          <div className="flex h-56 items-end justify-between gap-2 border-b border-slate-100 pb-2 min-[500px]:h-64 min-[500px]:gap-4 sm:gap-6">
            {monthlyCollectedStats.map((month, index) => (
              <div
                key={`${month.name}-${index}`}
                className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-2 min-[500px]:gap-3"
              >
                <span className="max-w-full break-words text-center text-[10px] font-semibold text-slate-700 min-[500px]:text-xs">
                  {formatMAD(month.total)}
                </span>

                <div
                  className="w-full max-w-16 rounded-t-lg bg-green-500 transition-all"
                  style={{
                    height: `${Math.max(
                      (month.total / highestMonthlyCollection) * 100,
                      month.total > 0 ? 5 : 0
                    )}%`
                  }}
                />

                <span className="text-xs font-medium text-slate-500">
                  {month.name}
                </span>
              </div>
            ))}
          </div>

        </section>

        {/* Most Requested Destinations */}

        <section className="mb-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
              Most Requested Destinations
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Destinations ranked by pending and confirmed bookings.
            </p>
          </div>

          {destinationStats.length === 0 ? (
            <p className="py-8 text-center text-sm text-slate-500">
              No destination bookings available yet.
            </p>
          ) : (
            <div className="space-y-5">
              {destinationStats.map((destination, index) => (
                <div
                  key={destination.id}
                  className="flex min-w-0 items-center gap-3 sm:gap-4"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-50 font-bold text-teal-700">
                    {index + 1}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h3 className="break-words font-semibold text-slate-800">
                        {destination.name}
                      </h3>

                      <span className="shrink-0 text-xs font-semibold text-slate-600 sm:text-sm">
                        {destination.bookingsCount} bookings
                      </span>
                    </div>

                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className="h-full rounded-full bg-teal-500"
                        style={{
                          width: `${
                            (destination.bookingsCount /
                              destinationStats[0].bookingsCount) *
                            100
                          }%`
                        }}
                      />
                    </div>

                    <p className="mt-2 text-xs text-slate-400">
                      {destination.packagesCount} packages
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </section>

        {/* Recent Bookings */}

        <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">

          <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-4 min-[500px]:flex-row min-[500px]:items-center sm:p-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                Recent Bookings
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Review and manage traveler bookings.
              </p>
            </div>

            <span className="text-sm font-medium text-slate-500">
              {bookings.length} bookings
            </span>
          </div>

          {bookings.length === 0 ? (
            <div className="px-4 py-14 text-center sm:px-6">
              <h3 className="font-semibold text-slate-800">
                No bookings yet
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                New traveler bookings will appear here.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile Booking Cards */}

              <div className="space-y-4 p-4 min-[701px]:hidden">

                {bookings.map((booking) => {
                  const { travelPackage, destination } =
                    getBookingDetails(booking);

                  const paymentDetails =
                    getBookingPaymentDetails(booking.id);

                  return (
                    <article
                      key={booking.id}
                      className="overflow-hidden rounded-xl border border-slate-100 bg-white"
                    >

                      {/* Card Header */}

                      <div className="flex flex-col gap-3 border-b border-slate-100 bg-slate-50 p-4 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between">

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-slate-400">
                            BOOKING REFERENCE
                          </p>

                          <h3 className="mt-1 break-all font-bold text-slate-800">
                            #{booking.id}
                          </h3>
                        </div>

                        <span
                          className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(booking.status)}`}
                        >
                          {booking.status}
                        </span>

                      </div>

                      <div className="space-y-4 p-4">

                        {/* Destination */}

                        <div>
                          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Destination
                          </p>

                          <p className="font-semibold text-slate-800">
                            {destination?.name || 'Unknown destination'}
                          </p>

                          <p className="mt-1 text-sm text-slate-500">
                            {travelPackage?.name || 'Unknown package'}
                          </p>
                        </div>

                        <div className="border-t border-slate-100" />

                        {/* Travel Dates */}

                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Travel Dates
                          </p>

                          <div className="grid grid-cols-2 gap-2">

                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Departure
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {formatDate(booking.departureDate)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Return
                              </p>

                              <p className="mt-1 text-sm font-semibold text-slate-700">
                                {formatDate(booking.returnDate)}
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* Travelers */}

                        <div className="rounded-lg bg-slate-50 p-3">
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Travelers
                          </p>

                          <div className="grid grid-cols-3 gap-2 text-center">

                            <div>
                              <p className="text-xs text-slate-400">
                                Adults
                              </p>

                              <p className="mt-1 font-bold text-slate-800">
                                {booking.adults}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Children
                              </p>

                              <p className="mt-1 font-bold text-slate-800">
                                {booking.children}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-400">
                                Total
                              </p>

                              <p className="mt-1 font-bold text-teal-700">
                                {Number(booking.adults) + Number(booking.children)}
                              </p>
                            </div>

                          </div>
                        </div>

                        {/* Financial Details */}

                        <div>
                          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Payment Summary
                          </p>

                          <div className="grid grid-cols-1 gap-2 min-[500px]:grid-cols-3">

                            <div className="rounded-lg bg-slate-50 p-3">
                              <p className="text-xs text-slate-400">
                                Total Price
                              </p>

                              <p className="mt-1 break-words text-sm font-bold text-slate-800">
                                {formatMAD(paymentDetails?.totalPrice)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-green-50 p-3">
                              <p className="text-xs text-green-700">
                                Collected
                              </p>

                              <p className="mt-1 break-words text-sm font-bold text-green-700">
                                {formatMAD(paymentDetails?.amountPaid)}
                              </p>
                            </div>

                            <div className="rounded-lg bg-orange-50 p-3">
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

                        {booking.status === 'Confirmed' && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Payment Status
                            </p>

                            <span
                              className={`inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ${getPaymentStatusStyle(paymentDetails?.paymentStatus)}`}
                            >
                              {paymentDetails?.paymentStatus || 'Unpaid'}
                            </span>
                          </div>
                        )}

                        {/* Actions */}

                        {booking.status === 'Pending' && (
                          <div className="border-t border-slate-100 pt-4">
                            <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                              Booking Actions
                            </p>

                            <div className="flex flex-col gap-2 min-[500px]:flex-row">
                              <button
                                type="button"
                                onClick={() => confirmBooking(booking.id)}
                                className="w-full rounded-lg bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 transition hover:bg-green-100"
                              >
                                Confirm
                              </button>

                              <button
                                type="button"
                                onClick={() => rejectBooking(booking.id)}
                                className="w-full rounded-lg bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}

                        {booking.status !== 'Pending' && (
                          <p className="border-t border-slate-100 pt-4 text-xs text-slate-400">
                            No actions available
                          </p>
                        )}

                      </div>

                    </article>
                  );
                })}

              </div>

              {/* Tablet and Desktop Table */}

              <div className="hidden min-[701px]:block">
                <div className="overflow-x-auto">

                  <table className="w-full min-w-[1150px] text-left">

                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                      <tr>
                        <th className="px-6 py-4 font-semibold">
                          Booking
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Destination
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Travel Dates
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Travelers
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Total Price
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Collected
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Remaining
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Status
                        </th>

                        <th className="px-6 py-4 font-semibold">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => {
                        const { travelPackage, destination } =
                          getBookingDetails(booking);

                        const paymentDetails =
                          getBookingPaymentDetails(booking.id);

                        return (
                          <tr
                            key={booking.id}
                            className="transition hover:bg-slate-50"
                          >
                            <td className="px-6 py-5">
                              <span className="font-semibold text-slate-800">
                                #{booking.id}
                              </span>
                            </td>

                            <td className="px-6 py-5">
                              <p className="font-semibold text-slate-800">
                                {destination?.name || 'Unknown destination'}
                              </p>

                              <p className="mt-1 text-xs text-slate-500">
                                {travelPackage?.name || 'Unknown package'}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              <p>{formatDate(booking.departureDate)}</p>

                              <p className="mt-1 text-xs text-slate-400">
                                to {formatDate(booking.returnDate)}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm text-slate-600">
                              <p>Adults: {booking.adults}</p>
                              <p className="mt-1">
                                Children: {booking.children}
                              </p>
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-slate-800">
                              {formatMAD(paymentDetails?.totalPrice)}
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-green-700">
                              {formatMAD(paymentDetails?.amountPaid)}
                            </td>

                            <td className="px-6 py-5 text-sm font-semibold text-orange-600">
                              {formatMAD(paymentDetails?.remainingAmount)}
                            </td>

                            <td className="px-6 py-5">
                              <span
                                className={`whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                                  booking.status
                                )}`}
                              >
                                {booking.status}
                              </span>

                              {booking.status === 'Confirmed' && (
                                <p className="mt-2">
                                  <span
                                    className={`whitespace-nowrap rounded-full px-2 py-1 text-xs font-semibold ${getPaymentStatusStyle(
                                      paymentDetails?.paymentStatus
                                    )}`}
                                  >
                                    {paymentDetails?.paymentStatus}
                                  </span>
                                </p>
                              )}
                            </td>

                            <td className="px-6 py-5">
                              {booking.status === 'Pending' ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => confirmBooking(booking.id)}
                                    className="rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 transition hover:bg-green-100"
                                  >
                                    Confirm
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => rejectBooking(booking.id)}
                                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-100"
                                  >
                                    Reject
                                  </button>
                                </div>
                              ) : (
                                <span className="text-xs text-slate-400">
                                  No actions
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>

                  </table>

                </div>
              </div>
            </>
          )}

        </section>

      </div>
    </main>
  );
}

export default AgencyDashboard;
