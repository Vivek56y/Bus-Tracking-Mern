import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Footer from "../components/Footer";
import BusMapPreview from "../components/BusMapPreview";
import Contact from "../components/Contact";
import { BadgeCheck, Clock, Headphones, ShieldCheck, Star } from "lucide-react";

function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-rose-50/40 to-white text-slate-900">
      <Hero />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <section id="offers" className="pt-10 sm:pt-12">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Top Offers</h3>
              <p className="text-slate-600 mt-1">Limited-time deals on popular routes.</p>
            </div>
            <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">
              DEALS
            </span>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[ 
              {
                title: "Save 20% on first trip",
                code: "BUSGO20",
                note: "New users • Selected routes",
                img: "https://images.unsplash.com/photo-1519666213638-31b1f61f08ca?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Weekend getaway fares",
                code: "WEEKEND",
                note: "Fri–Sun • Goa & hill stations",
                img: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80",
              },
              {
                title: "Track & save",
                code: "TRACK10",
                note: "Live tracking routes",
                img: "https://images.unsplash.com/photo-1508609349937-5ec4ae374ebf?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((o) => (
              <div key={o.code} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-36 w-full relative">
                  <img src={o.img} alt={o.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/20 to-transparent" />
                  <div className="relative p-4">
                    <span className="text-xs font-semibold tracking-wider text-white bg-white/10 border border-white/15 px-3 py-1 rounded-full">
                      CODE: {o.code}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-lg font-extrabold text-slate-900">{o.title}</p>
                  <p className="mt-1 text-sm text-slate-600">{o.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 bg-gradient-to-r from-rose-600 via-rose-600 to-fuchsia-600 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
              <p className="text-sm font-semibold tracking-wide text-white/90">NEW ON BUSGO</p>
              <h3 className="text-2xl sm:text-3xl font-extrabold mt-2">
                Flat 20% off on first tracking-enabled booking
              </h3>
              <p className="text-white/90 mt-2 max-w-2xl">
                Book tickets faster, track your bus live, and get timely updates for a stress-free journey.
              </p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm">LIVE MAP</span>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm">REAL-TIME</span>
                <span className="bg-white/10 border border-white/20 px-3 py-1 rounded-full text-sm">OFFERS</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Today’s Highlights</p>
              <div className="mt-4 grid gap-3">
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-rose-600" />
                    <span className="text-sm font-medium">Fast Booking</span>
                  </div>
                  <span className="text-xs text-slate-500">{"< 30 sec"}</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-rose-600" />
                    <span className="text-sm font-medium">Secure Data</span>
                  </div>
                  <span className="text-xs text-slate-500">MongoDB</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center gap-3">
                    <Headphones className="h-5 w-5 text-rose-600" />
                    <span className="text-sm font-medium">Support</span>
                  </div>
                  <span className="text-xs text-slate-500">24x7</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Features />

        <section className="py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Explore Destinations</h3>
              <p className="text-slate-600 mt-1">Plan your next trip with trending places.</p>
            </div>
            <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">TRAVEL</span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Goa",
                text: "Beach weekends",
                img: "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Manali",
                text: "Hill station trips",
                img: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Jaipur",
                text: "City of forts",
                img: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=80",
              },
              {
                name: "Udaipur",
                text: "Lakes & palaces",
                img: "https://images.unsplash.com/photo-1599661046827-dacde07b2b66?auto=format&fit=crop&w=1200&q=80",
              },
            ].map((d) => (
              <div key={d.name} className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition">
                <div className="h-36 relative">
                  <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/55 via-black/15 to-transparent" />
                  <div className="relative p-4">
                    <p className="text-white font-extrabold text-lg">{d.name}</p>
                    <p className="text-white/90 text-sm">{d.text}</p>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-sm text-slate-600">Best fares and easy booking</p>
                  <p className="mt-1 text-sm font-semibold text-rose-700">Explore routes →</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h3 className="text-2xl sm:text-3xl font-extrabold">Popular Routes</h3>
              <p className="text-slate-600 mt-1">Fast booking for high-demand routes.</p>
            </div>
            <span className="text-xs font-semibold tracking-wider text-rose-700 bg-rose-50 border border-rose-100 px-3 py-1 rounded-full">TOP PICKS</span>
          </div>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: "Mumbai", to: "Pune", time: "3h 15m", price: "₹450" },
              { from: "Delhi", to: "Jaipur", time: "4h 40m", price: "₹520" },
              { from: "Bengaluru", to: "Mysuru", time: "3h 00m", price: "₹399" },
              { from: "Hyderabad", to: "Vijayawada", time: "5h 20m", price: "₹610" },
              { from: "Ahmedabad", to: "Surat", time: "4h 10m", price: "₹499" },
              { from: "Chennai", to: "Pondicherry", time: "3h 30m", price: "₹420" },
            ].map((r) => (
              <div key={`${r.from}-${r.to}`} className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">From</p>
                    <p className="text-lg font-bold text-slate-900">{r.from}</p>
                  </div>
                  <div className="text-rose-600 font-bold">→</div>
                  <div className="text-right">
                    <p className="text-sm text-slate-500">To</p>
                    <p className="text-lg font-bold text-slate-900">{r.to}</p>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-slate-600">Duration: <span className="font-semibold text-slate-900">{r.time}</span></span>
                  <span className="text-slate-600">Starts: <span className="font-semibold text-slate-900">{r.price}</span></span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="py-10 sm:py-14">
          <BusMapPreview />
        </section>

        <section className="pb-12 sm:pb-16">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
              <div>
                <h3 className="text-2xl sm:text-3xl font-extrabold">Trusted by travelers</h3>
                <p className="text-slate-600 mt-2 max-w-2xl">
                  Simple booking, real-time tracking, and reliable support — designed for everyday travel.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full lg:w-auto">
                <div className="rounded-2xl border border-slate-100 p-4 text-center">
                  <BadgeCheck className="h-5 w-5 text-rose-600 mx-auto" />
                  <p className="mt-2 text-sm font-semibold">Verified UI</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 text-center">
                  <ShieldCheck className="h-5 w-5 text-rose-600 mx-auto" />
                  <p className="mt-2 text-sm font-semibold">Secure Auth</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 text-center">
                  <Clock className="h-5 w-5 text-rose-600 mx-auto" />
                  <p className="mt-2 text-sm font-semibold">Fast UX</p>
                </div>
                <div className="rounded-2xl border border-slate-100 p-4 text-center">
                  <Headphones className="h-5 w-5 text-rose-600 mx-auto" />
                  <p className="mt-2 text-sm font-semibold">Support</p>
                </div>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { name: "Traveler", text: "Booking was quick and the live tracking helped me plan perfectly." },
                { name: "Daily Commuter", text: "ETA updates are accurate. I reach the stop at the right time." },
                { name: "Family Trip", text: "Clean UI, great deals, and easy cancellations — smooth experience." },
              ].map((t) => (
                <div key={t.name} className="rounded-3xl border border-slate-100 p-6 bg-gradient-to-b from-white to-rose-50/30">
                  <div className="flex items-center gap-1 text-rose-600">
                    <Star className="h-4 w-4 fill-rose-600" />
                    <Star className="h-4 w-4 fill-rose-600" />
                    <Star className="h-4 w-4 fill-rose-600" />
                    <Star className="h-4 w-4 fill-rose-600" />
                    <Star className="h-4 w-4" />
                  </div>
                  <p className="mt-3 text-slate-700">{t.text}</p>
                  <p className="mt-4 text-sm font-semibold text-slate-900">— {t.name}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <Contact />
      <Footer />
    </div>
  );
}

export default Home;
