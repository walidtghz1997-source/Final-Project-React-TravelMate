
import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function AddService() {
  const { addServiceRequest } = useContext(MyContext);

  const emptyForm = {
    providerName: '',
    providerEmail: '',
    providerPhone: '',
    destinationName: '',
    country: '',
    region: '',
    description: '',
    bestSeason: '',
    images: '',
    includePackage: false,
    packageName: '',
    packageDescription: '',
    packagePrice: '',
    packageDuration: '',
    packageTotalSpots: '',
    tripType: '',
    includedServices: ''
  };

  const [formData, setFormData] = useState(emptyForm);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const inputStyle =
    'w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-teal-600 focus:ring-4 focus:ring-teal-50';

  const labelStyle =
    'mb-2 block text-sm font-semibold text-gray-700';

  function handleChange(e) {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    setMessage('');
  }

  function handleSubmit(e) {
    e.preventDefault();

    setMessage('');
    setIsSuccess(false);

    const images = formData.images
      .split('\n')
      .map((image) => image.trim())
      .filter((image) => image !== '');

    if (images.length === 0) {
      setMessage('Please add at least one destination image URL.');
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
      setMessage('Please enter valid HTTP or HTTPS image URLs.');
      return;
    }

    let packageData = null;

    if (formData.includePackage) {
      const price = Number(formData.packagePrice);
      const duration = Number(formData.packageDuration);
      const totalSpots = Number(formData.packageTotalSpots);

      if (
        !formData.packageName.trim() ||
        !formData.packageDescription.trim() ||
        formData.packagePrice === '' ||
        formData.packageDuration === '' ||
        formData.packageTotalSpots === ''
      ) {
        setMessage('Please complete all required package fields.');
        return;
      }

      if (!Number.isFinite(price) || price <= 0) {
        setMessage('Package price must be greater than zero.');
        return;
      }

      if (!Number.isInteger(duration) || duration <= 0) {
        setMessage('Package duration must be a positive whole number.');
        return;
      }

      if (!Number.isInteger(totalSpots) || totalSpots < 0) {
        setMessage('Total available places must be a whole number greater than or equal to zero.');
        return;
      }

      packageData = {
        name: formData.packageName.trim(),
        description: formData.packageDescription.trim(),
        price,
        duration,
        totalSpots,
        tripType: formData.tripType.trim(),
        includedServices: formData.includedServices
          .split('\n')
          .map((service) => service.trim())
          .filter((service) => service !== '')
      };
    }

    const requestData = {
      provider: {
        name: formData.providerName.trim(),
        email: formData.providerEmail.trim().toLowerCase(),
        phone: formData.providerPhone.trim()
      },

      destination: {
        name: formData.destinationName.trim(),
        country: formData.country.trim(),
        region: formData.region.trim(),
        description: formData.description.trim(),
        bestSeason: formData.bestSeason.trim(),
        images
      },

      package: packageData
    };

    const result = addServiceRequest(requestData);

    if (!result) {
      setMessage('Please check your information and try again.');
      return;
    }

    setFormData(emptyForm);
    setIsSuccess(true);

    setMessage(
      'Your destination request has been submitted successfully. It is waiting for admin approval.'
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-teal-800 px-4 py-14 text-white sm:py-16">
        <div className="absolute -left-20 -top-20 h-64 w-64 rounded-full bg-teal-700/50" />
        <div className="absolute -bottom-32 right-10 h-72 w-72 rounded-full bg-teal-600/30" />

        <div className="relative mx-auto max-w-4xl text-center">
          <span className="mb-5 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold tracking-wide text-teal-100">
            PARTNER WITH TRAVELMATE
          </span>

          <h1 className="mb-4 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            Share Your Destination
            <span className="mt-2 block text-teal-200">
              With The World
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-sm leading-7 text-teal-50 sm:text-base">
            Introduce your destination to travelers, provide its details
            and optionally create a travel package. Our team will review
            your submission before publication.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:py-14">

        {/* Form Introduction */}
        <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Destination Submission
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Complete the information below to submit your request.
            </p>
          </div>

          <span className="w-fit rounded-full bg-amber-50 px-4 py-2 text-xs font-semibold text-amber-700">
            Admin approval required
          </span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm"
        >

          {/* Provider Information */}
          <section className="p-5 sm:p-7 lg:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">
                👤
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Provider Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Tell us how to contact you.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className={labelStyle}>
                  Full Name *
                </label>

                <input
                  type="text"
                  name="providerName"
                  value={formData.providerName}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Phone Number *
                </label>

                <input
                  type="tel"
                  name="providerPhone"
                  value={formData.providerPhone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>
                  Email Address *
                </label>

                <input
                  type="email"
                  name="providerEmail"
                  value={formData.providerEmail}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  className={inputStyle}
                  required
                />
              </div>

            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Destination Information */}
          <section className="p-5 sm:p-7 lg:p-8">

            <div className="mb-7 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">
                🌍
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Destination Information
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Introduce the place you want to share.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

              <div>
                <label className={labelStyle}>
                  Destination Name *
                </label>

                <input
                  type="text"
                  name="destinationName"
                  value={formData.destinationName}
                  onChange={handleChange}
                  placeholder="Example: Chefchaouen"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Country *
                </label>

                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="Example: Morocco"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Region *
                </label>

                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  placeholder="Example: Tangier-Tetouan-Al Hoceima"
                  className={inputStyle}
                  required
                />
              </div>

              <div>
                <label className={labelStyle}>
                  Best Season *
                </label>

                <input
                  type="text"
                  name="bestSeason"
                  value={formData.bestSeason}
                  onChange={handleChange}
                  placeholder="Example: Spring and Summer"
                  className={inputStyle}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>
                  Description *
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe this destination..."
                  rows="5"
                  className={`${inputStyle} resize-y`}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className={labelStyle}>
                  Destination Image URLs *
                </label>

                <textarea
                  name="images"
                  value={formData.images}
                  onChange={handleChange}
                  placeholder={'Enter one image URL per line:\nhttps://example.com/image1.jpg\nhttps://example.com/image2.jpg'}
                  rows="4"
                  className={`${inputStyle} resize-y`}
                  required
                />

                <p className="mt-2 flex items-start gap-2 text-xs leading-5 text-gray-500">
                  <span>ℹ️</span>
                  <span>
                    Add at least one valid HTTP or HTTPS image URL.
                    Put each image URL on a separate line.
                  </span>
                </p>
              </div>

            </div>
          </section>

          <div className="border-t border-gray-100" />

          {/* Optional Package */}
          <section className="p-5 sm:p-7 lg:p-8">

            <div className="mb-6 flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-xl">
                🧳
              </div>

              <div>
                <h2 className="text-lg font-bold text-gray-800">
                  Travel Package
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Add an optional package to your destination.
                </p>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-4 rounded-xl border border-gray-200 p-4 transition hover:border-teal-300 hover:bg-teal-50/50 sm:p-5">

              <input
                type="checkbox"
                name="includePackage"
                checked={formData.includePackage}
                onChange={handleChange}
                className="mt-1 h-5 w-5 shrink-0 accent-teal-700"
              />

              <span>
                <span className="block font-semibold text-gray-800">
                  Create a travel package
                </span>

                <span className="mt-1 block text-sm leading-6 text-gray-500">
                  I also want to create a package for this destination.
                  This step is optional.
                </span>
              </span>

            </label>

            {formData.includePackage && (
              <div className="mt-6 space-y-5 rounded-xl border border-teal-100 bg-teal-50/40 p-4 sm:p-6">

                <div>
                  <label className={labelStyle}>
                    Package Name *
                  </label>

                  <input
                    type="text"
                    name="packageName"
                    value={formData.packageName}
                    onChange={handleChange}
                    placeholder="Enter package name"
                    className={inputStyle}
                    required
                  />
                </div>

                <div>
                  <label className={labelStyle}>
                    Package Description *
                  </label>

                  <textarea
                    name="packageDescription"
                    value={formData.packageDescription}
                    onChange={handleChange}
                    placeholder="Describe this travel package..."
                    rows="4"
                    className={`${inputStyle} resize-y`}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">

                  <div>
                    <label className={labelStyle}>
                      Price per Person (MAD) *
                    </label>

                    <input
                      type="number"
                      name="packagePrice"
                      value={formData.packagePrice}
                      onChange={handleChange}
                      min="0.01"
                      step="0.01"
                      placeholder="Enter price"
                      className={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Duration (Days) *
                    </label>

                    <input
                      type="number"
                      name="packageDuration"
                      value={formData.packageDuration}
                      onChange={handleChange}
                      min="1"
                      step="1"
                      placeholder="Number of days"
                      className={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Total Available Places *
                    </label>

                    <input
                      type="number"
                      name="packageTotalSpots"
                      value={formData.packageTotalSpots}
                      onChange={handleChange}
                      min="0"
                      step="1"
                      placeholder="Number of places"
                      className={inputStyle}
                      required
                    />
                  </div>

                  <div>
                    <label className={labelStyle}>
                      Trip Type
                    </label>

                    <input
                      type="text"
                      name="tripType"
                      value={formData.tripType}
                      onChange={handleChange}
                      placeholder="Adventure, Relaxation..."
                      className={inputStyle}
                    />
                  </div>

                </div>

                <div>
                  <label className={labelStyle}>
                    Included Services
                  </label>

                  <textarea
                    name="includedServices"
                    value={formData.includedServices}
                    onChange={handleChange}
                    placeholder={'Enter one service per line:\nHotel accommodation\nBreakfast\nAirport transfer'}
                    rows="4"
                    className={`${inputStyle} resize-y`}
                  />

                  <p className="mt-2 text-xs text-gray-500">
                    Enter each included service on a separate line.
                  </p>
                </div>

              </div>
            )}
          </section>

          {/* Submission Result */}
          {message && (
            <div
              role="status"
              className={`mx-5 mb-6 rounded-xl border p-4 text-sm leading-6 sm:mx-8 ${
                isSuccess
                  ? 'border-green-200 bg-green-50 text-green-800'
                  : 'border-red-200 bg-red-50 text-red-800'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg">
                  {isSuccess ? '✓' : '⚠'}
                </span>

                <p>{message}</p>
              </div>
            </div>
          )}

          {/* Submit */}
          <div className="border-t border-gray-100 bg-gray-50/70 p-5 sm:p-8">

            <button
              type="submit"
              className="w-full rounded-xl bg-teal-700 px-6 py-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              Submit Destination Request
            </button>

            <p className="mt-4 text-center text-xs leading-6 text-gray-500">
              Your destination and package will not appear publicly
              until they are reviewed and approved by the admin.
            </p>

          </div>

        </form>

        <div className="mt-7 text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            <span>←</span>
            <span>Back to Home</span>
          </Link>
        </div>

      </div>
    </main>
  );
}

export default AddService;
