import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useNavigate, useLocation } from 'react-router-dom';

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
          Go to Order Summary
        </button>
      </form>
    </div>
  );
}
