import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function RequestSuccess() {
  const navigate = useNavigate(); 

  useEffect(() => {
    AOS.init(); 
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-md text-center" data-aos="zoom-in" data-aos-duration="1000">
        <div className="mb-6" data-aos="flip-up" data-aos-delay="200">
          <FaCheckCircle className="text-green-500 text-8xl mb-4 animate-pulse" />
        </div>
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4" data-aos="fade-up" data-aos-delay="400">
          Request Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-4" data-aos="fade-up" data-aos-delay="500">
          Your waste collection request has been successfully submitted.
        </p>
        <p className="text-base text-gray-500 mb-8" data-aos="fade-up" data-aos-delay="600">
          Thank you for your contribution to a cleaner environment. We’ll process your request shortly.
        </p>
        <button 
          className="bg-green-500 text-white font-semibold py-2 px-6 rounded-full shadow-lg hover:bg-green-600 transition duration-300 transform hover:scale-105" 
          data-aos="fade-up" 
          data-aos-delay="700"
          onClick={() => navigate('/dashboard?tab=myrequest')} 
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
