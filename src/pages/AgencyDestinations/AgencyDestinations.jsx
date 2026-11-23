
import { useContext, useState } from 'react';
import { MyContext } from '../../utils/MyContext';

function AgencyDestinations() {
  const {
    destinations = [],
    packages = [],
    addDestination,
    updateDestination,
    deleteDestination,
  } = useContext(MyContext);

  const emptyForm = {
    name: '',
    country: '',
    region: '',
    description: '',
    bestSeason: '',
    images: '',
    latitude: '',
    longitude: '',
  };

  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError('');
  }

  function openAddForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setError('');
    setMessage('');
    setShowForm(true);
  }

  function openEditForm(destination) {
    setFormData({
      name: destination.name || '',
      country: destination.country || '',
      region: destination.region || '',
      description: destination.description || '',
      bestSeason: destination.bestSeason || '',
      images: Array.isArray(destination.images)
        ? destination.images.join('\n')
        : '',
      latitude:
        destination.latitude !== undefined &&
        destination.latitude !== null
          ? String(destination.latitude)
          : '',
      longitude:
        destination.longitude !== undefined &&
        destination.longitude !== null
          ? String(destination.longitude)
          : '',
    });

    setEditingId(destination.id);
    setError('');
    setMessage('');
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setFormData(emptyForm);
    setEditingId(null);
    setError('');
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.country.trim() ||
      !formData.region.trim() ||
      !formData.description.trim() ||
      !formData.bestSeason.trim()
    ) {
      setError('Please complete all required fields.');
      return;
    }

    const images = formData.images
      .split('\n')
      .map((image) => image.trim())
      .filter((image) => image !== '');

    if (images.length === 0) {
      setError('Please add at least one image URL.');
      return;
    }

    const invalidImage = images.some((image) => {
      try {
        const imageUrl = new URL(image);

        return !['http:', 'https:'].includes(imageUrl.protocol);
      } catch {
        return true;
      }
    });

    if (invalidImage) {
      setError('Please enter valid HTTP or HTTPS image URLs.');
      return;
    }

    const hasLatitude = formData.latitude.trim() !== '';
    const hasLongitude = formData.longitude.trim() !== '';

    if (hasLatitude !== hasLongitude) {
      setError('Please enter both latitude and longitude.');
      return;
    }

    let latitude;
    let longitude;

    if (hasLatitude && hasLongitude) {
      latitude = Number(formData.latitude);
      longitude = Number(formData.longitude);

      if (
        !Number.isFinite(latitude) ||
        !Number.isFinite(longitude) ||
        latitude < -90 ||
        latitude > 90 ||
        longitude < -180 ||
        longitude > 180
      ) {
        setError('Please enter valid geographic coordinates.');
        return;
      }
    }

    const destinationData = {
      name: formData.name.trim(),
      country: formData.country.trim(),
      region: formData.region.trim(),
      description: formData.description.trim(),
      bestSeason: formData.bestSeason.trim(),
      images,
      ...(hasLatitude && hasLongitude
        ? { latitude, longitude }
        : {}),
    };

    if (editingId !== null) {
      const updated = updateDestination(editingId, destinationData);

      if (!updated) {
        setError('Could not update this destination.');
        return;
      }

      setMessage('Destination updated successfully.');
    } else {
      const added = addDestination(destinationData);

      if (!added) {
        setError('Could not add this destination.');
        return;
      }

      setMessage('Destination added successfully.');
    }

    closeForm();
  }

  function handleDelete(destination) {
    const packageCount = getPackageCount(destination.id);

    const confirmed = window.confirm(
      `Are you sure you want to delete ${destination.name}?\n\n` +
        `This will also delete ${packageCount} linked package(s).`
    );

    if (!confirmed) return;

    let result = deleteDestination(destination.id);

    if (result.requiresConfirmation) {
      const bookingConfirmation = window.confirm(
        `This destination has ${result.bookingsCount} active booking(s).\n\n` +
          `Amount already paid: ${result.amountPaid} MAD.\n\n` +
          `Deleting this destination will cancel these bookings.\n` +
          `Their payment records will be preserved.\n\n` +
          `Do you want to continue?`
      );

      if (!bookingConfirmation) return;

      result = deleteDestination(destination.id, true);
    }

    if (!result.success) {
      setMessage(
        result.message ||
          'Could not delete this destination.'
      );
      return;
    }

    setMessage(
      result.cancelledBookings > 0
        ? `Destination deleted successfully. ${result.cancelledBookings} active booking(s) were cancelled.`
        : 'Destination deleted successfully.'
    );
  }

  function getPackageCount(destinationId) {
    return packages.filter(
      (travelPackage) =>
        String(travelPackage.destinationId) === String(destinationId)
    ).length;
  }

  const previewImages = formData.images
    .split('\n')
    .map((image) => image.trim())
    .filter((image) => {
      try {
        const imageUrl = new URL(image);

        return ['http:', 'https:'].includes(imageUrl.protocol);
      } catch {
        return false;
      }
    });

  return (
    <main className="min-h-screen min-w-0 bg-slate-50 px-3 py-6 min-[500px]:px-4 sm:px-6 lg:px-10 sm:py-8">
      <div className="mx-auto max-w-7xl min-w-0">

        {/* Header */}

        <div className="mb-8 flex min-w-0 flex-col justify-between gap-4 min-[701px]:flex-row min-[701px]:items-center">
          <div className="min-w-0">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-600">
              Admin Management
            </p>

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Destinations
            </h1>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Create, update and manage your travel destinations.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            className="w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 min-[450px]:w-fit min-[701px]:shrink-0"
          >
            + Add Destination
          </button>
        </div>

        {/* Feedback */}

        {message && (
          <div className="mb-6 break-words rounded-xl border border-teal-100 bg-teal-50 px-4 py-4 text-sm text-teal-700 sm:px-5">
            {message}
          </div>
        )}

        {/* Destinations Count */}

        <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
          <p className="text-sm text-slate-500">
            Total Destinations
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {destinations.length}
          </p>
        </div>

        {/* Destination Form */}

        {showForm && (
          <section className="mb-8 min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6">

            <div className="mb-6 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg font-bold text-slate-900 sm:text-xl">
                  {editingId !== null
                    ? 'Edit Destination'
                    : 'Add New Destination'}
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Enter the destination information below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Destination Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Example: Chefchaouen"
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Country *
                  </label>

                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Example: Morocco"
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Region *
                  </label>

                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    placeholder="Example: Fes-Meknes"
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Best Season *
                  </label>

                  <input
                    type="text"
                    name="bestSeason"
                    value={formData.bestSeason}
                    onChange={handleChange}
                    placeholder="Example: Spring and Summer"
                    required
                    className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                  />
                </div>

              </div>

              {/* Geographic Coordinates */}

              <div>
                <h3 className="mb-3 text-sm font-semibold text-slate-800">
                  Geographic Coordinates

                  <span className="ml-2 font-normal text-slate-400">
                    (Optional)
                  </span>
                </h3>

                <div className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2">

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Latitude
                    </label>

                    <input
                      type="number"
                      name="latitude"
                      value={formData.latitude}
                      onChange={handleChange}
                      placeholder="Example: 34.0331"
                      step="any"
                      min="-90"
                      max="90"
                      className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Longitude
                    </label>

                    <input
                      type="number"
                      name="longitude"
                      value={formData.longitude}
                      onChange={handleChange}
                      placeholder="Example: -5.0003"
                      step="any"
                      min="-180"
                      max="180"
                      className="w-full min-w-0 rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                    />
                  </div>

                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Coordinates are used to identify the geographic location of the destination.
                </p>
              </div>

              {/* Description */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="4"
                  placeholder="Describe this destination..."
                  required
                  className="w-full min-w-0 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />
              </div>

              {/* Images */}

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Image URLs *
                </label>

                <textarea
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  rows="4"
                  placeholder={'Enter one image URL per line:\nhttps://example.com/image1.jpg\nhttps://example.com/image2.jpg'}
                  required
                  className="w-full min-w-0 resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-teal-500"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Add at least one valid HTTP or HTTPS image URL. Put each image URL on a separate line.
                </p>
              </div>

              {/* Image Preview */}

              {previewImages.length > 0 && (
                <div>
                  <h3 className="mb-3 text-sm font-semibold text-slate-700">
                    Image Preview
                  </h3>

                  <div className="grid grid-cols-2 gap-3 min-[500px]:grid-cols-3 sm:gap-4">
                    {previewImages.map((image, index) => (
                      <div
                        key={`${image}-${index}`}
                        className="h-28 min-w-0 overflow-hidden rounded-xl bg-slate-100 min-[500px]:h-32"
                      >
                        <img
                          src={image}
                          alt={`Destination preview ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="break-words rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </p>
              )}

              {/* Form Actions */}

              <div className="flex flex-col gap-3 min-[450px]:flex-row">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-teal-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 min-[450px]:w-auto"
                >
                  {editingId !== null
                    ? 'Save Changes'
                    : 'Create Destination'}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="w-full rounded-xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 min-[450px]:w-auto"
                >
                  Cancel
                </button>
              </div>

            </form>
          </section>
        )}

        {/* Destinations List */}

        {destinations.length === 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-white px-4 py-16 text-center shadow-sm sm:px-6">
            <h2 className="text-xl font-bold text-slate-800">
              No destinations yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Start by adding your first travel destination.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-5 w-full rounded-xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 min-[450px]:w-fit"
            >
              Add Destination
            </button>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 xl:grid-cols-3 xl:gap-6">

            {destinations.map((destination) => (
              <article
                key={destination.id}
                className="min-w-0 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm transition hover:shadow-md"
              >

                <div className="h-48 overflow-hidden bg-slate-100 min-[500px]:h-44 sm:h-52">
                  {destination.images?.[0] ? (
                    <img
                      src={destination.images[0]}
                      alt={destination.name}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">
                      No image available
                    </div>
                  )}
                </div>

                <div className="p-4 sm:p-5">

                  <div className="mb-3 flex min-w-0 flex-col gap-2 min-[500px]:flex-row min-[500px]:items-start min-[500px]:justify-between">

                    <div className="min-w-0">
                      <h2 className="break-words text-lg font-bold text-slate-900">
                        {destination.name}
                      </h2>

                      <p className="mt-1 text-sm text-slate-500">
                        {destination.country}
                      </p>
                    </div>

                    <span className="w-fit max-w-full break-words rounded-full bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700">
                      {destination.region}
                    </span>

                  </div>

                  <p className="mb-4 line-clamp-3 text-sm leading-6 text-slate-500">
                    {destination.description}
                  </p>

                  <div className="mb-5 space-y-2 border-t border-slate-100 pt-4 text-sm">

                    <p className="break-words text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Best Season:
                      </span>{' '}
                      {destination.bestSeason}
                    </p>

                    <p className="text-slate-600">
                      <span className="font-semibold text-slate-800">
                        Packages:
                      </span>{' '}
                      {getPackageCount(destination.id)}
                    </p>

                    {destination.latitude !== undefined &&
                      destination.longitude !== undefined && (
                        <p className="break-words text-slate-600">
                          <span className="font-semibold text-slate-800">
                            Coordinates:
                          </span>{' '}
                          {destination.latitude}, {destination.longitude}
                        </p>
                      )}

                    {destination.source && (
                      <p className="break-words text-slate-600">
                        <span className="font-semibold text-slate-800">
                          Source:
                        </span>{' '}
                        {destination.source}
                      </p>
                    )}

                  </div>

                  <div className="flex flex-col gap-2 min-[450px]:flex-row min-[450px]:gap-3">

                    <button
                      type="button"
                      onClick={() => openEditForm(destination)}
                      className="w-full flex-1 rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-700 transition hover:bg-teal-100"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(destination)}
                      className="w-full flex-1 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </article>
            ))}

          </section>
        )}

      </div>
    </main>
  );
}

export default AgencyDestinations;
