import React from "react";

function BusList({ buses = [] }) {
  return (
    
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 p-6 rounded shadow max-w-4xl mx-auto mt-10">
    <BusList buses={[
  { _id: "1", busNumber: "123", driverName: "John", route: "A", latitude: "12", longitude: "34" },
  { _id: "2", busNumber: "456", driverName: "Jane", route: "B", latitude: "56", longitude: "78" }
]} />
      <h2 className="text-2xl font-bold mb-6 text-center text-white">All Buses</h2>
      <table className="w-full border border-gray-300 bg-white rounded">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Bus Number</th>
            <th className="border p-2">Driver</th>
            <th className="border p-2">Route</th>
            <th className="border p-2">Latitude</th>
            <th className="border p-2">Longitude</th>
          </tr>
        </thead>
        <tbody>
          {buses.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No buses found
              </td>
            </tr>
          ) : (
            buses.map((bus, index) => (
              <tr
                key={bus._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"}
              >
                <td className="border p-2">{bus.busNumber}</td>
                <td className="border p-2">{bus.driverName}</td>
                <td className="border p-2">{bus.route}</td>
                <td className="border p-2">{bus.latitude}</td>
                <td className="border p-2">{bus.longitude}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default BusList;
