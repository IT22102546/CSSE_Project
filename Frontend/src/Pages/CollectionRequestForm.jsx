import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { FaUser, FaEnvelope, FaMapMarkerAlt, FaTrashAlt, FaRecycle, FaMapSigns } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function CollectionRequestForm() {
  const [userId, setUserId] = useState('');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [address, setAddress] = useState('');
  const [overallPercentage, setOverallPercentage] = useState(0);
  const [binLevels, setBinLevels] = useState({
    foodBin: 0,
    plasticBin: 0,
    paperBin: 0,
  });
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    if (location.state) {
      const { userId, userName, userEmail, longitude, latitude, address, foodBin, plasticBin, paperBin, overallPercentage } = location.state;
      setUserId(userId);
      setUserName(userName);
      setUserEmail(userEmail);
      setLongitude(longitude);
      setLatitude(latitude);
      setAddress(address);
      setBinLevels({ foodBin, plasticBin, paperBin });
      setOverallPercentage(overallPercentage);
    }

    if (longitude && latitude) {
      if (mapContainerRef.current && !mapInstance.current) {
        mapInstance.current = new mapboxgl.Map({
          container: mapContainerRef.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [longitude, latitude],
          zoom: 12,
        });

        const markerElement = document.createElement('div');
        markerElement.style.backgroundImage = `url('https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png')`;
        markerElement.style.width = '40px';
        markerElement.style.height = '40px';

        markerRef.current = new mapboxgl.Marker({
          element: markerElement,
          draggable: true,
        })
          .setLngLat([longitude, latitude])
          .addTo(mapInstance.current);

        markerRef.current.on('dragend', () => {
          const lngLat = markerRef.current.getLngLat();
          setLongitude(lngLat.lng);
          setLatitude(lngLat.lat);
          reverseGeocode(lngLat.lng, lngLat.lat); // Update the address based on dragged location
        });
      }
    }
  }, [longitude, latitude, location.state]);

  const reverseGeocode = (lng, lat) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.features && data.features.length > 0) {
          setAddress(data.features[0].place_name);
        } else {
          setAddress('Unknown location');
        }
      })
      .catch(err => console.error('Error with reverse geocoding:', err));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log('Longitude:', longitude);
    console.log('Latitude:', latitude);
    console.log('Address:', address);

    if (longitude && latitude && address) {
      // Navigate to Order Summary page, passing all the necessary state
      navigate('/order-summary', {
        state: {
          userId,
          userName,
          userEmail,
          longitude,
          latitude,
          address,
          binLevels,
          overallPercentage
        }
      });
    } else {
      console.error('Location data is incomplete.');
    }
  };

  return (
    <div className="bg-gradient-to-b from-green-100 via-blue-100 to-purple-100 p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8" data-aos="fade-up">
      <h2 className="text-3xl font-bold text-center text-blue-900 mb-6">Waste Collection Request</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* User Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div data-aos="fade-right">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold">
              <FaUser className="text-green-600" />
              <span>Name:</span>
            </label>
            <input
              type="text"
              value={userName}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div data-aos="fade-left">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold">
              <FaEnvelope className="text-blue-600" />
              <span>Email:</span>
            </label>
            <input
              type="email"
              value={userEmail}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Map Section */}
        <div data-aos="fade-up">
          <label className="flex items-center space-x-2 text-gray-700 font-semibold">
            <FaMapMarkerAlt className="text-red-600" />
            <span>Location:</span>
          </label>
          <div ref={mapContainerRef} className="w-full h-64 rounded-md bg-gray-200 mt-2 shadow-lg" />
          {address && <p className="mt-2 text-gray-500 text-center">{address}</p>}
        </div>

        {/* Bin Levels */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" data-aos="fade-up">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold">
              <FaTrashAlt className="text-yellow-600" />
              <span>Food Bin Level:</span>
            </label>
            <input
              type="text"
              value={`${binLevels.foodBin}%`}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold">
              <FaRecycle className="text-blue-600" />
              <span>Plastic Bin Level:</span>
            </label>
            <input
              type="text"
              value={`${binLevels.plasticBin}%`}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md">
            <label className="flex items-center space-x-2 text-gray-700 font-semibold">
              <FaRecycle className="text-green-600" />
              <span>Paper Bin Level:</span>
            </label>
            <input
              type="text"
              value={`${binLevels.paperBin}%`}
              disabled
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Overall Percentage */}
        <div className="bg-white p-4 rounded-lg shadow-md text-center" data-aos="fade-up">
          <label className="flex justify-center items-center space-x-2 text-gray-700 font-semibold">
            <FaMapSigns className="text-purple-600" />
            <span>Overall Bin Fill Percentage:</span>
          </label>
          <p className="text-xl font-bold text-gray-800 mt-2">{overallPercentage}%</p>
        </div>

        <div className="text-center" data-aos="">
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-lg shadow-lg hover:bg-green-700 transition-all focus:outline-none focus:ring-4 focus:ring-green-300"
          >
            Go to Request Summary
          </button>
        </div>
      </form>
    </div>
  );
}
