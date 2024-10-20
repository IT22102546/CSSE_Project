import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FaTrash, FaRecycle, FaUtensils, FaMapMarkerAlt, FaMoneyBillWave } from 'react-icons/fa';
import PayButton from '../Components/PayButton';
import { useSelector } from 'react-redux';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function OrderSummary() {
  const location = useLocation();
  const { userId, userName, userEmail, longitude, latitude, address, binLevels, overallPercentage } = location.state;
  
  const { currentUser, loading } = useSelector(state => state.user);

  // Initialize AOS
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  // Function to calculate the distance to Battaramulla
  const calculateDistanceToBattaramulla = (lng, lat) => {
    const battaramulla = { lng: 79.9585, lat: 6.9271 };
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat - battaramulla.lat) * (Math.PI / 180);
    const dLng = (lng - battaramulla.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat * (Math.PI / 180)) * Math.cos(battaramulla.lat * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const distanceToBattaramulla = calculateDistanceToBattaramulla(longitude, latitude).toFixed(2);
  const totalPrice = 400 + (30 * distanceToBattaramulla);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col items-center p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8" data-aos="fade-up">
        <h2 className="text-3xl font-bold mb-6 text-green-800 text-center" data-aos="fade-down">Order Summary</h2>

        {/* User Info */}
        <div className="mb-6 text-center" data-aos="fade-right">
          <FaMapMarkerAlt className="text-green-600 text-4xl mx-auto mb-2" />
          <p className="text-xl font-semibold text-gray-800">Name: <span className="text-gray-600">{userName}</span></p>
          <p className="text-xl font-semibold text-gray-800">Email: <span className="text-gray-600">{userEmail}</span></p>
          <p className="text-xl font-semibold text-gray-800">Address: <span className="text-gray-600">{address}</span></p>
        </div>

        {/* Overall Bin Fill */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 mb-6 rounded-lg shadow-lg text-center" data-aos="zoom-in">
          <h3 className="text-xl font-semibold text-white mb-4">Overall Bin Fill Percentage</h3>
          <p className="text-3xl font-bold text-white">{overallPercentage}%</p>
        </div>

        {/* Bin Levels with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Food Bin */}
          <div className="bg-green-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-right">
            <FaUtensils className="text-green-600 text-4xl mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">Food Bin Level</h3>
            <p className="text-xl font-semibold text-gray-800">{binLevels.foodBin} / 100</p>
          </div>

          {/* Plastic Bin */}
          <div className="bg-yellow-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-up">
            <FaRecycle className="text-yellow-600 text-4xl mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">Plastic Bin Level</h3>
            <p className="text-xl font-semibold text-gray-800">{binLevels.plasticBin} / 100</p>
          </div>

          {/* Paper Bin */}
          <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-left">
            <FaTrash className="text-blue-600 text-4xl mx-auto mb-2" />
            <h3 className="text-lg font-bold text-gray-800">Paper Bin Level</h3>
            <p className="text-xl font-semibold text-gray-800">{binLevels.paperBin} / 100</p>
          </div>
        </div>

        {/* Distance and Total Price */}
        <div className="mt-8 text-center bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg shadow-lg" data-aos="fade-up">
          <h3 className="text-xl font-semibold text-white mb-4">Distance to Battaramulla</h3>
          <p className="text-3xl font-bold text-white mb-4">{distanceToBattaramulla} km</p>

          <div className="flex items-center justify-center text-white text-2xl font-bold">
            <FaMoneyBillWave className="mr-2" />
            <span>Total Price: LKR {totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Pay Button */}
        <div className="mt-6 text-center" data-aos="">
          <PayButton
            userId={userId}
            userName={userName}
            userEmail={userEmail}
            totalPrice={totalPrice}
            longitude={longitude}
            latitude={latitude}
            address={address}
            binLevels={binLevels}
            overallPercentage={overallPercentage}
          />
        </div>
      </div>
    </div>
  );
}
