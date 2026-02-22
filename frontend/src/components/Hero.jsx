import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden w-full">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-rose-50 via-white to-white"></div>
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-rose-200/40 blur-3xl"></div>
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-fuchsia-200/25 blur-3xl"></div>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full bg-gradient-to-tr from-rose-200/30 via-white to-fuchsia-200/20 blur-3xl"></div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-10 sm:pb-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left */}
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
              REDBUS-STYLE UI + LIVE TRACKING
            </p>
            <h2 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-slate-900">
              Book tickets.
              <span className="text-rose-600"> Track buses live.</span>
              <br />
              Travel with confidence.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-600 font-medium max-w-2xl leading-relaxed">
              A clean, modern bus experience: search routes, book seats, and see real-time bus locations — built with MERN + Socket.io.
            </p>

            {/* Search Form */}
            <div className="mt-7 bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-5 p-4 sm:p-5 bg-gradient-to-r from-rose-50 to-fuchsia-50 rounded-2xl border border-white/60">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                  <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                    <span className="px-3 text-rose-600 text-2xl">🏙️</span>
                    <input
                      type="text"
                      placeholder="From City"
                      className="w-full p-3 border-none outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                    <span className="px-3 text-rose-600 text-2xl">🏙️</span>
                    <input
                      type="text"
                      placeholder="To City"
                      className="w-full p-3 border-none outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div className="flex items-center flex-1 bg-white border border-slate-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                    <span className="px-3 text-rose-600 text-2xl">📅</span>
                    <input
                      type="date"
                      className="w-full p-3 border-none outline-none bg-transparent text-slate-900"
                    />
                  </div>
                </div>

                <button className="bg-rose-600 hover:bg-rose-700 text-white px-8 py-3 rounded-xl font-semibold shadow-sm transition mt-2 md:mt-0">
                  Search Buses
                </button>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <Link
                  to="/book"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl shadow-sm transition font-semibold"
                >
                  Book Ticket
                </Link>
                <Link
                  to="/BusMapPreview"
                  className="bg-white hover:bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl shadow-sm transition border border-slate-200 font-semibold"
                >
                  Live Tracking
                </Link>
              </div>
            </div>

            <p className="mt-6 text-slate-700 text-base sm:text-lg font-semibold">
              Start your journey today — search, book, and track with ease.
            </p>
          </div>

          {/* Right illustration (no external image) */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="relative rounded-3xl border border-slate-100 bg-white shadow-sm overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-white to-fuchsia-50"></div>
              <div className="absolute -top-10 -right-10 h-56 w-56 rounded-full bg-rose-200/40 blur-3xl"></div>
              <div className="absolute -bottom-10 -left-10 h-56 w-56 rounded-full bg-fuchsia-200/30 blur-3xl"></div>

              <div className="relative p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-extrabold text-slate-900">Live Trip Preview</p>
                  <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                    REAL-TIME
                  </span>
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-500">From</p>
                      <p className="text-lg font-extrabold text-slate-900">Mumbai</p>
                    </div>
                    <div className="text-rose-600 font-extrabold">→</div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">To</p>
                      <p className="text-lg font-extrabold text-slate-900">Pune</p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-[11px] text-slate-500">ETA</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">2h 50m</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-[11px] text-slate-500">Seats</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">18 left</p>
                    </div>
                    <div className="rounded-xl border border-slate-200 p-3">
                      <p className="text-[11px] text-slate-500">Fare</p>
                      <p className="mt-1 text-sm font-bold text-slate-900">₹450</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <span>Bus GPS</span>
                      <span className="text-emerald-600 font-semibold">Connected</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full w-2/3 bg-gradient-to-r from-rose-500 to-fuchsia-500"></div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Support</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">24x7</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Secure</p>
                    <p className="mt-1 text-sm font-bold text-slate-900">Payments</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
