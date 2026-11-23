
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function Packages() {
  const { packages = [], destinations = [] } = useContext(MyContext);

  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('all');
  const [budget, setBudget] = useState('all');
  const [tripType, setTripType] = useState('all');
  const [duration, setDuration] = useState('all');

  const regions = destinations
    .map((destination) => destination.region)
    .filter((item, index, array) => item && array.indexOf(item) === index);

  const tripTypes = packages
    .map((item) => item.tripType)
    .filter((item, index, array) => item && array.indexOf(item) === index);

  const filteredPackages = packages.filter((item) => {
    const destination = destinations.find(
      (destination) =>
        String(destination.id) === String(item.destinationId)
    );

    const matchesSearch =
      (item.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (item.description || '').toLowerCase().includes(search.toLowerCase()) ||
      (destination?.name || '').toLowerCase().includes(search.toLowerCase());

    const matchesRegion =
      region === 'all' || destination?.region === region;

    const price = Number(item.price);
    const matchesBudget =
      budget === 'all' ||
      (budget === 'low' && price <= 500) ||
      (budget === 'medium' && price > 500 && price <= 1000) ||
      (budget === 'high' && price > 1000);

    const matchesTripType =
      tripType === 'all' || item.tripType === tripType;

    const packageDuration = Number(item.duration);
    const matchesDuration =
      duration === 'all' ||
      (duration === 'short' && packageDuration <= 3) ||
      (duration === 'medium' && packageDuration > 3 && packageDuration <= 7) ||
      (duration === 'long' && packageDuration > 7);

    return (
      matchesSearch &&
      matchesRegion &&
      matchesBudget &&
      matchesTripType &&
      matchesDuration
    );
  });

  function resetFilters() {
    setSearch('');
    setRegion('all');
    setBudget('all');
    setTripType('all');
    setDuration('all');
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Page Header */}

      <section className="bg-teal-900 px-4 py-12 min-[500px]:px-6 min-[500px]:py-14 min-[701px]:py-16 text-center text-white">

        <h1 className="text-3xl min-[500px]:text-4xl min-[701px]:text-5xl font-bold">
          Travel Packages
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm min-[500px]:text-base text-teal-100">
          Find the right travel package for your next adventure.
        </p>

      </section>

      {/* Packages Content */}

      <section className="mx-auto max-w-7xl px-3 py-8 min-[500px]:px-5 min-[500px]:py-10 min-[701px]:px-8 min-[701px]:py-12">

        {/* Search */}

        <div className="mb-6 min-[701px]:mb-8">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search packages or destinations..."
            className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 min-[500px]:px-5 py-3 min-[500px]:py-4 text-sm min-[500px]:text-base outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />

        </div>

        {/* Filters */}

        <div className="mb-8 min-[701px]:mb-10 grid grid-cols-1 min-[450px]:grid-cols-2 min-[1100px]:grid-cols-4 gap-4 rounded-xl bg-white p-4 min-[500px]:p-5 shadow-sm">

          {/* Region */}

          <div className="min-w-0">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Region
            </label>

            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm min-[500px]:text-base outline-none focus:border-teal-600"
            >
              <option value="all">All Regions</option>

              {regions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

            </select>

          </div>

          {/* Budget */}

          <div className="min-w-0">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Budget
            </label>

            <select
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm min-[500px]:text-base outline-none focus:border-teal-600"
            >
              <option value="all">All Budgets</option>
              <option value="low">Up to 500</option>
              <option value="medium">501 - 1000</option>
              <option value="high">Above 1000</option>
            </select>

          </div>

          {/* Trip Type */}

          <div className="min-w-0">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Trip Type
            </label>

            <select
              value={tripType}
              onChange={(e) => setTripType(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm min-[500px]:text-base outline-none focus:border-teal-600"
            >
              <option value="all">All Trip Types</option>

              {tripTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}

            </select>

          </div>

          {/* Duration */}

          <div className="min-w-0">

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Duration
            </label>

            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 py-3 text-sm min-[500px]:text-base outline-none focus:border-teal-600"
            >
              <option value="all">Any Duration</option>
              <option value="short">1 - 3 Days</option>
              <option value="medium">4 - 7 Days</option>
              <option value="long">More than 7 Days</option>
            </select>

          </div>

          {/* Reset Filters */}

          <button
            type="button"
            onClick={resetFilters}
            className="rounded-lg border border-teal-700 px-4 py-3 text-sm min-[500px]:text-base font-medium text-teal-700 transition hover:bg-teal-50 min-[450px]:col-span-2 min-[1100px]:col-span-4"
          >
            Reset Filters
          </button>

        </div>

        {/* Results Header */}

        <div className="mb-6 min-[701px]:mb-7 flex flex-col min-[500px]:flex-row min-[500px]:items-center justify-between gap-2">

          <h2 className="text-xl min-[500px]:text-2xl font-bold text-gray-800">
            Available Packages
          </h2>

          <p className="text-sm text-gray-500">
            {filteredPackages.length} packages found
          </p>

        </div>

        {/* Packages Grid */}

        {filteredPackages.length > 0 ? (

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[1100px]:grid-cols-3 gap-5 min-[701px]:gap-6 min-[1100px]:gap-7">

            {filteredPackages.map((item) => {

              const destination = destinations.find(
                (destination) =>
                  String(destination.id) === String(item.destinationId)
              );

              const availableSpots = Number(
                item.availableSpots ?? item.totalSpots ?? 0
              );

              return (

                <article
                  key={item.id}
                  className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >

                  {/* Destination Image */}

                  {destination?.images?.[0] ? (

                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      className="h-48 min-[500px]:h-52 min-[701px]:h-56 w-full object-cover"
                    />

                  ) : (

                    <div className="flex h-48 min-[500px]:h-52 min-[701px]:h-56 items-center justify-center bg-teal-50 text-sm text-teal-700">
                      No image available
                    </div>

                  )}

                  {/* Package Information */}

                  <div className="p-4 min-[500px]:p-5">

                    <p className="text-sm font-medium text-teal-700 break-words">
                      {destination?.name || 'Destination not specified'}
                    </p>

                    <h3 className="mt-2 text-lg min-[500px]:text-xl font-bold text-gray-800 break-words">
                      {item.name}
                    </h3>

                    <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-2 break-words">
                      {item.description}
                    </p>

                    {/* Price and Duration */}

                    <div className="mt-5 grid grid-cols-2 gap-3 border-t border-gray-100 pt-4">

                      <div className="min-w-0">

                        <p className="text-xs text-gray-500">
                          Price per adult
                        </p>

                        <p className="mt-1 text-lg min-[500px]:text-xl font-bold text-teal-700 break-words">
                          {item.price} MAD
                        </p>

                      </div>

                      <div className="min-w-0">

                        <p className="text-xs text-gray-500">
                          Duration
                        </p>

                        <p className="mt-1 font-semibold text-gray-800">
                          {item.duration} days
                        </p>

                      </div>

                    </div>

                    {/* Availability */}

                    <div className="mt-4">

                      {availableSpots > 0 ? (

                        <p className="text-sm text-gray-500">
                          Available places: {availableSpots}
                        </p>

                      ) : (

                        <p className="font-semibold text-sm text-red-600">
                          Sold Out
                        </p>

                      )}

                    </div>

                    {/* Trip Type */}

                    {item.tripType && (

                      <p className="mt-4 inline-block max-w-full rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 break-words">
                        {item.tripType}
                      </p>

                    )}

                    {/* Booking Button */}

                    {availableSpots > 0 && (

                      <Link
                        to={`/booking/${item.id}`}
                        className="mt-5 block rounded-lg bg-teal-700 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-teal-800"
                      >
                        Book Now
                      </Link>

                    )}

                  </div>

                </article>

              );

            })}

          </div>

        ) : (

          /* Empty Results */

          <div className="rounded-xl bg-white px-4 py-12 min-[500px]:px-6 min-[500px]:py-16 text-center shadow-sm">

            <h3 className="text-lg min-[500px]:text-xl font-semibold text-gray-700">
              No packages found
            </h3>

            <p className="mt-2 text-sm min-[500px]:text-base text-gray-500">
              Try changing your search or filters.
            </p>

            <button
              type="button"
              onClick={resetFilters}
              className="mt-6 rounded-lg bg-teal-700 px-5 min-[500px]:px-6 py-3 text-sm min-[500px]:text-base font-semibold text-white transition hover:bg-teal-800"
            >
              Reset Filters
            </button>

          </div>

        )}

      </section>

    </main>
  );
}

export default Packages;
