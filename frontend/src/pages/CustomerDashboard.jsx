import React from "react";
import { Link } from "react-router-dom";

function CustomerDashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-slate-100 rounded-3xl shadow-sm p-4 sm:p-5">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
                DASHBOARD
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Customer
              </h1>
              <p className="mt-1 text-slate-600 text-sm">
                Book tickets, track buses, and manage your trip.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/dashboard/admin"
                className="bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
              >
                Admin
              </Link>
              <Link
                to="/Login"
                className="bg-rose-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-rose-700 transition-colors shadow-sm"
              >
                Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/book"
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
              BOOK
            </p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">Book Ticket</h2>
            <p className="mt-2 text-sm text-slate-600">
              Search routes and continue to seat booking.
            </p>
          </Link>

          <Link
            to="/BusMapPreview"
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
              LIVE
            </p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">Live Tracking</h2>
            <p className="mt-2 text-sm text-slate-600">
              Track buses in real time on the map.
            </p>
          </Link>

          <Link
            to="/Login"
            className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm hover:shadow-md transition"
          >
            <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
              ACCOUNT
            </p>
            <h2 className="mt-4 text-xl font-extrabold text-slate-900">Login</h2>
            <p className="mt-2 text-sm text-slate-600">
              Sign in to see bookings and profile.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomerDashboard;
