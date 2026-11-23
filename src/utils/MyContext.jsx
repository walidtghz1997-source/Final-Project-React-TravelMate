
import { createContext, useEffect, useState } from 'react';
import { fetchTravelMateData } from './travelDataService';

export const MyContext = createContext();

// ==================================
// 1. LocalStorage Helper
// ==================================

function getSavedData(key, defaultValue) {
  const savedData = localStorage.getItem(key);

  if (!savedData) {
    return defaultValue;
  }

  try {
    return JSON.parse(savedData);
  } catch (error) {
    return defaultValue;
  }
}

// ==================================
// 2. MyProvider
// ==================================

export function MyProvider({ children }) {

  // ==================================
  // 3. Global States
  // ==================================

  const [destinations, setDestinations] = useState(() =>
    getSavedData('travelmate-destinations', [])
  );

  const [packages, setPackages] = useState(() =>
    getSavedData('travelmate-packages', [])
  );

  const [bookings, setBookings] = useState(() =>
    getSavedData('travelmate-bookings', [])
  );

  const [favorites, setFavorites] = useState(() =>
    getSavedData('travelmate-favorites', [])
  );

  const [users, setUsers] = useState(() =>
    getSavedData('travelmate-users', [])
  );

  const [currentUser, setCurrentUser] = useState(() =>
    getSavedData('travelmate-current-user', null)
  );

  const [serviceRequests, setServiceRequests] = useState(() =>
    getSavedData('travelmate-service-requests', [])
  );

  const [travelDataLoading, setTravelDataLoading] = useState(true);

  const [travelDataError, setTravelDataError] = useState('');

  // ==================================
  // 4. Save Data in LocalStorage
  // ==================================

  useEffect(() => {
    if (travelDataLoading) {
      return;
    }

    localStorage.setItem(
      'travelmate-destinations',
      JSON.stringify(destinations)
    );
  }, [destinations, travelDataLoading]);

  useEffect(() => {
    if (travelDataLoading) {
      return;
    }

    localStorage.setItem(
      'travelmate-packages',
      JSON.stringify(packages)
    );
  }, [packages, travelDataLoading]);

  useEffect(() => {
    localStorage.setItem(
      'travelmate-bookings',
      JSON.stringify(bookings)
    );
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem(
      'travelmate-favorites',
      JSON.stringify(favorites)
    );
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem(
      'travelmate-users',
      JSON.stringify(users)
    );
  }, [users]);

  useEffect(() => {
    localStorage.setItem(
      'travelmate-current-user',
      JSON.stringify(currentUser)
    );
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(
      'travelmate-service-requests',
      JSON.stringify(serviceRequests)
    );
  }, [serviceRequests]);

  // ==================================
  // 5. Load Destinations and Packages
  // ==================================

  useEffect(() => {
    // If destinations and packages already exist,
    // there is no need to fetch them again.

    if (
      Array.isArray(destinations) &&
      destinations.length > 0 &&
      Array.isArray(packages) &&
      packages.length > 0
    ) {
      setTravelDataLoading(false);
      return;
    }

    let isMounted = true;

    const loadTravelData = async () => {
      try {
        const onlineData = await fetchTravelMateData();

        if (!isMounted) {
          return;
        }

        if (
          !onlineData ||
          !Array.isArray(onlineData.destinations) ||
          !Array.isArray(onlineData.packages) ||
          onlineData.destinations.length === 0 ||
          onlineData.packages.length === 0
        ) {
          throw new Error('Invalid travel data received.');
        }

        setDestinations(onlineData.destinations);
        setPackages(onlineData.packages);

        setTravelDataError('');

      } catch (error) {
        if (isMounted) {
          setTravelDataError(
            error.message ||
            'An error occurred while loading travel data.'
          );
        }

      } finally {
        if (isMounted) {
          setTravelDataLoading(false);
        }
      }
    };

    loadTravelData();

    return () => {
      isMounted = false;
    };
  }, []);

  // ==================================
  // 6. User Account Functions
  // ==================================

  const registerUser = (userData) => {
    const name = userData.name.trim();
    const email = userData.email.trim().toLowerCase();
    const password = userData.password;

    if (!name || !email || !password) {
      return false;
    }

    const emailExists = users.some(
      (user) => user.email === email
    );

    if (emailExists) {
      return false;
    }

    const newUser = {
      id: Date.now().toString(),
      name,
      email,
      password,
      role: 'Traveler'
    };

    setUsers((prev) => [...prev, newUser]);

    const loggedInUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role
    };

    setCurrentUser(loggedInUser);

    return true;
  };

  const loginUser = (email, password) => {
    const normalizedEmail = email.trim().toLowerCase();

    const user = users.find(
      (item) =>
        item.email === normalizedEmail &&
        item.password === password
    );

    if (!user) {
      return false;
    }

    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });

    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  // ==================================
  // 7. Helper Functions
  // ==================================

  const getTodayDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const isPastDate = (date) => {
    return date < getTodayDate();
  };

  const isBookingPast = (booking) => {
    return isPastDate(booking.departureDate);
  };

  const getReservedSpots = (packageId) => {
    return bookings
      .filter(
        (booking) =>
          String(booking.packageId) === String(packageId) &&
          ['Pending', 'Confirmed'].includes(booking.status)
      )
      .reduce(
        (total, booking) =>
          total + Number(booking.adults) + Number(booking.children),
        0
      );
  };

  // ==================================
  // 8. Booking Price Calculation
  // ==================================

  const calculateTotalPrice = (adults, children, price) => {
    const adultPrice = adults * price;
    const childPrice = children * price;

    return Math.round((adultPrice + childPrice) * 100) / 100;
  };

  // ==================================
  // 9. Booking Payment Helpers
  // ==================================

  const getBookingPaymentDetails = (bookingId) => {
    const booking = bookings.find(
      (item) => item.id === bookingId
    );

    if (!booking) {
      return null;
    }

    const totalPrice = Number(booking.totalPrice) || 0;

    const payments = Array.isArray(booking.payments)
      ? booking.payments
      : [];

    const amountPaid = Math.round(
      payments.reduce(
        (total, payment) => total + (Number(payment.amount) || 0),
        0
      ) * 100
    ) / 100;

    const remainingAmount = Math.max(
      Math.round((totalPrice - amountPaid) * 100) / 100,
      0
    );

    let paymentStatus = 'Unpaid';

    if (amountPaid > 0 && remainingAmount > 0) {
      paymentStatus = 'Partially Paid';
    } else if (totalPrice > 0 && remainingAmount === 0) {
      paymentStatus = 'Paid';
    }

    return {
      totalPrice,
      amountPaid,
      remainingAmount,
      paymentStatus,
      payments
    };
  };

  // ==================================
  // 10. Destinations CRUD
  // ==================================

  const addDestination = (newDestination) => {
    const destination = {
      ...newDestination,
      id: Date.now().toString()
    };

    setDestinations((prev) => [...prev, destination]);

    return true;
  };

  const updateDestination = (id, updatedData) => {
    const destinationExists = destinations.some(
      (destination) => String(destination.id) === String(id)
    );

    if (!destinationExists) {
      return false;
    }

    setDestinations((prev) =>
      prev.map((destination) =>
        String(destination.id) === String(id)
          ? {
              ...destination,
              ...updatedData,
              id: destination.id
            }
          : destination
      )
    );

    return true;
  };

  // ==================================
  // 11. Delete Destination + Its Packages
  // ==================================

  const deleteDestination = (id, confirmCancellation = false) => {
    const destinationExists = destinations.some(
      (destination) => String(destination.id) === String(id)
    );

    if (!destinationExists) {
      return {
        success: false,
        requiresConfirmation: false,
        message: 'Destination does not exist.'
      };
    }

    const destinationPackages = packages.filter(
      (travelPackage) =>
        String(travelPackage.destinationId) === String(id)
    );

    const packageIds = destinationPackages.map(
      (travelPackage) => String(travelPackage.id)
    );

    const linkedBookings = bookings.filter(
      (booking) => packageIds.includes(String(booking.packageId))
    );

    const activeBookings = linkedBookings.filter(
      (booking) =>
        ['Pending', 'Confirmed'].includes(booking.status)
    );

    const amountPaid = activeBookings.reduce(
      (total, booking) => {
        const payments = Array.isArray(booking.payments)
          ? booking.payments
          : [];

        const bookingPaid = payments.reduce(
          (sum, payment) => sum + (Number(payment.amount) || 0),
          0
        );

        return total + bookingPaid;
      },
      0
    );

    if (activeBookings.length > 0 && !confirmCancellation) {
      return {
        success: false,
        requiresConfirmation: true,
        bookingsCount: activeBookings.length,
        amountPaid: Math.round(amountPaid * 100) / 100
      };
    }

    if (activeBookings.length > 0) {
      const activeBookingIds = activeBookings.map(
        (booking) => String(booking.id)
      );

      setBookings((prev) =>
        prev.map((booking) =>
          activeBookingIds.includes(String(booking.id))
            ? {
                ...booking,
                status: 'Cancelled'
              }
            : booking
        )
      );
    }

    setPackages((prev) =>
      prev.filter(
        (travelPackage) =>
          String(travelPackage.destinationId) !== String(id)
      )
    );

    setDestinations((prev) =>
      prev.filter(
        (destination) => String(destination.id) !== String(id)
      )
    );

    setFavorites((prev) =>
      prev.filter(
        (destinationId) => String(destinationId) !== String(id)
      )
    );

    return {
      success: true,
      cancelledBookings: activeBookings.length
    };
  };

  // ==================================
  // 12. Packages CRUD
  // ==================================

  const addPackage = (newPackage) => {
    const destinationExists = destinations.some(
      (destination) =>
        String(destination.id) === String(newPackage.destinationId)
    );

    const price = Number(newPackage.price);
    const totalSpots = Number(newPackage.totalSpots);

    if (
      !destinationExists ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(totalSpots) ||
      totalSpots < 0
    ) {
      return false;
    }

    const travelPackage = {
      ...newPackage,
      id: Date.now().toString(),
      price,
      totalSpots,
      availableSpots: totalSpots
    };

    setPackages((prev) => [...prev, travelPackage]);

    return true;
  };

  const updatePackage = (id, updatedData) => {
    const currentPackage = packages.find(
      (item) => String(item.id) === String(id)
    );

    if (!currentPackage) {
      return false;
    }

    const destinationId =
      updatedData.destinationId || currentPackage.destinationId;

    const destinationExists = destinations.some(
      (destination) =>
        String(destination.id) === String(destinationId)
    );

    const price =
      updatedData.price !== undefined
        ? Number(updatedData.price)
        : currentPackage.price;

    const totalSpots =
      updatedData.totalSpots !== undefined
        ? Number(updatedData.totalSpots)
        : currentPackage.totalSpots;

    if (
      !destinationExists ||
      !Number.isFinite(price) ||
      price <= 0 ||
      !Number.isInteger(totalSpots) ||
      totalSpots < 0
    ) {
      return false;
    }

    const reservedSpots = getReservedSpots(id);

    if (totalSpots < reservedSpots) {
      return false;
    }

    setPackages((prev) =>
      prev.map((travelPackage) =>
        String(travelPackage.id) === String(id)
          ? {
              ...travelPackage,
              ...updatedData,
              id: travelPackage.id,
              destinationId,
              price,
              totalSpots,
              availableSpots: totalSpots - reservedSpots
            }
          : travelPackage
      )
    );

    return true;
  };

  // ==================================
  // 13. Delete One Package Only
  // ==================================

  const deletePackage = (id, confirmCancellation = false) => {
    const travelPackage = packages.find(
      (item) => String(item.id) === String(id)
    );

    if (!travelPackage) {
      return {
        success: false,
        requiresConfirmation: false,
        message: 'Package does not exist.'
      };
    }

    const linkedBookings = bookings.filter(
      (booking) => String(booking.packageId) === String(id)
    );

    const activeBookings = linkedBookings.filter(
      (booking) =>
        ['Pending', 'Confirmed'].includes(booking.status)
    );

    const amountPaid = activeBookings.reduce(
      (total, booking) => {
        const payments = Array.isArray(booking.payments)
          ? booking.payments
          : [];

        const bookingPaid = payments.reduce(
          (sum, payment) => sum + (Number(payment.amount) || 0),
          0
        );

        return total + bookingPaid;
      },
      0
    );

    if (activeBookings.length > 0 && !confirmCancellation) {
      return {
        success: false,
        requiresConfirmation: true,
        bookingsCount: activeBookings.length,
        amountPaid: Math.round(amountPaid * 100) / 100
      };
    }

    if (activeBookings.length > 0) {
      const activeBookingIds = activeBookings.map(
        (booking) => String(booking.id)
      );

      setBookings((prev) =>
        prev.map((booking) =>
          activeBookingIds.includes(String(booking.id))
            ? {
                ...booking,
                status: 'Cancelled'
              }
            : booking
        )
      );
    }

    setPackages((prev) =>
      prev.filter(
        (item) => String(item.id) !== String(id)
      )
    );

    return {
      success: true,
      cancelledBookings: activeBookings.length
    };
  };

  // ==================================
  // 14. Add Booking
  // ==================================

  const addBooking = (newBooking) => {
    const travelPackage = packages.find(
      (item) => String(item.id) === String(newBooking.packageId)
    );

    if (
      !travelPackage ||
      !currentUser ||
      currentUser.role !== 'Traveler'
    ) {
      return false;
    }

    const adults = Number(newBooking.adults);
    const children = Number(newBooking.children);

    const departureDate = newBooking.departureDate;
    const returnDate = newBooking.returnDate;

    if (
      !Number.isInteger(adults) ||
      !Number.isInteger(children) ||
      adults < 1 ||
      children < 0
    ) {
      return false;
    }

    if (
      !departureDate ||
      !returnDate ||
      isPastDate(departureDate) ||
      returnDate <= departureDate
    ) {
      return false;
    }

    const totalTravelers = adults + children;

    if (
      travelPackage.availableSpots < totalTravelers ||
      totalTravelers <= 0
    ) {
      return false;
    }

    const totalPrice = calculateTotalPrice(
      adults,
      children,
      travelPackage.price
    );

    const booking = {
      ...newBooking,
      id: Date.now().toString(),
      userId: currentUser.id,
      adults,
      children,
      totalPrice,
      payments: [],
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setPackages((prev) =>
      prev.map((item) =>
        String(item.id) === String(travelPackage.id)
          ? {
              ...item,
              availableSpots: item.availableSpots - totalTravelers
            }
          : item
      )
    );

    setBookings((prev) => [...prev, booking]);

    return true;
  };

  // ==================================
  // 15. Update Booking
  // ==================================

  const updateBooking = (id, updatedData) => {
    const booking = bookings.find(
      (item) => String(item.id) === String(id)
    );

    if (
      !booking ||
      booking.userId !== currentUser?.id ||
      booking.status !== 'Pending' ||
      isBookingPast(booking)
    ) {
      return false;
    }

    const travelPackage = packages.find(
      (item) => String(item.id) === String(booking.packageId)
    );

    if (!travelPackage) {
      return false;
    }

    const adults =
      updatedData.adults !== undefined
        ? Number(updatedData.adults)
        : booking.adults;

    const children =
      updatedData.children !== undefined
        ? Number(updatedData.children)
        : booking.children;

    const departureDate =
      updatedData.departureDate !== undefined
        ? updatedData.departureDate
        : booking.departureDate;

    const returnDate =
      updatedData.returnDate !== undefined
        ? updatedData.returnDate
        : booking.returnDate;

    if (
      !Number.isInteger(adults) ||
      !Number.isInteger(children) ||
      adults < 1 ||
      children < 0
    ) {
      return false;
    }

    if (
      !departureDate ||
      !returnDate ||
      isPastDate(departureDate) ||
      returnDate <= departureDate
    ) {
      return false;
    }

    const oldTravelers =
      Number(booking.adults) + Number(booking.children);

    const newTravelers = adults + children;
    const difference = newTravelers - oldTravelers;

    if (difference > travelPackage.availableSpots) {
      return false;
    }

    const totalPrice = calculateTotalPrice(
      adults,
      children,
      travelPackage.price
    );

    setPackages((prev) =>
      prev.map((item) =>
        String(item.id) === String(booking.packageId)
          ? {
              ...item,
              availableSpots: item.availableSpots - difference
            }
          : item
      )
    );

    setBookings((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              adults,
              children,
              departureDate,
              returnDate,
              totalPrice
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 16. Confirm Booking
  // ==================================

  const confirmBooking = (id) => {
    const booking = bookings.find(
      (item) => String(item.id) === String(id)
    );

    if (
      !booking ||
      booking.status !== 'Pending' ||
      isBookingPast(booking)
    ) {
      return false;
    }

    setBookings((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: 'Confirmed',
              payments: Array.isArray(item.payments)
                ? item.payments
                : []
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 17. Reject Booking
  // ==================================

  const rejectBooking = (id) => {
    const booking = bookings.find(
      (item) => String(item.id) === String(id)
    );

    if (!booking || booking.status !== 'Pending') {
      return false;
    }

    setPackages((prev) =>
      prev.map((item) =>
        String(item.id) === String(booking.packageId)
          ? {
              ...item,
              availableSpots:
                item.availableSpots +
                Number(booking.adults) +
                Number(booking.children)
            }
          : item
      )
    );

    setBookings((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: 'Rejected'
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 18. Cancel Booking
  // ==================================

  const cancelBooking = (id) => {
    const booking = bookings.find(
      (item) => String(item.id) === String(id)
    );

    if (
      !booking ||
      booking.userId !== currentUser?.id ||
      !['Pending', 'Confirmed'].includes(booking.status) ||
      isBookingPast(booking)
    ) {
      return false;
    }

    setPackages((prev) =>
      prev.map((item) =>
        String(item.id) === String(booking.packageId)
          ? {
              ...item,
              availableSpots:
                item.availableSpots +
                Number(booking.adults) +
                Number(booking.children)
            }
          : item
      )
    );

    setBookings((prev) =>
      prev.map((item) =>
        String(item.id) === String(id)
          ? {
              ...item,
              status: 'Cancelled'
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 19. Add Booking Payment
  // ==================================

  const addBookingPayment = (bookingId, paymentData) => {
    const booking = bookings.find(
      (item) => String(item.id) === String(bookingId)
    );

    if (!booking || booking.status !== 'Confirmed') {
      return false;
    }

    const amount = Number(paymentData.amount);
    const method = paymentData.method;
    const date = paymentData.date;

    const allowedMethods = [
      'Cash',
      'Bank Transfer',
      'Other'
    ];

    if (
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !allowedMethods.includes(method) ||
      !date ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date)
    ) {
      return false;
    }

    const parsedDate = new Date(`${date}T00:00:00`);

    if (isNaN(parsedDate.getTime())) {
      return false;
    }

    const paymentDetails = getBookingPaymentDetails(bookingId);

    if (
      !paymentDetails ||
      amount > paymentDetails.remainingAmount
    ) {
      return false;
    }

    const roundedAmount = Math.round(amount * 100) / 100;

    const newPayment = {
      id: Date.now().toString(),
      amount: roundedAmount,
      method,
      date,
      note: paymentData.note?.trim() || '',
      createdAt: new Date().toISOString()
    };

    setBookings((prev) =>
      prev.map((item) =>
        String(item.id) === String(bookingId)
          ? {
              ...item,
              payments: [
                ...(Array.isArray(item.payments)
                  ? item.payments
                  : []),
                newPayment
              ]
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 20. Favorites
  // ==================================

  const toggleFavorite = (destinationId) => {
    const destinationExists = destinations.some(
      (destination) =>
        String(destination.id) === String(destinationId)
    );

    if (!destinationExists) {
      return false;
    }

    setFavorites((prev) => {
      const isFavorite = prev.some(
        (id) => String(id) === String(destinationId)
      );

      if (isFavorite) {
        return prev.filter(
          (id) => String(id) !== String(destinationId)
        );
      }

      return [...prev, destinationId];
    });

    return true;
  };

  // ==================================
  // 21. Service Requests
  // ==================================

  const addServiceRequest = (requestData) => {
    const provider = requestData.provider;
    const destination = requestData.destination;
    const travelPackage = requestData.package;

    if (!provider || !destination) {
      return false;
    }

    const providerFields = [
      provider.name,
      provider.email,
      provider.phone
    ];

    const destinationFields = [
      destination.name,
      destination.country,
      destination.region,
      destination.description,
      destination.bestSeason
    ];

    const hasMissingProviderFields = providerFields.some(
      (field) => !field || !String(field).trim()
    );

    const hasMissingDestinationFields = destinationFields.some(
      (field) => !field || !String(field).trim()
    );

    if (
      hasMissingProviderFields ||
      hasMissingDestinationFields ||
      !Array.isArray(destination.images) ||
      destination.images.length === 0
    ) {
      return false;
    }

    const invalidImage = destination.images.some((image) => {
      try {
        const imageUrl = new URL(image);

        return !['http:', 'https:'].includes(imageUrl.protocol);
      } catch {
        return true;
      }
    });

    if (invalidImage) {
      return false;
    }

    let packageData = null;

    if (travelPackage !== null) {
      if (!travelPackage) {
        return false;
      }

      const price = Number(travelPackage.price);
      const duration = Number(travelPackage.duration);
      const totalSpots = Number(travelPackage.totalSpots);

      if (
        !travelPackage.name?.trim() ||
        !travelPackage.description?.trim() ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(duration) ||
        duration <= 0 ||
        !Number.isInteger(totalSpots) ||
        totalSpots < 0
      ) {
        return false;
      }

      const packageImages = Array.isArray(travelPackage.packageImages)
        ? travelPackage.packageImages.filter(
            (image) => typeof image === 'string' && image.trim()
          )
        : [];

      const invalidPackageImage = packageImages.some((image) => {
        try {
          const imageUrl = new URL(image);

          return !['http:', 'https:'].includes(imageUrl.protocol);
        } catch {
          return true;
        }
      });

      if (invalidPackageImage) {
        return false;
      }

      packageData = {
        name: travelPackage.name.trim(),
        description: travelPackage.description.trim(),
        price,
        duration,
        totalSpots,
        tripType: travelPackage.tripType?.trim() || '',
        includedServices: Array.isArray(travelPackage.includedServices)
          ? travelPackage.includedServices.filter(
              (service) =>
                typeof service === 'string' && service.trim()
            )
          : [],
        packageImages,
        itinerary: Array.isArray(travelPackage.itinerary)
          ? travelPackage.itinerary.filter(
              (day) => typeof day === 'string' && day.trim()
            )
          : [],
        excludedServices: Array.isArray(travelPackage.excludedServices)
          ? travelPackage.excludedServices.filter(
              (service) =>
                typeof service === 'string' && service.trim()
            )
          : [],
        accommodationDetails:
          travelPackage.accommodationDetails?.trim() || '',
        transportationDetails:
          travelPackage.transportationDetails?.trim() || '',
        meetingPoint: travelPackage.meetingPoint?.trim() || ''
      };
    }

    const newRequest = {
      id: Date.now().toString(),
      provider: {
        name: provider.name.trim(),
        email: provider.email.trim().toLowerCase(),
        phone: provider.phone.trim()
      },
      destination: {
        name: destination.name.trim(),
        country: destination.country.trim(),
        region: destination.region.trim(),
        description: destination.description.trim(),
        bestSeason: destination.bestSeason.trim(),
        images: destination.images
      },
      package: packageData,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    setServiceRequests((prev) => [...prev, newRequest]);

    return true;
  };

  // ==================================
  // 22. Approve Service Request
  // ==================================

  const approveServiceRequest = (id) => {
    const request = serviceRequests.find(
      (item) =>
        String(item.id) === String(id) &&
        item.status === 'Pending'
    );

    if (!request || !request.destination) {
      return false;
    }

    const destinationData = request.destination;

    const requiredDestinationFields = [
      destinationData.name,
      destinationData.country,
      destinationData.region,
      destinationData.description,
      destinationData.bestSeason
    ];

    const hasMissingDestinationFields = requiredDestinationFields.some(
      (field) => !field || !String(field).trim()
    );

    if (
      hasMissingDestinationFields ||
      !Array.isArray(destinationData.images) ||
      destinationData.images.length === 0
    ) {
      return false;
    }

    let packageData = null;

    if (request.package) {
      const price = Number(request.package.price);
      const duration = Number(request.package.duration);
      const totalSpots = Number(request.package.totalSpots);

      if (
        !request.package.name?.trim() ||
        !request.package.description?.trim() ||
        !Number.isFinite(price) ||
        price <= 0 ||
        !Number.isInteger(duration) ||
        duration <= 0 ||
        !Number.isInteger(totalSpots) ||
        totalSpots < 0
      ) {
        return false;
      }

      const packageImages = Array.isArray(request.package.packageImages)
        ? request.package.packageImages.filter(
            (image) => typeof image === 'string' && image.trim()
          )
        : [];

      const invalidPackageImage = packageImages.some((image) => {
        try {
          const imageUrl = new URL(image);

          return !['http:', 'https:'].includes(imageUrl.protocol);
        } catch {
          return true;
        }
      });

      if (invalidPackageImage) {
        return false;
      }

      packageData = {
        name: request.package.name.trim(),
        description: request.package.description.trim(),
        price,
        duration,
        totalSpots,
        tripType: request.package.tripType || '',
        includedServices: Array.isArray(request.package.includedServices)
          ? request.package.includedServices.filter(
              (service) =>
                typeof service === 'string' && service.trim()
            )
          : [],
        packageImages,
        itinerary: Array.isArray(request.package.itinerary)
          ? request.package.itinerary.filter(
              (day) => typeof day === 'string' && day.trim()
            )
          : [],
        excludedServices: Array.isArray(request.package.excludedServices)
          ? request.package.excludedServices.filter(
              (service) =>
                typeof service === 'string' && service.trim()
            )
          : [],
        accommodationDetails:
          request.package.accommodationDetails?.trim() || '',
        transportationDetails:
          request.package.transportationDetails?.trim() || '',
        meetingPoint: request.package.meetingPoint?.trim() || ''
      };
    }

    const destinationId = Date.now().toString();

    const newDestination = {
      ...destinationData,
      id: destinationId
    };

    const newPackage = packageData
      ? {
          ...packageData,
          id: `${destinationId}-package`,
          destinationId,
          availableSpots: packageData.totalSpots
        }
      : null;

    setDestinations((prev) => [...prev, newDestination]);

    if (newPackage) {
      setPackages((prev) => [...prev, newPackage]);
    }

    setServiceRequests((prev) =>
      prev.map((item) =>
        String(item.id) === String(id) && item.status === 'Pending'
          ? {
              ...item,
              status: 'Approved',
              approvedDestinationId: destinationId,
              approvedPackageId: newPackage?.id || null,
              reviewedAt: new Date().toISOString()
            }
          : item
      )
    );

    return true;
  };

  // ==================================
  // 23. Reject Service Request
  // ==================================

  const rejectServiceRequest = (id) => {
    const requestExists = serviceRequests.some(
      (request) =>
        String(request.id) === String(id) &&
        request.status === 'Pending'
    );

    if (!requestExists) {
      return false;
    }

    setServiceRequests((prev) =>
      prev.map((request) =>
        String(request.id) === String(id)
          ? {
              ...request,
              status: 'Rejected',
              reviewedAt: new Date().toISOString()
            }
          : request
      )
    );

    return true;
  };

  // ==================================
  // 24. Delete Service Request
  // ==================================

  const deleteServiceRequest = (id) => {
    const requestExists = serviceRequests.some(
      (request) => String(request.id) === String(id)
    );

    if (!requestExists) {
      return false;
    }

    setServiceRequests((prev) =>
      prev.filter(
        (request) => String(request.id) !== String(id)
      )
    );

    return true;
  };

  // ==================================
  // 25. Context Value
  // ==================================

  const contextValue = {
    destinations,
    packages,
    bookings,
    favorites,
    users,
    currentUser,
    serviceRequests,
    travelDataLoading,
    travelDataError,

    setCurrentUser,

    registerUser,
    loginUser,
    logoutUser,

    addDestination,
    updateDestination,
    deleteDestination,

    addPackage,
    updatePackage,
    deletePackage,

    addBooking,
    updateBooking,
    confirmBooking,
    rejectBooking,
    cancelBooking,

    addBookingPayment,
    getBookingPaymentDetails,

    toggleFavorite,

    addServiceRequest,
    approveServiceRequest,
    rejectServiceRequest,
    deleteServiceRequest
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
}
