
import { useContext, useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { MyContext } from '../utils/MyContext';

function AgencyLayout() {
  const { logoutUser } = useContext(MyContext);
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navLinkStyle = ({ isActive }) =>
    `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
      isActive
        ? 'bg-teal-700 text-white shadow-sm'
        : 'text-gray-600 hover:bg-teal-50 hover:text-teal-700'
    }`;

  const handleLogout = () => {
    logoutUser();
    setIsSidebarOpen(false);
    navigate('/', { replace: true });
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 md:flex" dir="ltr">

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/40 min-[701px]:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-300 min-[701px]:sticky min-[701px]:top-0 min-[701px]:h-screen min-[701px]:w-64 min-[701px]:translate-x-0 min-[701px]:transition-none ${
          isSidebarOpen
            ? 'translate-x-0'
            : '-translate-x-full min-[701px]:translate-x-0'
        }`}
      >

        {/* Brand */}
        <div className="border-b border-gray-100 px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
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

            <div>
              <h1 className="text-xl font-bold text-teal-800">
                Travel<span className="text-teal-500">Mate</span>
              </h1>

              <p className="mt-1 text-xs text-gray-500">
                Admin Dashboard
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-4">

          <p className="mb-4 px-4 text-xs font-semibold tracking-wider text-gray-400">
            MAIN MENU
          </p>

          <NavLink
            to="/admin"
            end
            className={navLinkStyle}
            onClick={closeSidebar}
          >
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </NavLink>

          <NavLink
            to="/admin/destinations"
            className={navLinkStyle}
            onClick={closeSidebar}
          >
            <span className="text-lg">🌍</span>
            <span>Destinations</span>
          </NavLink>

          <NavLink
            to="/admin/packages"
            className={navLinkStyle}
            onClick={closeSidebar}
          >
            <span className="text-lg">🧳</span>
            <span>Packages</span>
          </NavLink>

          <NavLink
            to="/admin/bookings"
            className={navLinkStyle}
            onClick={closeSidebar}
          >
            <span className="text-lg">📅</span>
            <span>Bookings</span>
          </NavLink>

          <NavLink
            to="/admin/service-requests"
            className={navLinkStyle}
            onClick={closeSidebar}
          >
            <span className="text-lg">📩</span>
            <span>Service Requests</span>
          </NavLink>

        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 p-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            <span className="text-lg">🚪</span>
            <span>Logout</span>
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <div className="min-w-0 flex-1">

        {/* Top Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 shadow-sm sm:px-6">

          <div className="flex items-center gap-3">

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen((prev) => !prev)}
              aria-label={
                isSidebarOpen
                  ? 'Close menu'
                  : 'Open menu'
              }
              aria-expanded={isSidebarOpen}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 text-gray-700 transition hover:bg-teal-50 hover:text-teal-700 min-[701px]:hidden"
            >
              {isSidebarOpen ? (
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

            <h2 className="font-bold text-gray-800">
              Platform Management
            </h2>
          </div>

          <span className="rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 sm:text-sm">
            Agency Admin
          </span>

        </header>

        {/* Page Content */}
        <main className="min-w-0 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default AgencyLayout;
