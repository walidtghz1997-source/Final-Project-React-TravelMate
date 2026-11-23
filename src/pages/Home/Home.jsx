
import { Link } from 'react-router-dom';
import HeroSection from './components/HeroSection';

function Home() {
  const services = [
    {
      icon: '🌍',
      title: 'Explore Destinations',
      description:
        'Discover beautiful destinations across Morocco and explore their attractions.',
      link: '/destinations',
      linkText: 'Explore Destinations'
    },
    {
      icon: '🎒',
      title: 'Discover Travel Packages',
      description:
        'Find travel packages with different durations, prices and experiences.',
      link: '/packages',
      linkText: 'View Packages'
    },
    {
      icon: '📅',
      title: 'Easy Booking',
      description:
        'Choose your travel dates, select the number of travelers and calculate your trip price.',
      link: '/destinations',
      linkText: 'Start Exploring'
    },
    {
      icon: '❤️',
      title: 'Save Your Favorites',
      description:
        'Save your favorite destinations and come back to them whenever you want.',
      link: '/favorites',
      linkText: 'My Favorites'
    },
    {
      icon: '🧳',
      title: 'Manage Your Trips',
      description:
        'Keep track of your bookings and follow the status of your trips.',
      link: '/traveler/dashboard',
      linkText: 'My Dashboard'
    },
    {
      icon: '☀️',
      title: 'Live Weather Information',
      description:
        'Discover weather information to help you prepare for your next destination.',
      link: '/destinations',
      linkText: 'Discover Weather'
    }
  ];

  return (
    <main className="w-full min-w-0 overflow-hidden bg-white">

      {/* Hero Section */}
      <HeroSection />

      {/* Introduction Video Section */}
      <section className="bg-slate-50 px-3 py-12 min-[500px]:px-5 min-[500px]:py-16 min-[701px]:px-8 min-[701px]:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-10 max-w-3xl text-center min-[701px]:mb-14">
            <span className="inline-block rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-800">
              Discover Morocco with TravelMate
            </span>

            <h2 className="mt-4 text-2xl font-bold leading-tight text-slate-900 min-[500px]:text-3xl min-[701px]:text-4xl">
              Everything You Need for Your Next Journey
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 min-[500px]:text-base">
              Get inspired by the beauty of Morocco and discover how
              TravelMate helps you explore destinations, find travel
              packages and organize your next trip.
            </p>
          </div>

          <div className="grid grid-cols-1 items-center gap-8 min-[701px]:grid-cols-2 min-[701px]:gap-12">

            {/* YouTube Video */}
            <div className="min-w-0 overflow-hidden rounded-2xl bg-slate-900 shadow-xl">
              <iframe
                className="aspect-video w-full"
                src="https://www.youtube.com/embed/93bCtFAaQQI"
                title="Morocco in 4K - Incredible Scenes and Hidden Gems"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            {/* Video Description */}
            <div className="min-w-0">
              <span className="text-sm font-bold uppercase tracking-wider text-teal-700">
                Your Journey Starts Here
              </span>

              <h3 className="mt-3 text-2xl font-bold leading-tight text-slate-900 min-[500px]:text-3xl">
                Discover More. Travel Better.
              </h3>

              <p className="mt-5 text-sm leading-7 text-slate-600 min-[500px]:text-base">
                Morocco is full of incredible places, from beautiful
                beaches and historic cities to mountains and desert
                landscapes.
              </p>

              <p className="mt-3 text-sm leading-7 text-slate-600 min-[500px]:text-base">
                TravelMate brings the essential tools together to make
                planning your journey easier. Explore destinations,
                compare packages, organize bookings and keep your trips
                in one place.
              </p>

              <div className="mt-7 space-y-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    Find destinations that match your interests.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    Discover packages and organize your bookings.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>
                  <p className="text-sm font-medium text-slate-700">
                    Manage your trips from your personal dashboard.
                  </p>
                </div>
              </div>

              <Link
                to="/destinations"
                className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-teal-700 px-6 py-3 font-semibold text-white transition hover:bg-teal-800 min-[500px]:w-auto"
              >
                Start Exploring
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* TravelMate Services Section */}
      <section className="px-3 py-12 min-[500px]:px-5 min-[500px]:py-16 min-[701px]:px-8 min-[701px]:py-20">
        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-10 max-w-3xl text-center min-[701px]:mb-14">
            <span className="inline-block rounded-full bg-teal-100 px-4 py-2 text-sm font-semibold text-teal-800">
              Our Services
            </span>

            <h2 className="mt-4 text-2xl font-bold text-slate-900 min-[500px]:text-3xl min-[701px]:text-4xl">
              Everything for a Better Travel Experience
            </h2>

            <p className="mt-4 text-sm leading-7 text-slate-600 min-[500px]:text-base">
              TravelMate provides useful features to help you discover,
              plan and manage your journeys in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 min-[500px]:grid-cols-2 min-[1100px]:grid-cols-3 min-[1100px]:gap-7">

            {services.map((service, index) => (
              <div
                key={index}
                className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg min-[500px]:p-6"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-3xl">
                  {service.icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-3 flex-1 break-words text-sm leading-7 text-slate-600">
                  {service.description}
                </p>

                <Link
                  to={service.link}
                  className="mt-6 inline-flex items-center gap-2 font-semibold text-teal-700 transition hover:text-teal-900"
                >
                  {service.linkText}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            ))}

          </div>
        </div>
      </section>

    </main>
  );
}

export default Home;
