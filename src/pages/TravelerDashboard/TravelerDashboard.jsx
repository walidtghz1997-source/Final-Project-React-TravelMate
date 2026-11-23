
import { useContext, useState } from 'react';
import { MyContext } from '../../utils/MyContext';

function TravelerDashboard() {
  const {
    currentUser,
    bookings = [],
    packages = [],
    destinations = [],
    updateBooking,
    cancelBooking,
  } = useContext(MyContext);

  const [activeFilter, setActiveFilter] = useState('All');
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [editForm, setEditForm] = useState({
    adults: 1,
    children: 0,
    departureDate: '',
    returnDate: '',
  });
  const [message, setMessage] = useState('');

  // Get today's date

  const today = new Date();

  const todayDate = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-');

  // Get only the current user's bookings

  const userBookings = bookings.filter(
    (booking) => String(booking.userId) === String(currentUser?.id)
  );

  // Separate upcoming and previous bookings

  const upcomingBookings = userBookings.filter(
    (booking) => booking.departureDate >= todayDate
  );

  const previousBookings = userBookings.filter(
    (booking) => booking.departureDate < todayDate
  );

  // Calculate confirmed bookings spending

  const totalSpent = userBookings
    .filter((booking) => booking.status === 'Confirmed')
    .reduce(
      (total, booking) => total + Number(booking.totalPrice),
      0
    );

  // Filter bookings

  const filteredBookings = userBookings.filter((booking) => {
    if (activeFilter === 'Upcoming') {
      return booking.departureDate >= todayDate;
    }

    if (activeFilter === 'Previous') {
      return booking.departureDate < todayDate;
    }

    return true;
  });

  // Find package and destination information

  const getPackage = (packageId) => {
    return packages.find(
      (travelPackage) =>
        String(travelPackage.id) === String(packageId)
    );
  };

  const getDestination = (destinationId) => {
    return destinations.find(
      (destination) =>
        String(destination.id) === String(destinationId)
    );
  };

  // Format date

  const formatDate = (date) => {
    if (!date) return 'Not specified';

    const [year, month, day] = date.split('-');

    return `${day}/${month}/${year}`;
  };

  // Get status styling

  const getStatusStyle = (status) => {
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
  };

  // Start editing a booking

  const handleEdit = (booking) => {
    setEditingBookingId(booking.id);

    setEditForm({
      adults: booking.adults,
      children: booking.children,
      departureDate: booking.departureDate,
      returnDate: booking.returnDate,
    });

    setMessage('');
  };

  // Update edit form

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Save booking changes

  const handleSave = (bookingId) => {
    const success = updateBooking(bookingId, {
      adults: Number(editForm.adults),
      children: Number(editForm.children),
      departureDate: editForm.departureDate,
      returnDate: editForm.returnDate,
    });

    if (success) {
      setEditingBookingId(null);
      setMessage('Your booking has been updated successfully.');
    } else {
      setMessage(
        'Unable to update booking. Please check dates, passengers and available spots.'
      );
    }
  };

  // Cancel booking

  const handleCancel = (bookingId) => {
    const confirmed = window.confirm(
      'Are you sure you want to cancel this booking?'
    );

    if (!confirmed) return;

    const success = cancelBooking(bookingId);

    if (success) {
      setMessage('Your booking has been cancelled successfully.');
    } else {
      setMessage('Unable to cancel this booking.');
    }
  };

  // Not Logged In

  if (!currentUser) {
    return (
      <main className="min-h-screen bg-gray-50 px-3 py-10 min-[500px]:px-5 min-[500px]:py-16">

        <div className="mx-auto max-w-4xl rounded-2xl bg-white p-5 min-[500px]:p-8 min-[701px]:p-10 text-center shadow-sm">

          <h1 className="text-xl min-[500px]:text-2xl font-bold text-gray-900">
            Traveler Dashboard
          </h1>

          <p className="mt-3 text-sm min-[500px]:text-base text-gray-500">
            No traveler is currently selected.
          </p>

        </div>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 px-3 py-7 min-[500px]:px-5 min-[500px]:py-9 min-[701px]:px-8 min-[701px]:py-10">

      <div className="mx-auto max-w-7xl min-w-0">

        {/* Page Header */}

        <div className="mb-7 min-[701px]:mb-8">

          <p className="text-xs min-[500px]:text-sm font-semibold uppercase tracking-wider text-blue-600">
            Traveler Area
          </p>

          <h1 className="mt-2 text-2xl min-[500px]:text-3xl min-[701px]:text-4xl font-bold text-gray-900 break-words">
            Welcome, {currentUser.name || 'Traveler'}
          </h1>

          <p className="mt-2 text-sm min-[500px]:text-base text-gray-500">
            Manage your trips and keep track of your bookings.
          </p>

        </div>

        {/* Statistics */}

        <div className="mb-7 min-[701px]:mb-8 grid grid-cols-1 min-[450px]:grid-cols-2 min-[1100px]:grid-cols-4 gap-4 min-[701px]:gap-5">

          <div className="min-w-0 rounded-2xl bg-white p-4 min-[500px]:p-5 min-[701px]:p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Bookings
            </p>

            <h2 className="mt-3 text-2xl min-[500px]:text-3xl font-bold text-gray-900">
              {userBookings.length}
            </h2>

          </div>

          <div className="min-w-0 rounded-2xl bg-white p-4 min-[500px]:p-5 min-[701px]:p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Upcoming Trips
            </p>

            <h2 className="mt-3 text-2xl min-[500px]:text-3xl font-bold text-blue-600">
              {upcomingBookings.length}
            </h2>

          </div>

          <div className="min-w-0 rounded-2xl bg-white p-4 min-[500px]:p-5 min-[701px]:p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Previous Trips
            </p>

            <h2 className="mt-3 text-2xl min-[500px]:text-3xl font-bold text-gray-900">
              {previousBookings.length}
            </h2>

          </div>

          <div className="min-w-0 rounded-2xl bg-white p-4 min-[500px]:p-5 min-[701px]:p-6 shadow-sm">

            <p className="text-sm text-gray-500">
              Total Spent
            </p>

            <h2 className="mt-3 text-2xl min-[500px]:text-3xl font-bold text-green-600 break-words">
              {totalSpent.toLocaleString()} MAD
            </h2>

          </div>

        </div>

        {/* Message */}

        {message && (

          <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-3 min-[500px]:p-4 text-sm leading-6 text-blue-700 break-words">
            {message}
          </div>

        )}

        {/* Bookings Section */}

        <section className="min-w-0">

          {/* Section Header */}

          <div className="mb-5 min-[701px]:mb-6 flex flex-col min-[701px]:flex-row min-[701px]:items-center justify-between gap-4">

            <div>

              <h2 className="text-xl min-[500px]:text-2xl font-bold text-gray-900">
                My Bookings
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                View and manage all your travel reservations.
              </p>

            </div>

            {/* Booking Filters */}

            <div className="grid grid-cols-3 min-[450px]:flex gap-2">

              {['All', 'Upcoming', 'Previous'].map((filter) => (

                <button
                  key={filter}
                  type="button"
                  onClick={() => setActiveFilter(filter)}
                  className={`rounded-lg px-2 min-[450px]:px-4 py-2.5 text-xs min-[500px]:text-sm font-medium transition ${
                    activeFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {filter}
                </button>

              ))}

            </div>

          </div>

          {/* Empty State */}

          {filteredBookings.length === 0 ? (

            <div className="rounded-2xl bg-white px-4 py-12 min-[500px]:px-6 min-[500px]:py-16 text-center shadow-sm">

              <h3 className="text-lg min-[500px]:text-xl font-semibold text-gray-900">
                No bookings found
              </h3>

              <p className="mt-2 text-sm min-[500px]:text-base text-gray-500">
                Your bookings will appear here when you reserve a trip.
              </p>

            </div>

          ) : (

            <div className="space-y-4 min-[701px]:space-y-5">

              {filteredBookings.map((booking) => {

                const travelPackage = getPackage(booking.packageId);

                const destination = travelPackage
                  ? getDestination(travelPackage.destinationId)
                  : null;

                const canEdit =
                  booking.status === 'Pending' &&
                  booking.departureDate >= todayDate;

                const canCancel =
                  ['Pending', 'Confirmed'].includes(booking.status) &&
                  booking.departureDate >= todayDate;

                const isEditing = editingBookingId === booking.id;

                return (

                  <article
                    key={booking.id}
                    className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm"
                  >

                    <div className="p-4 min-[500px]:p-5 min-[701px]:p-7">

                      {/* Booking Header */}

                      <div className="mb-5 flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between gap-3">

                        <div className="min-w-0">

                          <h3 className="text-lg min-[500px]:text-xl font-bold text-gray-900 break-words">
                            {travelPackage?.name || 'Travel Package'}
                          </h3>

                          <p className="mt-1 text-sm text-gray-500 break-words">
                            {destination?.name || 'Destination information unavailable'}
                          </p>

                        </div>

                        <span
                          className={`w-fit shrink-0 rounded-full px-3 min-[500px]:px-4 py-2 text-xs font-semibold ${getStatusStyle(
                            booking.status
                          )}`}
                        >
                          {booking.status}
                        </span>

                      </div>

                      {/* Booking Information */}

                      <div className="grid grid-cols-1 min-[450px]:grid-cols-2 min-[1100px]:grid-cols-4 gap-4 min-[500px]:gap-5 border-y border-gray-100 py-5">

                        <div className="min-w-0">

                          <p className="text-sm text-gray-500">
                            Departure Date
                          </p>

                          <p className="mt-2 font-semibold text-sm min-[500px]:text-base text-gray-900">
                            {formatDate(booking.departureDate)}
                          </p>

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm text-gray-500">
                            Return Date
                          </p>

                          <p className="mt-2 font-semibold text-sm min-[500px]:text-base text-gray-900">
                            {formatDate(booking.returnDate)}
                          </p>

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm text-gray-500">
                            Travelers
                          </p>

                          <p className="mt-2 font-semibold text-sm min-[500px]:text-base text-gray-900 break-words">
                            {booking.adults} Adults, {booking.children} Children
                          </p>

                        </div>

                        <div className="min-w-0">

                          <p className="text-sm text-gray-500">
                            Total Price
                          </p>

                          <p className="mt-2 font-bold text-sm min-[500px]:text-base text-blue-600 break-words">
                            {Number(booking.totalPrice).toLocaleString()} MAD
                          </p>

                        </div>

                      </div>

                      {/* Edit Form */}

                      {isEditing && (

                        <div className="mt-5 min-[500px]:mt-6 rounded-xl border border-gray-200 bg-gray-50 p-4 min-[500px]:p-5">

                          <h4 className="mb-4 min-[500px]:mb-5 font-semibold text-gray-900">
                            Edit Your Booking
                          </h4>

                          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 gap-4">

                            <div className="min-w-0">

                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Adults
                              </label>

                              <input
                                type="number"
                                name="adults"
                                min="1"
                                value={editForm.adults}
                                onChange={handleInputChange}
                                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500"
                              />

                            </div>

                            <div className="min-w-0">

                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Children
                              </label>

                              <input
                                type="number"
                                name="children"
                                min="0"
                                value={editForm.children}
                                onChange={handleInputChange}
                                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500"
                              />

                            </div>

                            <div className="min-w-0">

                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Departure Date
                              </label>

                              <input
                                type="date"
                                name="departureDate"
                                min={todayDate}
                                value={editForm.departureDate}
                                onChange={handleInputChange}
                                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 min-[500px]:px-4 py-3 text-sm outline-none focus:border-blue-500"
                              />

                            </div>

                            <div className="min-w-0">

                              <label className="mb-2 block text-sm font-medium text-gray-700">
                                Return Date
                              </label>

                              <input
                                type="date"
                                name="returnDate"
                                min={editForm.departureDate || todayDate}
                                value={editForm.returnDate}
                                onChange={handleInputChange}
                                className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-2 min-[500px]:px-4 py-3 text-sm outline-none focus:border-blue-500"
                              />

                            </div>

                          </div>

                          {/* Edit Actions */}

                          <div className="mt-5 grid grid-cols-1 min-[450px]:flex gap-3">

                            <button
                              type="button"
                              onClick={() => handleSave(booking.id)}
                              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              Save Changes
                            </button>

                            <button
                              type="button"
                              onClick={() => setEditingBookingId(null)}
                              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100"
                            >
                              Cancel
                            </button>

                          </div>

                        </div>

                      )}

                      {/* Booking Actions */}

                      {!isEditing && (canEdit || canCancel) && (

                        <div className="mt-5 grid grid-cols-1 min-[450px]:flex gap-3">

                          {canEdit && (

                            <button
                              type="button"
                              onClick={() => handleEdit(booking)}
                              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              Edit Booking
                            </button>

                          )}

                          {canCancel && (

                            <button
                              type="button"
                              onClick={() => handleCancel(booking.id)}
                              className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                              Cancel Booking
                            </button>

                          )}

                        </div>

                      )}

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>

      </div>

    </main>
  );
}

export default TravelerDashboard;
