import React, { useState, useEffect } from "react";
import axios from "axios";

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
      const payload = {
        routeId: selectedBus._id,
        from: selectedBus.route.split(' → ')[0] || 'Origin',
        to: selectedBus.route.split(' → ')[1] || 'Destination',
        travelDate: date,
        seats: selectedSeats,
        amount: 450 * selectedSeats.length
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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg mb-6">
          <h1 className="text-3xl font-bold">Book Your Bus Ticket</h1>
          <p className="mt-2">Search, select, and book in minutes</p>
        </div>

        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <form onSubmit={handleSearch} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="From"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="To"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        </div>

        {/* Bus Results */}
        <div className="grid gap-4">
          {buses.map(bus => (
            <div key={bus._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold">{bus.busNumber}</h3>
                  <p className="text-gray-600 mt-1">{bus.route}</p>
                  <p className="text-gray-600">Driver: {bus.driverName}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">₹450</p>
                  <button
                    onClick={() => openSeatModal(bus)}
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
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
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedBus.busNumber}</h2>
                    <p className="text-gray-600">{selectedBus.route}</p>
                    <p className="text-gray-600">Date: {date}</p>
                  </div>
                  <button
                    onClick={() => setShowSeatModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>

                {bookingError && (
                  <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                    {bookingError}
                  </div>
                )}

                {bookingSuccess && (
                  <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {bookingSuccess}
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold mb-2">Select Seats:</h3>
                  <div className="grid grid-cols-10 gap-2">
                    {seatGrid.map(seat => {
                      const isBooked = bookedSeats.includes(seat);
                      const isSelected = selectedSeats.includes(seat);
                      return (
                        <button
                          key={seat}
                          onClick={() => toggleSeat(seat)}
                          disabled={isBooked}
                          className={`p-2 text-sm rounded ${
                            isBooked 
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          {seat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div>
                    <p>Selected Seats: {selectedSeats.join(", ") || "None"}</p>
                    <p className="text-xl font-bold">Total: ₹{450 * selectedSeats.length}</p>
                  </div>
                  <button
                    onClick={confirmBooking}
                    disabled={selectedSeats.length === 0}
                    className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
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
