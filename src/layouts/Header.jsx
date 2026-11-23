
import { useContext, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { MyContext } from '../utils/MyContext';

function Header() {
  const { currentUser } = useContext(MyContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isTraveler = currentUser?.role === 'Traveler';

  const navLinkStyle = ({ isActive }) =>
    isActive
      ? 'font-semibold text-teal-700'
      : 'text-gray-600 transition hover:text-teal-700';

  const mobileNavLinkStyle = ({ isActive }) =>
    `block rounded-lg px-4 py-3 transition ${
      isActive
        ? 'bg-teal-50 font-semibold text-teal-700'
        : 'text-gray-700 hover:bg-gray-50 hover:text-teal-700'
    }`;

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm">
      <div className="relative mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 max-[700px]:px-4 max-[700px]:py-3">

        {/* Logo */}
        <Link
          to="/"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-700 text-white shadow-sm">
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
                stroke="currentColor"
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

          <span className="text-2xl font-bold tracking-tight text-teal-800 max-[400px]:text-xl">
            Travel<span className="text-teal-500">Mate</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 min-[701px]:flex">
          <NavLink to="/" end className={navLinkStyle}>
            Home
          </NavLink>

          <NavLink to="/destinations" className={navLinkStyle}>
            Destinations
          </NavLink>

          <NavLink to="/packages" className={navLinkStyle}>
            Packages
          </NavLink>

          {isTraveler && (
            <NavLink to="/favorites" className={navLinkStyle}>
              Favorites
            </NavLink>
          )}
        </nav>

        {/* Desktop User Actions */}
        <div className="hidden items-center gap-3 min-[701px]:flex">
          <Link
            to="/add-service"
            className="text-sm font-medium text-gray-600 transition hover:text-teal-700"
          >
            Offer a Service
          </Link>

          {isTraveler ? (
            <Link
              to="/traveler/dashboard"
              className="rounded-lg border border-teal-700 px-4 py-2 text-sm font-semibold text-teal-700 transition hover:bg-teal-50"
            >
              My Trips
            </Link>
          ) : (
            <Link
              to="/login"
              className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800"
            >
              Login / Register
            </Link>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((prev) => !prev)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:border-teal-600 hover:bg-teal-50 hover:text-teal-700 min-[701px]:hidden"
        >
          {isMenuOpen ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M18 6L6 18" />
              <path d="M6 6L18 18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              className="h-6 w-6"
            >
              <path d="M4 6H20" />
              <path d="M4 12H20" />
              <path d="M4 18H20" />
            </svg>
          )}
        </button>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div
            id="mobile-navigation"
            className="absolute left-0 top-full w-full border-t border-gray-100 bg-white px-4 pb-5 pt-3 shadow-lg min-[701px]:hidden"
          >
            <nav className="flex flex-col gap-1">
              <NavLink
                to="/"
                end
                onClick={closeMenu}
                className={mobileNavLinkStyle}
              >
                Home
              </NavLink>

              <NavLink
                to="/destinations"
                onClick={closeMenu}
                className={mobileNavLinkStyle}
              >
                Destinations
              </NavLink>

              <NavLink
                to="/packages"
                onClick={closeMenu}
                className={mobileNavLinkStyle}
              >
                Packages
              </NavLink>

              {isTraveler && (
                <NavLink
                  to="/favorites"
                  onClick={closeMenu}
                  className={mobileNavLinkStyle}
                >
                  Favorites
                </NavLink>
              )}
            </nav>

            <div className="my-3 border-t border-gray-100" />

            <div className="flex flex-col gap-2">
              <Link
                to="/add-service"
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 hover:text-teal-700"
              >
                Offer a Service
              </Link>

              {isTraveler ? (
                <Link
                  to="/traveler/dashboard"
                  onClick={closeMenu}
                  className="rounded-lg bg-teal-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-teal-800"
                >
                  My Trips
                </Link>
              ) : (
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="rounded-lg bg-teal-700 px-4 py-3 text-center font-semibold text-white transition hover:bg-teal-800"
                >
                  Login / Register
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
