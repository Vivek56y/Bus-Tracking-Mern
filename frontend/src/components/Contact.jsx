import React from "react";
import { Mail, Phone, MapPin, Github, Linkedin, Globe } from "lucide-react";

function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center p-6">
      <div className="max-w-3xl w-full bg-white shadow-xl rounded-2xl p-10">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">👨‍💻 Developer & App Owner</h1>
          <h2 className="text-2xl font-semibold text-gray-800">Vivek Ahir</h2>
          <p className="text-gray-500 mt-2">Full Stack Web Developer | MERN Stack | UI/UX Enthusiast</p>
        </div>

        {/* Contact Details */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-center gap-3 border p-4 rounded-lg hover:shadow-md transition">
            <Mail className="text-blue-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Email</h3>
              <p className="text-gray-600">vivek.ahir@example.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border p-4 rounded-lg hover:shadow-md transition">
            <Phone className="text-blue-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Phone</h3>
              <p className="text-gray-600">+91 98765 43210</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border p-4 rounded-lg hover:shadow-md transition">
            <MapPin className="text-blue-500 w-6 h-6" />
            <div>
              <h3 className="font-semibold text-gray-800">Location</h3>
              <p className="text-gray-600">Navi Mumbai, Maharashtra, India</p>
            </div>
          </div>

          <div className="flex items-center gap-3 border p-4 rounded-lg hover:shadow-md transition">
            <Globe className="text-blue-500 w-6 h-6" />
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
            <Linkedin className="w-7 h-7 text-blue-600 hover:text-blue-700 transition" />
          </a>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>@{new Date().getFullYear()} BusGo | Developed by <span className="text-blue-600 font-medium">Vivek Ahir</span></p>
        </div>
      </div>
    </div>
  );
}

export default Contact;
