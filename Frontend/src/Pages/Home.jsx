import React, { useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function Home() {
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Ensure geolocation is supported
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLongitude(position.coords.longitude);
          setLatitude(position.coords.latitude);

          // Initialize the map after getting location
          const mapInstance = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mapbox/streets-v11',
            center: [position.coords.longitude, position.coords.latitude],
            zoom: 12,
          });

          // Create a red marker element
          const markerElement = document.createElement('div');
          markerElement.style.backgroundColor = 'red';
          markerElement.style.width = '20px';
          markerElement.style.height = '20px';
          markerElement.style.borderRadius = '50%';
          markerElement.style.border = '2px solid white';

          // Add the custom marker for the current location
          new mapboxgl.Marker({
            element: markerElement, // Use the red marker element
          })
            .setLngLat([position.coords.longitude, position.coords.latitude])
            .addTo(mapInstance);
        },
        (error) => {
          setError('Unable to retrieve location');
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Current Location</h1>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : longitude && latitude ? (
        <div>
          <p className="text-gray-700">Longitude: {longitude}</p>
          <p className="text-gray-700">Latitude: {latitude}</p>
          {/* Map container styled with Tailwind */}
          <div id="map" className="w-full h-96 mt-4 bg-gray-200 relative"></div>
        </div>
      ) : (
        <p>Fetching location...</p>
      )}
    </div>
  );
}
