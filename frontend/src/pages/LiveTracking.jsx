import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import BusMapPreview from "../components/BusMapPreview";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function formatTime(value) {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function estimateEtaMinutes(bus) {
  const speed = Number(bus?.speedKmph);
  if (Number.isFinite(speed) && speed > 5) {
    return Math.round(45 * (40 / speed));
  }
  return 45;
}

function LiveTracking() {
  const [buses, setBuses] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedBusId, setSelectedBusId] = useState("all");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/buses`)
      .then((res) => setBuses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setBuses([]));
  }, []);

  const routes = useMemo(() => {
    const set = new Set(
      buses
        .map((b) => (b?.route || "").trim())
        .filter((r) => r.length > 0)
        .map((r) => r.toLowerCase())
    );

    const unique = Array.from(set).map((r) => ({
      value: r,
      label: r
        .split(" ")
        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
        .join(" "),
    }));

    unique.sort((a, b) => a.label.localeCompare(b.label));
    return unique;
  }, [buses]);

  const filteredBuses = useMemo(() => {
    let list = Array.isArray(buses) ? buses : [];

    if (selectedRoute !== "all") {
      list = list.filter((b) => (b?.route || "").trim().toLowerCase() === selectedRoute);
    }

    if (selectedBusId !== "all") {
      list = list.filter((b) => b?._id === selectedBusId);
    }

    return list;
  }, [buses, selectedRoute, selectedBusId]);

  const mapBuses = useMemo(() => {
    if (selectedBusId === "all") return filteredBuses;
    const selected = filteredBuses.find((b) => b?._id === selectedBusId);
    const rest = filteredBuses.filter((b) => b?._id !== selectedBusId);
    return selected ? [selected, ...rest] : filteredBuses;
  }, [filteredBuses, selectedBusId]);

  const summary = useMemo(() => {
    const total = filteredBuses.length;
    const active = filteredBuses.filter(
      (b) => Number.isFinite(parseFloat(b?.latitude)) && Number.isFinite(parseFloat(b?.longitude))
    ).length;
    const delayed = filteredBuses.filter((b) => (b?.status || "").toLowerCase() === "delayed").length;
    return { total, active, delayed };
  }, [filteredBuses]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/30 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border border-slate-100 rounded-3xl shadow-sm p-4 sm:p-5">
          <div className="flex items-start sm:items-center justify-between gap-4 flex-wrap">
            <div>
              <p className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
                LIVE TRACKING
              </p>
              <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
                Track Your Bus in Real Time
              </h1>
              <p className="mt-1 text-slate-600 text-sm">
                Select a route and monitor buses on the map.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-50 px-3 py-2 rounded-2xl border border-slate-100 text-sm">
                <span className="text-slate-600">Total: </span>
                <span className="font-semibold text-slate-900">{summary.total}</span>
              </div>
              <div className="bg-rose-50 px-3 py-2 rounded-2xl border border-rose-100 text-sm">
                <span className="text-slate-600">Active: </span>
                <span className="font-semibold text-slate-900">{summary.active}</span>
              </div>
              <div className="bg-white px-3 py-2 rounded-2xl border border-slate-200 text-sm">
                <span className="text-slate-600">Delayed: </span>
                <span className="font-semibold text-slate-900">{summary.delayed}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Panel */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 sm:p-6">
              <div className="flex items-end justify-between gap-4 flex-wrap">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Filters</h2>
                  <p className="mt-1 text-sm text-slate-600">Narrow down buses quickly.</p>
                </div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  ABHIBUS STYLE
                </span>
              </div>

              <div className="mt-5 grid gap-3">
                <div>
                  <label className="text-sm font-semibold text-slate-900">Route</label>
                  <select
                    value={selectedRoute}
                    onChange={(e) => {
                      setSelectedRoute(e.target.value);
                      setSelectedBusId("all");
                    }}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                  >
                    <option value="all">All Routes</option>
                    {routes.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900">Bus</label>
                  <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    className="mt-2 w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300 bg-white"
                  >
                    <option value="all">All Buses</option>
                    {filteredBuses.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.busNumber} — {b.route}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-sm font-extrabold text-slate-900">Buses</h3>
                <div className="mt-3 grid gap-3 max-h-[420px] overflow-auto pr-1">
                  {filteredBuses.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                      No buses found for this filter.
                    </div>
                  ) : (
                    filteredBuses.map((b) => {
                      const active =
                        Number.isFinite(parseFloat(b?.latitude)) &&
                        Number.isFinite(parseFloat(b?.longitude));
                      const selected = selectedBusId === b._id;
                      const lastUpdated = b?.lastUpdatedAt || b?.updatedAt;
                      const eta = estimateEtaMinutes(b);

                      return (
                        <button
                          key={b._id}
                          type="button"
                          onClick={() => setSelectedBusId((prev) => (prev === b._id ? "all" : b._id))}
                          className={`text-left rounded-2xl border p-4 transition-colors ${
                            selected
                              ? "border-rose-200 bg-rose-50/60"
                              : "border-slate-200 bg-white hover:bg-slate-50"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-extrabold text-slate-900">{b.busNumber}</p>
                              <p className="text-xs text-slate-600 mt-0.5">{b.route}</p>
                            </div>
                            <span
                              className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${
                                active
                                  ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                                  : "bg-slate-50 text-slate-700 border-slate-200"
                              }`}
                            >
                              {active ? "LIVE" : "OFFLINE"}
                            </span>
                          </div>

                          <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                              <p className="text-slate-500">ETA</p>
                              <p className="font-semibold text-slate-900">~{eta} min</p>
                            </div>
                            <div className="rounded-xl border border-slate-200 bg-white p-2.5">
                              <p className="text-slate-500">Last update</p>
                              <p className="font-semibold text-slate-900 truncate">
                                {formatTime(lastUpdated)}
                              </p>
                            </div>
                          </div>

                          {b?.status && (
                            <p className="mt-2 text-xs text-slate-700">
                              Status: <span className="font-semibold">{b.status}</span>
                            </p>
                          )}
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-4 sm:p-5">
              <div className="flex items-end justify-between gap-4 flex-wrap mb-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Map</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Buses with valid coordinates will appear here.
                  </p>
                </div>
                <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
                  REAL-TIME
                </span>
              </div>

              <BusMapPreview buses={mapBuses} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LiveTracking;
