import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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
  const [mapBuses, setMapBuses] = useState([]);

  useEffect(() => {
    setMapBuses(buses);
  }, [buses]);

  // Validate center coordinates
  const validCenter = mapBuses.length > 0 && mapBuses[0] && !isNaN(parseFloat(mapBuses[0].latitude)) && !isNaN(parseFloat(mapBuses[0].longitude))
    ? [parseFloat(mapBuses[0].latitude), parseFloat(mapBuses[0].longitude)]
    : [20.5937, 78.9629];  // Default to India center

  return (
    <div className="bg-gradient-to-b from-blue-100 to-gray-100 shadow-lg rounded-xl p-6 max-w-6xl mx-auto border border-blue-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
        🚌 Real-Time Bus Tracker
      </h2>

      <div className="h-[500px] w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
        <MapContainer
          center={validCenter}  // Use validated center
          zoom={10}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <AutoPan center={validCenter} />

          {mapBuses.map((bus) => {
            const lat = parseFloat(bus.latitude);
            const lng = parseFloat(bus.longitude);
            // Only render marker if coordinates are valid
            if (!isNaN(lat) && !isNaN(lng)) {
              return (
                <Marker key={bus._id} position={[lat, lng]} icon={busIcon}>
                  <Popup className="bg-white shadow-md rounded-lg">
                    <p className="text-blue-600 font-bold">{bus.busNumber}</p>
                    <p>Driver: {bus.driverName}</p>
                    <p>Route: {bus.route}</p>
                    {bus.status && (
                      <p
                        className={
                          bus.status.toLowerCase() === "on time"
                            ? "text-green-600 font-semibold"
                            : "text-red-600 font-semibold"
                        }
                      >
                        Status: {bus.status}
                      </p>
                    )}
                  </Popup>
                </Marker>
              );
            }
            return null;  // Skip invalid buses
          })}
        </MapContainer>
      </div>

      <p className="mt-4 text-center text-gray-500 text-sm">
        Map updates in real-time and follows buses. Invalid locations are skipped.
      </p>
    </div>
  );
}

// export default BusMap;
export default BusMapPreview;