
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center bg-gray-50 px-4 py-12 min-[500px]:px-6 text-center">

      <h1 className="text-7xl min-[500px]:text-8xl min-[701px]:text-9xl font-bold text-teal-700">
        404
      </h1>

      <h2 className="mt-4 text-xl min-[500px]:text-2xl min-[701px]:text-3xl font-bold text-gray-800">
        Page Not Found
      </h2>

      <p className="mt-3 max-w-md text-sm min-[500px]:text-base leading-7 text-gray-500">
        Sorry, the page you are looking for does not exist.
      </p>

      <Link
        to="/"
        className="mt-7 min-[701px]:mt-8 rounded-lg bg-teal-700 px-6 min-[500px]:px-7 py-3 text-sm min-[500px]:text-base font-semibold text-white transition hover:bg-teal-800"
      >
        Back to Home
      </Link>

    </main>
  );
}

export default NotFound;
