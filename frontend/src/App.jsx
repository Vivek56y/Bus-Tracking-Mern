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
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<LoginPage />} />
          <Route path="/Signup" element={<SignupPage />} />
          
          {/* Protected Routes */}
          <Route path="/book" element={
            <ProtectedRoute allow={["admin", "customer"]}>
              <CustomerBooking />
            </ProtectedRoute>
          } />
          <Route path="/my-bookings" element={
            <ProtectedRoute allow={["admin", "customer"]}>
              <MyBookings />
            </ProtectedRoute>
          } />
          
          {/* Admin Routes */}
          <Route path="/admin/all-bookings" element={
            <ProtectedRoute allow={["admin"]}>
              <AdminAllBookings />
            </ProtectedRoute>
          } />
          <Route path="/AddBusForm" element={
            <ProtectedRoute allow={["admin"]}>
              <AddBusForm />
            </ProtectedRoute>
          } />
          <Route path="/dashboard/admin" element={
            <ProtectedRoute allow={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          {/* Customer Routes */}
          <Route path="/dashboard/customer" element={
            <ProtectedRoute allow={["customer"]}>
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Public Routes */}
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
