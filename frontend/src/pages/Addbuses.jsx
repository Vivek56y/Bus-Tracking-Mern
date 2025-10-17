import React, { useEffect, useState } from "react";
import AddBusForm from "../components/AddBusForm";
import BusList from "../components/BusList";
import axios from "axios";

function AddBuses() {
  const [buses, setBuses] = useState([]);

  // Fetch buses from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/buses")
      .then(res => setBuses(res.data))
      .catch(err => console.error(err));
  }, []);

  // Add new bus to list
  const addBusToList = (newBus) => {
    setBuses([...buses, newBus]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Bus Dashboard</h1>
      <AddBusForm addBusToList={addBusToList} />
      <BusList buses={buses} />
    </div>
  );
}

export default AddBuses;
