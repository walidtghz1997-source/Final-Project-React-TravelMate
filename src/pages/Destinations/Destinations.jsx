
import { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function Destinations() {
  const {
    destinations,
    favorites,
    toggleFavorite,
    currentUser
  } = useContext(MyContext);

  const [search, setSearch] = useState('');

  const navigate = useNavigate();

  const isTraveler = currentUser?.role === 'Traveler';

  const safeDestinations = Array.isArray(destinations)
    ? destinations
    : [];

  const safeFavorites = Array.isArray(favorites)
    ? favorites
    : [];

  const handleFavorite = (destinationId) => {
    if (!isTraveler) {
      navigate('/login');
      return;
    }

    toggleFavorite(destinationId);
  };

  const filteredDestinations = safeDestinations.filter((destination) => {
    const name = String(destination.name ?? '').toLowerCase();
    const country = String(destination.country ?? '').toLowerCase();
    const region = String(destination.region ?? '').toLowerCase();

    const searchValue = search.trim().toLowerCase();

    return (
      name.includes(searchValue) ||
      country.includes(searchValue) ||
      region.includes(searchValue)
    );
  });

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero Section */}

      <section className="bg-teal-900 px-4 py-12 min-[500px]:px-6 min-[500px]:py-16 min-[701px]:py-20 text-center text-white">

        <h1 className="text-3xl min-[500px]:text-4xl min-[701px]:text-5xl font-bold">
          Explore Destinations
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm min-[500px]:text-base leading-7 text-teal-100">
          Discover beautiful places and find your next travel destination.
        </p>

      </section>

      {/* Destinations Section */}

      <section className="mx-auto max-w-7xl px-3 py-8 min-[500px]:px-5 min-[500px]:py-10 min-[701px]:px-8 min-[701px]:py-12">

        {/* Search */}

        <div className="mb-7 min-[701px]:mb-10">

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination, country or region..."
            className="w-full min-w-0 rounded-xl border border-gray-300 bg-white px-4 py-3 min-[500px]:px-5 min-[500px]:py-4 text-sm min-[500px]:text-base outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
          />

        </div>

        {/* Results Header */}

        <div className="mb-6 min-[701px]:mb-8 flex flex-col min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between gap-2">

          <h2 className="text-xl min-[500px]:text-2xl font-bold text-gray-800">
            All Destinations
          </h2>

          <p className="text-xs min-[500px]:text-sm text-gray-500">
            {filteredDestinations.length} destinations found
          </p>

        </div>

        {/* Destinations Grid */}

        {filteredDestinations.length > 0 ? (

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[1100px]:grid-cols-3 gap-5 min-[701px]:gap-7">

            {filteredDestinations.map((destination) => {

              const isFavorite = safeFavorites.some(
                (favoriteId) =>
                  String(favoriteId) === String(destination.id)
              );

              const destinationImage = Array.isArray(destination.images)
                ? destination.images[0]
                : '';

              return (

                <article
                  key={destination.id}
                  className="min-w-0 overflow-hidden rounded-2xl bg-white shadow-sm transition hover:shadow-lg min-[701px]:hover:-translate-y-1"
                >

                  {/* Destination Image */}

                  <div className="relative">

                    {destinationImage ? (

                      <img
                        src={destinationImage}
                        alt={destination.name || 'Destination'}
                        className="h-52 min-[500px]:h-48 min-[701px]:h-56 w-full object-cover"
                      />

                    ) : (

                      <div className="flex h-52 min-[500px]:h-48 min-[701px]:h-56 w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                        No image available
                      </div>

                    )}

                    {/* Favorite Button */}

                    <button
                      type="button"
                      onClick={() => handleFavorite(destination.id)}
                      aria-label={
                        isFavorite
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                      title={
                        isFavorite
                          ? 'Remove from favorites'
                          : 'Add to favorites'
                      }
                      className="absolute right-3 top-3 min-[500px]:right-4 min-[500px]:top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-2xl shadow-md transition hover:scale-110"
                    >

                      <span
                        className={
                          isFavorite
                            ? 'text-red-500'
                            : 'text-gray-400'
                        }
                      >
                        {isFavorite ? '♥' : '♡'}
                      </span>

                    </button>

                  </div>

                  {/* Destination Information */}

                  <div className="p-4 min-[500px]:p-5">

                    <div className="mb-3 flex flex-col min-[400px]:flex-row min-[400px]:items-start min-[400px]:justify-between gap-2">

                      <h3 className="min-w-0 text-lg min-[500px]:text-xl font-bold text-gray-800 break-words">
                        {destination.name || 'Unnamed destination'}
                      </h3>

                      <span className="self-start max-w-full rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 break-words">
                        {destination.region || 'Not specified'}
                      </span>

                    </div>

                    <p className="mb-3 text-sm text-gray-500 break-words">
                      {destination.country || 'Country not specified'}
                    </p>

                    <p className="mb-5 text-sm leading-6 text-gray-600 line-clamp-2 break-words">
                      {destination.description || 'No description available.'}
                    </p>

                    {/* Best Season */}

                    <div className="mb-5">

                      <p className="text-xs text-gray-400">
                        Best Season
                      </p>

                      <p className="mt-1 text-sm min-[500px]:text-base font-medium text-gray-700 break-words">
                        {destination.bestSeason || 'Not specified'}
                      </p>

                    </div>

                    {/* Explore Button */}

                    <Link
                      to={`/destinations/${destination.id}`}
                      className="block w-full rounded-lg bg-teal-700 px-4 py-3 text-center text-sm min-[500px]:text-base font-semibold text-white transition hover:bg-teal-800"
                    >
                      Explore Destination
                    </Link>

                  </div>

                </article>

              );
            })}

          </div>

        ) : (

          /* Empty Search Result */

          <div className="rounded-xl bg-white px-4 py-12 min-[500px]:px-6 min-[500px]:py-16 text-center shadow-sm">

            <h3 className="text-lg min-[500px]:text-xl font-semibold text-gray-700">
              No destinations found
            </h3>

            <p className="mt-2 text-sm min-[500px]:text-base text-gray-500">
              Try searching with another name or region.
            </p>

          </div>

        )}

      </section>

    </main>
  );
}

export default Destinations;
