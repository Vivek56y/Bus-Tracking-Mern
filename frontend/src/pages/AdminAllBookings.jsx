import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "https://bus-tracking-mern.onrender.com";

function AdminAllBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/bookings`);
        setBookings(res.data);
      } catch (err) {
        setError("Failed to fetch bookings.");
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <div className="p-6 text-gray-600">Loading bookings…</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">All Bookings</h1>
        {bookings.length === 0 ? (
          <p className="text-gray-600">No bookings found.</p>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 p-4"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500">Booking ID</p>
                    <p className="font-mono text-xs">{b._id}</p>
                    <p className="mt-2 font-semibold text-gray-900">
                      {b.route?.from || "N/A"} → {b.route?.to || "N/A"}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(b.travelDate).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">Seats: {b.selectedSeats?.join(", ")}</p>
                    <p className="text-sm text-gray-600">Amount: ₹{b.amount}</p>
                    <p className="text-sm text-gray-600">
                      User: {b.userId?.email || b.userId?.name || "N/A"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                        b.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {b.status || "confirmed"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminAllBookings;
