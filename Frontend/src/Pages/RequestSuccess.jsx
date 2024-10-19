import React, { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; 
import AOS from 'aos'; // Import AOS
import 'aos/dist/aos.css'; // Import AOS styles

export default function RequestSuccess() {
  const navigate = useNavigate(); 

  useEffect(() => {
    AOS.init(); 
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-green-50">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md text-center">
        <div className="mb-4" data-aos="fade-up">
          <FaCheckCircle className="text-green-500 text-6xl mb-2" />
        </div>
        <h1 className="text-2xl font-bold mb-2" data-aos="fade-up">
          Success!
        </h1>
        <p className="text-gray-700 mb-4" data-aos="fade-up">
          Your request has been successfully submitted.
        </p>
        <p className="text-gray-600 mb-6" data-aos="fade-up">
          Thank you for helping us keep the environment clean. We will get back to you shortly.
        </p>
        <button 
          className="bg-green-500 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 hover:bg-green-600" 
          data-aos="fade-up" 
          onClick={() => navigate('/dashboard?tab=myrequest')} 
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
}
