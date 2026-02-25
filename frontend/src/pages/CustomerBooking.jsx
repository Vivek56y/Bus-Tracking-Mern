import React, { useState, useEffect } from "react";
import axios from "axios";
import { isLoggedIn, getAuthUser } from "../lib/auth";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function CustomerBooking() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [showSeatModal, setShowSeatModal] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();

  // Load buses on component mount
  useEffect(() => {
    loadBuses();
  }, []);

  const loadBuses = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/buses`);
      setBuses(res.data || []);
    } catch (err) {
      console.error("Failed to load buses:", err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!from || !to || !date) {
      alert("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/buses`);
      const filtered = res.data.filter(bus => 
        bus.route.toLowerCase().includes(from.toLowerCase()) || 
        bus.route.toLowerCase().includes(to.toLowerCase())
      );
      setBuses(filtered);
    } catch (err) {
      console.error("Search failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const openSeatModal = async (bus) => {
    if (!date) {
      alert("Please select a travel date first");
      return;
    }
    
    // Check if user is logged in
    if (!isLoggedIn()) {
      alert("Please login to book a bus");
      navigate("/Login");
      return;
    }
    
    setSelectedBus(bus);
    setShowSeatModal(true);
    setBookingError("");
    setBookingSuccess("");
    
    // Load booked seats for this bus
    try {
      const res = await axios.get(`${API_BASE_URL}/api/bookings/seats`, {
        params: { routeId: bus._id, travelDate: date }
      });
      setBookedSeats(res.data?.bookedSeats || []);
    } catch (err) {
      console.error("Failed to load seats:", err);
      setBookedSeats([]);
    }
  };

  const toggleSeat = (seat) => {
    if (bookedSeats.includes(seat)) return;
    
    setSelectedSeats(prev => {
      if (prev.includes(seat)) {
        return prev.filter(s => s !== seat);
      } else if (prev.length < 6) {
        return [...prev, seat];
      }
      return prev;
    });
  };

  const confirmBooking = async () => {
    if (selectedSeats.length === 0) {
      setBookingError("Please select at least one seat");
      return;
    }

    setBookingError("");
    setBookingSuccess("");
    
    try {
      const user = getAuthUser();
      const payload = {
        routeId: selectedBus._id,
        from: selectedBus.route.split(' → ')[0] || 'Origin',
        to: selectedBus.route.split(' → ')[1] || 'Destination',
        travelDate: date,
        seats: selectedSeats,
        amount: 450 * selectedSeats.length,
        userId: user?._id || user?.id // Include user ID
      };

      const res = await axios.post(`${API_BASE_URL}/api/bookings`, payload);
      setBookingSuccess(`Booking confirmed! Seats: ${selectedSeats.join(", ")}`);
      setSelectedSeats([]);
      
      // Update booked seats
      setBookedSeats(prev => [...prev, ...selectedSeats]);
      
    } catch (err) {
      setBookingError(err.response?.data?.message || "Booking failed");
    }
  };

  // Auth prompt handler for compatibility
  const setAuthPromptOpen = (show) => {
    setShowLoginModal(show);
  };

  const seatGrid = [];
  for (let row = 65; row <= 68; row++) { // A-D
    for (let num = 1; num <= 10; num++) {
      seatGrid.push(String.fromCharCode(row) + num);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg mb-6 shadow-lg">
          <h1 className="text-3xl font-bold">Book Your Bus Ticket</h1>
          <p className="mt-2">Search, select, and book in minutes</p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Bus Results */}
        <div className="grid gap-4">
          {buses.map(bus => (
            <div key={bus._id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900">{bus.busNumber}</h3>
                  <p className="text-gray-600 mt-1 font-medium">{bus.route}</p>
                  <p className="text-gray-600">Driver: {bus.driverName}</p>
                  <div className="mt-2 flex gap-2">
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-semibold">Available</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">WiFi</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-semibold">AC</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">₹450</p>
                  <p className="text-sm text-gray-500">per seat</p>
                  <button
                    onClick={() => openSeatModal(bus)}
                    className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-semibold shadow-md"
                  >
                    Select Seats
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Seat Selection Modal */}
        {showSeatModal && selectedBus && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto shadow-2xl">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedBus.busNumber}</h2>
                    <p className="text-gray-600 font-medium">{selectedBus.route}</p>
                    <p className="text-gray-600">Date: {date}</p>
                  </div>
                  <button
                    onClick={() => setShowSeatModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl font-bold transition-colors"
                  >
                    ×
                  </button>
                </div>

                {bookingError && (
                  <div className="bg-red-100 border border-red-400 text-red-700 p-3 rounded-lg mb-4">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="bg-green-100 border border-green-400 text-green-700 p-3 rounded-lg mb-4">
                    {bookingSuccess}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold text-gray-900 mb-2">Select Seats:</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {seatGrid.map(seat => {
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          disabled={isBooked}
                          className={`p-2 text-sm rounded-lg font-medium transition-all ${
                            isBooked 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-red-600 text-white shadow-md'
                              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 flex gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-300 rounded"></div>
                      <span>Booked</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-600 rounded"></div>
                      <span>Selected</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-100 rounded border"></div>
                      <span>Available</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div>
                    <p className="text-gray-600">Selected Seats: <span className="font-bold text-gray-900">{selectedSeats.join(", ") || "None"}</span></p>
                    <p className="text-2xl font-bold text-red-600">Total: ₹{450 * selectedSeats.length}</p>
                  </div>
                  <button
                    onClick={confirmBooking}
                    disabled={selectedSeats.length === 0}
                    className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
                  >
                    Confirm Booking
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CustomerBooking;
