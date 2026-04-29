import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    password: "",
  });

  const handleRegister = (e) => {
    e.preventDefault();

    localStorage.setItem("isLoggedIn", "true");
    localStorage.setItem(
      "profile",
      JSON.stringify({
        name: form.name,
        email: form.email,
        phone: form.phone,
        city: form.city,
      })
    );

    alert("Registration successful");
    navigate("/profile");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10">
      <form
        onSubmit={handleRegister}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-extrabold text-[#0b1f4d]">Register</h1>
        <p className="mt-2 text-gray-600">
          Create your student account.
        </p>

        <input
          required
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-6 w-full rounded-xl border px-4 py-3 outline-none"
        />

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
        />

        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
        />

        <input
          required
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="mt-4 w-full rounded-xl border px-4 py-3 outline-none"
        />

        <button className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white">
          Register
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-blue-600">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}