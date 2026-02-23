import React, { useState } from "react";
import axios from "axios";
import { getAuthHeader } from "../lib/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

function AddBusForm({ addBusToList = () => {} }) {
  const [busNumber, setBusNumber] = useState("");
  const [driverName, setDriverName] = useState("");
  const [route, setRoute] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!busNumber || !driverName || !route || !latitude || !longitude) {
      setError("Please fill all details");
      return;
    }

    const newBus = {
      busNumber,
      driverName,
      route,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
    };

    axios
      .post(`${API_BASE_URL}/api/buses`, newBus, { headers: getAuthHeader() })
      .then((res) => {
        addBusToList(res.data); // ✅ will work now
        setBusNumber("");
        setDriverName("");
        setRoute("");
        setLatitude("");
        setLongitude("");
        setError("");
      })
      .catch((err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          setError("Admin login required to add buses.");
        } else {
          setError(`Error adding bus: ${err.message}`);
        }
      });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-slate-100">
      <div className="flex items-end justify-between flex-wrap gap-3 mb-5">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">Add New Bus</h2>
          <p className="text-slate-600 text-sm mt-1">Enter bus details used for dashboard and live tracking.</p>
        </div>
        <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
          CREATE
        </span>
      </div>

      {error && <p className="text-rose-600 mb-3 text-sm">{error}</p>}

      <form onSubmit={handleSubmit} className="grid gap-3 sm:gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="text"
            placeholder="Bus Number"
            value={busNumber}
            onChange={(e) => setBusNumber(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="text"
            placeholder="Driver Name"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        <input
          type="text"
          placeholder="Route"
          value={route}
          onChange={(e) => setRoute(e.target.value)}
          className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <input
            type="number"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="number"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
        </div>

        <button
          type="submit"
          className="bg-rose-600 text-white p-3 rounded-xl mt-1 font-semibold hover:bg-rose-700 transition-colors shadow-sm"
        >
          Add Bus
        </button>
      </form>
    </div>
  );
}

export default AddBusForm;
