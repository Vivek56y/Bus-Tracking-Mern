import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { clearAuthToken, getUserRole, isLoggedIn } from "../lib/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function Navbar() {
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [busCount, setBusCount] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
  const [role, setRole] = useState(getUserRole());
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (to) => {
    const a = (location.pathname || "").toLowerCase();
    const b = (to || "").toLowerCase();
    return a === b;
  };

  const linkClass = (to) => {
    const active = isActive(to);
    return `px-3 py-2 rounded-xl transition-colors ${
      active ? "bg-white/15 text-white" : "text-white/90 hover:text-white hover:bg-white/10"
    }`;
  };

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
   <nav className="w-full bg-rose-600 border-b border-rose-700 py-3.5 px-4 sm:px-6 flex justify-between items-center sticky top-0 z-50">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1
          className="text-2xl font-extrabold text-white cursor-pointer tracking-tight"
          onClick={() => navigate("/")}
        >
          BusGo
        </h1>

        {/* Live Stats (hidden on very small screens) */}
        <div className="hidden sm:flex gap-3 text-sm">
          <div className="bg-white/10 px-3 py-1 rounded-full flex items-center gap-2 border border-white/15">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-white/90">
              <strong className="text-white">{activeBuses}</strong> Live
            </span>
          </div>
          <div className="bg-white/10 px-3 py-1 rounded-full border border-white/15">
            <span className="text-white/90">
              <strong className="text-white">{busCount}</strong> Buses
            </span>
          </div>
        </div>
      </div>

      {/* Hamburger Button (Mobile) */}
      <button
        className="sm:hidden text-white focus:outline-none rounded-md px-3 py-2 hover:bg-white/10"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰
      </button>

      {/* Menu Links */}
      <ul
        className={`${
          showMobileMenu ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-2 sm:gap-2 text-white font-semibold items-start sm:items-center absolute sm:static top-[56px] left-0 w-full sm:w-auto bg-rose-600 sm:bg-transparent shadow-lg sm:shadow-none px-6 sm:px-0 py-4 sm:py-0 border-t border-rose-700 sm:border-none`}
      >
        <li>
          <Link to="/" className={linkClass("/")}> 
            Home
          </Link>
        </li>
        <li>
          <Link to="/BusMapPreview" className={linkClass("/BusMapPreview")}> 
            Live Tracking
          </Link>
        </li>
        {(!loggedIn || role !== "admin") && (
          <li>
            <Link to="/book" className={linkClass("/book")}> 
              Book Ticket
            </Link>
          </li>
        )}
        <li>
          <a href="/#offers" className="px-3 py-2 rounded-xl transition-colors text-white/90 hover:text-white hover:bg-white/10">Offers</a>
        </li>
        <li>
          <Link to="/contact" className={linkClass("/contact")}> 
            Help
          </Link>
        </li>

        {/* Dashboard Dropdown */}
        {loggedIn && (
          <li className="relative">
            <button
              onClick={() => setShowDashboardMenu(!showDashboardMenu)}
              className="px-3 py-2 rounded-xl transition-colors flex items-center gap-1 text-white/90 hover:text-white hover:bg-white/10"
            >
              Dashboard <span className="text-xs">▼</span>
            </button>
            {showDashboardMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-52 border border-gray-200 z-50 text-slate-900">
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
              className="bg-white text-rose-700 px-4 py-2 rounded-xl hover:bg-rose-50 transition-colors shadow-sm font-extrabold"
            >
              Login
            </Link>
          ) : (
            <button
              type="button"
              onClick={handleLogout}
              className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded-xl hover:bg-white/15 transition-colors shadow-sm font-extrabold"
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
