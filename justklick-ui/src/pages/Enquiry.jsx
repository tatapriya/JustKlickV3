import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  MapPin,
  BookOpen,
  MessageSquare,
  Send,
  ArrowLeft,
  CheckCircle,
} from "lucide-react";

const categoryOptions = [
  "Colleges",
  "Software Training",
  "Overseas Education",
  "Hostels",
  "Competitive Exams",
  "Career Guidance",
];

export default function Enquiry() {
  const navigate = useNavigate();
  const location = useLocation();

  const enquiryState = location.state || {};

  const initialCategory = useMemo(() => {
    if (!enquiryState.category) return "";

    const value = enquiryState.category;

    const labels = {
      colleges: "Colleges",
      hostels: "Hostels",
      "software-training": "Software Training",
      "training-institutes": "Software Training",
      overseas: "Overseas Education",
      "overseas-education": "Overseas Education",
      exams: "Competitive Exams",
      more: "Career Guidance",
      "career-guidance": "Career Guidance",
    };

    return labels[value] || value;
  }, [enquiryState.category]);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    city: "",
    category: initialCategory,
    institutionName: enquiryState.itemName || "",
    message: enquiryState.itemName
      ? `I am interested in ${enquiryState.itemName}. Please contact me with more details.`
      : "",
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!formData.category.trim()) {
      newErrors.category = "Please select a category";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const enquiry = {
      id: Date.now(),
      ...formData,
      sourceCategory: enquiryState.category || "",
      sourceItemId: enquiryState.itemId || "",
      createdAt: new Date().toISOString(),
      status: "New",
    };

    const existingEnquiries =
      JSON.parse(localStorage.getItem("enquiries")) || [];

    localStorage.setItem(
      "enquiries",
      JSON.stringify([enquiry, ...existingEnquiries])
    );

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#f6f6f9] px-4 py-10">
        <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle size={36} className="text-green-600" />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-[#111827]">
            Enquiry Submitted Successfully
          </h1>

          <p className="mt-3 text-sm leading-6 text-gray-500">
            Thank you for your enquiry. Our team will contact you soon with the
            required details.
          </p>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/")}
              className="rounded-md bg-[#ef233c] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d90429]"
            >
              Go to Home
            </button>

            <button
              onClick={() => navigate(-1)}
              className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f6f9] px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 rounded-md bg-white px-3 py-2 text-xs font-semibold text-gray-600 shadow-sm hover:text-[#ef233c]"
        >
          <ArrowLeft size={14} />
          Back
        </button>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm lg:grid-cols-[0.9fr_1.1fr]">
          {/* Left Content */}
          <div className="bg-[#071f4d] p-8 text-white">
            <p className="text-sm font-semibold text-blue-200">
              Student Enquiry
            </p>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight">
              Get the right guidance for your education needs
            </h1>

            <p className="mt-4 text-sm leading-6 text-blue-100">
              Fill this enquiry form and connect with colleges, hostels,
              software training institutes, overseas consultants, or exam
              coaching centers.
            </p>

            <div className="mt-8 space-y-4">
              <InfoItem
                icon={<Phone size={18} />}
                title="Quick Callback"
                text="Our team will contact you with relevant details."
              />

              <InfoItem
                icon={<BookOpen size={18} />}
                title="Category Based Support"
                text="Choose the right category and get matching guidance."
              />

              <InfoItem
                icon={<MapPin size={18} />}
                title="AP & Telangana Focused"
                text="Find options from Andhra Pradesh and Telangana."
              />
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#111827]">
              Enquiry Form
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Please enter your details below.
            </p>

            {formData.institutionName && (
              <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <p className="text-xs font-semibold text-blue-700">
                  You are enquiring about
                </p>
                <p className="mt-1 text-sm font-bold text-[#071f4d]">
                  {formData.institutionName}
                </p>
              </div>
            )}

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InputField
                label="Full Name"
                icon={<User size={16} />}
                value={formData.fullName}
                error={errors.fullName}
                placeholder="Enter your full name"
                onChange={(e) => updateField("fullName", e.target.value)}
              />

              <InputField
                label="Mobile Number"
                icon={<Phone size={16} />}
                value={formData.phone}
                error={errors.phone}
                placeholder="Enter mobile number"
                maxLength={10}
                onChange={(e) =>
                  updateField("phone", e.target.value.replace(/\D/g, ""))
                }
              />

              <InputField
                label="Email Address"
                icon={<Mail size={16} />}
                value={formData.email}
                error={errors.email}
                placeholder="Enter email address"
                onChange={(e) => updateField("email", e.target.value)}
              />

              <InputField
                label="City"
                icon={<MapPin size={16} />}
                value={formData.city}
                error={errors.city}
                placeholder="Hyderabad / Vijayawada / Vizag"
                onChange={(e) => updateField("city", e.target.value)}
              />

              <div>
                <label className="mb-2 block text-xs font-bold text-gray-700">
                  Category
                </label>

                <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 focus-within:border-[#ef233c]">
                  <BookOpen size={16} className="text-gray-400" />
                  <select
                    value={formData.category}
                    onChange={(e) => updateField("category", e.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                  >
                    <option value="">Select Category</option>
                    {categoryOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>

                {errors.category && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.category}
                  </p>
                )}
              </div>

              <InputField
                label="Institution / Service Name"
                icon={<BookOpen size={16} />}
                value={formData.institutionName}
                placeholder="Optional"
                onChange={(e) =>
                  updateField("institutionName", e.target.value)
                }
              />
            </div>

            <div className="mt-4">
              <label className="mb-2 block text-xs font-bold text-gray-700">
                Message
              </label>

              <div className="flex gap-2 rounded-md border border-gray-200 px-3 py-2 focus-within:border-[#ef233c]">
                <MessageSquare
                  size={16}
                  className="mt-1 shrink-0 text-gray-400"
                />

                <textarea
                  value={formData.message}
                  onChange={(e) => updateField("message", e.target.value)}
                  placeholder="Tell us what you are looking for..."
                  rows={5}
                  className="w-full resize-none bg-transparent text-sm outline-none"
                />
              </div>

              {errors.message && (
                <p className="mt-1 text-xs text-red-500">{errors.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-[#ef233c] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#d90429]"
            >
              <Send size={16} />
              Submit Enquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function InputField({
  label,
  icon,
  value,
  error,
  placeholder,
  onChange,
  maxLength,
}) {
  return (
    <div>
      <label className="mb-2 block text-xs font-bold text-gray-700">
        {label}
      </label>

      <div className="flex items-center gap-2 rounded-md border border-gray-200 px-3 py-2 focus-within:border-[#ef233c]">
        <span className="text-gray-400">{icon}</span>

        <input
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function InfoItem({ icon, title, text }) {
  return (
    <div className="flex gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10">
        {icon}
      </div>

      <div>
        <h3 className="text-sm font-bold text-white">{title}</h3>
        <p className="mt-1 text-xs leading-5 text-blue-100">{text}</p>
      </div>
    </div>
  );
}