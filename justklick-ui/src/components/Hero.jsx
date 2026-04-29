Hero.jsx



import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="bg-[#f5f7fb] py-5">
      <div className="mx-auto max-w-[1400px] px-6">
        <div className="relative overflow-hidden rounded-2xl bg-[#071b46]">
          <div className="grid min-h-[430px] grid-cols-1 lg:grid-cols-[55%_45%]">
            
            {/* LEFT CONTENT */}
            <div className="flex flex-col justify-center px-10 py-12 lg:px-20">
              <p className="mb-4 text-sm font-bold tracking-wide text-blue-400">
                STUDENT PLATFORM
              </p>

              <h1 className="max-w-[560px] text-4xl font-extrabold leading-tight text-white lg:text-[52px]">
                Find Your Right College & Career Path
              </h1>

              <p className="mt-5 max-w-[520px] text-base leading-7 text-white/80">
                Explore colleges, training institutes, overseas education,
                hostels and career opportunities in one platform.
              </p>

              <div className="mt-7 flex gap-4">
                <Link
                  to="/explore"
                  className="rounded-lg bg-red-500 px-7 py-3 text-sm font-bold text-white hover:bg-red-600"
                >
                  Explore Now
                </Link>

                <Link
                  to="/categories"
                  className="rounded-lg border border-white/40 px-7 py-3 text-sm font-bold text-white hover:bg-white/10"
                >
                  View Categories
                </Link>
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative hidden h-[430px] items-end justify-center lg:flex">
              <div className="absolute bottom-8 h-[330px] w-[330px] rounded-full bg-[#24376d]/70" />

              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=900"
                alt="student"
                className="relative z-10 h-[410px] w-[330px] object-cover object-top"
              />

              <div className="absolute right-20 top-20 grid grid-cols-4 gap-3">
                {Array.from({ length: 16 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-1.5 w-1.5 rounded-full bg-white/40"
                  />
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}