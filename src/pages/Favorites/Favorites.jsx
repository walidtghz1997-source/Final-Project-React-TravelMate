
import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { MyContext } from '../../utils/MyContext';

function Favorites() {
  const {
    destinations,
    favorites,
    toggleFavorite
  } = useContext(MyContext);

  const safeDestinations = Array.isArray(destinations)
    ? destinations
    : [];

  const safeFavorites = Array.isArray(favorites)
    ? favorites
    : [];

  const favoriteDestinations = safeDestinations.filter(
    (destination) =>
      safeFavorites.some(
        (favoriteId) =>
          String(favoriteId) === String(destination.id)
      )
  );

  return (
    <main className="min-h-screen bg-white">

      {/* Page Hero Section */}

      <section className="bg-teal-900 px-4 py-12 min-[500px]:px-6 min-[500px]:py-14 min-[701px]:py-16 text-center text-white">

        <h1 className="text-3xl min-[500px]:text-4xl min-[701px]:text-5xl font-bold">
          My Favorite Destinations
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm min-[500px]:text-base text-teal-100">
          Keep your favorite destinations close and explore the places you dream of visiting.
        </p>

      </section>

      {/* Favorites Content */}

      <section className="mx-auto max-w-7xl px-3 py-8 min-[500px]:px-5 min-[500px]:py-10 min-[701px]:px-8 min-[701px]:py-12">

        {/* Empty Favorites */}

        {favoriteDestinations.length === 0 ? (

          <div className="rounded-xl bg-gray-50 px-4 py-12 min-[500px]:px-6 min-[500px]:py-16 text-center">

            <h2 className="text-lg min-[500px]:text-xl font-semibold text-gray-700">
              No favorite destinations yet
            </h2>

            <p className="mt-3 text-sm min-[500px]:text-base text-gray-500">
              Explore destinations and save the ones you love.
            </p>

            <Link
              to="/destinations"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 min-[500px]:px-6 py-3 text-sm min-[500px]:text-base font-semibold text-white transition hover:bg-blue-700"
            >
              Explore Destinations
            </Link>

          </div>

        ) : (

          /* Favorites Grid */

          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 min-[1100px]:grid-cols-3 gap-5 min-[701px]:gap-6">

            {favoriteDestinations.map((destination) => (

              <article
                key={destination.id}
                className="min-w-0 overflow-hidden rounded-xl bg-white shadow-md transition hover:shadow-lg"
              >

                {/* Destination Image */}

                <img
                  src={
                    destination.images?.[0] ||
                    'https://placehold.co/600x400?text=Destination'
                  }
                  alt={destination.name || 'Destination'}
                  className="h-52 min-[500px]:h-48 min-[701px]:h-56 w-full object-cover"
                />

                {/* Destination Information */}

                <div className="p-4 min-[500px]:p-5">

                  <h2 className="text-lg min-[500px]:text-xl font-bold text-gray-800 break-words">
                    {destination.name}
                  </h2>

                  <p className="mt-1 text-sm text-gray-500 break-words">
                    {destination.country}
                  </p>

                  <p className="mt-3 text-sm leading-6 text-gray-600 line-clamp-3 break-words">
                    {destination.description}
                  </p>

                  {/* Actions */}

                  <div className="mt-5 flex flex-col min-[400px]:flex-row items-stretch min-[400px]:items-center justify-between gap-3">

                    <Link
                      to={`/destinations/${destination.id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-3 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => toggleFavorite(destination.id)}
                      className="flex-1 rounded-lg border border-red-200 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      Remove
                    </button>

                  </div>

                </div>

              </article>

            ))}

          </div>

        )}

      </section>

    </main>
  );
}

export default Favorites;
