import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { clearAuthToken, getUserRole, isLoggedIn } from "../lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function Navbar() {
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [busCount, setBusCount] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
  const [role, setRole] = useState(getUserRole());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const navigate = useNavigate();

  useEffect(() => {
    const sync = () => {
      setRole(getUserRole());
      setLoggedIn(isLoggedIn());
    };
    window.addEventListener("storage", sync);
    window.addEventListener("auth_changed", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("auth_changed", sync);
    };
  }, []);

  const handleLogout = () => {
    clearAuthToken();
    setRole(getUserRole());
    setLoggedIn(isLoggedIn());
    navigate("/");
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/buses`)
      .then((res) => {
        setBusCount(res.data.length);
        const active = res.data.filter(
          (bus) =>
            !isNaN(parseFloat(bus.latitude)) &&
            !isNaN(parseFloat(bus.longitude))
        ).length;
        setActiveBuses(active);
      })
      .catch((err) => console.error("Error fetching bus stats:", err));
  }, []);

  return (
   <nav className="w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-slate-100 py-4 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-50">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1
          className="text-2xl font-extrabold text-rose-600 cursor-pointer tracking-tight"
          onClick={() => navigate("/")}
        >
          BusGo
        </h1>

        {/* Live Stats (hidden on very small screens) */}
        <div className="hidden sm:flex gap-3 text-sm">
          <div className="bg-rose-50 px-3 py-1 rounded-full flex items-center gap-2 border border-rose-100">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-slate-700">
              <strong className="text-rose-600">{activeBuses}</strong> Active
            </span>
          </div>
          <div className="bg-slate-50 px-3 py-1 rounded-full border border-slate-100">
            <span className="text-slate-700">
              <strong className="text-slate-900">{busCount}</strong> Total Buses
            </span>
          </div>
        </div>
      </div>

      {/* Hamburger Button (Mobile) */}
      <button
        className="sm:hidden text-slate-700 focus:outline-none rounded-md px-3 py-2 hover:bg-slate-100"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰
      </button>

      {/* Menu Links */}
      <ul
        className={`${
          showMobileMenu ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 sm:gap-6 text-slate-800 font-medium items-start sm:items-center absolute sm:static top-[64px] left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow-lg sm:shadow-none px-6 sm:px-0 py-4 sm:py-0 border-t border-slate-100 sm:border-none`}
      >
        <li>
          <Link to="/" className="hover:text-rose-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link to="/BusMapPreview" className="hover:text-rose-600 transition-colors">
            Live Tracking
          </Link>
        </li>
        {(!loggedIn || role !== "admin") && (
          <li>
            <Link to="/book" className="hover:text-rose-600 transition-colors">
              Book Ticket
            </Link>
          </li>
        )}
        <li>
          <Link to="/contact" className="hover:text-rose-600 transition-colors">
            Contact
          </Link>
        </li>

        {/* Dashboard Dropdown */}
        {loggedIn && (
          <li className="relative">
            <button
              onClick={() => setShowDashboardMenu(!showDashboardMenu)}
              className="hover:text-rose-600 transition-colors flex items-center gap-1"
            >
              Dashboard <span className="text-xs">▼</span>
            </button>
            {showDashboardMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-52 border border-gray-200 z-50">
                {role === "admin" ? (
                  <Link
                    to="/dashboard/admin"
                    className="block px-4 py-2 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    �️ Admin
                  </Link>
                ) : (
                  <Link
                    to="/dashboard/customer"
                    className="block px-4 py-2 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                  >
                    👤 Customer
                  </Link>
                )}

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                >
                  🚪 Logout
                </button>
              </div>
            )}
          </li>
        )}

        <li>
          {!loggedIn ? (
            <Link
              to="/Login"
              className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 transition-colors shadow-sm"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white text-slate-900 border border-slate-200 px-4 py-2 rounded-lg hover:bg-slate-50 transition-colors shadow-sm font-semibold"
            >
              Logout
            </button>
          )}
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
