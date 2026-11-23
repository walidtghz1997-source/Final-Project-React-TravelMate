
import { useContext } from 'react';

import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation
} from 'react-router-dom';

import { MyContext } from './utils/MyContext';

// Layouts
import TravelerLayout from './layouts/TravelerLayout';
import AgencyLayout from './layouts/AgencyLayout';

// Traveler Pages
import Home from './pages/Home/Home';
import Destinations from './pages/Destinations/Destinations';
import DestinationDetails from './pages/Destinations/DestinationDetails';
import Packages from './pages/Packages/Packages';
import Favorites from './pages/Favorites/Favorites';
import Booking from './pages/Booking/Booking';
import TravelerDashboard from './pages/TravelerDashboard/TravelerDashboard';
import TravelerAuth from './pages/TravelerAuth/TravelerAuth';
import AddService from './pages/AddService/AddService';

// Agency Pages
import AdminLogin from './pages/AdminLogin/AdminLogin';
import AgencyDashboard from './pages/AgencyDashboard/AgencyDashboard';
import AgencyDestinations from './pages/AgencyDestinations/AgencyDestinations';
import AgencyPackages from './pages/AgencyPackages/AgencyPackages';
import AgencyBookings from './pages/AgencyBookings/AgencyBookings';
import AgencyServiceRequests from './pages/AgencyServiceRequests/AgencyServiceRequests';

// Error Page
import NotFound from './pages/Error/Error';


// ==================================
// Protected Route
// ==================================

function ProtectedRoute({ allowedRole }) {
  const { currentUser } = useContext(MyContext);
  const location = useLocation();

  if (!currentUser) {
    return (
      <Navigate
        to={allowedRole === 'Agency' ? '/admin-login' : '/login'}
        state={{ from: location }}
        replace
      />
    );
  }

  if (currentUser.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}


// ==================================
// Main App
// ==================================

function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ==================================
            Public Traveler Pages
        ================================== */}

        <Route element={<TravelerLayout />}>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/destinations"
            element={<Destinations />}
          />

          <Route
            path="/destinations/:id"
            element={<DestinationDetails />}
          />

          <Route
            path="/packages"
            element={<Packages />}
          />

          <Route
            path="/add-service"
            element={<AddService />}
          />

        </Route>


        {/* ==================================
            Traveler Login and Register
        ================================== */}

        <Route
          path="/login"
          element={<TravelerAuth />}
        />


        {/* ==================================
            Protected Traveler Pages
        ================================== */}

        <Route element={<ProtectedRoute allowedRole="Traveler" />}>

          <Route element={<TravelerLayout />}>

            <Route
              path="/booking/:packageId"
              element={<Booking />}
            />

            <Route
              path="/favorites"
              element={<Favorites />}
            />

            <Route
              path="/traveler/dashboard"
              element={<TravelerDashboard />}
            />

          </Route>

        </Route>


        {/* ==================================
            Agency Login
        ================================== */}

        <Route
          path="/admin-login"
          element={<AdminLogin />}
        />


        {/* ==================================
            Protected Agency Pages
        ================================== */}

        <Route element={<ProtectedRoute allowedRole="Agency" />}>

          <Route element={<AgencyLayout />}>

            <Route
              path="/admin"
              element={<AgencyDashboard />}
            />

            <Route
              path="/admin/dashboard"
              element={<AgencyDashboard />}
            />

            <Route
              path="/admin/destinations"
              element={<AgencyDestinations />}
            />

            <Route
              path="/admin/packages"
              element={<AgencyPackages />}
            />

            <Route
              path="/admin/bookings"
              element={<AgencyBookings />}
            />

            <Route
              path="/admin/service-requests"
              element={<AgencyServiceRequests />}
            />

          </Route>

        </Route>


        {/* ==================================
            Not Found
        ================================== */}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
