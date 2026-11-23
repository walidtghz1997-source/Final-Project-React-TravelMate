
import { Link } from 'react-router-dom';

function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden bg-gradient-to-br from-slate-950 via-teal-950 to-teal-800">

      {/* Background Decorations */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-400/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-cyan-400/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-14 min-[500px]:px-6 min-[500px]:py-16 min-[701px]:grid-cols-2 min-[701px]:gap-10 min-[701px]:py-20 min-[1100px]:gap-16 min-[1100px]:py-24">

        {/* Left Content */}
        <div className="min-w-0 text-center min-[701px]:text-left">

          <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-white/10 px-4 py-2 text-sm font-medium text-teal-100 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-teal-400" />
            Discover Morocco with TravelMate
          </div>

          <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-white min-[500px]:text-5xl min-[701px]:text-5xl min-[1100px]:text-6xl">
            Explore New Places.
            <span className="mt-2 block text-teal-300">
              Create New Memories.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-base leading-8 text-slate-300 min-[701px]:mx-0 min-[1100px]:text-lg">
            Your next adventure starts here. Discover amazing destinations,
            find the perfect travel package and plan unforgettable journeys
            with TravelMate.
          </p>

          {/* Buttons */}
          <div className="mt-8 flex flex-col justify-center gap-3 min-[500px]:flex-row min-[701px]:justify-start">

            <Link
              to="/destinations"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 px-7 py-3.5 font-bold text-slate-950 shadow-lg shadow-teal-950/30 transition duration-300 hover:-translate-y-1 hover:bg-teal-300"
            >
              Explore Destinations
              <span aria-hidden="true">→</span>
            </Link>

            <Link
              to="/packages"
              className="inline-flex items-center justify-center rounded-xl border border-white/30 bg-white/10 px-7 py-3.5 font-semibold text-white backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:bg-white/20"
            >
              Discover Packages
            </Link>

          </div>

          {/* Small Features */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-4 text-sm text-slate-300 min-[701px]:justify-start">

            <div className="flex items-center gap-2">
              <span className="text-teal-300">✓</span>
              Discover destinations
            </div>

            <div className="flex items-center gap-2">
              <span className="text-teal-300">✓</span>
              Find travel packages
            </div>

            <div className="flex items-center gap-2">
              <span className="text-teal-300">✓</span>
              Easy booking
            </div>

          </div>
        </div>

        {/* Right Visual */}
        <div className="relative mx-auto w-full max-w-xl min-w-0">

          {/* Main Image */}
          <div className="relative overflow-hidden rounded-3xl border border-white/20 bg-teal-900 shadow-2xl shadow-black/30">

            <img
              src="https://images.unsplash.com/photo-1539020140153-e479b8c22e70?auto=format&fit=crop&w=1200&q=85"
              alt="Beautiful Moroccan architecture and travel scenery"
              className="h-[320px] w-full object-cover min-[500px]:h-[400px] min-[701px]:h-[440px] min-[1100px]:h-[500px]"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

            <div className="absolute bottom-0 left-0 right-0 p-5 text-white min-[500px]:p-7">
              <p className="text-sm font-medium text-teal-200">
                Discover the beauty of
              </p>

              <h2 className="mt-1 text-2xl font-bold min-[500px]:text-3xl">
                Morocco
              </h2>

              <p className="mt-2 max-w-sm text-sm leading-6 text-slate-200">
                From colorful cities to breathtaking landscapes.
              </p>
            </div>
          </div>

          {/* Floating Destination Card */}
          <div className="absolute -left-2 top-5 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-xl min-[500px]:-left-5 min-[500px]:top-10 min-[500px]:p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-100 text-2xl">
              🌍
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Your next adventure
              </p>
              <p className="text-sm font-bold text-slate-900">
                Starts here
              </p>
            </div>

          </div>

          {/* Floating Travel Card */}
          <div className="absolute -bottom-5 right-2 flex items-center gap-3 rounded-2xl border border-white/20 bg-white/95 p-3 shadow-xl min-[500px]:-right-5 min-[500px]:p-4">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              ✈️
            </div>

            <div>
              <p className="text-xs text-slate-500">
                Plan your journey
              </p>
              <p className="text-sm font-bold text-slate-900">
                Travel with ease
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* Bottom Decorative Shape */}
      <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-transparent via-teal-300/70 to-transparent" />

    </section>
  );
}

export default HeroSection;
