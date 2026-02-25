import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function Navbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [busCount, setBusCount] = useState(0);
  const [activeBuses, setActiveBuses] = useState(0);
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
        <li>
          <Link to="/book" className={linkClass("/book")}> 
            Book Ticket
          </Link>
        </li>
        <li>
          <Link to="/my-bookings" className={linkClass("/my-bookings")}>
            My Bookings
          </Link>
        </li>
        <li>
          <Link to="/admin/all-bookings" className={linkClass("/admin/all-bookings")}>
            All Bookings
          </Link>
        </li>
        <li>
          <Link to="/AddBusForm" className={linkClass("/AddBusForm")}>
            Add Bus
          </Link>
        </li>
        <li>
          <a href="/#offers" className="px-3 py-2 rounded-xl transition-colors text-white/90 hover:text-white hover:bg-white/10">Offers</a>
        </li>
        <li>
          <Link to="/contact" className={linkClass("/contact")}> 
            Help
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
