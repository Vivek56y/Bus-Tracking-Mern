import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setAuthToken, setAuthUser } from "../lib/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [signupStep, setSignupStep] = useState("form");
  const [loginAs, setLoginAs] = useState("client");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    adminKey: "",
    otp: "",
  });
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      if (!form.email) return setError("Email is required.");
      if (!form.password) return setError("Password is required.");

      try {
        const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
          email: form.email,
          password: form.password,
        });

        const role = res.data?.user?.role;
        if (loginAs === "admin" && role !== "admin") {
          return setError("Please login using a valid Admin account.");
        }
        if (loginAs === "client" && role !== "client") {
          return setError("Please login using a valid Customer account.");
        }

        if (res.data?.token) setAuthToken(res.data.token);
        if (res.data?.user) setAuthUser(res.data.user);

        if (role === "admin") navigate("/dashboard/admin");
        else navigate("/dashboard/customer");
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Login failed.");
      }
      return;
    }

    // SIGNUP
    if (signupStep === "otp") {
      if (!form.email) return setError("Email is required.");
      if (!form.otp) return setError("OTP is required.");

      try {
        setVerifyingOtp(true);
        const res = await axios.post(`${API_BASE_URL}/api/auth/verify-otp`, {
          email: form.email,
          otp: form.otp,
        });
        setVerifyingOtp(false);

        if (res.data?.token) setAuthToken(res.data.token);
        if (res.data?.user) setAuthUser(res.data.user);

        const role = res.data?.user?.role;
        if (role === "admin") navigate("/dashboard/admin");
        else navigate("/dashboard/customer");
      } catch (err) {
        console.error(err);
        setVerifyingOtp(false);
        setError(err.response?.data?.message || "OTP verification failed.");
      }
      return;
    }

    if (!form.name) return setError("Full name is required.");
    if (!form.email) return setError("Email is required.");
    if (!form.password) return setError("Password is required.");
    if (!form.confirmPassword) return setError("Confirm password is required.");
    if (form.password !== form.confirmPassword) return setError("Passwords do not match.");

    try {
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
      };
      if (loginAs === "admin") {
        payload.role = "admin";
        payload.adminKey = form.adminKey;
      }

      await axios.post(`${API_BASE_URL}/api/auth/signup`, payload);
      setSignupStep("otp");
      alert("Account created. OTP sent to your email.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed.");
    }
  };

  const handleResendOtp = async () => {
    setError("");
    if (!form.email) return setError("Email is required.");
    try {
      setSendingOtp(true);
      await axios.post(`${API_BASE_URL}/api/auth/send-otp`, { email: form.email, role: loginAs });
      alert("OTP sent to your email.");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-50 via-white to-white p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          BusGo
        </h1>
        <p className="text-slate-600 text-lg mt-2">
          {isLogin ? "Login with password" : "Signup with OTP verification"}
        </p>
      </div>

      <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-sm border border-slate-100 w-full max-w-md">
        <h2 className="text-2xl font-extrabold text-center text-slate-900 mb-4">
          {isLogin ? "Login" : signupStep === "otp" ? "Verify OTP" : "Create Account"}
        </h2>

        <div className="mb-5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setLoginAs("client")}
            className={`px-4 py-2.5 rounded-xl font-semibold border transition-colors ${
              loginAs === "client"
                ? "bg-rose-600 text-white border-rose-600"
                : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Customer
          </button>
          <button
            type="button"
            onClick={() => setLoginAs("admin")}
            className={`px-4 py-2.5 rounded-xl font-semibold border transition-colors ${
              loginAs === "admin"
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Admin
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          {!isLogin && signupStep === "form" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Enter your name"
              />
            </div>
          )}

          {!isLogin && signupStep === "form" && loginAs === "admin" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Admin Key</label>
              <input
                type="password"
                name="adminKey"
                value={form.adminKey}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Enter admin signup key"
              />
            </div>
          )}

          <div>
            <label className="block text-gray-700 font-medium mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
              placeholder="Enter your email"
            />
          </div>

          {(isLogin || (!isLogin && signupStep === "form")) && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Enter your password"
              />
            </div>
          )}

          {!isLogin && signupStep === "form" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Confirm your password"
              />
            </div>
          )}

          {!isLogin && signupStep === "otp" && (
            <div>
              <label className="block text-gray-700 font-medium mb-2">OTP</label>
              <input
                type="text"
                name="otp"
                value={form.otp}
                onChange={handleChange}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-rose-300"
                placeholder="Enter 6-digit OTP"
              />
            </div>
          )}

          {error && <p className="text-red-500 text-center text-sm">{error}</p>}

          <button
            type="submit"
            disabled={sendingOtp || verifyingOtp}
            className="w-full bg-rose-600 text-white py-2.5 rounded-xl font-semibold hover:bg-rose-700 transition duration-300 shadow-sm disabled:opacity-60"
          >
            {isLogin
              ? "Login"
              : signupStep === "otp"
                ? verifyingOtp
                  ? "Verifying..."
                  : "Verify OTP"
                : "Create Account"}
          </button>
        </form>

        {!isLogin && signupStep === "otp" && (
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={sendingOtp}
            className="mt-4 w-full bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors disabled:opacity-60"
          >
            {sendingOtp ? "Sending OTP..." : "Resend OTP"}
          </button>
        )}

        <p className="text-center text-slate-600 mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setSignupStep("form");
              setError("");
              setForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
                adminKey: "",
                otp: "",
              });
            }}
            className="text-rose-700 font-semibold hover:underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default AuthPage;
