
import { useContext } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

import Header from './Header';
import Footer from './Footer';

import { MyContext } from '../utils/MyContext';

function TravelerLayout() {
  const { currentUser, logoutUser } = useContext(MyContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/', { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">

      <Header />

      {currentUser?.role === 'Traveler' && (
        <div
          dir="ltr"
          className="border-b border-teal-100 bg-teal-50"
        >
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  className="h-5 w-5"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M5 21C5 17.1 8.1 14 12 14C15.9 14 19 17.1 19 21" />
                </svg>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Welcome, {currentUser.name}
                </p>

                <p className="text-xs text-gray-500">
                  We wish you an enjoyable journey with TravelMate
                </p>
              </div>

            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 hover:text-red-700"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4"
              >
                <path d="M10 17L15 12L10 7" />
                <path d="M15 12H3" />
                <path d="M12 3H19C20.1 3 21 3.9 21 5V19C21 20.1 20.1 21 19 21H12" />
              </svg>

              <span>Logout</span>
            </button>

          </div>
        </div>
      )}

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default TravelerLayout;
