import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function formatDate(raw) {
  if (!raw) return "-";
  // raw is expected as YYYY-MM-DD
  return raw;
}

function formatTime(ts) {
  if (!ts) return "-";
  const d = new Date(ts);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString();
}

function MyBookings() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    let mounted = true;
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings/my?userId=guest`);
        if (mounted) setBookings(res.data);
      } catch (err) {
        if (mounted) setError("Failed to fetch bookings.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBookings();
    return () => { mounted = false; };
  }, []);

  const summary = useMemo(() => {
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const cancelled = bookings.filter((b) => b.status === "cancelled").length;
    return { total: bookings.length, confirmed, cancelled };
  }, [bookings]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-rose-600 to-fuchsia-600 text-white px-6 sm:px-8 py-6">
            <p className="text-sm font-semibold tracking-wide text-white/90">MY BOOKINGS</p>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold">Your tickets</h1>
            <p className="mt-1 text-white/90 text-sm">View seat details and booking history.</p>
          </div>

          <div className="px-4 sm:px-6 py-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  TOTAL: {summary.total}
                </span>
                <span className="text-xs font-semibold tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-100 px-3 py-1 rounded-full">
                  CONFIRMED: {summary.confirmed}
                </span>
                <span className="text-xs font-semibold tracking-wider text-slate-700 bg-slate-50 border border-slate-200 px-3 py-1 rounded-full">
                  CANCELLED: {summary.cancelled}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to="/book"
                  className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2.5 rounded-xl font-semibold shadow-sm transition"
                >
                  Book new ticket
                </Link>
                <Link
                  to="/dashboard/customer"
                  className="bg-white hover:bg-slate-50 text-slate-900 px-4 py-2.5 rounded-xl font-semibold shadow-sm transition border border-slate-200"
                >
                  Back
                </Link>
              </div>
            </div>

            {error ? <p className="mt-4 text-rose-600 text-sm font-semibold">{error}</p> : null}

            <div className="mt-5 grid gap-4">
              {loading ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                  Loading your bookings…
                </div>
              ) : bookings.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 text-slate-700">
                  <p className="font-bold text-slate-900">No bookings yet.</p>
                  <p className="mt-1 text-sm text-slate-600">Book your first ticket to see it here.</p>
                </div>
              ) : (
                bookings.map((b) => (
                  <div
                    key={b._id}
                    className="rounded-3xl border border-slate-100 bg-white p-5 sm:p-6 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div>
                        <p className="text-lg font-extrabold text-slate-900">
                          {b.from} <span className="text-rose-600">→</span> {b.to}
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Travel date: <span className="font-semibold text-slate-900">{formatDate(b.travelDate)}</span>
                        </p>
                        <p className="mt-1 text-sm text-slate-600">
                          Seats: <span className="font-semibold text-slate-900">{(b.seats || []).join(", ")}</span>
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-2xl font-extrabold text-slate-900">₹{b.amount ?? 0}</p>
                        <p className="text-xs text-slate-500">Paid</p>
                        <div className="mt-2">
                          <span
                            className={`text-xs font-extrabold px-2.5 py-1 rounded-full border ${
                              b.status === "confirmed"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                : "bg-slate-50 text-slate-700 border-slate-200"
                            }`}
                          >
                            {String(b.status || "-").toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50/60 p-4 flex items-center justify-between gap-3 flex-wrap">
                      <p className="text-sm text-slate-700">
                        Booking ID: <span className="font-extrabold text-slate-900">{b._id}</span>
                      </p>
                      <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-slate-200 text-slate-700">
                        {formatTime(b.createdAt)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyBookings;
