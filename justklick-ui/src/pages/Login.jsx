import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleLogin = (e) => {
    e.preventDefault();

    localStorage.setItem("isLoggedIn", "true");

    const savedProfile = JSON.parse(localStorage.getItem("profile")) || {
      name: "Student User",
      email: form.email,
      phone: "",
      city: "",
    };

    localStorage.setItem(
      "profile",
      JSON.stringify({ ...savedProfile, email: form.email })
    );

    alert("Login successful");
    navigate("/profile");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4 py-10">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md rounded-3xl bg-white p-8 shadow"
      >
        <h1 className="text-3xl font-extrabold text-[#0b1f4d]">Login</h1>
        <p className="mt-2 text-gray-600">
          Login to save, share and download details.
        </p>

        <input
          type="email"
          required
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="mt-6 w-full rounded-xl border px-4 py-3 outline-none"
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
          Login
        </button>

        <p className="mt-5 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link to="/register" className="font-semibold text-blue-600">
            Register
          </Link>
        </p>
      </form>
    </main>
  );
}