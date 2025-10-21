import React from "react";
import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="relative overflow-hidden w-full min-h-screen flex flex-col items-center justify-center">
      {/* Background Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-blue-900 opacity-20"></div>

      {/* Heading & Subheading */}
      <div className="relative z-10 text-center px-4">
        <h2 className="text-4xl md:text-6xl font-extrabold mb-6 md:mb-12 mt-14 leading-tight 
                       bg-clip-text text-transparent 
                       bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 drop-shadow-lg">
          Track Buses, Book Seats, and Travel Smart!
        </h2>

        <p className="mt-6 md:mt-4 text-lg md:text-xl text-gray-700 font-medium mb-10 max-w-3xl mx-auto leading-relaxed text-center">
          Just like IRCTC, search for buses, check live updates, and book your journey seamlessly.
        </p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl p-8 shadow-lg max-w-5xl w-full relative z-10">
        <div className="flex flex-col md:flex-row gap-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg">
          {/* Inputs */}
          <div className="flex flex-col md:flex-row gap-4 w-full">
            {/* From City */}
            <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-blue-400 transition">
              <span className="px-3 text-blue-600 text-2xl">🏙️</span>
              <input
                type="text"
                placeholder="From City"
                className="w-full p-3 border-none outline-none bg-transparent text-gray-800"
              />
            </div>

            {/* To City */}
            <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-blue-400 transition">
              <span className="px-3 text-blue-600 text-2xl">🏙️</span>
              <input
                type="text"
                placeholder="To City"
                className="w-full p-3 border-none outline-none bg-transparent text-gray-800"
              />
            </div>

            {/* Date */}
            <div className="flex items-center flex-1 bg-white border border-gray-300 rounded-xl shadow-md focus-within:ring-2 focus-within:ring-blue-400 transition">
              <span className="px-3 text-blue-600 text-2xl">📅</span>
              <input
                type="date"
                className="w-full p-3 border-none outline-none bg-transparent text-gray-800"
              />
            </div>
          </div>

          {/* Search Button */}
          <button className="bg-blue-500 hover:bg-blue-700 text-black px-9 py-3 rounded-lg font-semibold shadow-md transition transform hover:scale-105 mt-4 md:mt-0">
            Search Buses
          </button>
        </div>

        {/* Navigation Links */}
        <div className="mt-6 mb-2 flex justify-center gap-8 flex-wrap">
          <Link
            to="/booking"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Book Ticket
          </Link>
          <Link
            to="/dashboard"
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Live Tracking
          </Link>
          <Link
            to="/update"
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg shadow-md transition"
          >
            Update Bus
          </Link>
        </div>
      </div>

      {/* Call-to-action Text */}
      <p className="mt-8 mb-6 text-center text-2xl md:text-3xl font-bold text-blue-900 relative z-10">
        Start your journey today – search, book, and track with ease!
      </p>
    </section>
  );
}

export default Hero;
