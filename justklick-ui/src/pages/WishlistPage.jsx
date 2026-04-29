import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, MapPin, Star } from "lucide-react";

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(saved);
  }, []);

  const removeItem = (item) => {
    const updated = wishlist.filter(
      (wish) =>
        !(wish.id === item.id && wish.categorySlug === item.categorySlug)
    );

    localStorage.setItem("wishlist", JSON.stringify(updated));
    setWishlist(updated);
  };

  return (
    <main className="min-h-screen bg-[#f5f7fb] py-10">
      <div className="mx-auto max-w-7xl px-4">
        <h1 className="text-3xl font-extrabold text-[#0b1f4d]">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="mt-8 rounded-3xl bg-white p-10 text-center shadow">
            <h2 className="text-2xl font-bold text-[#0b1f4d]">
              No wishlist items yet
            </h2>
            <Link
              to="/"
              className="mt-4 inline-block rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white"
            >
              Explore Now
            </Link>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlist.map((item) => (
              <div
                key={`${item.categorySlug}-${item.id}`}
                className="overflow-hidden rounded-3xl bg-white shadow"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-56 w-full object-cover"
                />

                <div className="p-5">
                  <Link to={`/category/${item.categorySlug}/${item.id}`}>
                    <h3 className="text-xl font-bold text-[#0b1f4d] hover:text-blue-600">
                      {item.name}
                    </h3>
                  </Link>

                  <p className="mt-2 flex items-center gap-2 text-sm text-gray-600">
                    <MapPin size={16} />
                    {item.area}, {item.city}
                  </p>

                  <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-700">
                    <Star size={15} fill="currentColor" />
                    {item.rating}
                  </p>

                  <button
                    onClick={() => removeItem(item)}
                    className="mt-5 w-full rounded-xl border border-red-200 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 size={16} className="inline mr-1" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}