import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Globe } from "lucide-react";

function Contact() {
  return (
    <div className="bg-gradient-to-b from-white to-rose-50/50 flex items-center justify-center px-4 sm:px-6 py-12 sm:py-16">
      <div className="max-w-5xl w-full bg-white shadow-sm rounded-3xl p-6 sm:p-10 border border-gray-100">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-rose-600 mb-2">Support & Contact</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Vivek Ahir</h2>
          <p className="text-gray-500 mt-2">
            Full Stack Web Developer | MERN Stack | UI/UX Enthusiast
          </p>
        </div>
        {/* Contact Details */}
        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mt-6">
          {/* Email */}
          <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-2xl hover:shadow-sm transition">
            <Mail className="text-rose-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">vivek.ahir@example.com</p>
            </div>
          </div>
          {/* Phone */}
          <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-2xl hover:shadow-sm transition">
            <Phone className="text-rose-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>
          {/* Location */}
          <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-2xl hover:shadow-sm transition">
            <MapPin className="text-rose-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-600">Navi Mumbai, Maharashtra, India</p>
            </div>
          </div>
          {/* Website */}
          <div className="flex items-center gap-3 border border-slate-200 p-4 rounded-2xl hover:shadow-sm transition">
            <Globe className="text-rose-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Website</h3>
              <p className="text-gray-600">www.vivekdev.in</p>
            </div>
          </div>
        </div>
        {/* Social Links */}
        <div className="flex justify-center gap-6 mt-10">
          <a href="https://github.com/vivekahir" target="_blank" rel="noreferrer">
            <Github className="w-7 h-7 text-gray-700 hover:text-black transition" />
          </a>
          <a href="https://linkedin.com/in/vivekahir" target="_blank" rel="noreferrer">
            <Linkedin className="w-7 h-7 text-rose-600 hover:text-rose-700 transition" />
          </a>
        </div>
        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>
            @{new Date().getFullYear()} BusGo &nbsp;|&nbsp; Developed by <span className="text-rose-600 font-medium">Vivek Ahir</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
