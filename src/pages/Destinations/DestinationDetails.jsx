
import { useContext } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function DestinationDetails() {
  const { id } = useParams();

  const { destinations, packages } = useContext(MyContext);

  const destination = destinations.find(
    (item) => String(item.id) === String(id)
  );

  if (!destination) {
    return <Navigate to="/destinations" replace />;
  }

  const destinationPackages = packages.filter(
    (item) => String(item.destinationId) === String(destination.id)
  );

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-6 min-[500px]:px-5 min-[701px]:px-8 min-[701px]:py-10">
      <div className="mx-auto max-w-6xl">

        <Link
          to="/destinations"
          className="mb-5 min-[701px]:mb-6 inline-block text-sm min-[701px]:text-base text-blue-600 hover:underline"
        >
          ← Back to destinations
        </Link>

        <div className="overflow-hidden rounded-2xl bg-white shadow">

          {/* Destination Images */}

          {destination.images?.length > 0 && (
            <div className="grid grid-cols-1 min-[701px]:grid-cols-2 gap-2">
              <img
                src={destination.images[0]}
                alt={destination.name}
                className="h-56 min-[500px]:h-72 min-[701px]:h-80 w-full object-cover"
              />

              {destination.images[1] && (
                <img
                  src={destination.images[1]}
                  alt={destination.name}
                  className="hidden h-80 w-full object-cover min-[701px]:block"
                />
              )}
            </div>
          )}

          <div className="p-4 min-[500px]:p-6 min-[701px]:p-10">

            {/* Destination Information */}

            <h1 className="mb-3 text-2xl min-[500px]:text-3xl font-bold text-gray-900 break-words">
              {destination.name}
            </h1>

            <p className="mb-6 text-sm min-[500px]:text-base text-gray-500 break-words">
              {destination.country} · {destination.region}
            </p>

            <div className="mb-7 min-[701px]:mb-8">
              <h2 className="mb-3 text-lg min-[500px]:text-xl font-semibold">
                About this destination
              </h2>

              <p className="text-sm min-[500px]:text-base leading-7 text-gray-600 break-words">
                {destination.description}
              </p>
            </div>

            <div className="mb-7 min-[701px]:mb-8">
              <h2 className="mb-2 text-lg min-[500px]:text-xl font-semibold">
                Best season
              </h2>

              <p className="text-sm min-[500px]:text-base text-gray-600">
                {destination.bestSeason || 'Not specified'}
              </p>
            </div>

            {/* Available Packages */}

            <div>
              <h2 className="mb-5 text-lg min-[500px]:text-xl font-semibold">
                Available packages
              </h2>

              {destinationPackages.length === 0 ? (
                <p className="text-sm min-[500px]:text-base text-gray-500">
                  No packages available for this destination yet.
                </p>
              ) : (
                <div className="space-y-6 min-[701px]:space-y-8">

                  {destinationPackages.map((item) => {
                    const availableSpots = Number(
                      item.availableSpots ?? item.totalSpots ?? 0
                    );

                    const isSoldOut =
                      !Number.isFinite(availableSpots) || availableSpots <= 0;

                    const packageImages = Array.isArray(item.packageImages)
                      ? item.packageImages
                      : [];

                    const includedServices = Array.isArray(item.includedServices)
                      ? item.includedServices
                      : [];

                    const excludedServices = Array.isArray(item.excludedServices)
                      ? item.excludedServices
                      : [];

                    const itinerary = Array.isArray(item.itinerary)
                      ? item.itinerary
                      : [];

                    return (
                      <article
                        key={item.id}
                        className="overflow-hidden rounded-2xl border border-gray-200"
                      >

                        {/* Package Images */}

                        {packageImages.length > 0 && (
                          <div className="grid grid-cols-1 min-[500px]:grid-cols-2 gap-2">
                            {packageImages.slice(0, 4).map((image, index) => (
                              <img
                                key={`${item.id}-image-${index}`}
                                src={image}
                                alt={`${item.name} - ${index + 1}`}
                                className="h-48 min-[500px]:h-56 min-[701px]:h-64 w-full object-cover"
                              />
                            ))}
                          </div>
                        )}

                        <div className="p-4 min-[500px]:p-5 min-[701px]:p-7">

                          {/* Package Header */}

                          <div className="mb-4 flex flex-col min-[500px]:flex-row min-[500px]:items-start min-[500px]:justify-between gap-3">

                            <div className="min-w-0">
                              <h3 className="text-xl min-[500px]:text-2xl font-bold text-gray-900 break-words">
                                {item.name}
                              </h3>

                              {item.tripType && (
                                <span className="mt-2 inline-block rounded-full bg-blue-50 px-3 py-1 text-xs min-[500px]:text-sm font-medium text-blue-700">
                                  {item.tripType}
                                </span>
                              )}
                            </div>

                            <span className={`self-start shrink-0 rounded-full px-3 py-1 text-xs min-[500px]:text-sm font-semibold ${isSoldOut ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
                              {isSoldOut ? 'Sold Out' : 'Available'}
                            </span>

                          </div>

                          <p className="mb-6 text-sm min-[500px]:text-base leading-7 text-gray-600 break-words">
                            {item.description}
                          </p>

                          {/* Package Statistics */}

                          <div className="mb-6 min-[701px]:mb-7 grid grid-cols-1 min-[400px]:grid-cols-2 min-[701px]:grid-cols-4 gap-3 min-[500px]:gap-4 rounded-xl bg-gray-50 p-3 min-[500px]:p-4">

                            <div className="min-w-0">
                              <p className="text-xs min-[500px]:text-sm text-gray-500">
                                Price per person
                              </p>

                              <p className="mt-1 font-bold text-blue-700 break-words">
                                {item.price} MAD
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs min-[500px]:text-sm text-gray-500">
                                Duration
                              </p>

                              <p className="mt-1 font-semibold text-gray-900">
                                {item.duration} days
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs min-[500px]:text-sm text-gray-500">
                                Total places
                              </p>

                              <p className="mt-1 font-semibold text-gray-900">
                                {item.totalSpots ?? 0}
                              </p>
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs min-[500px]:text-sm text-gray-500">
                                Available places
                              </p>

                              <p className="mt-1 font-semibold text-gray-900">
                                {availableSpots}
                              </p>
                            </div>

                          </div>

                          {/* Trip Itinerary */}

                          {itinerary.length > 0 && (
                            <section className="mb-6">
                              <h4 className="mb-3 text-base min-[500px]:text-lg font-semibold text-gray-900">
                                Trip Itinerary
                              </h4>

                              <ol className="list-inside list-decimal space-y-2 text-sm min-[500px]:text-base text-gray-600">
                                {itinerary.map((day, index) => (
                                  <li key={index} className="break-words">
                                    {day}
                                  </li>
                                ))}
                              </ol>
                            </section>
                          )}

                          {/* Included Services */}

                          {includedServices.length > 0 && (
                            <section className="mb-6">
                              <h4 className="mb-3 text-base min-[500px]:text-lg font-semibold text-gray-900">
                                What's Included
                              </h4>

                              <ul className="list-inside list-disc space-y-2 text-sm min-[500px]:text-base text-gray-600">
                                {includedServices.map((service, index) => (
                                  <li key={index} className="break-words">
                                    {service}
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {/* Excluded Services */}

                          {excludedServices.length > 0 && (
                            <section className="mb-6">
                              <h4 className="mb-3 text-base min-[500px]:text-lg font-semibold text-gray-900">
                                What's Not Included
                              </h4>

                              <ul className="list-inside list-disc space-y-2 text-sm min-[500px]:text-base text-gray-600">
                                {excludedServices.map((service, index) => (
                                  <li key={index} className="break-words">
                                    {service}
                                  </li>
                                ))}
                              </ul>
                            </section>
                          )}

                          {/* Additional Package Details */}

                          {(item.accommodationDetails || item.transportationDetails || item.meetingPoint) && (
                            <section className="mb-6 grid grid-cols-1 min-[500px]:grid-cols-2 gap-3 min-[500px]:gap-4">

                              {item.accommodationDetails && (
                                <div className="min-w-0 rounded-lg border border-gray-200 p-3 min-[500px]:p-4">
                                  <h4 className="mb-2 font-semibold text-gray-900">
                                    Accommodation
                                  </h4>

                                  <p className="text-sm min-[500px]:text-base leading-6 text-gray-600 break-words">
                                    {item.accommodationDetails}
                                  </p>
                                </div>
                              )}

                              {item.transportationDetails && (
                                <div className="min-w-0 rounded-lg border border-gray-200 p-3 min-[500px]:p-4">
                                  <h4 className="mb-2 font-semibold text-gray-900">
                                    Transportation
                                  </h4>

                                  <p className="text-sm min-[500px]:text-base leading-6 text-gray-600 break-words">
                                    {item.transportationDetails}
                                  </p>
                                </div>
                              )}

                              {item.meetingPoint && (
                                <div className="min-w-0 rounded-lg border border-gray-200 p-3 min-[500px]:p-4 min-[500px]:col-span-2">
                                  <h4 className="mb-2 font-semibold text-gray-900">
                                    Meeting Point
                                  </h4>

                                  <p className="text-sm min-[500px]:text-base leading-6 text-gray-600 break-words">
                                    {item.meetingPoint}
                                  </p>
                                </div>
                              )}

                            </section>
                          )}

                          {/* Booking Action */}

                          {isSoldOut ? (
                            <p className="mt-5 text-sm min-[500px]:text-base font-semibold text-red-600">
                              This package is currently sold out.
                            </p>
                          ) : (
                            <Link
                              to={`/booking/${item.id}`}
                              className="mt-2 block w-full min-[500px]:inline-block min-[500px]:w-auto rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-blue-700"
                            >
                              Book This Package
                            </Link>
                          )}

                        </div>
                      </article>
                    );
                  })}

                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default DestinationDetails;
