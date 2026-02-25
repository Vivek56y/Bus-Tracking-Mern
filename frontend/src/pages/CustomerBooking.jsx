import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function CustomerBooking() {
  const navigate = useNavigate();
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [appliedFrom, setAppliedFrom] = useState("");
  const [appliedTo, setAppliedTo] = useState("");
  const [appliedDate, setAppliedDate] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [buses, setBuses] = useState([]);
  const [filteredBuses, setFilteredBuses] = useState([]);
  const [busType, setBusType] = useState("all");
  const [maxPrice, setMaxPrice] = useState(700);
  const [departure, setDeparture] = useState("any");
  const [sortBy, setSortBy] = useState("recommended");

  const [seatModalOpen, setSeatModalOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(null);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [seatError, setSeatError] = useState("");
  const [seatLoading, setSeatLoading] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");

  const popularRoutes = useMemo(
    () => [
      { id: "r1", from: "Mumbai", to: "Pune", time: "3h 15m", price: 450, type: "AC", dep: "Morning" },
      { id: "r2", from: "Delhi", to: "Jaipur", time: "4h 40m", price: 520, type: "Non-AC", dep: "Afternoon" },
      { id: "r3", from: "Bengaluru", to: "Mysuru", time: "3h 00m", price: 399, type: "AC", dep: "Evening" },
      { id: "r4", from: "Hyderabad", to: "Vijayawada", time: "5h 20m", price: 610, type: "AC", dep: "Night" },
      { id: "r5", from: "Ahmedabad", to: "Surat", time: "4h 10m", price: 499, type: "Non-AC", dep: "Morning" },
      { id: "r6", from: "Chennai", to: "Pondicherry", time: "3h 30m", price: 420, type: "Non-AC", dep: "Afternoon" },
      { id: "r7", from: "Kolkata", to: "Durgapur", time: "3h 20m", price: 380, type: "Non-AC", dep: "Morning" },
      { id: "r8", from: "Lucknow", to: "Varanasi", time: "5h 10m", price: 540, type: "AC", dep: "Night" },
      { id: "r9", from: "Jaipur", to: "Udaipur", time: "6h 00m", price: 650, type: "AC", dep: "Afternoon" },
      { id: "r10", from: "Indore", to: "Bhopal", time: "3h 05m", price: 360, type: "Non-AC", dep: "Evening" },
      { id: "r11", from: "Chandigarh", to: "Manali", time: "8h 30m", price: 720, type: "AC", dep: "Night" },
      { id: "r12", from: "Kochi", to: "Thiruvananthapuram", time: "5h 35m", price: 560, type: "Non-AC", dep: "Morning" },
      { id: "r13", from: "Bhubaneswar", to: "Puri", time: "2h 05m", price: 220, type: "Non-AC", dep: "Afternoon" },
      { id: "r14", from: "Guwahati", to: "Shillong", time: "3h 10m", price: 340, type: "Non-AC", dep: "Morning" },
      { id: "r15", from: "Nagpur", to: "Amravati", time: "3h 00m", price: 310, type: "Non-AC", dep: "Evening" },
      { id: "r16", from: "Patna", to: "Gaya", time: "2h 35m", price: 260, type: "Non-AC", dep: "Afternoon" },
    ],
    []
  );

  const onPickRoute = (r) => {
    setFrom(r.from);
    setTo(r.to);
  };

  const seatGrid = useMemo(() => {
    // 40 seats: A1-A10, B1-B10, C1-C10, D1-D10
    const rows = ["A", "B", "C", "D"];
    const cols = Array.from({ length: 10 }, (_, i) => i + 1);
    return rows.flatMap((row) => cols.map((c) => `${row}${c}`));
  }, []);

  const normalizeSeat = (s) => String(s || "").trim().toUpperCase();

  const closeSeatModal = () => {
    setSeatModalOpen(false);
    setActiveRoute(null);
    setBookedSeats([]);
    setSelectedSeats([]);
    setSeatError("");
    setSeatLoading(false);
    setBookingLoading(false);
    setBookingSuccess("");
    setAuthPromptOpen(false);
  };

  const openSeatModal = async (route) => {
    setSeatError("");
    setBookingSuccess("");
    setAuthPromptOpen(false);

    if (!date) {
      setSeatError("Please select a travel date first.");
      return;
    }

    setActiveRoute(route);
    setSelectedSeats([]);
    setSeatModalOpen(true);
    setSeatLoading(true);

    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/seats`, {
        params: { routeId: route.id, travelDate: date },
      });
      setBookedSeats((res.data?.bookedSeats || []).map(normalizeSeat));
    } catch (err) {
      setSeatError("Failed to load seat availability. Please try again.");
      setBookedSeats([]);
    } finally {
      setSeatLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    const s = normalizeSeat(seat);
    if (!s) return;
    if (bookedSeats.includes(s)) return;

    setSelectedSeats((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      if (prev.length >= 6) return prev; // simple cap
      return [...prev, s];
    });
  };

  const totalAmount = useMemo(() => {
    const base = activeRoute?.price || 0;
    return base * selectedSeats.length;
  }, [activeRoute, selectedSeats.length]);

  const onConfirmBooking = async () => {
    setSeatError("");
    setBookingSuccess("");
    setAuthPromptOpen(false);

    if (!activeRoute) {
      setSeatError("Please select a bus first.");
      return;
    }
    if (!date) {
      setSeatError("Please select a travel date.");
      return;
    }
    if (selectedSeats.length === 0) {
      setSeatError("Please select at least one seat.");
      return;
    }
    if (!isLoggedIn()) {
      setAuthPromptOpen(true);
      return;
    }

    setBookingLoading(true);
    try {
      const payload = {
        routeId: activeRoute.id,
        from: activeRoute.from,
        to: activeRoute.to,
        travelDate: date,
        seats: selectedSeats,
        amount: totalAmount,
      };

      const res = await axios.post(`${API_BASE_URL}/api/bookings`, payload);

      const confirmed = res.data?.booking;
      setBookingSuccess(
        confirmed
          ? `Booking confirmed. Seats: ${(confirmed.seats || []).join(", ")}`
          : "Booking confirmed."
      );

      // lock selected seats in UI
      setBookedSeats((prev) => Array.from(new Set([...prev, ...selectedSeats])));
      setSelectedSeats([]);
    } catch (err) {
      const status = err?.response?.status;
      if (status === 409) {
        const taken = err?.response?.data?.takenSeats;
        setSeatError(
          taken?.length
            ? `Seats already booked: ${taken.join(", ")}. Please pick different seats.`
            : "Some selected seats are already booked. Please try again."
        );
        if (taken?.length) {
          setBookedSeats((prev) => Array.from(new Set([...prev, ...taken.map(normalizeSeat)])));
          setSelectedSeats((prev) => prev.filter((s) => !taken.map(normalizeSeat).includes(s)));
        }
      } else {
        setSeatError("Booking failed. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  const onSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill in From, To, and Date");
      return;
    }
    setLoading(true);
    setAppliedFrom(from);
    setAppliedTo(to);
    setAppliedDate(date);
    setHasSearched(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/buses`);
      setBuses(res.data);
    } catch (err) {
      console.error("Failed to fetch buses:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredBusesData = useMemo(() => {
    let list = buses;

    // Filter by route text if search applied
    const f = (hasSearched ? appliedFrom : "").trim().toLowerCase();
    const t = (hasSearched ? appliedTo : "").trim().toLowerCase();
    if (f) list = list.filter((bus) => bus.route.toLowerCase().includes(f));
    if (t) list = list.filter((bus) => bus.route.toLowerCase().includes(t));

    // No busType filtering for real buses since they don't have type field
    // if (busType !== "all") list = list.filter((bus) => bus.type === busType);

    if (sortBy === "recommended") return list; // Keep original order
    return list;
  }, [buses, appliedFrom, appliedTo, hasSearched, busType, sortBy]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="mb-6 rounded-3xl overflow-hidden border border-rose-100 bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white">
          <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-wider text-white/90">BUSGO OFFERS</p>
              <h2 className="mt-1 text-xl sm:text-2xl font-extrabold">Up to 20% OFF on selected routes</h2>
              <p className="text-white/90 text-sm mt-1">
                Use code <span className="font-extrabold">BUSGO20</span> • Limited time
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
                <p className="text-xs text-white/80">Popular</p>
                <p className="font-extrabold">Delhi → Jaipur</p>
              </div>
              <div className="bg-white/10 border border-white/15 rounded-2xl px-4 py-3">
                <p className="text-xs text-white/80">Fastest</p>
                <p className="font-extrabold">Mumbai → Pune</p>
              </div>
            </div>
          </div>
        </div>

        {/* AbhiBus-like search bar */}
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white px-6 sm:px-8 py-6">
            <p className="text-sm font-semibold tracking-wide text-white/90">CUSTOMER BOOKING</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">
              Search buses and book tickets
            </h1>
            <p className="mt-1 text-white/90 text-sm">
              Compare routes, choose your bus, and book in minutes.
            </p>
          </div>

          <div className="px-4 sm:px-6 py-5">
            <form onSubmit={onSearch} className="grid grid-cols-1 lg:grid-cols-12 gap-4">
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
                <button
                  type="submit"
                  className="w-full h-full bg-rose-600 hover:bg-rose-700 text-white px-5 py-3 rounded-2xl font-semibold shadow-sm transition"
                >
                  Search
                </button>
              </div>
            </form>

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
                    {filteredBusesData.length} buses found
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                    RESULTS
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="text-sm border border-slate-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-rose-300"
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 grid gap-4">
                {loading && (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
                  </div>
                )}

                {!loading && filteredBusesData.length === 0 ? (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                    {hasSearched && (appliedFrom.trim() || appliedTo.trim()) ? (
                      <div>
                        <p className="font-bold text-slate-900">No buses found for this route.</p>
                        <p className="mt-1 text-sm text-slate-700">
                          {appliedFrom.trim() ? appliedFrom.trim() : "From"} <span className="text-rose-600">→</span>{" "}
                          {appliedTo.trim() ? appliedTo.trim() : "To"}
                          {appliedDate ? <span className="text-slate-500"> • {appliedDate}</span> : null}
                        </p>
                        <p className="mt-2 text-sm text-slate-600">
                          Try a different spelling or choose one of the popular routes.
                        </p>
                      </div>
                    ) : (
                      "No buses match your filters."
                    )}
                  </div>
                ) : (
                  filteredBusesData.map((bus) => (
                    <div
                      key={bus._id}
                      className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm hover:shadow-md transition"
                    >
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <div className="h-16 w-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50 flex-shrink-0">
                            <img
                              src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=400&q=80"
                              alt="Bus"
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                          </div>
                        <div>
                          <p className="text-lg font-extrabold text-slate-900">
                            {bus.busNumber} • {bus.route}
                          </p>
                          <p className="mt-1 text-sm text-slate-600">
                            Driver: {bus.driverName} • Available Now
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                              4.5 ★
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                              WiFi
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                              Charging
                            </span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-50 text-slate-700 border border-slate-200">
                              Water bottle
                            </span>
                          </div>

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

                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-extrabold text-slate-900">₹450</p>
                          <p className="text-xs text-slate-500">Onwards</p>
                          <div className="mt-3 flex justify-end">
                            <button
                              type="button"
                              onClick={() => openSeatModal(bus)}
                              className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition"
                            >
                              View Seats
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex items-center justify-between gap-3 flex-wrap">
                        <p className="text-sm text-slate-700">
                          Coupon: <span className="font-extrabold text-slate-900">BUSGO20</span> • Save up to <span className="font-extrabold">₹150</span>
                        </p>
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                          Limited seats
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-6 rounded-2xl border border-rose-100 bg-rose-50/60 p-4">
                <p className="text-sm font-semibold text-slate-900">Need help with your booking?</p>
                <p className="mt-1 text-sm text-slate-600">
                  For cancellations, refunds, or trip updates, visit the Help page.
                </p>
                <div className="mt-3">
                  <Link
                    to="/contact"
                    className="inline-flex bg-white text-slate-900 border border-slate-200 px-4 py-2.5 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {seatModalOpen ? (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeSeatModal}
            role="button"
            tabIndex={-1}
          />

          <div className="absolute inset-x-0 bottom-0 sm:inset-0 sm:flex sm:items-center sm:justify-center p-3 sm:p-6">
            <div className="w-full sm:max-w-3xl bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
              <div className="px-5 sm:px-6 py-4 bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-white/90">SEAT SELECTION</p>
                  <p className="mt-1 font-extrabold text-lg">
                    {activeRoute?.from} <span className="text-white/90">→</span> {activeRoute?.to}
                  </p>
                  <p className="text-sm text-white/90">Travel date: {date || "-"}</p>
                </div>
                <button
                  type="button"
                  onClick={closeSeatModal}
                  className="bg-white/15 hover:bg-white/20 border border-white/20 text-white px-3 py-2 rounded-xl font-semibold"
                >
                  Close
                </button>
              </div>

              <div className="p-5 sm:p-6">
                {seatError ? <p className="text-rose-600 text-sm font-semibold">{seatError}</p> : null}
                {bookingSuccess ? (
                  <p className="mt-2 text-emerald-700 text-sm font-semibold">{bookingSuccess}</p>
                ) : null}

                <div className="mt-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-extrabold text-slate-900">Choose seats</p>
                      <div className="text-xs text-slate-600 flex items-center gap-3">
                        <span className="inline-flex items-center gap-1">
                          <span className="h-3 w-3 rounded bg-slate-200 inline-block" /> Booked
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <span className="h-3 w-3 rounded bg-rose-600 inline-block" /> Selected
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      {seatLoading ? (
                        <p className="text-sm text-slate-700">Loading seats…</p>
                      ) : (
                        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                          {seatGrid.map((s) => {
                            const ns = normalizeSeat(s);
                            const isBooked = bookedSeats.includes(ns);
                            const isSelected = selectedSeats.includes(ns);
                            return (
                              <button
                                key={ns}
                                type="button"
                                onClick={() => toggleSeat(ns)}
                                disabled={isBooked}
                                className={`text-xs font-extrabold rounded-lg px-2 py-2 border transition ${
                                  isBooked
                                    ? "bg-slate-200 text-slate-500 border-slate-200 cursor-not-allowed"
                                    : isSelected
                                      ? "bg-rose-600 text-white border-rose-600"
                                      : "bg-white text-slate-800 border-slate-200 hover:bg-slate-50"
                                }`}
                              >
                                {ns}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-xs text-slate-600">
                      You can select up to 6 seats per booking.
                    </p>
                  </div>

                  <div className="lg:col-span-4">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4">
                      <p className="text-sm font-extrabold text-slate-900">Booking summary</p>
                      <div className="mt-3 grid gap-2 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Fare per seat</span>
                          <span className="font-extrabold text-slate-900">₹{activeRoute?.price || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Selected seats</span>
                          <span className="font-extrabold text-slate-900">{selectedSeats.length}</span>
                        </div>
                        <div className="h-px bg-slate-200 my-2" />
                        <div className="flex items-center justify-between">
                          <span className="text-slate-600">Total</span>
                          <span className="text-lg font-extrabold text-slate-900">₹{totalAmount}</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <button
                          type="button"
                          onClick={onConfirmBooking}
                          disabled={bookingLoading || seatLoading}
                          className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-300 text-white px-4 py-3 rounded-2xl font-semibold shadow-sm transition"
                        >
                          {bookingLoading ? "Booking…" : "Book Ticket"}
                        </button>
                        {!isLoggedIn() ? (
                          <p className="mt-2 text-xs text-slate-600">
                            Login is required to confirm booking.
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default CustomerBooking;
