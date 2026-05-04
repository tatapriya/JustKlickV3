import { Link, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  ChevronDown,
  Heart,
  User,
  MessageCircle,
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Plane,
  Home as HomeIcon,
  Building2,
} from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location, setLocation] = useState("");

  const [downloadActive, setDownloadActive] = useState(false);
  const [downloadDone, setDownloadDone] = useState(false);

  const downloadTimerRef = useRef(null);
  const resetTimerRef = useRef(null);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  const categories = [
    {
      name: "Colleges",
      path: "/category/colleges",
      icon: GraduationCap,
    },
    {
      name: "Hostels",
      path: "/category/hostels",
      icon: HomeIcon,
    },
    {
      name: "Overseas Education",
      path: "/category/overseas",
      icon: Plane,
    },
    {
      name: "Software Training",
      path: "/category/software-training",
      icon: BookOpen,
    },
    {
      name: "Competitive Exams",
      path: "/category/exams",
      icon: Building2,
    },
    {
      name: "Career Guidance",
      path: "/category/more",
      icon: GraduationCap,
    },
  ];

  useEffect(() => {
    return () => {
      if (downloadTimerRef.current) clearTimeout(downloadTimerRef.current);
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    };
  }, []);

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
    navigate("/download-app");
  };

  const DownloadButton = ({ mobile = false }) => (
    <div
      className={`relative ${mobile ? "col-span-2 mx-auto mt-3" : "ml-2"}`}
      style={{
        perspective: "80rem",
        perspectiveOrigin: "50% 50% 0",
        width: mobile ? "10.8rem" : "10.6rem",
        height: mobile ? "2.45rem" : "2.35rem",
      }}
    >
      <div
        className={`relative h-full w-full transition-all duration-200 ease-linear [transform-style:preserve-3d] [transform-origin:50%_50%_0] ${
          downloadActive
            ? "[transform:rotateX(90deg)_translateZ(1.18rem)]"
            : "[transform:rotateX(0deg)]"
        }`}
      >
        {/* FRONT FACE */}
        <button
          type="button"
          onClick={() => {
            handleDownloadApp();

            if (mobile) {
              setMobileOpen(false);
            }
          }}
          title="Download JustKlick App"
          className="absolute inset-0 flex h-full w-full items-center overflow-visible rounded-l-md border border-r-0 border-[#0b2a5b] bg-white pl-4 pr-[3.1rem] text-left text-[13px] font-semibold text-[#0b2a5b] shadow-sm transition hover:border-[#ef233c] hover:text-[#ef233c] [backface-visibility:hidden]"
        >
          <span className="whitespace-nowrap">Get App</span>

          {/* PHONE LIKE CONTAINER */}
          <span
            className={`absolute right-0 top-1/2 z-20 flex -translate-y-1/2 items-center justify-center rounded-md border border-[#0b2a5b] bg-white shadow-sm transition group-hover:-translate-y-1 ${
              mobile ? "h-[46px] w-[31px]" : "h-[50px] w-[34px]"
            }`}
          >
            {/* Phone speaker */}
            <span className="absolute top-[6px] h-[2px] w-[11px] rounded-full bg-[#0b2a5b]" />

            {/* Phone screen */}
            <span className="absolute inset-[4px] rounded-[6px] bg-[#f8fbff]" />

            {/* Download icon */}
            <span className="relative z-10 flex h-[22px] w-[22px] items-center justify-center">
              {/* Arrow stem */}
              <span className="absolute top-[1px] h-[10px] w-[3px] animate-[downloadIconBounce_.55s_infinite_alternate] rounded-full bg-[#0b2a5b]" />

              {/* Arrow head */}
              <span className="absolute top-[8px] h-0 w-0 animate-[downloadIconBounce_.55s_infinite_alternate] border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#0b2a5b]" />

              {/* Tray */}
              <span className="absolute bottom-[1px] h-[7px] w-[18px] rounded-b-[3px] border-[2.5px] border-t-0 border-[#0b2a5b]" />
            </span>

            {/* Home indicator */}
            <span className="absolute bottom-[5px] h-[2px] w-[9px] rounded-full bg-[#cbd5e1]" />
          </span>
        </button>

        {/* BACK FACE / METER */}
        <div
          className={`absolute inset-0 h-full w-full overflow-hidden rounded-full border border-[#ef233c] bg-[#ef233c] text-center text-[13px] font-semibold text-white shadow-sm [transform:rotateX(270deg)] [transform-origin:top_center] ${
            mobile ? "leading-[2.45rem]" : "leading-[2.35rem]"
          }`}
        >
          <span
            className={`relative z-10 ${
              downloadDone
                ? "text-white"
                : "animate-[whitePulse_1s_infinite_alternate]"
            }`}
          >
            {downloadDone ? "Done!" : "Downloading..."}
          </span>

          <span
            className={`absolute bottom-0 top-0 block w-full transition-all duration-[4000ms] ease-linear ${
              downloadActive ? "right-0" : "right-full"
            }`}
            style={{
              backgroundImage:
                "linear-gradient(-45deg, rgba(255,255,255,0.12) 10%, rgba(255,255,255,0.22) 10%, rgba(255,255,255,0.22) 20%, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.22) 30%, rgba(255,255,255,0.22) 40%, rgba(255,255,255,0.12) 40%, rgba(255,255,255,0.12) 50%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.22) 60%, rgba(255,255,255,0.12) 60%, rgba(255,255,255,0.12) 70%, rgba(255,255,255,0.22) 70%, rgba(255,255,255,0.22) 80%, rgba(255,255,255,0.12) 80%, rgba(255,255,255,0.12) 90%, rgba(255,255,255,0.22) 90%, rgba(255,255,255,0.22))",
            }}
          />
        </div>
      </div>
    </div>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white shadow-sm">
      <style>
        {`
          @keyframes downloadIconBounce {
            from {
              transform: translateY(-2px);
            }
            to {
              transform: translateY(0);
            }
          }

          @keyframes whitePulse {
            from {
              color: rgba(255, 255, 255, 0.45);
            }
            to {
              color: rgba(255, 255, 255, 1);
            }
          }
        `}
      </style>

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
              <div className="absolute left-0 top-10 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-lg">
                {categories.map((item) => {
                  const Icon = item.icon;

                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        navigate(item.path);
                        setOpen(false);
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm font-medium text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
                    >
                      <Icon size={16} />
                      {item.name}
                    </button>
                  );
                })}
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

          {/* GET APP BUTTON */}
          <DownloadButton />
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

              {categories.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      navigate(item.path);
                      setOpen(false);
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-semibold text-gray-700 hover:bg-red-50 hover:text-[#ef233c]"
                  >
                    <Icon size={16} />
                    {item.name}
                  </button>
                );
              })}
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

            {/* MOBILE GET APP BUTTON */}
            <DownloadButton mobile />
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;