import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useLocation, useNavigate } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function CollectionRequestForm() {
  const [userId, setUserId] = useState('');
  const [qrCodeData, setQrCodeData] = useState('');
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
  const location = useLocation(); // To receive state passed from Home page

  // Initialize form with user data from Home
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

    // Initialize map if longitude and latitude are available
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

        // Update location when the marker is dragged
        markerRef.current.on('dragend', () => {
          const lngLat = markerRef.current.getLngLat();
          setLongitude(lngLat.lng);
          setLatitude(lngLat.lat);
          reverseGeocode(lngLat.lng, lngLat.lat); // Call reverse geocoding to update address
        });
      }
    }
  }, [longitude, latitude, location.state]);

  // Reverse geocode to get address
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/bin/createbin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          userName,
          userEmail,
          longitude,
          latitude,
          address,
          binLevels,
          overallPercentage,
        }),
      });
      const data = await response.json();
      setQrCodeData(`Bin ID: ${data.bin._id}, User ID: ${userId}, Overall Percentage: ${overallPercentage}%`);  
      navigate('/request-confirmation');
    } catch (error) {
      console.error('Error submitting request:', error);
    }
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Waste Collection Request</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Name:</label>
          <input
            type="text"
            value={userName}
            disabled
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Email:</label>
          <input
            type="email"
            value={userEmail}
            disabled
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Location:</label>
          <div ref={mapContainerRef} className="w-full h-64 rounded-md bg-gray-200" />
          {address && <p className="mt-2 text-gray-500">{address}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold">Overall Bin Fill Percentage:</label>
          <input
            type="text"
            value={`${overallPercentage}%`}
            disabled
            className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Food Bin Level:</label>
            <input
              type="text"
              value={`${binLevels.foodBin} / 100`}
              disabled
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Plastic Bin Level:</label>
            <input
              type="text"
              value={`${binLevels.plasticBin} / 100`}
              disabled
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">Paper Bin Level:</label>
            <input
              type="text"
              value={`${binLevels.paperBin} / 100`}
              disabled
              className="mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 w-full bg-green-600 text-white py-2 rounded-lg shadow-lg hover:bg-green-700 transition-all"
        >
          Submit Collection Request
        </button>
      </form>

      
    </div>
  );
}
