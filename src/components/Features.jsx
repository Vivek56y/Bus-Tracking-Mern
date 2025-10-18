import React from "react";

function Features() {
  const features = [
    { title: "Real-Time Tracking", desc: "Track buses live with accurate GPS data." },
    { title: "Easy Ticket Booking", desc: "Book your seats in just a few clicks." },
    { title: "Instant Cancellation", desc: "Cancel and get instant confirmation." },
    { title: "Secure Payments", desc: "Your transactions are 100% safe and fast." },
  ];

  return (
    <section className="py-16 bg-gray-50 text-center">
      <h3 className="text-3xl font-bold text-gray-800 mb-10">Our Features</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-20">
        {features.map((f, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all">
            <h4 className="text-xl font-semibold text-blue-600 mb-2">{f.title}</h4>
            <p className="text-gray-600">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;
