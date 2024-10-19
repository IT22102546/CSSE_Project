import React, { useEffect } from 'react';
import { FaHandsHelping, FaLeaf, FaRecycle, FaGlobe } from 'react-icons/fa';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function AboutUs() {

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="container mx-auto py-16">
        <h2 className="text-4xl font-bold text-center text-green-800 mb-8" data-aos="fade-down">About Us</h2>

        {/* Company Mission */}
        <section className="bg-white p-8 rounded-lg shadow-lg mb-12" data-aos="fade-up">
          <h3 className="text-2xl font-bold text-green-700 mb-4">Our Mission</h3>
          <p className="text-gray-600 text-lg">
            At <span className="text-green-600 font-semibold">EcoCollect</span>, our mission is to promote sustainable waste management practices that positively impact the environment and communities. By making waste collection easy and efficient, we aim to reduce the environmental footprint, encourage recycling, and keep our planet clean.
          </p>
        </section>

        {/* Values Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-green-100 p-6 rounded-lg shadow-md text-center" data-aos="zoom-in">
            <FaLeaf className="text-green-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-green-700 mb-2">Sustainability</h3>
            <p className="text-gray-600">We are committed to reducing waste and promoting recycling, helping to protect our environment for future generations.</p>
          </div>

          <div className="bg-yellow-100 p-6 rounded-lg shadow-md text-center" data-aos="zoom-in">
            <FaHandsHelping className="text-yellow-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-yellow-700 mb-2">Community</h3>
            <p className="text-gray-600">Working closely with communities to improve waste management and promote healthier living environments.</p>
          </div>

          <div className="bg-blue-100 p-6 rounded-lg shadow-md text-center" data-aos="zoom-in">
            <FaRecycle className="text-blue-600 text-5xl mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-blue-700 mb-2">Innovation</h3>
            <p className="text-gray-600">Constantly improving our technology and processes to ensure the most efficient waste management systems possible.</p>
          </div>
        </section>

        {/* Global Impact Section */}
        <section className="bg-gradient-to-r from-green-400 to-green-600 text-white p-8 rounded-lg shadow-lg text-center" data-aos="fade-up">
          <h3 className="text-2xl font-bold mb-4">Our Global Impact</h3>
          <p className="text-lg mb-4">
            Over the years, <span className="font-semibold">EcoCollect</span> has made a significant impact on waste reduction and recycling efforts worldwide. With our advanced systems and commitment to sustainability, we've helped communities globally reduce waste and recycle more efficiently.
          </p>
          <FaGlobe className="text-5xl mx-auto mb-4" />
          <p className="text-lg font-semibold">Join us in making a positive difference!</p>
        </section>

        {/* Call to Action */}
        <section className="mt-12 text-center">
          <h4 className="text-xl font-bold mb-4 text-green-700" data-aos="fade-right">Want to Make a Difference?</h4>
          <p className="text-gray-600 text-lg mb-6" data-aos="fade-left">Partner with <span className="text-green-600 font-semibold">EcoCollect</span> today to help promote sustainable practices and create a cleaner, greener future for all.</p>
          <a href="/contact" className="bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-green-700 transition duration-300" data-aos="zoom-in">Contact Us</a>
        </section>
      </div>
    </div>
  );
}
