
import { useContext, useState } from 'react';

import { MyContext } from '../../utils/MyContext';

function AgencyServiceRequests() {
  const {
    serviceRequests = [],
    approveServiceRequest,
    rejectServiceRequest
  } = useContext(MyContext);

  const [activeFilter, setActiveFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const pendingCount = serviceRequests.filter(
    (request) => request.status === 'Pending'
  ).length;

  const approvedCount = serviceRequests.filter(
    (request) => request.status === 'Approved'
  ).length;

  const rejectedCount = serviceRequests.filter(
    (request) => request.status === 'Rejected'
  ).length;

  const filteredRequests = serviceRequests.filter((request) => {
    if (activeFilter === 'All') {
      return true;
    }

    return request.status === activeFilter;
  });

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  function handleApprove(id) {
    const confirmed = window.confirm(
      'Approve this request? The destination and its optional package will be published to travelers.'
    );

    if (!confirmed) {
      return;
    }

    const result = approveServiceRequest(id);

    if (!result) {
      showMessage(
        'Could not approve this request. Check its information or its current status.',
        'error'
      );
      return;
    }

    showMessage(
      'Request approved successfully. The destination and its package, if included, are now published to travelers.'
    );
  }

  function handleReject(id) {
    const confirmed = window.confirm(
      'Are you sure you want to reject this request?'
    );

    if (!confirmed) {
      return;
    }

    const result = rejectServiceRequest(id);

    if (!result) {
      showMessage(
        'Could not reject this request. It may have already been reviewed.',
        'error'
      );
      return;
    }

    showMessage('Request rejected successfully.');
  }

  function getStatusStyle(status) {
    if (status === 'Approved') {
      return 'bg-green-100 text-green-700';
    }

    if (status === 'Rejected') {
      return 'bg-red-100 text-red-700';
    }

    return 'bg-yellow-100 text-yellow-700';
  }

  function formatDate(date) {
    if (!date) {
      return 'Not available';
    }

    return new Date(date).toLocaleString();
  }

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl min-w-0">

        {/* Header */}
        <div className="mb-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-teal-600 sm:text-sm">
            Admin Management
          </p>

          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Destination Requests
          </h1>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
            Review destination submissions and optional travel packages before publishing them.
          </p>
        </div>

        {/* Feedback */}
        {message && (
          <div
            className={`mb-6 break-words rounded-xl border px-4 py-4 text-sm sm:px-5 ${
              messageType === 'error'
                ? 'border-red-100 bg-red-50 text-red-700'
                : 'border-teal-100 bg-teal-50 text-teal-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Statistics */}
        <div className="mb-8 grid grid-cols-1 gap-4 min-[500px]:grid-cols-2 min-[1000px]:grid-cols-3">

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Pending Requests
              </p>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-yellow-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <circle cx="12" cy="12" r="9" />
                  <path d="M12 7v5l3 2" />
                </svg>
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-yellow-600">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Approved Requests
              </p>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m5 12 4 4L19 6" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-green-600">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:col-span-2 min-[1000px]:col-span-1 sm:p-5">
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm text-slate-500">
                Rejected Requests
              </p>

              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="m8 8 8 8M16 8l-8 8" />
                  <circle cx="12" cy="12" r="9" />
                </svg>
              </span>
            </div>

            <p className="mt-3 text-3xl font-bold text-red-600">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <section className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-slate-800">
              Filter Requests
            </h2>

            <span className="text-xs text-slate-500">
              {filteredRequests.length} results
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 min-[500px]:flex min-[500px]:flex-wrap">
            {['All', 'Pending', 'Approved', 'Rejected'].map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActiveFilter(filter)}
                className={`rounded-xl px-3 py-3 text-sm font-semibold transition min-[500px]:px-5 ${
                  activeFilter === filter
                    ? 'bg-teal-700 text-white shadow-sm'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                {filter}
                {filter === 'All' && ` (${serviceRequests.length})`}
                {filter === 'Pending' && ` (${pendingCount})`}
                {filter === 'Approved' && ` (${approvedCount})`}
                {filter === 'Rejected' && ` (${rejectedCount})`}
              </button>
            ))}
          </div>
        </section>

        {/* Requests List */}
        {filteredRequests.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-5 py-14 text-center shadow-sm sm:px-6 sm:py-16">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-50 text-slate-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
              >
                <path d="M8 6h13M8 12h13M8 18h13" />
                <path d="M3 6h.01M3 12h.01M3 18h.01" />
              </svg>
            </div>

            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">
              No requests found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              There are no requests in this category.
            </p>
          </div>
        ) : (
          <div className="space-y-5 sm:space-y-6">

            {filteredRequests.map((request) => {
              const provider = request.provider || {
                name: request.providerName,
                email: request.providerEmail,
                phone: request.providerPhone
              };

              const destination = request.destination;
              const travelPackage = request.package;

              const isNewRequest = Boolean(destination);

              return (
                <article
                  key={request.id}
                  className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm"
                >

                  {/* Request Header */}
                  <div className="flex flex-col gap-4 border-b border-slate-100 p-4 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between sm:p-5">

                    <div className="min-w-0">
                      <p className="text-xs text-slate-500 sm:text-sm">
                        Request submitted
                      </p>

                      <p className="mt-1 break-words text-sm font-medium text-slate-800 sm:text-base">
                        {formatDate(request.createdAt)}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(request.status)}`}
                      >
                        {request.status}
                      </span>

                      {isNewRequest && (
                        <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
                          Destination Request
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="min-w-0 p-4 sm:p-6">

                    {/* Provider Information */}
                    <section className="mb-7">
                      <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
                        Provider Information
                      </h2>

                      <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 min-[500px]:grid-cols-2 min-[900px]:grid-cols-3">

                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            Full Name
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {provider.name || 'Not available'}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-slate-500">
                            Email Address
                          </p>

                          <p className="mt-1 break-all text-sm font-semibold text-slate-800">
                            {provider.email || 'Not available'}
                          </p>
                        </div>

                        <div className="min-w-0 min-[500px]:col-span-2 min-[900px]:col-span-1">
                          <p className="text-xs text-slate-500">
                            Phone Number
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                            {provider.phone || 'Not available'}
                          </p>
                        </div>
                      </div>
                    </section>

                    {destination ? (
                      <>
                        {/* Destination Information */}
                        <section className="mb-7">
                          <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
                            Destination Information
                          </h2>

                          <div className="mb-5 grid grid-cols-1 gap-4 min-[500px]:grid-cols-2">

                            <div>
                              <p className="text-xs text-slate-500">
                                Destination Name
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {destination.name}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Country
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {destination.country}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Region
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {destination.region}
                              </p>
                            </div>

                            <div>
                              <p className="text-xs text-slate-500">
                                Best Season
                              </p>

                              <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                {destination.bestSeason}
                              </p>
                            </div>
                          </div>

                          <div className="mb-5 min-w-0">
                            <p className="mb-2 text-xs font-semibold text-slate-500">
                              Description
                            </p>

                            <p className="break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                              {destination.description}
                            </p>
                          </div>

                          {Array.isArray(destination.images) &&
                            destination.images.length > 0 && (
                              <div>
                                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                                  Destination Images
                                </h3>

                                <div className="grid grid-cols-2 gap-3 min-[500px]:grid-cols-3 min-[900px]:grid-cols-4">
                                  {destination.images.map((image, index) => (
                                    <div
                                      key={`${image}-${index}`}
                                      className="aspect-[4/3] min-w-0 overflow-hidden rounded-xl bg-slate-100"
                                    >
                                      <img
                                        src={image}
                                        alt={`${destination.name} ${index + 1}`}
                                        className="h-full w-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                        </section>

                        {/* Optional Package */}
                        <section className="mb-7 border-t border-slate-100 pt-6">
                          <h2 className="mb-4 text-base font-bold text-slate-900 sm:text-lg">
                            Travel Package
                          </h2>

                          {travelPackage ? (
                            <>
                              <div className="mb-5 rounded-xl border border-teal-100 bg-teal-50 p-4">
                                <p className="text-sm font-semibold leading-6 text-teal-800">
                                  The provider included a package with this destination.
                                </p>
                              </div>

                              <div className="grid grid-cols-1 gap-4 rounded-xl bg-slate-50 p-4 min-[500px]:grid-cols-2">

                                <div>
                                  <p className="text-xs text-slate-500">
                                    Package Name
                                  </p>

                                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                    {travelPackage.name}
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500">
                                    Price per Adult
                                  </p>

                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {travelPackage.price} MAD
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500">
                                    Duration
                                  </p>

                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {travelPackage.duration} days
                                  </p>
                                </div>

                                <div>
                                  <p className="text-xs text-slate-500">
                                    Total Available Places
                                  </p>

                                  <p className="mt-1 text-sm font-semibold text-slate-800">
                                    {travelPackage.totalSpots}
                                  </p>
                                </div>

                                {travelPackage.tripType && (
                                  <div className="min-[500px]:col-span-2">
                                    <p className="text-xs text-slate-500">
                                      Trip Type
                                    </p>

                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                      {travelPackage.tripType}
                                    </p>
                                  </div>
                                )}
                              </div>

                              <div className="mt-5 min-w-0">
                                <p className="mb-2 text-xs font-semibold text-slate-500">
                                  Package Description
                                </p>

                                <p className="break-words rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-700">
                                  {travelPackage.description}
                                </p>
                              </div>

                              {Array.isArray(travelPackage.includedServices) &&
                                travelPackage.includedServices.length > 0 && (
                                  <div className="mt-5">
                                    <h3 className="mb-3 text-sm font-semibold text-slate-700">
                                      Included Services
                                    </h3>

                                    <ul className="list-inside list-disc space-y-2 break-words text-sm leading-6 text-slate-600">
                                      {travelPackage.includedServices.map(
                                        (service, index) => (
                                          <li key={index}>{service}</li>
                                        )
                                      )}
                                    </ul>
                                  </div>
                                )}
                            </>
                          ) : (
                            <div className="rounded-xl bg-slate-50 p-4">
                              <p className="text-sm leading-6 text-slate-600">
                                The provider submitted this destination without a travel package.
                              </p>
                            </div>
                          )}
                        </section>
                      </>
                    ) : (
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
                        <p className="font-semibold text-yellow-800">
                          Legacy request
                        </p>

                        <p className="mt-1 text-sm leading-6 text-yellow-700">
                          This request uses the previous service-request format and cannot be approved as a destination request.
                        </p>

                        {request.serviceName && (
                          <p className="mt-3 break-words text-sm text-slate-700">
                            Service: {request.serviceName}
                          </p>
                        )}

                        {request.description && (
                          <p className="mt-2 break-words text-sm leading-6 text-slate-700">
                            {request.description}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Review Actions */}
                    {request.status === 'Pending' && isNewRequest && (
                      <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 min-[500px]:flex-row">

                        <button
                          type="button"
                          onClick={() => handleApprove(request.id)}
                          className="w-full rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800 min-[500px]:w-auto"
                        >
                          Approve & Publish
                        </button>

                        <button
                          type="button"
                          onClick={() => handleReject(request.id)}
                          className="w-full rounded-xl bg-red-50 px-5 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100 min-[500px]:w-auto"
                        >
                          Reject Request
                        </button>
                      </div>
                    )}

                    {request.status === 'Approved' && (
                      <div className="border-t border-slate-100 pt-5">
                        <p className="break-words text-sm leading-6 text-green-700">
                          Published successfully on {formatDate(request.reviewedAt)}.
                        </p>
                      </div>
                    )}

                    {request.status === 'Rejected' && (
                      <div className="border-t border-slate-100 pt-5">
                        <p className="break-words text-sm leading-6 text-red-600">
                          Rejected on {formatDate(request.reviewedAt)}.
                        </p>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

export default AgencyServiceRequests;
