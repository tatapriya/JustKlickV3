import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Package,
  Heart,
  Download,
  MessageCircle,
  MapPin,
  Mail,
  Phone,
  LogOut,
  ChevronRight,
  Edit,
  X,
  Save,
} from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [user, setUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
  });

  const [wishlist, setWishlist] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [enquiries, setEnquiries] = useState([]);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loggedUser = JSON.parse(localStorage.getItem("loggedInUser"));

    if (!isLoggedIn || !loggedUser) {
      navigate("/login");
      return;
    }

    setUser(loggedUser);
    setEditForm({
      name: loggedUser.name || "",
      email: loggedUser.email || "",
      phone: loggedUser.phone || "",
      location: loggedUser.location || "",
    });

    const userKey = loggedUser.email || loggedUser.phone || "guest";

    setWishlist(JSON.parse(localStorage.getItem(`wishlist_${userKey}`)) || []);
    setDownloads(JSON.parse(localStorage.getItem(`downloads_${userKey}`)) || []);
    setEnquiries(JSON.parse(localStorage.getItem(`enquiries_${userKey}`)) || []);
  }, [navigate]);

  const menuItems = useMemo(
    () => [
      { id: "overview", label: "Overview", icon: <User size={18} /> },
      { id: "wishlist", label: "Wishlist", icon: <Heart size={18} /> },
      { id: "downloads", label: "Downloads", icon: <Download size={18} /> },
      { id: "enquiries", label: "Enquiries", icon: <MessageCircle size={18} /> },
      { id: "addresses", label: "Saved Address", icon: <MapPin size={18} /> },
    ],
    []
  );

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.email) {
      alert("Name and email are required");
      return;
    }

    const oldUserKey = user.email || user.phone || "guest";
    const newUserKey = editForm.email || editForm.phone || "guest";

    const updatedUser = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
    };

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const updatedUsers = registeredUsers.map((item) =>
      item.email === user.email
        ? {
            ...item,
            name: editForm.name,
            email: editForm.email,
            phone: editForm.phone,
            location: editForm.location,
          }
        : item
    );

    localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers));

    if (oldUserKey !== newUserKey) {
      localStorage.setItem(
        `wishlist_${newUserKey}`,
        JSON.stringify(wishlist)
      );
      localStorage.setItem(
        `downloads_${newUserKey}`,
        JSON.stringify(downloads)
      );
      localStorage.setItem(
        `enquiries_${newUserKey}`,
        JSON.stringify(enquiries)
      );

      localStorage.removeItem(`wishlist_${oldUserKey}`);
      localStorage.removeItem(`downloads_${oldUserKey}`);
      localStorage.removeItem(`enquiries_${oldUserKey}`);
    }

    setUser(updatedUser);
    setEditOpen(false);
    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    navigate("/login");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-[#f5f5f6] px-4 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">Account</h1>
            <p className="text-sm text-gray-500">
              {user.name || "User"} | {user.email || user.phone}
            </p>
          </div>

          <button
            onClick={() => setEditOpen(true)}
            className="flex items-center gap-2 rounded-full bg-[#ff3f6c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e73361]"
          >
            <Edit size={16} />
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="p-5 border-b">
              <div className="flex items-center gap-3">
                <div className="h-14 w-14 rounded-full bg-[#ff3f6c] text-white flex items-center justify-center">
                  <User size={28} />
                </div>

                <div>
                  <h2 className="font-extrabold text-gray-900">
                    {user.name || "User"}
                  </h2>
                  <p className="text-xs text-gray-500">Logged In</p>
                </div>
              </div>
            </div>

            <div className="py-2">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between px-5 py-4 text-sm font-bold transition ${
                    activeTab === item.id
                      ? "text-[#ff3f6c] bg-pink-50 border-r-4 border-[#ff3f6c]"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    {item.icon}
                    {item.label}
                  </span>
                  <ChevronRight size={16} />
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full border-t px-5 py-4 flex items-center gap-3 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </aside>

          <section className="bg-white border border-gray-200 rounded-xl p-6">
            {activeTab === "overview" && (
              <>
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Overview
                  </h2>

                  <button
                    onClick={() => setEditOpen(true)}
                    className="text-sm font-bold text-[#ff3f6c]"
                  >
                    Edit Details
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
                  <StatCard icon={<Heart />} title="Wishlist" value={wishlist.length} />
                  <StatCard
                    icon={<Download />}
                    title="Downloads"
                    value={downloads.length}
                  />
                  <StatCard
                    icon={<MessageCircle />}
                    title="Enquiries"
                    value={enquiries.length}
                  />
                </div>

                <div className="mt-8">
                  <h3 className="font-extrabold text-gray-900 mb-4">
                    Profile Details
                  </h3>

                  <div className="border rounded-xl divide-y">
                    <InfoRow icon={<User size={17} />} label="Name" value={user.name} />
                    <InfoRow icon={<Mail size={17} />} label="Email" value={user.email} />
                    <InfoRow icon={<Phone size={17} />} label="Phone" value={user.phone} />
                    <InfoRow
                      icon={<MapPin size={17} />}
                      label="Location"
                      value={user.location}
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "wishlist" && (
              <ListSection
                title="My Wishlist"
                items={wishlist}
                emptyText="Your wishlist is empty."
              />
            )}

            {activeTab === "downloads" && (
              <ListSection
                title="Downloaded Listings"
                items={downloads}
                emptyText="No downloaded listings yet."
              />
            )}

            {activeTab === "enquiries" && (
              <ListSection
                title="My Enquiries"
                items={enquiries}
                emptyText="No enquiries sent yet."
              />
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Saved Address
                </h2>

                <div className="mt-5 border rounded-xl p-5">
                  <h3 className="font-bold text-gray-900">
                    {user.name || "User"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2">
                    {user.location || "No address added yet."}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    Mobile: {user.phone || "Not added"}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-gray-900">
                Edit Profile
              </h2>

              <button
                onClick={() => setEditOpen(false)}
                className="rounded-full p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <EditInput
                label="Full Name"
                name="name"
                value={editForm.name}
                onChange={handleEditChange}
              />

              <EditInput
                label="Email"
                name="email"
                type="email"
                value={editForm.email}
                onChange={handleEditChange}
              />

              <EditInput
                label="Phone"
                name="phone"
                value={editForm.phone}
                onChange={handleEditChange}
              />

              <EditInput
                label="Location"
                name="location"
                value={editForm.location}
                onChange={handleEditChange}
              />

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditOpen(false)}
                  className="rounded-full border px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="flex items-center gap-2 rounded-full bg-[#ff3f6c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e73361]"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="border rounded-xl p-5 bg-[#fafafa]">
      <div className="text-[#ff3f6c]">{icon}</div>
      <h3 className="text-3xl font-extrabold mt-3">{value}</h3>
      <p className="text-sm font-bold text-gray-500">{title}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between px-4 py-4 gap-4">
      <div className="flex items-center gap-3 text-gray-600">
        <span className="text-[#ff3f6c]">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>
      <span className="text-sm text-gray-800 text-right">
        {value || "Not added"}
      </span>
    </div>
  );
}

function EditInput({ label, name, value, onChange, type = "text" }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#ff3f6c]"
      />
    </div>
  );
}

function ListSection({ title, items, emptyText }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>

      {items.length === 0 ? (
        <div className="mt-8 text-center border rounded-xl py-14">
          <Package size={42} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm font-bold text-gray-500">{emptyText}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map((item, index) => (
            <div key={item.id || index} className="border rounded-xl p-4">
              <h3 className="font-extrabold text-gray-900">
                {item.name || item.title || "Listing"}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {item.location || item.city || "Location not available"}
              </p>

              {item.category && (
                <p className="text-xs font-bold text-[#ff3f6c] mt-2">
                  {item.category}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}