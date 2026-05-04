import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  GitCompare,
  Trash2,
  Star,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Heart,
} from "lucide-react";

import {
  WISHLIST_BASE_KEY,
  readUserItems,
  writeUserItems,
  clearOldWishlistKeys,
} from "../utils/userStorage";

export default function ComparePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(() => {
    loadSavedItems();

    const handleStorageUpdate = () => {
      loadSavedItems();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("user-storage-updated", handleStorageUpdate);
    window.addEventListener("focus", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("user-storage-updated", handleStorageUpdate);
      window.removeEventListener("focus", handleStorageUpdate);
    };
  }, []);

  const safeParse = (key) => {
    try {
      const data = localStorage.getItem(key);
      if (!data) return [];

      const parsed = JSON.parse(data);

      if (Array.isArray(parsed)) return parsed;

      if (parsed && typeof parsed === "object") {
        return Object.values(parsed).flat();
      }

      return [];
    } catch (error) {
      console.error(`Error reading ${key}:`, error);
      return [];
    }
  };

  const loadSavedItems = () => {
    clearOldWishlistKeys();

    const userWishlistData = readUserItems(WISHLIST_BASE_KEY);

    const oldWishlistData = safeParse("wishlist");
    const oldWishlistItemsData = safeParse("wishlistItems");
    const oldCompareData = safeParse("compareItems");
    const oldSavedOptionsData = safeParse("savedOptions");

    const mergedItems = [
      ...userWishlistData,
      ...oldWishlistData,
      ...oldWishlistItemsData,
      ...oldCompareData,
      ...oldSavedOptionsData,
    ];

    const uniqueItems = mergedItems.filter((item, index, self) => {
      const itemId = String(item?.id || item?.name || item?.title || index);
      const itemCategory = String(
        item?.categorySlug || item?.category || item?.slug || "general"
      );

      return (
        index ===
        self.findIndex((saved) => {
          const savedId = String(
            saved?.id || saved?.name || saved?.title || index
          );
          const savedCategory = String(
            saved?.categorySlug || saved?.category || saved?.slug || "general"
          );

          return savedId === itemId && savedCategory === itemCategory;
        })
      );
    });

    setItems(uniqueItems);
  };

  const removeItem = (item) => {
    const updatedItems = items.filter((savedItem) => {
      return !(
        String(savedItem.id || savedItem.name || savedItem.title) ===
          String(item.id || item.name || item.title) &&
        String(savedItem.categorySlug || savedItem.category || savedItem.slug) ===
          String(item.categorySlug || item.category || item.slug)
      );
    });

    writeUserItems(WISHLIST_BASE_KEY, updatedItems);

    localStorage.setItem("wishlist", JSON.stringify(updatedItems));
    localStorage.setItem("wishlistItems", JSON.stringify(updatedItems));
    localStorage.setItem("compareItems", JSON.stringify(updatedItems));
    localStorage.setItem("savedOptions", JSON.stringify(updatedItems));

    setItems(updatedItems);

    window.dispatchEvent(new CustomEvent("user-storage-updated"));
  };

  const clearAll = () => {
    writeUserItems(WISHLIST_BASE_KEY, []);

    localStorage.removeItem("wishlist");
    localStorage.removeItem("wishlistItems");
    localStorage.removeItem("compareItems");
    localStorage.removeItem("savedOptions");

    setItems([]);

    window.dispatchEvent(new CustomEvent("user-storage-updated"));
  };

  const getTitle = (item) => {
    return (
      item?.name ||
      item?.title ||
      item?.collegeName ||
      item?.hostelName ||
      item?.instituteName ||
      item?.consultancyName ||
      "Student Option"
    );
  };

  const getImage = (item) => {
    return (
      item?.image ||
      item?.img ||
      item?.banner ||
      item?.photo ||
      "https://images.unsplash.com/photo-1523580846011-d3a5bc25702b?w=900"
    );
  };

  const getCategory = (item) => {
    const slug = item?.categorySlug || item?.category || item?.slug || item?.type;

    const names = {
      colleges: "College",
      college: "College",
      hostels: "Hostel",
      hostel: "Hostel",
      "software-training": "Software Training",
      "training-institutes": "Software Training",
      training: "Software Training",
      "overseas-education": "Overseas Education",
      overseas: "Overseas Education",
    };

    return names[slug] || slug || "Student Option";
  };

  const getLocation = (item) => {
    return item?.location || item?.city || item?.area || "Location not added";
  };

  const getFees = (item) => {
    return (
      item?.fees ||
      item?.fee ||
      item?.averageFee ||
      item?.price ||
      item?.budget ||
      "Contact for details"
    );
  };

  const getCourses = (item) => {
    if (Array.isArray(item?.courses)) return item.courses.join(", ");
    if (Array.isArray(item?.services)) return item.services.join(", ");

    return (
      item?.courses ||
      item?.course ||
      item?.services ||
      item?.specialization ||
      item?.programs ||
      "Not specified"
    );
  };

  const getDetailsLink = (item) => {
    const categorySlug = item?.categorySlug || item?.category || item?.slug;
    const id = item?.id;

    if (categorySlug && id) {
      return `/category/${categorySlug}/${id}`;
    }

    return "/";
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <section className="bg-[#071b46] px-4 py-12 text-white">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-blue-100">
                <GitCompare size={15} />
                Compare Saved Options
              </div>

              <h1 className="text-3xl font-extrabold md:text-4xl">
                Compare Your Saved Student Options
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-white/75">
                Compare colleges, hostels, training institutes, and overseas
                education options saved in your wishlist.
              </p>
            </div>

            <Link
              to="/"
              className="inline-flex w-fit items-center gap-2 rounded-full bg-red-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              Explore More
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        {items.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              <Heart size={30} />
            </div>

            <h2 className="mt-5 text-2xl font-extrabold text-[#0b1f4d]">
              No saved options found
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-600">
              Add colleges, hostels, software training institutes, or overseas
              education options to wishlist first. Then they will appear here.
            </p>

            <Link
              to="/"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#0b1f4d] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#102b66]"
            >
              Browse Options
              <ArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
              <div>
                <h2 className="text-2xl font-extrabold text-[#0b1f4d]">
                  Saved Options
                </h2>
                <p className="mt-1 text-sm text-gray-600">
                  {items.length} saved item{items.length > 1 ? "s" : ""} found.
                </p>
              </div>

              <button
                onClick={clearAll}
                className="inline-flex w-fit items-center gap-2 rounded-full bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Clear All
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {items.map((item, index) => (
                <div
                  key={`${item?.categorySlug || item?.category || "item"}-${
                    item?.id || index
                  }`}
                  className="overflow-hidden rounded-3xl bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={getImage(item)}
                      alt={getTitle(item)}
                      className="h-full w-full object-cover transition duration-500 hover:scale-110"
                    />

                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-[#0b1f4d]">
                      {getCategory(item)}
                    </div>

                    <button
                      onClick={() => removeItem(item)}
                      className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-red-500 shadow transition hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <div className="p-5">
                    <h3 className="line-clamp-2 text-lg font-extrabold text-[#0b1f4d]">
                      {getTitle(item)}
                    </h3>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={15} className="text-red-500" />
                      <span>{getLocation(item)}</span>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <Star
                        size={16}
                        className="text-yellow-500"
                        fill="currentColor"
                      />
                      <span className="text-sm font-bold text-[#0b1f4d]">
                        {item?.rating || "4.5"}
                      </span>
                      <span className="text-sm text-gray-500">Rating</span>
                    </div>

                    <div className="mt-5 space-y-3 rounded-2xl bg-[#f5f7fb] p-4">
                      <CompareRow label="Fees" value={getFees(item)} />
                      <CompareRow label="Courses" value={getCourses(item)} />
                      <CompareRow label="Type" value={getCategory(item)} />
                      <CompareRow label="Area" value={getLocation(item)} />
                    </div>

                    <div className="mt-5 flex flex-col gap-3">
                      {item?.phone && (
                        <a
                          href={`tel:${item.phone}`}
                          className="flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0b1f4d] transition hover:bg-gray-50"
                        >
                          <Phone size={15} />
                          Call
                        </a>
                      )}

                      {item?.email && (
                        <a
                          href={`mailto:${item.email}`}
                          className="flex items-center justify-center gap-2 rounded-full border border-gray-200 px-4 py-2.5 text-sm font-semibold text-[#0b1f4d] transition hover:bg-gray-50"
                        >
                          <Mail size={15} />
                          Email
                        </a>
                      )}

                      <button
                        onClick={() => navigate(getDetailsLink(item))}
                        className="flex items-center justify-center gap-2 rounded-full bg-[#0b1f4d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#102b66]"
                      >
                        View Details
                        <ArrowRight size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

function CompareRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-gray-200 pb-2 last:border-b-0 last:pb-0">
      <span className="text-xs font-bold uppercase tracking-wide text-gray-500">
        {label}
      </span>

      <span className="max-w-[170px] text-right text-sm font-semibold text-[#0b1f4d]">
        {String(value || "Not specified")}
      </span>
    </div>
  );
}