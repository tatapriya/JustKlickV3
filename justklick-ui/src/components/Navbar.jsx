import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MapPin,
  ChevronDown,
  Download,
  Heart,
  User,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState("");

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const categories = [
    { name: "Colleges", path: "/category/colleges" },
    { name: "Hostels", path: "/category/hostels" },
    { name: "Overseas Education", path: "/category/overseas" },
    { name: "Software Training", path: "/category/software-training" },
    { name: "Competitive Exams", path: "/category/exams" },
    { name: "Career Guidance", path: "/category/more" },
  ];

  const handleLocationSearch = (e) => {
    e.preventDefault();

    if (location.trim()) {
      navigate(`/category/colleges?location=${encodeURIComponent(location)}`);
    }
  };

  const handleWishlistClick = () => {
    if (isLoggedIn) {
      navigate("/wishlist");
    } else {
      navigate("/login", {
        state: {
          from: "/wishlist",
        },
      });
    }
  };

  const handleProfileClick = () => {
    if (isLoggedIn) {
      navigate("/profile");
    } else {
      navigate("/login", {
        state: {
          from: "/profile",
        },
      });
    }
  };

  const handleEnquiryClick = () => {
    navigate("/enquiry");
  };

  const handleDownloadApp = () => {
    alert("Download App Coming Soon");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-5 px-6">
        {/* LOGO */}
        <Link to="/" className="shrink-0 leading-none">
          <div className="text-[26px] font-extrabold tracking-tight">
            <span className="text-[#ef233c]">Just</span>
            <span className="text-[#0b2a5b]">Klick</span>
          </div>
          <p className="mt-1 text-[10px] font-semibold text-gray-400">
            Student Platform
          </p>
        </Link>

        {/* LOCATION SEARCH */}
        <form
          onSubmit={handleLocationSearch}
          className="hidden h-[40px] w-[220px] items-center rounded-full border border-gray-200 bg-[#f9fafb] px-4 lg:flex"
        >
          <MapPin size={16} className="text-gray-400" />

          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full bg-transparent px-2 text-sm outline-none"
          />
        </form>

        {/* DESKTOP MENU */}
        <div className="hidden items-center gap-5 lg:flex">
          <button
            onClick={() => navigate("/categories")}
            className="text-sm font-semibold text-gray-700 hover:text-[#ef233c]"
          >
            Explore
          </button>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-1 text-sm font-semibold text-gray-700 hover:text-[#ef233c]"
            >
              Categories <ChevronDown size={15} />
            </button>

            {open && (
              <div className="absolute left-0 top-10 w-52 rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                {categories.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* DESKTOP RIGHT ACTIONS */}
        <div className="hidden items-center gap-2 lg:flex">
          <button
            onClick={handleEnquiryClick}
            className="flex h-[36px] items-center gap-1 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-[#ef233c] hover:text-[#ef233c]"
          >
            <MessageCircle size={15} />
            Enquiry
          </button>

          <button
            onClick={handleWishlistClick}
            className="flex h-[36px] items-center gap-1 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-[#ef233c] hover:text-[#ef233c]"
          >
            <Heart size={15} />
            Wishlist
          </button>

          <button
            onClick={handleProfileClick}
            className="flex h-[36px] items-center gap-1 rounded-full border border-gray-200 px-4 text-sm font-semibold text-gray-700 hover:border-[#ef233c] hover:text-[#ef233c]"
          >
            <User size={15} />
            Profile
          </button>

          <button
            onClick={handleDownloadApp}
            className="flex h-[36px] items-center gap-2 rounded-full bg-[#ef233c] px-5 text-sm font-semibold text-white hover:bg-[#d90429]"
          >
            <Download size={15} />
            Download App
          </button>
        </div>

        {/* MOBILE MENU BUTTON */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-gray-200 text-gray-700 lg:hidden"
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="border-t border-gray-100 bg-white px-5 py-4 lg:hidden">
          {/* MOBILE LOCATION */}
          <form
            onSubmit={handleLocationSearch}
            className="mb-4 flex h-[40px] items-center rounded-full border border-gray-200 bg-[#f9fafb] px-4"
          >
            <MapPin size={16} className="text-gray-400" />

            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Location"
              className="w-full bg-transparent px-2 text-sm outline-none"
            />
          </form>

          <div className="space-y-2">
            <button
              onClick={() => {
                navigate("/");
                setMobileOpen(false);
              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
            >
              Home
            </button>

            <button
              onClick={() => {
                navigate("/categories");
                setMobileOpen(false);
              }}
              className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
            >
              Explore
            </button>

            <div className="rounded-md border border-gray-100 p-2">
              <p className="mb-2 px-2 text-xs font-bold text-gray-500">
                Categories
              </p>

              {categories.map((item) => (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.path);
                    setMobileOpen(false);
                  }}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              onClick={() => {
                handleEnquiryClick();
                setMobileOpen(false);
              }}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Enquiry
            </button>

            <button
              onClick={() => {
                handleWishlistClick();
                setMobileOpen(false);
              }}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Wishlist
            </button>

            <button
              onClick={() => {
                handleProfileClick();
                setMobileOpen(false);
              }}
              className="rounded-md border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700"
            >
              Profile
            </button>

            <button
              onClick={() => {
                handleDownloadApp();
                setMobileOpen(false);
              }}
              className="rounded-md bg-[#ef233c] px-4 py-2 text-sm font-semibold text-white"
            >
              Download App
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;