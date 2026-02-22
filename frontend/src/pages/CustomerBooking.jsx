import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

function CustomerBooking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [busType, setBusType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(700);
  const [departure, setDeparture] = useState("any");

  const popularRoutes = useMemo(
    () => [
      { id: "r1", from: "Mumbai", to: "Pune", time: "3h 15m", price: 450, type: "AC", dep: "Morning" },
      { id: "r2", from: "Delhi", to: "Jaipur", time: "4h 40m", price: 520, type: "Non-AC", dep: "Afternoon" },
      { id: "r3", from: "Bengaluru", to: "Mysuru", time: "3h 00m", price: 399, type: "AC", dep: "Evening" },
      { id: "r4", from: "Hyderabad", to: "Vijayawada", time: "5h 20m", price: 610, type: "AC", dep: "Night" },
      { id: "r5", from: "Ahmedabad", to: "Surat", time: "4h 10m", price: 499, type: "Non-AC", dep: "Morning" },
      { id: "r6", from: "Chennai", to: "Pondicherry", time: "3h 30m", price: 420, type: "Non-AC", dep: "Afternoon" },
    ],
    []
  );

  const onPickRoute = (r) => {
    setFrom(r.from);
    setTo(r.to);
  };

  const filteredRoutes = useMemo(() => {
    let list = popularRoutes;

    const f = from.trim().toLowerCase();
    const t = to.trim().toLowerCase();
    if (f) list = list.filter((r) => r.from.toLowerCase().includes(f));
    if (t) list = list.filter((r) => r.to.toLowerCase().includes(t));

    if (busType !== "all") list = list.filter((r) => r.type === busType);
    if (departure !== "any") list = list.filter((r) => r.dep === departure);

    list = list.filter((r) => r.price <= maxPrice);
    return list;
  }, [popularRoutes, from, to, busType, maxPrice, departure]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* AbhiBus-like search bar */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white px-6 sm:px-8 py-6">
            <p className="text-sm font-semibold tracking-wide text-white/90">CUSTOMER BOOKING</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Search buses and book tickets
            </h1>
            <p className="mt-1 text-white/90 text-sm">
              AbhiBus-style UI — filters + clean result cards.
            </p>
          </div>

          <div className="px-4 sm:px-6 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
              <div className="lg:col-span-4 flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                <span className="px-3 text-rose-600 text-2xl">🏙️</span>
                <input
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  type="text"
                  placeholder="Leaving From"
                  className="w-full p-3 border-none outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="lg:col-span-4 flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                <span className="px-3 text-rose-600 text-2xl">📍</span>
                <input
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  type="text"
                  placeholder="Going To"
                  className="w-full p-3 border-none outline-none bg-transparent text-slate-900 placeholder:text-slate-400"
                />
              </div>
              <div className="lg:col-span-2 flex items-center bg-white border border-slate-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-rose-300 transition">
                <span className="px-3 text-rose-600 text-2xl">📅</span>
                <input
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  type="date"
                  className="w-full p-3 border-none outline-none bg-transparent text-slate-900"
                />
              </div>
              <div className="lg:col-span-2">
                <button className="w-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-sm transition">
                  Search
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                to="/BusMapPreview"
                className="bg-white hover:bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl shadow-sm transition border border-slate-200 font-semibold"
              >
                Live Tracking
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Filters */}
          <aside className="lg:col-span-3">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-slate-900">Filters</h2>
                <button
                  type="button"
                  onClick={() => {
                    setBusType("all");
                    setMaxPrice(700);
                    setDeparture("any");
                  }}
                  className="text-sm font-semibold text-rose-700 hover:underline"
                >
                  Clear
                </button>
              </div>

              <div className="mt-5 grid gap-5">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Bus Type</p>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {["all", "AC", "Non-AC"].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setBusType(t)}
                        className={`px-3 py-2.5 rounded-xl border font-semibold text-sm transition-colors ${
                          busType === t
                            ? "bg-rose-600 text-white border-rose-600"
                            : "bg-white text-slate-900 border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        {t === "all" ? "All" : t}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Price (max)</p>
                  <div className="mt-3">
                    <input
                      type="range"
                      min={200}
                      max={800}
                      step={10}
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(parseInt(e.target.value, 10))}
                      className="w-full"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600">
                      <span>₹200</span>
                      <span className="font-semibold text-slate-900">₹{maxPrice}</span>
                      <span>₹800</span>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">Departure</p>
                  <select
                    value={departure}
                    onChange={(e) => setDeparture(e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                  >
                    <option value="any">Any time</option>
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <p className="text-sm font-extrabold text-slate-900">Popular routes</p>
              <p className="mt-1 text-sm text-slate-600">Tap to autofill.</p>

              <div className="mt-4 grid gap-2">
                {popularRoutes.slice(0, 4).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => onPickRoute(r)}
                    className="text-left rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors p-4"
                  >
                    <p className="font-bold text-slate-900">
                      {r.from} <span className="text-rose-600">→</span> {r.to}
                    </p>
                    <p className="mt-1 text-xs text-slate-600">{r.time} • {r.type} • {r.dep}</p>
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Results */}
          <section className="lg:col-span-9">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                    Bus Results
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {filteredRoutes.length} options found
                  </p>
                </div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  RESULTS
                </span>
              </div>

              <div className="mt-5 grid gap-4">
                {filteredRoutes.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    No buses match your filters.
                  </div>
                ) : (
                  filteredRoutes.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div>
                          <p className="text-lg font-extrabold text-slate-900">
                            {r.from} <span className="text-rose-600">→</span> {r.to}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            {r.type} • {r.dep} • Duration: <span className="font-semibold text-slate-900">{r.time}</span>
                          </p>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-rose-50 text-rose-700 border border-rose-100">
                              Free cancellation
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                              Live tracking
                            </span>
                            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-100">
                              Instant confirmation
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-slate-900">₹{r.price}</p>
                          <p className="text-xs text-slate-500">Onwards</p>
                          <div className="mt-3 flex justify-end">
                            <button className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition">
                              View Seats
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">Seat booking (next step)</p>
                <p className="mt-1 text-sm text-slate-600">
                  This page is UI-first like AbhiBus. Next we can build a real seat layout and booking API.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default CustomerBooking;
