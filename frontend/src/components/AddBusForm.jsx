import React, { useState } from "react";
import axios from "axios";

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
      .post("http://localhost:5000/api/buses", newBus)
      .then((res) => {
        addBusToList(res.data); // ✅ will work now
        setBusNumber("");
        setDriverName("");
        setRoute("");
        setLatitude("");
        setLongitude("");
        setError("");
      })
      .catch((err) => setError(`Error adding bus: ${err.message}`));
  };

  return (
    <div className="bg-white p-6 rounded shadow mb-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Add New Bus</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="grid gap-3">
        <input type="text" placeholder="Bus Number" value={busNumber} onChange={(e) => setBusNumber(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Driver Name" value={driverName} onChange={(e) => setDriverName(e.target.value)} className="p-2 border rounded" />
        <input type="text" placeholder="Route" value={route} onChange={(e) => setRoute(e.target.value)} className="p-2 border rounded" />
        <input type="number" placeholder="Latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} className="p-2 border rounded" />
        <input type="number" placeholder="Longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} className="p-2 border rounded" />
        <button type="submit" className="bg-blue-600 text-white p-2 rounded mt-2">Add Bus</button>
      </form>
    </div>
  );
}

export default AddBusForm;
