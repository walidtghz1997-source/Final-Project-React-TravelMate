import { useContext, useState } from 'react';
import { MyContext } from '../../utils/MyContext';

function AgencyPackages() {
  const {
    packages = [],
    destinations = [],
    addPackage,
    updatePackage,
    deletePackage
  } = useContext(MyContext);

  const initialFormData = {
    name: '',
    destinationId: '',
    description: '',
    price: '',
    duration: '',
    durationLabel: '',
    totalSpots: '',
    tripType: '',
    includedServices: '',
    packageImages: '',
    itinerary: '',
    excludedServices: '',
    accommodationDetails: '',
    transportationDetails: '',
    meetingPoint: '',
    operator: '',
    sourceUrl: '',
    sourcePrice: '',
    sourceCurrency: 'MAD',
    priceNote: '',
    availabilityNote: '',
    isDemo: false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [editingPackageId, setEditingPackageId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [expandedPackageId, setExpandedPackageId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleDemoChange(e) {
    setFormData((prev) => ({
      ...prev,
      isDemo: e.target.checked
    }));
  }

  function resetForm() {
    setFormData(initialFormData);
    setEditingPackageId(null);
  }

  function showMessage(text, type = 'success') {
    setMessage(text);
    setMessageType(type);
  }

  function isValidHttpUrl(value) {
    if (!value.trim()) return true;

    try {
      const url = new URL(value);

      return ['http:', 'https:'].includes(url.protocol);
    } catch {
      return false;
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    const destination = destinations.find(
      (item) => String(item.id) === String(formData.destinationId)
    );

    const price = Number(formData.price);
    const duration = Number(formData.duration);
    const totalSpots = Number(formData.totalSpots);

    const sourcePrice =
      formData.sourcePrice.trim() === ''
        ? null
        : Number(formData.sourcePrice);

    const packageImages = formData.packageImages
      .split('\n')
      .map((image) => image.trim())
      .filter((image) => image !== '');

    const invalidPackageImage = packageImages.some(
      (image) => !isValidHttpUrl(image)
    );

    if (
      !formData.name.trim() ||
      !destination ||
      !formData.description.trim() ||
      formData.price === '' ||
      formData.duration === '' ||
      formData.totalSpots === ''
    ) {
      showMessage('Please fill in all required fields.', 'error');
      return;
    }

    if (!Number.isFinite(price) || price <= 0) {
      showMessage('Price must be greater than zero.', 'error');
      return;
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      showMessage('Duration must be a positive whole number.', 'error');
      return;
    }

    if (!Number.isInteger(totalSpots) || totalSpots < 0) {
      showMessage(
        'Total places must be a whole number greater than or equal to zero.',
        'error'
      );
      return;
    }

    if (
      sourcePrice !== null &&
      (!Number.isFinite(sourcePrice) || sourcePrice < 0)
    ) {
      showMessage(
        'Source price must be a valid positive number or zero.',
        'error'
      );
      return;
    }

    if (invalidPackageImage) {
      showMessage(
        'Package images must be valid HTTP or HTTPS URLs.',
        'error'
      );
      return;
    }

    if (!isValidHttpUrl(formData.sourceUrl)) {
      showMessage(
        'Source URL must be a valid HTTP or HTTPS URL.',
        'error'
      );
      return;
    }

    const packageData = {
      name: formData.name.trim(),
      destinationId: destination.id,
      description: formData.description.trim(),

      price,
      duration,
      durationLabel:
        formData.durationLabel.trim() || `${duration} days`,

      totalSpots,

      tripType: formData.tripType.trim(),

      includedServices: formData.includedServices
        .split('\n')
        .map((service) => service.trim())
        .filter((service) => service !== ''),

      packageImages,

      itinerary: formData.itinerary
        .split('\n')
        .map((day) => day.trim())
        .filter((day) => day !== ''),

      excludedServices: formData.excludedServices
        .split('\n')
        .map((service) => service.trim())
        .filter((service) => service !== ''),

      accommodationDetails: formData.accommodationDetails.trim(),
      transportationDetails: formData.transportationDetails.trim(),
      meetingPoint: formData.meetingPoint.trim(),

      operator: formData.operator.trim(),
      sourceUrl: formData.sourceUrl.trim(),
      sourcePrice,
      sourceCurrency: formData.sourceCurrency.trim() || 'MAD',

      priceNote: formData.priceNote.trim(),
      availabilityNote: formData.availabilityNote.trim(),

      isDemo: formData.isDemo
    };

    let result;

    if (editingPackageId !== null) {
      result = updatePackage(editingPackageId, packageData);

      if (result) {
        showMessage('Package updated successfully.');
        resetForm();
      } else {
        showMessage(
          'Could not update the package. Check the destination, price and total places. The capacity cannot be lower than already reserved places.',
          'error'
        );
      }
    } else {
      result = addPackage(packageData);

      if (result) {
        showMessage('Package added successfully.');
        resetForm();
      } else {
        showMessage(
          'Could not add the package. Please check the destination, price and total places.',
          'error'
        );
      }
    }
  }

  function handleEdit(travelPackage) {
    setEditingPackageId(travelPackage.id);

    setFormData({
      name: travelPackage.name || '',
      destinationId: String(travelPackage.destinationId || ''),
      description: travelPackage.description || '',

      price: travelPackage.price ?? '',
      duration: travelPackage.duration ?? '',
      durationLabel: travelPackage.durationLabel || '',

      totalSpots: travelPackage.totalSpots ?? '',

      tripType: travelPackage.tripType || '',

      includedServices: Array.isArray(travelPackage.includedServices)
        ? travelPackage.includedServices.join('\n')
        : travelPackage.includedServices || '',

      packageImages: Array.isArray(travelPackage.packageImages)
        ? travelPackage.packageImages.join('\n')
        : '',

      itinerary: Array.isArray(travelPackage.itinerary)
        ? travelPackage.itinerary.join('\n')
        : '',

      excludedServices: Array.isArray(travelPackage.excludedServices)
        ? travelPackage.excludedServices.join('\n')
        : '',

      accommodationDetails: travelPackage.accommodationDetails || '',
      transportationDetails: travelPackage.transportationDetails || '',
      meetingPoint: travelPackage.meetingPoint || '',

      operator: travelPackage.operator || '',
      sourceUrl: travelPackage.sourceUrl || '',
      sourcePrice: travelPackage.sourcePrice ?? '',
      sourceCurrency: travelPackage.sourceCurrency || 'MAD',

      priceNote: travelPackage.priceNote || '',
      availabilityNote: travelPackage.availabilityNote || '',

      isDemo: travelPackage.isDemo === true
    });

    setExpandedPackageId(null);
    setMessage('');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleDelete(id) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this package?'
    );

    if (!confirmed) return;

    let result = deletePackage(id);

    if (result?.requiresConfirmation) {
      const bookingConfirmation = window.confirm(
        `This package has ${result.bookingsCount} active booking(s).\n\n` +
          `Amount already paid: ${result.amountPaid} MAD.\n\n` +
          `Deleting this package will cancel these bookings.\n` +
          `Their payment records will be preserved.\n\n` +
          `Do you want to continue?`
      );

      if (!bookingConfirmation) return;

      result = deletePackage(id, true);
    }

    if (!result?.success) {
      showMessage(
        result?.message ||
          'This package could not be deleted.',
        'error'
      );
      return;
    }

    if (editingPackageId === id) {
      resetForm();
    }

    if (expandedPackageId === id) {
      setExpandedPackageId(null);
    }

    showMessage(
      result.cancelledBookings > 0
        ? `Package deleted successfully. ${result.cancelledBookings} active booking(s) were cancelled.`
        : 'Package deleted successfully.'
    );
  }

  function getDestinationName(destinationId) {
    const destination = destinations.find(
      (item) => String(item.id) === String(destinationId)
    );

    return destination?.name || 'Destination not found';
  }

  function togglePackageDetails(id) {
    setExpandedPackageId((prev) => (
      prev === id ? null : id
    ));
  }

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-teal-700">
            Admin Management
          </p>

          <h1 className="text-2xl font-bold text-gray-800 sm:text-3xl">
            Packages Management
          </h1>

          <p className="mt-2 text-sm text-gray-500 sm:text-base">
            Add, edit and manage travel packages.
          </p>
        </div>

        {/* Feedback Message */}
        {message && (
          <div
            className={`mb-6 rounded-xl border p-4 text-sm ${
              messageType === 'error'
                ? 'border-red-200 bg-red-50 text-red-700'
                : 'border-green-200 bg-green-50 text-green-700'
            }`}
          >
            {message}
          </div>
        )}

        {/* Package Form */}
        <section className="mb-10 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-gray-800 sm:text-xl">
              {editingPackageId !== null ? 'Edit Package' : 'Add New Package'}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Complete the package information below.
            </p>
          </div>

          {destinations.length === 0 ? (
            <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
              You must add at least one destination before creating a package.
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2">

                {/* Package Name */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Package Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter package name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                    required
                  />
                </div>

                {/* Destination */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Destination *
                  </label>

                  <select
                    name="destinationId"
                    value={formData.destinationId}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-teal-600"
                    required
                  >
                    <option value="">Select a destination</option>

                    {destinations.map((destination) => (
                      <option
                        key={destination.id}
                        value={String(destination.id)}
                      >
                        {destination.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price per Traveler (MAD) *
                  </label>

                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0.01"
                    step="0.01"
                    placeholder="Enter price per traveler"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                    required
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    The same price applies to adults and children.
                  </p>
                </div>

                {/* Duration */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration (days) *
                  </label>

                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    min="1"
                    step="1"
                    placeholder="Number of days"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                    required
                  />
                </div>

                {/* Duration Label */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Duration Label
                  </label>

                  <input
                    type="text"
                    name="durationLabel"
                    value={formData.durationLabel}
                    onChange={handleChange}
                    placeholder="Example: 3 days / 2 nights"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Total Places */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Total Available Places *
                  </label>

                  <input
                    type="number"
                    name="totalSpots"
                    value={formData.totalSpots}
                    onChange={handleChange}
                    min="0"
                    step="1"
                    placeholder="Number of places"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                    required
                  />
                </div>

                {/* Trip Type */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trip Type
                  </label>

                  <input
                    type="text"
                    name="tripType"
                    value={formData.tripType}
                    onChange={handleChange}
                    placeholder="Example: Adventure, Culture, Nature"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Description */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Description *
                  </label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Describe this travel package..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                    required
                  />
                </div>

                {/* Demo Package */}
                <div className="min-[701px]:col-span-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.isDemo}
                      onChange={handleDemoChange}
                      className="mt-1 h-4 w-4 shrink-0 accent-teal-700"
                    />

                    <span>
                      <span className="block font-semibold text-amber-900">
                        Demo Package
                      </span>

                      <span className="mt-1 block text-sm leading-6 text-amber-800">
                        Enable this option if the package is sample data and its price or availability is not a verified real offer.
                      </span>
                    </span>
                  </label>

                  {formData.isDemo && (
                    <p className="mt-3 text-sm font-medium text-amber-800">
                      This package will be clearly marked as a demonstration package.
                    </p>
                  )}
                </div>

                {/* Source Information Heading */}
                <div className="min-[701px]:col-span-2 border-b border-gray-100 pb-3">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Source Information
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Optional information about the original source of this package.
                  </p>
                </div>

                {/* Operator */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Operator
                  </label>

                  <input
                    type="text"
                    name="operator"
                    value={formData.operator}
                    onChange={handleChange}
                    placeholder="Agency or service provider name"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Source URL */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Source URL
                  </label>

                  <input
                    type="url"
                    name="sourceUrl"
                    value={formData.sourceUrl}
                    onChange={handleChange}
                    placeholder="https://example.com/package"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Source Price */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Original Source Price
                  </label>

                  <input
                    type="number"
                    name="sourcePrice"
                    value={formData.sourcePrice}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="Optional original price"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Source Currency */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Source Currency
                  </label>

                  <input
                    type="text"
                    name="sourceCurrency"
                    value={formData.sourceCurrency}
                    onChange={handleChange}
                    placeholder="MAD, EUR, USD..."
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Price Note */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Price Note
                  </label>

                  <textarea
                    name="priceNote"
                    value={formData.priceNote}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Explain the price or clarify that it is an estimated demo price..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Availability Note */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Availability Note
                  </label>

                  <textarea
                    name="availabilityNote"
                    value={formData.availabilityNote}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Explain availability or clarify that places are illustrative..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Included Services */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Included Services
                  </label>

                  <textarea
                    name="includedServices"
                    value={formData.includedServices}
                    onChange={handleChange}
                    rows="3"
                    placeholder={'Enter one service per line:\nHotel accommodation\nBreakfast\nAirport transfer'}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Enter each included service on a separate line.
                  </p>
                </div>

                {/* Package Images */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Package Images (URLs)
                  </label>

                  <textarea
                    name="packageImages"
                    value={formData.packageImages}
                    onChange={handleChange}
                    rows="3"
                    placeholder={'Enter one image URL per line:\nhttps://example.com/image-1.jpg'}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Optional. Use direct HTTP or HTTPS image URLs, one per line.
                    The destination image will be used as a fallback.
                  </p>
                </div>

                {/* Itinerary */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Trip Itinerary
                  </label>

                  <textarea
                    name="itinerary"
                    value={formData.itinerary}
                    onChange={handleChange}
                    rows="5"
                    placeholder={'Enter one day or activity per line:\nDay 1: Arrival and hotel check-in\nDay 2: Guided city tour'}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Optional. Each line will appear as a separate itinerary item.
                  </p>
                </div>

                {/* Excluded Services */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Excluded Services
                  </label>

                  <textarea
                    name="excludedServices"
                    value={formData.excludedServices}
                    onChange={handleChange}
                    rows="3"
                    placeholder={'Enter one excluded service per line:\nPersonal expenses\nOptional activities'}
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Accommodation */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Accommodation Details
                  </label>

                  <textarea
                    name="accommodationDetails"
                    value={formData.accommodationDetails}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the accommodation..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Transportation */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Transportation Details
                  </label>

                  <textarea
                    name="transportationDetails"
                    value={formData.transportationDetails}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe the transportation..."
                    className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>

                {/* Meeting Point */}
                <div className="min-[701px]:col-span-2">
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Meeting Point
                  </label>

                  <input
                    type="text"
                    name="meetingPoint"
                    value={formData.meetingPoint}
                    onChange={handleChange}
                    placeholder="Enter the meeting or departure point"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-teal-600"
                  />
                </div>
              </div>

              {/* Form Actions */}
              <div className="mt-6 flex flex-col gap-3 min-[500px]:flex-row">
                <button
                  type="submit"
                  className="w-full rounded-lg bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 min-[500px]:w-auto"
                >
                  {editingPackageId !== null
                    ? 'Update Package'
                    : 'Add Package'}
                </button>

                {editingPackageId !== null && (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="w-full rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100 min-[500px]:w-auto"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          )}
        </section>

        {/* Existing Packages */}
        <section>
          <div className="mb-6 flex flex-col gap-2 min-[500px]:flex-row min-[500px]:items-center min-[500px]:justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
                Existing Packages
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Manage your existing travel packages.
              </p>
            </div>

            <span className="w-fit rounded-full bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700">
              {packages.length} packages
            </span>
          </div>

          {packages.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 min-[701px]:grid-cols-2 min-[701px]:gap-6">
              {packages.map((travelPackage) => {
                const destination = destinations.find(
                  (item) =>
                    String(item.id) === String(travelPackage.destinationId)
                );

                const availableSpots = Number(
                  travelPackage.availableSpots ?? 0
                );

                const includedServices = Array.isArray(
                  travelPackage.includedServices
                )
                  ? travelPackage.includedServices
                  : [];

                const excludedServices = Array.isArray(
                  travelPackage.excludedServices
                )
                  ? travelPackage.excludedServices
                  : [];

                const itinerary = Array.isArray(travelPackage.itinerary)
                  ? travelPackage.itinerary
                  : [];

                const packageImage =
                  travelPackage.packageImages?.[0] ||
                  destination?.images?.[0];

                const isExpanded =
                  expandedPackageId === travelPackage.id;

                return (
                  <article
                    key={travelPackage.id}
                    className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:shadow-md"
                  >
                    {/* Package Image */}
                    <div className="relative h-44 overflow-hidden bg-teal-50 sm:h-52">
                      {packageImage ? (
                        <img
                          src={packageImage}
                          alt={travelPackage.name}
                          className="h-full w-full object-cover transition duration-300 hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-teal-700">
                          No image available
                        </div>
                      )}

                      {/* Package Status */}
                      <div className="absolute right-3 top-3 flex flex-wrap justify-end gap-2">
                        {travelPackage.isDemo && (
                          <span className="rounded-full bg-amber-100 px-3 py-1.5 text-xs font-bold text-amber-800 shadow-sm">
                            Demo
                          </span>
                        )}

                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-bold shadow-sm ${
                            availableSpots > 0
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {availableSpots > 0 ? 'Available' : 'Sold Out'}
                        </span>
                      </div>
                    </div>

                    {/* Main Card Content */}
                    <div className="flex flex-1 flex-col p-4 sm:p-5">

                      {/* Destination and Name */}
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-teal-700">
                          {getDestinationName(travelPackage.destinationId)}
                        </p>

                        <h3 className="mt-1 break-words text-lg font-bold text-gray-800 sm:text-xl">
                          {travelPackage.name}
                        </h3>

                        {travelPackage.tripType && (
                          <span className="mt-2 inline-block rounded-full bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700">
                            {travelPackage.tripType}
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      <p className="mb-4 line-clamp-2 text-sm leading-6 text-gray-500">
                        {travelPackage.description}
                      </p>

                      {/* Essential Information */}
                      <div className="grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 sm:gap-4 sm:p-4">

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            Price per Traveler
                          </p>

                          <p className="mt-1 break-words text-base font-bold text-teal-700 sm:text-lg">
                            {travelPackage.price} MAD
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            Duration
                          </p>

                          <p className="mt-1 break-words text-sm font-semibold text-gray-800 sm:text-base">
                            {travelPackage.durationLabel ||
                              `${travelPackage.duration} days`}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            Total Places
                          </p>

                          <p className="mt-1 text-sm font-semibold text-gray-800 sm:text-base">
                            {travelPackage.totalSpots}
                          </p>
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs text-gray-500">
                            Available Places
                          </p>

                          <p
                            className={`mt-1 text-sm font-bold sm:text-base ${
                              availableSpots > 0
                                ? 'text-green-700'
                                : 'text-red-600'
                            }`}
                          >
                            {availableSpots}
                          </p>
                        </div>
                      </div>

                      {/* Details Toggle */}
                      <button
                        type="button"
                        onClick={() => togglePackageDetails(travelPackage.id)}
                        className="mt-4 flex w-full items-center justify-between rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
                      >
                        <span>
                          {isExpanded ? 'Hide Details' : 'View Full Details'}
                        </span>

                        <span className="text-lg">
                          {isExpanded ? '−' : '+'}
                        </span>
                      </button>

                      {/* Additional Details */}
                      {isExpanded && (
                        <div className="mt-4 space-y-5 border-t border-gray-100 pt-4">

                          {/* Source Information */}
                          {(travelPackage.operator ||
                            travelPackage.sourcePrice !== undefined ||
                            travelPackage.sourceUrl) && (
                            <div className="rounded-xl bg-gray-50 p-4">
                              <h4 className="mb-3 font-semibold text-gray-800">
                                Source Information
                              </h4>

                              {travelPackage.operator && (
                                <p className="mb-2 break-words text-sm text-gray-600">
                                  <strong>Operator:</strong>{' '}
                                  {travelPackage.operator}
                                </p>
                              )}

                              {travelPackage.sourcePrice !== undefined &&
                                travelPackage.sourcePrice !== null && (
                                  <p className="mb-2 text-sm text-gray-600">
                                    <strong>Source Price:</strong>{' '}
                                    {travelPackage.sourcePrice}{' '}
                                    {travelPackage.sourceCurrency || 'MAD'}
                                  </p>
                                )}

                              {travelPackage.sourceUrl && (
                                <a
                                  href={travelPackage.sourceUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="inline-block break-all text-sm font-medium text-teal-700 underline"
                                >
                                  View Source
                                </a>
                              )}
                            </div>
                          )}

                          {/* Price Note */}
                          {travelPackage.priceNote && (
                            <div className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-800">
                              <strong>Price Note:</strong>{' '}
                              {travelPackage.priceNote}
                            </div>
                          )}

                          {/* Availability Note */}
                          {travelPackage.availabilityNote && (
                            <div className="rounded-xl bg-blue-50 p-4 text-sm leading-6 text-blue-800">
                              <strong>Availability Note:</strong>{' '}
                              {travelPackage.availabilityNote}
                            </div>
                          )}

                          {/* Included Services */}
                          {includedServices.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-sm font-bold text-gray-800">
                                Included Services
                              </h4>

                              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-gray-600">
                                {includedServices.map((service, index) => (
                                  <li key={index}>{service}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Excluded Services */}
                          {excludedServices.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-sm font-bold text-gray-800">
                                Excluded Services
                              </h4>

                              <ul className="list-inside list-disc space-y-1 text-sm leading-6 text-gray-600">
                                {excludedServices.map((service, index) => (
                                  <li key={index}>{service}</li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {/* Itinerary */}
                          {itinerary.length > 0 && (
                            <div>
                              <h4 className="mb-2 text-sm font-bold text-gray-800">
                                Itinerary
                              </h4>

                              <ol className="list-inside list-decimal space-y-2 text-sm leading-6 text-gray-600">
                                {itinerary.map((day, index) => (
                                  <li key={index}>{day}</li>
                                ))}
                              </ol>
                            </div>
                          )}

                          {/* Accommodation and Transportation */}
                          {(travelPackage.accommodationDetails ||
                            travelPackage.transportationDetails ||
                            travelPackage.meetingPoint) && (
                            <div className="space-y-3 rounded-xl bg-gray-50 p-4 text-sm leading-6 text-gray-600">

                              {travelPackage.accommodationDetails && (
                                <p className="break-words">
                                  <strong className="text-gray-800">
                                    Accommodation:
                                  </strong>{' '}
                                  {travelPackage.accommodationDetails}
                                </p>
                              )}

                              {travelPackage.transportationDetails && (
                                <p className="break-words">
                                  <strong className="text-gray-800">
                                    Transportation:
                                  </strong>{' '}
                                  {travelPackage.transportationDetails}
                                </p>
                              )}

                              {travelPackage.meetingPoint && (
                                <p className="break-words">
                                  <strong className="text-gray-800">
                                    Meeting Point:
                                  </strong>{' '}
                                  {travelPackage.meetingPoint}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Card Actions */}
                      <div className="mt-auto flex gap-3 pt-5">
                        <button
                          type="button"
                          onClick={() => handleEdit(travelPackage)}
                          className="flex-1 rounded-lg bg-blue-50 px-3 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(travelPackage.id)}
                          className="flex-1 rounded-lg bg-red-50 px-3 py-3 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-gray-100 bg-white px-6 py-16 text-center shadow-sm">
              <h3 className="text-lg font-semibold text-gray-700 sm:text-xl">
                No packages available
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first package using the form above.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default AgencyPackages;