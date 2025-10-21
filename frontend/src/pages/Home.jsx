import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import BusMapPreview from "../components/BusMapPreview";

function Home() {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-gray-100 text-gray-800">
      <Hero />
      <Features className=" md:px-20" />
      <BusMapPreview />
      <Footer />
    </div>
  );
}

export default Home;
