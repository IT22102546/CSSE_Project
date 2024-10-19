import React from 'react';
import { useLocation } from 'react-router-dom';
import PayButton from '../Components/PayButton';
import { useSelector } from 'react-redux';

export default function OrderSummary() {
  const location = useLocation();
  const { userId, userName, userEmail, longitude, latitude, address, binLevels, overallPercentage } = location.state;
  
  const { currentUser , loading } = useSelector(state => state.user);

  // Function to calculate the distance to Battaramulla
  const calculateDistanceToBattaramulla = (lng, lat) => {
    const battaramulla = { lng: 79.9585, lat: 6.9271 };
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat - battaramulla.lat) * (Math.PI / 180);
    const dLng = (lng - battaramulla.lng) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat) * (Math.PI / 180)) * Math.cos((battaramulla.lat) * (Math.PI / 180)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const totalPrice = 400 + (30 * calculateDistanceToBattaramulla(longitude, latitude));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Order Summary</h2>
      <p>Name: {userName}</p>
      <p>Email: {userEmail}</p>
      <p>Address: {address}</p>
      <p>Overall Bin Fill Percentage: {overallPercentage}%</p>
      <p>Food Bin Level: {binLevels.foodBin}/100</p>
      <p>Plastic Bin Level: {binLevels.plasticBin}/100</p>
      <p>Paper Bin Level: {binLevels.paperBin}/100</p>
      <p>Total Price: LKR {totalPrice.toFixed(2)}</p>

      {/* Pass the order details to the PayButton component */}
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
  );
}
