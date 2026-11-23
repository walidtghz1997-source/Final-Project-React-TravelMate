
import { useContext, useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function Booking() {
  const { packageId } = useParams();
  const navigate = useNavigate();

  const {
    packages,
    destinations,
    currentUser,
    addBooking
  } = useContext(MyContext);

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [message, setMessage] = useState('');

  // Find Selected Package

  const travelPackage = packages.find(
    (item) => String(item.id) === String(packageId)
  );

  if (!currentUser) {
    return (
      <Navigate
        to="/login"
        state={{ from: `/booking/${packageId}` }}
        replace
      />
    );
  }

  if (currentUser.role !== 'Traveler') {
    return <Navigate to="/" replace />;
  }

  if (!travelPackage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Package Not Found
        </h1>

        <p className="text-gray-500 text-center">
          The selected package does not exist.
        </p>

        <Link
          to="/packages"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Browse Packages
        </Link>
      </div>
    );
  }

  // Booking Data

  const price = Number(travelPackage.price);
  const availableSpots = Number(travelPackage.availableSpots);

  const isPackageValid =
    Number.isFinite(price) &&
    price > 0 &&
    Number.isInteger(availableSpots) &&
    availableSpots >= 0;

  if (!isPackageValid) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Package Unavailable
        </h1>

        <p className="text-gray-500 text-center">
          The package price or available places are invalid.
          Please contact the administrator.
        </p>

        <Link
          to="/packages"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg"
        >
          Browse Packages
        </Link>
      </div>
    );
  }

  // Booking Calculations

  const adultTotal = adults * price;
  const childTotal = children * price;

  const totalPrice = Math.round(
    (adultTotal + childTotal) * 100
  ) / 100;

  const totalTravelers = adults + children;

  const remainingSpots = Math.max(
    0,
    availableSpots - adults
  );

  const isSoldOut = availableSpots === 0;

  // Date Helper

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Handle Departure Date

  const handleDepartureChange = (value) => {
    setDepartureDate(value);

    if (returnDate && value && returnDate <= value) {
      setReturnDate('');
    }

    setMessage('');
  };

  // Submit Booking

  const handleSubmit = (event) => {
    event.preventDefault();

    setMessage('');

    if (isSoldOut) {
      setMessage('This package is sold out.');
      return;
    }

    if (
      !Number.isInteger(adults) ||
      !Number.isInteger(children) ||
      adults < 1 ||
      children < 0
    ) {
      setMessage('Please enter valid passenger numbers.');
      return;
    }

    if (totalTravelers > availableSpots) {
      setMessage(
        `Only ${availableSpots} places are available for this package.`
      );
      return;
    }

    if (!departureDate || !returnDate) {
      setMessage('Please select departure and return dates.');
      return;
    }

    if (
      departureDate < getTodayDate() ||
      returnDate <= departureDate
    ) {
      setMessage('Please check your travel dates.');
      return;
    }

    const bookingData = {
      packageId: travelPackage.id,
      departureDate,
      returnDate,
      adults,
      children
    };

    const result = addBooking(bookingData);

    if (!result) {
      setMessage(
        'Booking could not be completed. Please check the available places and your information.'
      );
      return;
    }

    navigate('/traveler/dashboard');
  };

  // Find Destination

  const destination = destinations.find(
    (item) =>
      String(item.id) === String(travelPackage.destinationId)
  );

  // Render

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 min-[500px]:px-5 min-[701px]:px-8 min-[701px]:py-12">

      <div className="mx-auto max-w-4xl">

        <Link
          to="/packages"
          className="text-blue-600 hover:underline mb-5 min-[701px]:mb-6 inline-block text-sm min-[701px]:text-base"
        >
          ← Back to Packages
        </Link>

        <div className="bg-white rounded-2xl shadow-md overflow-hidden">

          <div className="bg-blue-700 text-white px-4 py-5 min-[500px]:px-6 min-[500px]:py-6 min-[701px]:p-8">
            <h1 className="text-2xl min-[500px]:text-3xl font-bold">
              Book Your Trip
            </h1>

            <p className="mt-2 text-sm min-[500px]:text-base text-blue-100">
              Complete your travel information.
            </p>
          </div>

          <div className="p-4 min-[500px]:p-6 min-[701px]:p-8">

            {/* Package Information */}

            <div className="mb-7 min-[701px]:mb-8 border-b pb-6">

              <h2 className="text-lg min-[500px]:text-xl font-bold text-gray-800 mb-4">
                Selected Package
              </h2>

              <h3 className="text-base min-[500px]:text-lg font-semibold text-gray-700 break-words">
                {travelPackage.name}
              </h3>

              {destination && (
                <p className="text-sm min-[500px]:text-base text-gray-500 mt-1 break-words">
                  {destination.name}, {destination.country}
                </p>
              )}

              <div className="mt-4 grid grid-cols-1 min-[450px]:grid-cols-2 gap-3 min-[701px]:flex min-[701px]:flex-wrap min-[701px]:gap-4 text-sm">

                <p className="text-gray-600">
                  Price per person:

                  <span className="font-bold text-gray-800 ml-1">
                    {price.toFixed(2)} DH
                  </span>
                </p>

                <p className="text-gray-600">
                  Available places:

                  <span className="font-bold text-gray-800 ml-1">
                    {availableSpots}
                  </span>
                </p>

              </div>

            </div>

            {/* Booking Form */}

            <form onSubmit={handleSubmit}>

              <h2 className="text-lg min-[500px]:text-xl font-bold text-gray-800 mb-5 min-[701px]:mb-6">
                Travel Information
              </h2>

              <div className="grid grid-cols-1 min-[701px]:grid-cols-2 gap-5">

                {/* Departure Date */}

                <div className="min-w-0">
                  <label className="block text-sm min-[500px]:text-base text-gray-700 font-medium mb-2">
                    Departure Date
                  </label>

                  <input
                    type="date"
                    min={getTodayDate()}
                    value={departureDate}
                    onChange={(event) =>
                      handleDepartureChange(event.target.value)
                    }
                    className="w-full min-w-0 border border-gray-300 rounded-lg p-3 text-sm min-[500px]:text-base outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Return Date */}

                <div className="min-w-0">
                  <label className="block text-sm min-[500px]:text-base text-gray-700 font-medium mb-2">
                    Return Date
                  </label>

                  <input
                    type="date"
                    min={departureDate || getTodayDate()}
                    value={returnDate}
                    onChange={(event) => {
                      setReturnDate(event.target.value);
                      setMessage('');
                    }}
                    className="w-full min-w-0 border border-gray-300 rounded-lg p-3 text-sm min-[500px]:text-base outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Adults */}

                <div className="min-w-0">
                  <label className="block text-sm min-[500px]:text-base text-gray-700 font-medium mb-2">
                    Number of Adults
                  </label>

                  <input
                    type="number"
                    min="1"
                    max={availableSpots}
                    step="1"
                    value={adults}
                    onChange={(event) => {
                      setAdults(Number(event.target.value));
                      setMessage('');
                    }}
                    className="w-full min-w-0 border border-gray-300 rounded-lg p-3 text-sm min-[500px]:text-base outline-none focus:border-blue-600"
                    required
                  />
                </div>

                {/* Children */}

                <div className="min-w-0">
                  <label className="block text-sm min-[500px]:text-base text-gray-700 font-medium mb-2">
                    Number of Children
                  </label>

                  <input
                    type="number"
                    min="0"
                    max={remainingSpots}
                    step="1"
                    value={children}
                    onChange={(event) => {
                      setChildren(Number(event.target.value));
                      setMessage('');
                    }}
                    className="w-full min-w-0 border border-gray-300 rounded-lg p-3 text-sm min-[500px]:text-base outline-none focus:border-blue-600"
                    required
                  />
                </div>

              </div>

              {/* Price Summary */}

              <div className="mt-7 min-[701px]:mt-8 bg-gray-50 rounded-xl p-4 min-[500px]:p-5">

                <h2 className="font-bold text-base min-[500px]:text-lg text-gray-800 mb-4">
                  Price Summary
                </h2>

                <div className="space-y-3 text-sm min-[500px]:text-base text-gray-600">

                  <div className="flex flex-wrap justify-between gap-2">
                    <span>
                      Adults ({adults})
                    </span>

                    <span className="font-medium tabular-nums">
                      {adultTotal.toFixed(2)} DH
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between gap-2">
                    <span>
                      Children ({children})
                    </span>

                    <span className="font-medium tabular-nums">
                      {childTotal.toFixed(2)} DH
                    </span>
                  </div>

                  <div className="border-t pt-3 flex flex-wrap justify-between items-center gap-3">
                    <span className="font-bold text-gray-800">
                      Total Price
                    </span>

                    <span className="text-xl min-[500px]:text-2xl font-bold text-blue-700 tabular-nums">
                      {totalPrice.toFixed(2)} DH
                    </span>
                  </div>

                </div>

              </div>

              {/* Error Message */}

              {message && (
                <div className="mt-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm min-[500px]:text-base break-words">
                  {message}
                </div>
              )}

              {/* Submit */}

              <button
                type="submit"
                disabled={
                  isSoldOut ||
                  adults < 1 ||
                  children < 0 ||
                  !Number.isInteger(adults) ||
                  !Number.isInteger(children) ||
                  totalTravelers > availableSpots
                }
                className="w-full mt-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm min-[500px]:text-base font-bold py-3.5 min-[500px]:py-4 px-4 rounded-lg transition"
              >
                {isSoldOut
                  ? 'Sold Out'
                  : 'Confirm Booking'}
              </button>

              <p className="text-center text-gray-500 text-xs min-[500px]:text-sm mt-4">
                Your booking will initially have Pending status.
              </p>

            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Booking;
