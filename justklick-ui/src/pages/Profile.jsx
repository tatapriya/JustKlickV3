import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
  Star,
  Trash2,
  Eye,
  Calendar,
  Building2,
} from "lucide-react";

import {
  WISHLIST_BASE_KEY,
  DOWNLOADS_BASE_KEY,
  ENQUIRIES_BASE_KEY,
  getLoggedInUser,
  getUserKey,
  isUserLoggedIn,
  readUserItems,
  writeUserItems,
  clearOldWishlistKeys,
} from "../utils/userStorage";

export default function Profile() {
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(
    location.state?.activeTab || "overview"
  );

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

  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [viewEnquiryOpen, setViewEnquiryOpen] = useState(false);
  const [editEnquiryOpen, setEditEnquiryOpen] = useState(false);

  const [enquiryForm, setEnquiryForm] = useState({
    studentName: "",
    email: "",
    phone: "",
    message: "",
    status: "Interest Sent",
  });

  const loadUserData = () => {
    clearOldWishlistKeys();

    setWishlist(readUserItems(WISHLIST_BASE_KEY));
    setDownloads(readUserItems(DOWNLOADS_BASE_KEY));
    setEnquiries(readUserItems(ENQUIRIES_BASE_KEY));
  };

  useEffect(() => {
    if (!isUserLoggedIn()) {
      navigate("/login", {
        state: {
          from: "/profile",
          message: "Please login to view your profile.",
        },
      });
      return;
    }

    const loggedUser = getLoggedInUser();

    setUser(loggedUser);

    setEditForm({
      name: loggedUser?.name || "",
      email: loggedUser?.email || "",
      phone: loggedUser?.phone || "",
      location: loggedUser?.location || "",
    });

    loadUserData();

    const handleStorageUpdate = () => {
      loadUserData();
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("user-storage-updated", handleStorageUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("user-storage-updated", handleStorageUpdate);
    };
  }, [navigate]);

  useEffect(() => {
    if (location.state?.activeTab) {
      setActiveTab(location.state.activeTab);
    }

    loadUserData();
  }, [location.state?.activeTab, location.state?.refreshProfile]);

  // ADDED: Open enquiries tab when route is /profile#enquiries
  useEffect(() => {
    if (location.hash === "#enquiries") {
      setActiveTab("enquiries");
      loadUserData();
    }
  }, [location.hash]);

  // ADDED: Scroll to enquiries section after tab becomes active
  useEffect(() => {
    if (location.hash === "#enquiries" && activeTab === "enquiries") {
      setTimeout(() => {
        const section = document.getElementById("enquiries");

        if (section) {
          section.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 300);
    }
  }, [location.hash, activeTab]);

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
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  const moveStorageToNewUserKey = (oldUserKey, newUserKey) => {
    if (!oldUserKey || !newUserKey || oldUserKey === newUserKey) return;

    const oldWishlistKey = `${WISHLIST_BASE_KEY}_${oldUserKey}`;
    const newWishlistKey = `${WISHLIST_BASE_KEY}_${newUserKey}`;

    const oldDownloadsKey = `${DOWNLOADS_BASE_KEY}_${oldUserKey}`;
    const newDownloadsKey = `${DOWNLOADS_BASE_KEY}_${newUserKey}`;

    const oldEnquiriesKey = `${ENQUIRIES_BASE_KEY}_${oldUserKey}`;
    const newEnquiriesKey = `${ENQUIRIES_BASE_KEY}_${newUserKey}`;

    localStorage.setItem(newWishlistKey, JSON.stringify(wishlist));
    localStorage.setItem(newDownloadsKey, JSON.stringify(downloads));
    localStorage.setItem(newEnquiriesKey, JSON.stringify(enquiries));

    localStorage.removeItem(oldWishlistKey);
    localStorage.removeItem(oldDownloadsKey);
    localStorage.removeItem(oldEnquiriesKey);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();

    if (!editForm.name || !editForm.email) {
      alert("Name and email are required");
      return;
    }

    const oldUserKey = getUserKey(user);

    const updatedUser = {
      ...user,
      name: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      location: editForm.location,
    };

    const newUserKey = getUserKey(updatedUser);

    moveStorageToNewUserKey(oldUserKey, newUserKey);

    localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
    localStorage.setItem("isLoggedIn", "true");

    const registeredUsers =
      JSON.parse(localStorage.getItem("registeredUsers")) || [];

    const updatedUsers = registeredUsers.map((item) =>
      item.email === user.email || item.phone === user.phone
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

    setUser(updatedUser);
    setEditOpen(false);

    window.dispatchEvent(new CustomEvent("user-storage-updated"));

    alert("Profile updated successfully");
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("authUser");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const removeWishlistItem = (item) => {
    const updated = wishlist.filter(
      (wish) =>
        !(
          String(wish.id) === String(item.id) &&
          String(wish.categorySlug || wish.category) ===
            String(item.categorySlug || item.category)
        )
    );

    setWishlist(updated);
    writeUserItems(WISHLIST_BASE_KEY, updated);
    clearOldWishlistKeys();
  };

  const openViewEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);
    setViewEnquiryOpen(true);
  };

  const openEditEnquiry = (enquiry) => {
    setSelectedEnquiry(enquiry);

    setEnquiryForm({
      studentName: enquiry.studentName || user?.name || "",
      email: enquiry.email || user?.email || "",
      phone: enquiry.phone || user?.phone || "",
      message: enquiry.message || "",
      status: enquiry.status || "Interest Sent",
    });

    setEditEnquiryOpen(true);
  };

  const handleEnquiryFormChange = (e) => {
    setEnquiryForm({
      ...enquiryForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdateEnquiry = (e) => {
    e.preventDefault();

    if (!selectedEnquiry) return;

    const updatedEnquiries = enquiries.map((item) => {
      const sameItem =
        selectedEnquiry.enquiryId && item.enquiryId
          ? String(item.enquiryId) === String(selectedEnquiry.enquiryId)
          : String(item.id || item.itemId) ===
              String(selectedEnquiry.id || selectedEnquiry.itemId) &&
            String(item.categorySlug || item.category) ===
              String(selectedEnquiry.categorySlug || selectedEnquiry.category);

      if (!sameItem) return item;

      return {
        ...item,
        studentName: enquiryForm.studentName,
        email: enquiryForm.email,
        phone: enquiryForm.phone,
        message: enquiryForm.message,
        status: enquiryForm.status,
        updatedAt: new Date().toISOString(),
      };
    });

    setEnquiries(updatedEnquiries);
    writeUserItems(ENQUIRIES_BASE_KEY, updatedEnquiries);

    setEditEnquiryOpen(false);
    setSelectedEnquiry(null);

    alert("Enquiry updated successfully");
  };

  const deleteEnquiry = (enquiry) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this enquiry?"
    );

    if (!confirmDelete) return;

    const updatedEnquiries = enquiries.filter((item) => {
      if (enquiry.enquiryId && item.enquiryId) {
        return String(item.enquiryId) !== String(enquiry.enquiryId);
      }

      return !(
        String(item.id || item.itemId) === String(enquiry.id || enquiry.itemId) &&
        String(item.categorySlug || item.category) ===
          String(enquiry.categorySlug || enquiry.category)
      );
    });

    setEnquiries(updatedEnquiries);
    writeUserItems(ENQUIRIES_BASE_KEY, updatedEnquiries);

    setSelectedEnquiry(null);
    setViewEnquiryOpen(false);
    setEditEnquiryOpen(false);

    alert("Enquiry deleted successfully");
  };

  if (!user) return null;

  return (
    <main className="min-h-screen overflow-y-auto bg-[#f5f5f6] px-4 py-8">
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
          <aside className="h-fit overflow-hidden rounded-xl border border-gray-200 bg-white">
            <div className="border-b p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff3f6c] text-white">
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
                  className={`flex w-full items-center justify-between px-5 py-4 text-sm font-bold transition ${
                    activeTab === item.id
                      ? "border-r-4 border-[#ff3f6c] bg-pink-50 text-[#ff3f6c]"
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
              className="flex w-full items-center gap-3 border-t px-5 py-4 text-sm font-bold text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </aside>

          <section className="min-h-[620px] rounded-xl border border-gray-200 bg-white p-6">
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

                <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
                  <StatCard
                    icon={<Heart />}
                    title="Wishlist"
                    value={wishlist.length}
                  />
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
                  <h3 className="mb-4 font-extrabold text-gray-900">
                    Profile Details
                  </h3>

                  <div className="divide-y rounded-xl border">
                    <InfoRow
                      icon={<User size={17} />}
                      label="Name"
                      value={user.name}
                    />
                    <InfoRow
                      icon={<Mail size={17} />}
                      label="Email"
                      value={user.email}
                    />
                    <InfoRow
                      icon={<Phone size={17} />}
                      label="Phone"
                      value={user.phone}
                    />
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
              <ListingSection
                title="My Wishlist"
                items={wishlist}
                emptyText="Your wishlist is empty."
                navigate={navigate}
                onRemove={removeWishlistItem}
                showRemove
              />
            )}

            {activeTab === "downloads" && (
              <ListingSection
                title="Downloaded Listings"
                items={downloads}
                emptyText="No downloaded listings yet."
                navigate={navigate}
              />
            )}

            {activeTab === "enquiries" && (
              <div id="enquiries" className="scroll-mt-28">
                <EnquiriesSection
                  enquiries={enquiries}
                  navigate={navigate}
                  onView={openViewEnquiry}
                  onEdit={openEditEnquiry}
                  onDelete={deleteEnquiry}
                />
              </div>
            )}

            {activeTab === "addresses" && (
              <div>
                <h2 className="text-xl font-extrabold text-gray-900">
                  Saved Address
                </h2>

                <div className="mt-5 rounded-xl border p-5">
                  <h3 className="font-bold text-gray-900">
                    {user.name || "User"}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {user.location || "No address added yet."}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    Mobile: {user.phone || "Not added"}
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 px-4 py-8">
          <div className="mx-auto flex min-h-full max-w-lg items-center justify-center">
            <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
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
        </div>
      )}

      {viewEnquiryOpen && selectedEnquiry && (
        <ViewEnquiryModal
          enquiry={selectedEnquiry}
          onClose={() => {
            setViewEnquiryOpen(false);
            setSelectedEnquiry(null);
          }}
          onEdit={() => {
            setViewEnquiryOpen(false);
            openEditEnquiry(selectedEnquiry);
          }}
          onDelete={() => deleteEnquiry(selectedEnquiry)}
          navigate={navigate}
        />
      )}

      {editEnquiryOpen && selectedEnquiry && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 px-4 py-8">
          <div className="mx-auto flex min-h-full max-w-lg items-center justify-center">
            <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-gray-900">
                    Modify Enquiry
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Update the enquiry details you sent.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setEditEnquiryOpen(false);
                    setSelectedEnquiry(null);
                  }}
                  className="rounded-full p-2 hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleUpdateEnquiry} className="space-y-4">
                <EditInput
                  label="Student Name"
                  name="studentName"
                  value={enquiryForm.studentName}
                  onChange={handleEnquiryFormChange}
                />

                <EditInput
                  label="Email"
                  name="email"
                  type="email"
                  value={enquiryForm.email}
                  onChange={handleEnquiryFormChange}
                />

                <EditInput
                  label="Phone"
                  name="phone"
                  value={enquiryForm.phone}
                  onChange={handleEnquiryFormChange}
                />

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Status
                  </label>

                  <select
                    name="status"
                    value={enquiryForm.status}
                    onChange={handleEnquiryFormChange}
                    className="h-12 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-[#ff3f6c]"
                  >
                    <option value="Interest Sent">Interest Sent</option>
                    <option value="Need Callback">Need Callback</option>
                    <option value="Interested">Interested</option>
                    <option value="Not Interested">Not Interested</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-bold text-gray-700">
                    Message
                  </label>

                  <textarea
                    name="message"
                    value={enquiryForm.message}
                    onChange={handleEnquiryFormChange}
                    rows="4"
                    placeholder="Write your enquiry message..."
                    className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#ff3f6c]"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditEnquiryOpen(false);
                      setSelectedEnquiry(null);
                    }}
                    className="rounded-full border px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="flex items-center gap-2 rounded-full bg-[#ff3f6c] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e73361]"
                  >
                    <Save size={16} />
                    Update Enquiry
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="rounded-xl border bg-[#fafafa] p-5">
      <div className="text-[#ff3f6c]">{icon}</div>
      <h3 className="mt-3 text-3xl font-extrabold">{value}</h3>
      <p className="text-sm font-bold text-gray-500">{title}</p>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-4">
      <div className="flex items-center gap-3 text-gray-600">
        <span className="text-[#ff3f6c]">{icon}</span>
        <span className="text-sm font-bold">{label}</span>
      </div>

      <span className="text-right text-sm text-gray-800">
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

function ListingSection({
  title,
  items,
  emptyText,
  navigate,
  onRemove,
  showRemove = false,
}) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">{title}</h2>

      {items.length === 0 ? (
        <div className="mt-8 rounded-xl border py-14 text-center">
          <Package size={42} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm font-bold text-gray-500">{emptyText}</p>
        </div>
      ) : (
        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
          {items.map((item, index) => {
            const itemLink =
              item.link ||
              `/category/${item.categorySlug || item.category}/${item.id}`;

            return (
              <div
                key={`${item.categorySlug || item.category}-${item.id || index}`}
                className="overflow-hidden rounded-xl border bg-white transition hover:shadow-md"
              >
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    className="h-40 w-full cursor-pointer object-cover"
                    onClick={() => navigate(itemLink)}
                  />
                )}

                <div className="p-4">
                  <h3 className="font-extrabold text-gray-900">
                    {item.name || item.title || "Listing"}
                  </h3>

                  <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                    <MapPin size={14} />
                    {item.location || "Location not available"},{" "}
                    {item.city || ""}
                  </p>

                  {item.rating && (
                    <p className="mt-2 inline-flex items-center gap-1 rounded-full bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                      <Star size={13} fill="currentColor" />
                      {item.rating}
                    </p>
                  )}

                  {item.categoryTitle && (
                    <p className="mt-2 text-xs font-bold text-[#ff3f6c]">
                      {item.categoryTitle}
                    </p>
                  )}

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={() => navigate(itemLink)}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0b1f4d] px-4 py-2 text-sm font-bold text-white hover:bg-[#132d68]"
                    >
                      <Eye size={15} />
                      View
                    </button>

                    {showRemove && (
                      <button
                        onClick={() => onRemove(item)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                      >
                        <Trash2 size={15} />
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EnquiriesSection({ enquiries, navigate, onView, onEdit, onDelete }) {
  return (
    <div>
      <h2 className="text-xl font-extrabold text-gray-900">My Enquiries</h2>

      {enquiries.length === 0 ? (
        <div className="mt-8 rounded-xl border py-14 text-center">
          <MessageCircle size={42} className="mx-auto text-gray-300" />
          <p className="mt-3 text-sm font-bold text-gray-500">
            No enquiries sent yet.
          </p>
        </div>
      ) : (
        <div className="mt-5 space-y-4">
          {enquiries.map((item, index) => {
            const itemLink =
              item.link ||
              `/category/${item.categorySlug || item.category}/${item.id}`;

            return (
              <div
                key={
                  item.enquiryId ||
                  `${item.categorySlug || item.category}-${item.id || index}`
                }
                className="rounded-2xl border bg-white p-4 transition hover:shadow-md"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name || item.title}
                        className="h-24 w-24 rounded-xl object-cover"
                      />
                    )}

                    <div>
                      <p className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#ff3f6c]">
                        {item.status || "Interest Sent"}
                      </p>

                      <h3 className="mt-2 text-lg font-extrabold text-gray-900">
                        {item.name || item.title || item.itemName || "Enquiry"}
                      </h3>

                      <p className="mt-1 flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} />
                        {item.location || "Location not available"},{" "}
                        {item.city || ""}
                      </p>

                      <p className="mt-1 flex items-center gap-1 text-xs text-gray-400">
                        <Calendar size={13} />
                        Sent on{" "}
                        {item.enquiryAt || item.addedAt
                          ? new Date(
                              item.enquiryAt || item.addedAt
                            ).toLocaleDateString("en-IN")
                          : "N/A"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => onView(item)}
                      className="flex items-center gap-2 rounded-lg bg-[#0b1f4d] px-4 py-2 text-sm font-bold text-white hover:bg-[#132d68]"
                    >
                      <Eye size={15} />
                      Open
                    </button>

                    <button
                      onClick={() => onEdit(item)}
                      className="flex items-center gap-2 rounded-lg border border-blue-200 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50"
                    >
                      <Edit size={15} />
                      Modify
                    </button>

                    <button
                      onClick={() => onDelete(item)}
                      className="flex items-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>

                    <button
                      onClick={() => navigate(itemLink)}
                      className="flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold text-gray-700 hover:bg-gray-50"
                    >
                      <Building2 size={15} />
                      Listing
                    </button>
                  </div>
                </div>

                {item.message && (
                  <div className="mt-4 rounded-xl bg-gray-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
                      Message
                    </p>
                    <p className="mt-1 text-sm leading-6 text-gray-700">
                      {item.message}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ViewEnquiryModal({ enquiry, onClose, onEdit, onDelete, navigate }) {
  const itemLink =
    enquiry.link ||
    `/category/${enquiry.categorySlug || enquiry.category}/${enquiry.id}`;

  return (
    <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/50 px-4 py-8">
      <div className="mx-auto flex min-h-full max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl bg-white p-6 shadow-xl">
          <div className="mb-5 flex items-start justify-between gap-4">
            <div>
              <p className="inline-flex rounded-full bg-pink-50 px-3 py-1 text-xs font-bold text-[#ff3f6c]">
                {enquiry.status || "Interest Sent"}
              </p>

              <h2 className="mt-3 text-2xl font-extrabold text-gray-900">
                {enquiry.name || enquiry.title || enquiry.itemName || "Enquiry"}
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Your sent enquiry details
              </p>
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>

          {enquiry.image && (
            <img
              src={enquiry.image}
              alt={enquiry.name || enquiry.title}
              className="mb-5 h-56 w-full rounded-xl object-cover"
            />
          )}

          <div className="grid gap-4 md:grid-cols-2">
            <DetailBox
              icon={<User size={16} />}
              label="Student Name"
              value={enquiry.studentName || "Not added"}
            />
            <DetailBox
              icon={<Mail size={16} />}
              label="Email"
              value={enquiry.email || "Not added"}
            />
            <DetailBox
              icon={<Phone size={16} />}
              label="Phone"
              value={enquiry.phone || "Not added"}
            />
            <DetailBox
              icon={<MapPin size={16} />}
              label="Location"
              value={`${enquiry.location || "N/A"}, ${enquiry.city || "N/A"}`}
            />
            <DetailBox
              icon={<Building2 size={16} />}
              label="Category"
              value={enquiry.categoryTitle || enquiry.category || "N/A"}
            />
            <DetailBox
              icon={<Calendar size={16} />}
              label="Sent Date"
              value={
                enquiry.enquiryAt || enquiry.addedAt
                  ? new Date(
                      enquiry.enquiryAt || enquiry.addedAt
                    ).toLocaleString("en-IN")
                  : "N/A"
              }
            />
          </div>

          <div className="mt-5 rounded-xl bg-gray-50 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Message
            </p>
            <p className="mt-2 text-sm leading-6 text-gray-700">
              {enquiry.message || "No message added."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap justify-end gap-3">
            <button
              onClick={() => navigate(itemLink)}
              className="flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50"
            >
              <Building2 size={16} />
              View Listing
            </button>

            <button
              onClick={onEdit}
              className="flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-700"
            >
              <Edit size={16} />
              Modify
            </button>

            <button
              onClick={onDelete}
              className="flex items-center gap-2 rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white hover:bg-red-700"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailBox({ icon, label, value }) {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-2 text-gray-500">
        <span className="text-[#ff3f6c]">{icon}</span>
        <p className="text-xs font-bold uppercase tracking-wide">{label}</p>
      </div>

      <p className="mt-2 break-words text-sm font-bold text-gray-900">
        {value || "N/A"}
      </p>
    </div>
  );
}