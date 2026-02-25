import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import BusList from "./pages/BusList";
import AddBusForm from "./components/AddBusForm";
import CustomerBooking from "./pages/CustomerBooking";
import MyBookings from "./pages/MyBookings";
import AdminAllBookings from "./pages/AdminAllBookings";
import LiveTracking from "./pages/LiveTracking";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/book" element={<CustomerBooking />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/admin/all-bookings" element={<AdminAllBookings />} />
          <Route path="/AddBusForm" element={<AddBusForm />} />
          <Route path="/BusList" element={<BusList />} />
          <Route path="/BusMapPreview" element={<LiveTracking />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
