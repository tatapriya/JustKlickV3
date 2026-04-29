import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Send,
  GraduationCap,
  Home,
  BookOpen,
  Globe2,
  CheckCircle,
} from "lucide-react";

export default function CTASection() {
  const navigate = useNavigate();

  const [contactValue, setContactValue] = useState("");
  const [error, setError] = useState("");

  const categories = [
    {
      icon: <GraduationCap size={17} />,
      label: "Colleges",
      path: "/category/colleges",
    },
    {
      icon: <BookOpen size={17} />,
      label: "Training Institutes",
      path: "/category/software-training",
    },
    {
      icon: <Globe2 size={17} />,
      label: "Overseas Education",
      path: "/category/overseas",
    },
    {
      icon: <Home size={17} />,
      label: "Hostels",
      path: "/category/hostels",
    },
  ];

  const isValidEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
  const isValidPhone = (value) => /^[6-9]\d{9}$/.test(value);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = contactValue.trim();

    if (!value) {
      setError("Please enter your email or phone number");
      return;
    }

    if (!isValidEmail(value) && !isValidPhone(value)) {
      setError("Enter a valid email or 10-digit mobile number");
      return;
    }

    setError("");

    navigate("/enquiry", {
      state: {
        contact: value,
        message:
          "I want help finding colleges, hostels, training institutes, or overseas education options.",
      },
    });
  };

  return (
    <section className="w-full bg-white px-4 py-16 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-[32px] border border-gray-200 bg-[#f4f7ff] px-6 py-12 text-center shadow-sm md:px-16 md:py-14">
          {/* Decorative shapes */}
          <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-blue-200 opacity-40 blur-sm" />
          <div className="absolute -bottom-10 -left-10 h-36 w-36 rounded-full bg-red-200 opacity-40 blur-sm" />
          <div className="absolute left-10 top-10 hidden h-3 w-3 rounded-full bg-[#ef233c] md:block" />
          <div className="absolute bottom-12 right-20 hidden h-4 w-4 rounded-full bg-blue-400 md:block" />

          <div className="relative z-10">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#071f4d] text-white shadow-md">
              <Send size={24} />
            </div>

            <h2 className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight text-[#0b1f4d] md:text-4xl">
              Discover & Connect with Top Student Services
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-gray-600 md:text-base">
              Explore colleges, training institutes, overseas education
              providers, competitive exam coaching, and hostels in one place.
              Register once and send enquiries directly through JustKlick.
            </p>

            {/* Category Pills */}
            <div className="mx-auto mt-6 flex max-w-4xl flex-wrap items-center justify-center gap-3">
              {categories.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => navigate(item.path)}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-[#0b1f4d] shadow-sm transition hover:border-[#ef233c] hover:text-[#ef233c]"
                >
                  <span className="text-[#ef233c]">{item.icon}</span>
                  {item.label}
                </button>
              ))}
            </div>

            {/* Input + Button */}
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 max-w-2xl"
            >
              <div className="flex flex-col overflow-hidden rounded-2xl border border-gray-300 bg-white shadow-sm sm:flex-row">
                <input
                  type="text"
                  value={contactValue}
                  onChange={(e) => {
                    setContactValue(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter email or phone number"
                  className="w-full flex-1 px-5 py-4 text-sm outline-none"
                />

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 bg-[#ef233c] px-8 py-4 text-sm font-bold text-white transition hover:bg-[#d90429]"
                >
                  Get Started
                  <Send size={16} />
                </button>
              </div>

              {error && (
                <p className="mt-2 text-sm font-medium text-red-500">
                  {error}
                </p>
              )}
            </form>

            {/* Trust Points */}
            <div className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-3 text-left sm:grid-cols-3">
              <TrustPoint text="Free student enquiry" />
              <TrustPoint text="AP & Telangana options" />
              <TrustPoint text="Quick callback support" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function TrustPoint({ text }) {
  return (
    <div className="flex items-center justify-center gap-2 rounded-xl bg-white/80 px-4 py-3 text-xs font-bold text-gray-700 shadow-sm">
      <CheckCircle size={15} className="text-green-600" />
      {text}
    </div>
  );
}