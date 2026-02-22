import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { socket } from "../lib/socket";

// Custom bus icon
const busIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/61/61212.png",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -35],
});

// Component to auto pan map
function AutoPan({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && !isNaN(center[0]) && !isNaN(center[1])) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function BusMapPreview({ buses = [] }) {
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";
  const [liveBuses, setLiveBuses] = useState([]);

  const mapBuses = useMemo(() => {
    return buses && buses.length > 0 ? buses : liveBuses;
  }, [buses, liveBuses]);

  useEffect(() => {
    if (buses && buses.length > 0) return;

    axios
      .get(`${API_BASE_URL}/api/buses`)
      .then((res) => setLiveBuses(Array.isArray(res.data) ? res.data : []))
      .catch(() => setLiveBuses([]));
  }, [API_BASE_URL, buses]);

  useEffect(() => {
    const onUpdate = (data) => {
      if (!data) return;

      const id = data.busId || data._id || data.id;
      const lat = parseFloat(data.latitude);
      const lng = parseFloat(data.longitude);
      if (!id || Number.isNaN(lat) || Number.isNaN(lng)) return;

      setLiveBuses((prev) => {
        const next = Array.isArray(prev) ? [...prev] : [];
        const idx = next.findIndex((b) => b?._id === id || b?.id === id);
        if (idx === -1) return prev;
        next[idx] = {
          ...next[idx],
          latitude: lat,
          longitude: lng,
        };
        return next;
      });
    };

    socket.on("updateBusLocation", onUpdate);
    return () => {
      socket.off("updateBusLocation", onUpdate);
    };
  }, []);

  const validCenter =
    mapBuses.length > 0 &&
    !isNaN(parseFloat(mapBuses[0]?.latitude)) &&
    !isNaN(parseFloat(mapBuses[0]?.longitude))
      ? [parseFloat(mapBuses[0].latitude), parseFloat(mapBuses[0].longitude)]
      : [20.5937, 78.9629]; // default to India

  return (
    <div className="bg-white shadow-sm rounded-2xl p-4 sm:p-6 max-w-6xl mx-auto border border-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2 mb-5">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Live Bus Tracking
          </h2>
          <p className="text-slate-600 mt-1">
            Real-time map preview. Invalid locations are skipped.
          </p>
        </div>
        <div className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full w-fit">
          REAL-TIME
        </div>
      </div>

      <div className="h-[360px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
        <MapContainer
          center={validCenter}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AutoPan center={validCenter} />

          {mapBuses.map((bus) => {
            const lat = parseFloat(bus.latitude);
            const lng = parseFloat(bus.longitude);
            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker key={bus._id} position={[lat, lng]} icon={busIcon}>
                  <Popup>
                    <p className="text-rose-700 font-bold">{bus.busNumber}</p>
                    <p>Driver: {bus.driverName}</p>
                    <p>Route: {bus.route}</p>
                    {bus.status && (
                      <p
                        className={
                          bus.status.toLowerCase() === "on time"
                            ? "text-green-600 font-semibold"
                            : "text-rose-600 font-semibold"
                        }
                      >
                        Status: {bus.status}
                      </p>
                    )}
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </div>
  );
}

export default BusMapPreview;
