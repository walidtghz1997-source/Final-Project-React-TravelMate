
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="mt-16 bg-slate-950 text-white">

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">

        {/* Brand */}
        <div>
          <Link to="/" className="mb-5 inline-flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="white"
                  strokeWidth="1.7"
                />
                <path
                  d="M15.8 8.2L13.2 13.2L8.2 15.8L10.8 10.8L15.8 8.2Z"
                  fill="#FBBF24"
                  stroke="#FBBF24"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="1.2" fill="white" />
              </svg>
            </div>

            <span className="text-2xl font-bold tracking-tight">
              Travel<span className="text-teal-400">Mate</span>
            </span>
          </Link>

          <p className="max-w-sm text-sm leading-7 text-slate-400">
            Discover amazing destinations and create unforgettable
            travel experiences with TravelMate.
          </p>

          <p className="mt-5 text-sm font-medium text-teal-400">
            Discover More. Travel Better.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">
            Quick Links
          </h3>

          <div className="flex flex-col gap-4 text-sm text-slate-400">
            <Link
              className="w-fit transition hover:translate-x-1 hover:text-teal-400"
              to="/"
            >
              Home
            </Link>

            <Link
              className="w-fit transition hover:translate-x-1 hover:text-teal-400"
              to="/destinations"
            >
              Destinations
            </Link>

            <Link
              className="w-fit transition hover:translate-x-1 hover:text-teal-400"
              to="/packages"
            >
              Packages
            </Link>

            <Link
              className="w-fit transition hover:translate-x-1 hover:text-teal-400"
              to="/add-service"
            >
              Offer a Service
            </Link>
          </div>
        </div>

        {/* Explore */}
        <div>
          <h3 className="mb-5 text-lg font-semibold">
            Explore TravelMate
          </h3>

          <p className="text-sm leading-7 text-slate-400">
            Find your next destination, explore travel packages
            and organize your upcoming trips.
          </p>

          <Link
            to="/destinations"
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-600"
          >
            Explore Destinations

            <span aria-hidden="true">→</span>
          </Link>
        </div>

      </div>

      {/* Copyright */}
      <div className="border-t border-slate-800 px-6 py-6">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center text-sm text-slate-500 sm:flex-row sm:text-left">

          <p>
            © 2026 TravelMate. All rights reserved.
          </p>

          <p>
            Made for travel lovers.
          </p>

        </div>
      </div>

    </footer>
  );
}

export default Footer;
