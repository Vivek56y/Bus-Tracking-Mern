import React, { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { socket } from "../lib/socket";

function makeBusDivIcon(color = "#0f172a") {
  const html = `
    <div style="
      width: 38px;
      height: 38px;
      border-radius: 9999px;
      background: ${color};
      border: 3px solid rgba(255,255,255,0.95);
      box-shadow: 0 10px 22px rgba(2,6,23,0.18);
      display: grid;
      place-items: center;
      font-size: 18px;
      line-height: 1;
      color: white;
    ">
      🚌
    </div>
  `;
  return L.divIcon({
    className: "",
    html,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
    popupAnchor: [0, -34],
  });
}

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

function FitBounds({ points }) {
  const map = useMap();

  useEffect(() => {
    if (!Array.isArray(points)) return;
    const valid = points.filter(
      (p) => Array.isArray(p) && p.length === 2 && Number.isFinite(p[0]) && Number.isFinite(p[1])
    );

    if (valid.length >= 2) {
      const bounds = L.latLngBounds(valid.map((p) => L.latLng(p[0], p[1])));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [map, points]);

  return null;
}

function BusMapPreview({ buses = [] }) {
  const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";
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

  const points = useMemo(() => {
    return mapBuses
      .map((b) => [parseFloat(b?.latitude), parseFloat(b?.longitude)])
      .filter((p) => Number.isFinite(p[0]) && Number.isFinite(p[1]));
  }, [mapBuses]);

  return (
    <div className="h-[360px] sm:h-[520px] w-full rounded-2xl overflow-hidden shadow-sm border border-slate-200">
      <MapContainer center={validCenter} zoom={5} style={{ height: "100%", width: "100%" }}>
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
        />

        <AutoPan center={validCenter} />
        <FitBounds points={points} />

        {mapBuses.map((bus) => {
          const lat = parseFloat(bus.latitude);
          const lng = parseFloat(bus.longitude);
          if (Number.isNaN(lat) || Number.isNaN(lng)) return null;

          const status = (bus?.status || "").toLowerCase();

          return (
            <Marker key={bus._id} position={[lat, lng]} icon={makeBusDivIcon("#0b1220")}>
              <Popup>
                <p className="text-rose-700 font-bold">{bus.busNumber}</p>
                <p>Driver: {bus.driverName}</p>
                <p>Route: {bus.route}</p>
                {bus.status && (
                  <p className={status === "on time" ? "text-green-600 font-semibold" : "text-rose-600 font-semibold"}>
                    Status: {bus.status}
                  </p>
                )}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default BusMapPreview;
