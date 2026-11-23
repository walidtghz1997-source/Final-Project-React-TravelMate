
import { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MyContext } from '../../utils/MyContext';

function AdminLogin() {
  const { setCurrentUser } = useContext(MyContext);

  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const inputStyle =
    'w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-50';

  const handleSubmit = (e) => {
    e.preventDefault();

    // Demo Admin Credentials
    const adminEmail = 'apahAdmin@gmail.com';
    const adminPassword = 'Admin123';

    if (
      email.trim().toLowerCase() === adminEmail.toLowerCase() &&
      password === adminPassword
    ) {
      setCurrentUser({
        id: 'admin',
        name: 'Admin',
        email: adminEmail,
        role: 'Agency'
      });

      const redirectPath =
        location.state?.from?.pathname || '/admin/dashboard';

      navigate(redirectPath, { replace: true });
    } else {
      setError('Invalid email or password.');
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gray-50 px-4 py-10">

      {/* Background Decoration */}
      <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" />
      <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-teal-100/60 blur-3xl" />

      <div className="relative w-full max-w-md">

        {/* Brand */}
        <div className="mb-8 text-center">

          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">

            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="h-9 w-9"
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

          <h1 className="text-3xl font-extrabold tracking-tight text-gray-800">
            Travel<span className="text-teal-700">Mate</span>
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Administration Portal
          </p>

        </div>

        {/* Login Card */}
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-xl shadow-gray-200/60 sm:p-8">

          <div className="mb-8">
            <span className="mb-3 inline-flex rounded-full bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
              ADMIN ACCESS
            </span>

            <h2 className="text-2xl font-bold text-gray-800">
              Welcome Back
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Sign in to access and manage your TravelMate platform.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email Address
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <rect x="3" y="5" width="18" height="14" rx="2" />
                    <path d="M3 7L12 13L21 7" />
                  </svg>
                </span>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter admin email"
                  required
                  autoComplete="username"
                  className={`${inputStyle} pl-12`}
                />

              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">

                <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-400">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="h-5 w-5"
                  >
                    <rect x="4" y="10" width="16" height="11" rx="2" />
                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                    <path d="M12 14V17" />
                  </svg>
                </span>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError('');
                  }}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
                  className={`${inputStyle} pl-12`}
                />

              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div
                role="alert"
                className="flex items-start gap-3 rounded-xl border border-red-100 bg-red-50 p-4 text-sm text-red-700"
              >
                <span className="text-lg">⚠</span>
                <p>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-bold text-white shadow-md shadow-teal-700/20 transition hover:bg-teal-800 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-teal-100"
            >
              <span>Sign In</span>

              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M5 12H19" />
                <path d="M12 5L19 12L12 19" />
              </svg>
            </button>

          </form>

          <div className="my-7 border-t border-gray-100" />

          <button
            type="button"
            onClick={() => navigate('/')}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-semibold text-gray-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
          >
            <span>←</span>
            <span>Back to Home</span>
          </button>

        </div>

        <p className="mt-7 text-center text-xs text-gray-400">
          © 2026 TravelMate. All rights reserved.
        </p>

      </div>
    </main>
  );
}

export default AdminLogin;
