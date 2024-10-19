import React, { useEffect } from 'react';
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt, FaFacebookF, FaTwitter, FaInstagram, FaLinkedin, FaYoutube, FaClock, FaCalendarAlt, FaCommentDots } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function ContactUs() {
  
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gradient-to-b from-purple-100 via-pink-100 to-yellow-100 min-h-screen p-6">
      <div className="container mx-auto py-16">
        <h2 className="text-5xl font-extrabold text-center text-purple-900 mb-8" data-aos="fade-down">Contact Us</h2>

        {/* Contact Information */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300" data-aos="fade-up">
            <FaPhoneAlt className="text-blue-600 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Call Us</h3>
            <p className="text-gray-700">+123-456-7890</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300" data-aos="fade-up">
            <FaEnvelope className="text-green-600 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Email Us</h3>
            <p className="text-gray-700">info@ecocollect.com</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-lg text-center transform hover:scale-105 transition duration-300" data-aos="fade-up">
            <FaMapMarkerAlt className="text-red-600 text-5xl mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-purple-800 mb-2">Visit Us</h3>
            <p className="text-gray-700">123 Green Street, Battaramulla</p>
          </div>
        </section>

        {/* Message Section */}
        <section className="bg-gradient-to-r from-green-400 to-blue-500 p-8 rounded-lg shadow-lg text-center" data-aos="zoom-in">
          <FaCommentDots className="text-white text-6xl mx-auto mb-4" />
          <h3 className="text-3xl font-bold text-white mb-4">We'd Love to Hear from You!</h3>
          <p className="text-lg text-white mb-6">
            Whether you have questions, feedback, or just want to say hello, feel free to reach out. 
            Our team is always here to help and make your experience better.
          </p>
          <p className="text-white text-lg">
            Connect with us through social media or use any of the contact details above to get in touch.
          </p>
        </section>

        {/* Social Media Links */}
        <section className="mt-12 text-center">
          <h4 className="text-2xl font-bold text-purple-800 mb-6" data-aos="fade-right">Follow Us</h4>
          <div className="flex justify-center space-x-8 text-4xl text-gray-600" data-aos="fade-left">
            <a href="#" className="hover:text-blue-600 transition duration-300" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-blue-400 transition duration-300" aria-label="Twitter">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-pink-600 transition duration-300" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-700 transition duration-300" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a href="#" className="hover:text-red-600 transition duration-300" aria-label="YouTube">
              <FaYoutube />
            </a>
          </div>
          <p className="mt-6 text-gray-800 text-lg" data-aos="fade-in">Stay connected and up to date with all the latest news from EcoCollect. Follow us on our social media platforms!</p>
        </section>
        
        {/* Additional Information Section */}
        <section className="mt-16 bg-white p-8 rounded-lg shadow-lg text-center" data-aos="zoom-in-up">
          <FaClock className="text-yellow-600 text-6xl mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-purple-800 mb-4">Office Hours</h3>
          <div className="text-lg text-gray-700 mb-4">
            <FaCalendarAlt className="inline-block text-blue-500 mr-2" /> 
            <span>Monday - Friday: 9:00 AM - 6:00 PM</span>
          </div>
          <div className="text-lg text-gray-700 mb-4">
            <FaCalendarAlt className="inline-block text-blue-500 mr-2" /> 
            <span>Saturday: 10:00 AM - 4:00 PM</span>
          </div>
          <div className="text-lg text-gray-700">
            <FaCalendarAlt className="inline-block text-blue-500 mr-2" /> 
            <span>Sunday: Closed</span>
          </div>
        </section>
      </div>
    </div>
  );
}
