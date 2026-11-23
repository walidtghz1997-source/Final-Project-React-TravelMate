
import { useContext, useState } from 'react';
import {
  useNavigate,
  useLocation,
  Navigate
} from 'react-router-dom';

import { MyContext } from '../../utils/MyContext';

function TravelerAuth() {
  const {
    registerUser,
    loginUser,
    currentUser
  } = useContext(MyContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // ==================================
  // Redirect Logged-in Users
  // ==================================

  if (currentUser) {
    if (currentUser.role === 'Agency') {
      return <Navigate to="/admin" replace />;
    }

    return (
      <Navigate
        to={location.state?.from || '/'}
        replace
      />
    );
  }

  // ==================================
  // Handle Form Submission
  // ==================================

  const handleSubmit = (e) => {
    e.preventDefault();

    setError('');
    setSuccess('');

    if (isRegister) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }

      const registered = registerUser({
        name,
        email,
        password
      });

      if (!registered) {
        setError(
          'Registration failed. Check your information or use another email.'
        );
        return;
      }

      navigate(location.state?.from || '/', {
        replace: true
      });

      return;
    }

    const loggedIn = loginUser(email, password);

    if (!loggedIn) {
      setError('Invalid email or password.');
      return;
    }

    navigate(location.state?.from || '/', {
      replace: true
    });
  };

  // ==================================
  // Switch Authentication Mode
  // ==================================

  const switchMode = () => {
    setIsRegister((prev) => !prev);

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');

    setError('');
    setSuccess('');
  };

  // ==================================
  // UI
  // ==================================

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-3 py-8 min-[500px]:px-5 min-[500px]:py-10">

      <div className="w-full max-w-md rounded-2xl bg-white p-5 min-[500px]:p-7 min-[701px]:p-8 shadow-lg">

        {/* Header */}

        <div className="mb-6 min-[500px]:mb-8 text-center">

          <h1 className="text-2xl min-[500px]:text-3xl font-bold text-gray-800">
            {isRegister ? 'Create Account' : 'Welcome Back'}
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-500">
            {isRegister
              ? 'Create your traveler account to start booking trips.'
              : 'Sign in to continue your travel journey.'}
          </p>

        </div>

        {/* Authentication Form */}

        <form onSubmit={handleSubmit} className="space-y-4 min-[500px]:space-y-5">

          {isRegister && (

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>

              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                required
                className="w-full min-w-0 rounded-lg border border-gray-300 px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          )}

          <div>

            <label
              htmlFor="traveler-email"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Email Address
            </label>

            <input
              id="traveler-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          <div>

            <label
              htmlFor="traveler-password"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <input
              id="traveler-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              className="w-full min-w-0 rounded-lg border border-gray-300 px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

          </div>

          {isRegister && (

            <div>

              <label
                htmlFor="confirm-password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Confirm Password
              </label>

              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="w-full min-w-0 rounded-lg border border-gray-300 px-3 min-[500px]:px-4 py-3 text-sm min-[500px]:text-base outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />

            </div>

          )}

          {/* Error Message */}

          {error && (

            <p className="break-words rounded-lg bg-red-50 p-3 text-sm leading-6 text-red-600">
              {error}
            </p>

          )}

          {/* Success Message */}

          {success && (

            <p className="break-words rounded-lg bg-green-50 p-3 text-sm leading-6 text-green-600">
              {success}
            </p>

          )}

          {/* Submit Button */}

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 text-sm min-[500px]:text-base font-semibold text-white transition hover:bg-blue-700"
          >
            {isRegister ? 'Create Account' : 'Login'}
          </button>

        </form>

        {/* Switch Authentication Mode */}

        <div className="mt-5 min-[500px]:mt-6 text-center">

          <p className="text-sm text-gray-500">
            {isRegister
              ? 'Already have an account?'
              : "Don't have an account?"}
          </p>

          <button
            type="button"
            onClick={switchMode}
            className="mt-2 text-sm min-[500px]:text-base font-semibold text-blue-600 transition hover:text-blue-700"
          >
            {isRegister ? 'Login' : 'Create Account'}
          </button>

        </div>

        {/* Back to Home */}

        <button
          type="button"
          onClick={() => navigate('/')}
          className="mt-5 min-[500px]:mt-6 w-full py-2 text-sm text-gray-500 transition hover:text-blue-600"
        >
          Back to Home
        </button>

      </div>

    </main>
  );
}

export default TravelerAuth;
