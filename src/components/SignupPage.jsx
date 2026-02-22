import React, { useState } from "react";
function SinupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDeafult();
    if (!form.name || !form.password || !form.confirmPassword)
      setError("please fill in all fields.");
    return;
  };
  if (form.password !== form.confirmPassword) {
    setError("password do not match.");
    return;
  }
  setError("");
  alert("Account created successfully!");

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 to-blue-600 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-white drop-shadow-lg animate-slidein">
          Welcome to <span>Bus tracking App</span>
        </h1>
        <p className="text-white text-lg mt-2">
          Create your account and start tracking buses in real time !
        </p>
      </div>
      {/* sinup form */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-2xl font-bold text-xenter text-gray-800 mb-4">
          Sign Up
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Join our community and stay updated with live routes.
        </p>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Your Name"
            />
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus;ring-blue-400"
                placeholder="Enter your Emails"
              />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Password</label>
                <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:rinng-2 focus:ring-blue-400"
                placeholder="Confirm your passwords"
                />
            </div>
            <div>
                <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
            type="password"
            name="confirmpassword"
            value={form.confirmPassword}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Confirm your password"
            />
            </div>
             {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            <button type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                Create Accounts
            </button>
          </div>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
export default SinupPage;
