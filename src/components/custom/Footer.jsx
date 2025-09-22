import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border-t border-blue-200 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="simple-sticker p-2 bg-white/80 backdrop-blur-sm">
                <img
                  src="/logo.png"
                  alt="Smart Trip Logo"
                  className="w-6 h-6"
                />
              </div>
              <h3 className="text-2xl font-normal text-[#153582]" style={{fontFamily: 'Kranky, serif', lineHeight: '0.9', letterSpacing: '-0.02em'}}>Smart Trip</h3>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Your personal AI travel curator, creating custom itineraries tailored to your dreams and budget. 
              Discover amazing destinations with our intelligent planning system.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#153582] hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </div>
              <div className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center hover:bg-[#153582] hover:text-white transition-colors cursor-pointer">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24.009c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.012.001z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-[#153582] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-600 hover:text-[#153582] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/create-trip" className="text-gray-600 hover:text-[#153582] transition-colors">
                  Plan Trip
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#153582] transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-600 hover:text-[#153582] transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-lg font-semibold text-[#153582] mb-4">Features</h4>
            <ul className="space-y-2">
              <li className="text-gray-600">AI-Powered Planning</li>
              <li className="text-gray-600">Custom Itineraries</li>
              <li className="text-gray-600">Budget Optimization</li>
              <li className="text-gray-600">Real-time Updates</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-blue-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-600 text-sm mb-4 md:mb-0">
            © 2024 Smart Trip. All rights reserved.
          </div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="text-gray-600 hover:text-[#153582] transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-600 hover:text-[#153582] transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-gray-600 hover:text-[#153582] transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-4 right-4 simple-doodle text-sm pink-accent">✨</div>
        <div className="absolute bottom-8 left-8 simple-doodle text-xs text-[#153582] opacity-60">🌙</div>
      </div>
    </footer>
  );
}

export default Footer;
