import React from "react";
import { Link } from "react-router-dom";  // For navigation links

function Hero() {
  return (
    <section className="bg-gradient-to-blue text-black py-20 px-10 md:px-12 text-center relative overflow-hidden">
      {/* Subtle background overlay for attractiveness */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-20"></div>

      <h2 className="text-6xl font-bold mb-6 relative z-10">
        Track Buses, Book Seats, and Travel Smart!
      </h2>
      <p className="text-1xl mb-8 relative z-10 max-w-2xl mx-auto">
        Just like IRCTC, search for buses, check live updates, and book your journey seamlessly.
      </p>

      {/* Search Form - Similar to IRCTC's train search */}
      <div className="bg-white rounded-xl p-6 shadow-lg max-w-4xl mx-auto relative z-10">
        <div className="flex-flex-col md:flex-row gap-4 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2x1 shadow">
          {/* From City Input */}
          

          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400">
    <span className="px-3 text-blue-600 text-xl">🏙️</span>
    <input
      type="text"
      placeholder="From City"
      className="w-full p-3 border-none outline-none bg-transparent text-gray-800"
    />
  </div>

          {/* To City Input */}
          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400 ">
            <span className="px-3 text-blue-600 text-xl">🏙️</span>
            <input
              type="text"
              placeholder="To City"
              className="w-full p-3 border-none bg-transparent text-gray-800 "/>
          </div>

          {/* Date Input */}
          <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-lg shadow-sm focus-within:ring-2 focus-within:ring-blue-400 ">
            <span className="px-3 text-blue-600 text-xl">📅</span>
            <input
              type="date"
              className="w-full p-3 p-3 border-none bg-transparent text-gray-800"
            />
          </div>

          {/* Search Button */}
          <button
            className="bg-blue-500 hover:bg-blue-700 text-black px-9 py-3 rounded-lg font-semibold shadow-md transition transform hover:scale-105"
          >
            Search Buses
          </button>
        </div>

        {/* Navigation Options - Links to other pages */}
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Book Ticket
          </Link>
          <Link
            to="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Live Tracking
          </Link>
          <Link
            to="/update"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Update Bus
          </Link>
        </div>
      </div>

      <p className="mt-6 text-blue-100 relative z-10">
        Start your journey today – search, book, and track with ease!
      </p>
    </section>
  );
}

export default Hero;