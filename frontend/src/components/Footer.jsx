import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 text-center py-6 w-full">
      <p>© 2025 BusGo. All rights reserved.</p>
      
      {/* Social links (uncomment if needed) */}
      <div className="mt-3 flex justify-center gap-4">
        <a href="#" className="hover:text-white transition-colors">Facebook</a>
        <a href="#" className="hover:text-white transition-colors">Twitter</a>
        <a href="#" className="hover:text-white transition-colors">Instagram</a>
      </div>
    </footer>
  );
}

export default Footer;
