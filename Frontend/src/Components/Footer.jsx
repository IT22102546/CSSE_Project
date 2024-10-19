import React from 'react';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaCopyright, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          {/* Social Media Links */}
          <div className="mb-4">
            <h2 className="text-lg font-bold mb-2">Connect with Us</h2>
            <div className="flex space-x-4">
              <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <FaFacebook className="text-2xl" />
              </a>
              <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <FaTwitter className="text-2xl" />
              </a>
              <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <FaInstagram className="text-2xl" />
              </a>
              <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-white transition transform hover:scale-110">
                <FaLinkedin className="text-2xl" />
              </a>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-gray-800 rounded-lg p-4 shadow-lg w-full md:w-1/3 text-center">
            <h2 className="text-lg font-bold mb-2">Contact Us</h2>
            <p className="flex items-center justify-center text-sm mb-1">
              <FaMapMarkerAlt className="mr-1" /> 123 Eco Lane, Green City, EC 12345
            </p>
            <p className="flex items-center justify-center text-sm mb-1">
              <FaPhone className="mr-1" /> (123) 456-7890
            </p>
            <p className="flex items-center justify-center text-sm">
              <FaEnvelope className="mr-1" /> info@yourcompany.com
            </p>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="text-center mt-6">
          <p className="text-sm">
            <FaCopyright className="inline mr-1" /> 2024 Your Company. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
