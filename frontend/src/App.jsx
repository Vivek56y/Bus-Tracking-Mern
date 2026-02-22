import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Contact from "./components/Contact";
import BusList from "./pages/BusList";
import AddBusForm from "./components/AddBusForm";
import LoginPage from "./components/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import CustomerBooking from "./pages/CustomerBooking";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import LiveTracking from "./pages/LiveTracking";
// import SignupPage from "./components/SignupPage";
function App() {
  return (
    <Router>
      <Navbar />
      <div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer"
            element={
              <ProtectedRoute allow={["client"]}>
                <CustomerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customer/bookings"
            element={
              <ProtectedRoute allow={["client"]}>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book"
            element={<CustomerBooking />}
          />

          {/* Backward compatibility */}
          <Route
            path="/Addbuses"
            element={
              <ProtectedRoute allow={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/BusMapPreview"
            element={<LiveTracking />}
          />
          <Route path="/contact" element={<Contact />} />
          <Route path="/AddBusForm" element={<AddBusForm />} />
          <Route path="/BusList" element={<BusList />}/>
          <Route path="/Login" element={<LoginPage/>}/>
           {/* <Route path="/signup" element={<SignupPage />} />  */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
