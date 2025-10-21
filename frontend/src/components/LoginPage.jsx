import React, { useState } from "react";
import { Link } from "react-router-dom";


function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please fill in all fields.");
      return;
    }
    setError("");
    alert("Logging in...");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6 overflow-hidden whitespace-nowrap">
      <div className="text-center mb-15 ">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg animate-slideAcross inline-block">
          🚌 Welcome to{" "}
          <span className="text-yellow-300">Bus Tracking App</span>
        </h1>
        <p className="text-white text-1xl mt-4 mb-10 ">
          Track your buses easily and stay updated in real time!
        </p>
      </div>
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        {/* 🚌 App Header */}
        <h1 className="text-3xl font-extrabold text-center text-blue-600 mb-2">
          🚌 Bus Tracking App
        </h1>
        <div className="w-24 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>

        {/* 🧭 Page Title */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome Back
        </h2>
        <p className="text-center text-gray-800 mb-10">
          Log in to continue tracking your buses in real time.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
