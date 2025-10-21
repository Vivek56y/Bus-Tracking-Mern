import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Navbar() {
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [busCount, setBusCount] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/buses")
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
   <nav className="w-full bg-white shadow-md py-6 px-5 flex justify-between items-center sticky top-0 z-0">

      {/* Left Section */}
      <div className="flex items-center gap-4">
        <h1
          className="text-2xl font-bold text-blue-600 cursor-pointer"
          onClick={() => navigate("/")}
        >
          🚌 BusGo
        </h1>

        {/* Live Stats (hidden on very small screens) */}
        <div className="hidden sm:flex gap-3 text-sm">
          <div className="bg-blue-50 px-3 py-1 rounded-full flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="text-gray-700">
              <strong className="text-blue-600">{activeBuses}</strong> Active
            </span>
          </div>
          <div className="bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-gray-700">
              <strong className="text-gray-800">{busCount}</strong> Total Buses
            </span>
          </div>
        </div>
      </div>

      {/* Hamburger Button (Mobile) */}
      <button
        className="sm:hidden text-gray-700 focus:outline-none"
        onClick={() => setShowMobileMenu(!showMobileMenu)}
      >
        ☰
      </button>

      {/* Menu Links */}
      <ul
        className={`${
          showMobileMenu ? "flex" : "hidden"
        } sm:flex flex-col sm:flex-row gap-4 sm:gap-6 text-gray-700 font-medium items-start sm:items-center absolute sm:static top-16 left-0 w-full sm:w-auto bg-white sm:bg-transparent shadow sm:shadow-none px-6 sm:px-0 py-4 sm:py-0 border-t sm:border-none`}
      >
        <li>
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Home
          </Link>
        </li>
        <li>
          <Link to="/live-tracking" className="hover:text-blue-600 transition-colors">
            Live Tracking
          </Link>
        </li>
        <li>
          <Link to="/book-ticket" className="hover:text-blue-600 transition-colors">
            Book Ticket
          </Link>
        </li>
        <li>
          <Link to="/contact" className="hover:text-blue-600 transition-colors">
            Contact
          </Link>
        </li>

        {/* Dashboard Dropdown */}
        <li className="relative">
          <button
            onClick={() => setShowDashboardMenu(!showDashboardMenu)}
            className="hover:text-blue-600 transition-colors flex items-center gap-1"
          >
            Dashboard <span className="text-xs">▼</span>
          </button>
          {showDashboardMenu && (
            <div className="absolute top-full left-0 mt-2 bg-white shadow-lg rounded-lg py-2 w-48 border border-gray-200 z-50">
              <Link
                to="/BusList"
                className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                📊 View All Buses
              </Link>
              <div className="border-t border-gray-200 my-1"></div>
              <Link
                to="/dashboard"
                className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                ✏️ Manage Buses
              </Link>
              <Link
                to="/AddBusForm"
                className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                ➕ Add New Bus
              </Link>
              <Link
                to="/BusMapPreview"
                className="block px-4 py-2 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                🗺️ View Map
              </Link>
            </div>
          )}
        </li>

        <li>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
