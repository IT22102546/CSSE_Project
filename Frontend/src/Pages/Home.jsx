
import React, { useEffect, useState, useRef } from 'react'
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import location from '../assets/images/location.png';
import trashIcon from '../assets/images/trashbg.png';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { FaTrash, FaRecycle, FaUtensils, FaClipboardList, FaLeaf } from 'react-icons/fa'; 
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function Home() {
  // State and ref declarations
  const [longitude, setLongitude] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState(null);
  const mapContainerRef = useRef(null);
  const mapInstance = useRef(null);
  const markerRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser , loading } = useSelector(state => state.user);

  const maxCapacity = 100;

  const getInitialBinValue = (binType) => {
    const savedValue = localStorage.getItem(binType);
    return savedValue ? parseFloat(savedValue) : 0;
  };

  const [foodBin, setFoodBin] = useState(getInitialBinValue('foodBin')); 
  const [plasticBin, setPlasticBin] = useState(getInitialBinValue('plasticBin')); 
  const [paperBin, setPaperBin] = useState(getInitialBinValue('paperBin')); 

  const [overallPercentage, setOverallPercentage] = useState(0);

  const getPercentage = (binValue) => ((binValue / maxCapacity) * 100).toFixed(2);

  const calculateOverallPercentage = () => {
    const totalBins = 3;
    const average = (foodBin + plasticBin + paperBin) / totalBins;
    return getPercentage(average);
  };

  const handleIncrease = (binSetter, binValue, binType) => {
    const newValue = Math.min(binValue + maxCapacity * 0.05, maxCapacity);
    binSetter(newValue);
    localStorage.setItem(binType, newValue);
  };

  const handleDecrease = (binSetter, binValue, binType) => {
    const newValue = Math.max(binValue - maxCapacity * 0.05, 0);
    binSetter(newValue);
    localStorage.setItem(binType, newValue);
  };

  const goToForm = () => {
    
    const userId = currentUser._id; 
    const userEmail = currentUser.email 
    const userName = currentUser.username
  
    navigate('/request', {
      state: {
        userId,
        userName,
        userEmail,
        foodBin,
        plasticBin,
        paperBin,
        overallPercentage,
        longitude,
        latitude,
        address,
      },
    });
  };

  useEffect(() => {
    AOS.init();

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords;
          setLongitude(longitude);
          setLatitude(latitude);
          setTimeout(() => {
            if (mapContainerRef.current && !mapInstance.current) {
              mapInstance.current = new mapboxgl.Map({
                container: mapContainerRef.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [longitude, latitude],
                zoom: 12,
              });

              const markerElement = document.createElement('div');
              const imgElement = document.createElement('img');
              imgElement.src = location;
              imgElement.alt = 'Location Icon';
              imgElement.style.width = '40px'; 
              imgElement.style.height = '40px';
              markerElement.appendChild(imgElement);

              markerRef.current = new mapboxgl.Marker({
                element: markerElement,
                draggable: true,
              })
                .setLngLat([longitude, latitude])
                .addTo(mapInstance.current);

              fetchAddress(longitude, latitude);

              markerRef.current.on('dragend', () => {
                const lngLat = markerRef.current.getLngLat();
                setLongitude(lngLat.lng);
                setLatitude(lngLat.lat);
                fetchAddress(lngLat.lng, lngLat.lat);
              });
            }
          }, 0);
        },
        (error) => {
          setError('Unable to retrieve location. Please check location services.');
        },
        { enableHighAccuracy: true }
      );
    } else {
      setError('Geolocation is not supported by your browser');
    }
  }, []);

  const fetchAddress = (lng, lat) => {
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)
      .then(response => response.json())
      .then(data => {
        if (data.features.length > 0) {
          setAddress(data.features[0].place_name);
        } else {
          setAddress("Address not found");
        }
      })
      .catch(() => setError('Failed to fetch address.'));
  };

  useEffect(() => {
    setOverallPercentage(calculateOverallPercentage());
  }, [foodBin, plasticBin, paperBin]);

  return (
    <div className="bg-green-50 min-h-screen flex flex-col items-center p-6">
      <h1 className="text-4xl font-bold text-center mb-6 text-green-800" data-aos="fade-up">Welcome to EcoWaste!</h1>
      <p className="text-lg text-center mb-4 text-gray-600" data-aos="fade-up" data-aos-delay="200">Your one-stop solution for responsible waste disposal and recycling.</p>
      <img src={trashIcon} alt="Trash Icon" className="w-16 h-16 mx-auto mb-4" data-aos="zoom-in" data-aos-delay="400" />

      {error ? (
        <p className="text-red-500 text-center" data-aos="fade-in">{error}</p>
      ) : (
        <div data-aos="fade-up" className="max-w-4xl w-full bg-white shadow-lg rounded-lg p-6">
          {longitude && latitude ? (
            <div>
              <div className="text-center mb-4" data-aos="fade-in" data-aos-delay="200">
                <p className="text-lg font-semibold text-gray-800">Longitude: <span className="text-gray-600">{longitude}</span></p>
                <p className="text-lg font-semibold text-gray-800">Latitude: <span className="text-gray-600">{latitude}</span></p>
                {address && <p className="text-lg font-semibold text-gray-800">Address: <span className="text-gray-600">{address}</span></p>}
              </div>
              <div ref={mapContainerRef} id="map" className="w-full h-96 rounded-lg bg-gray-200" data-aos="zoom-in" data-aos-delay="300"></div>
            </div>
          ) : (
            <p className="text-center">Fetching location...</p>
          )}

          {/* Overall Percentage UI with Icons and Animation */}
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 mt-8 rounded-lg shadow-lg text-center transition-transform transform hover:scale-105" data-aos="fade-up" data-aos-delay="400">
            <h3 className="text-xl font-semibold mb-2">Overall Bin Percentage</h3>
            <div className="flex justify-center items-center mb-4">
              <FaLeaf className="text-green-600 text-3xl animate-bounce mr-2" />
              <div className="w-32 h-32 mx-auto">
                <CircularProgressbar
                  value={overallPercentage}
                  text={`${overallPercentage}%`}
                  styles={buildStyles({
                    textSize: '24px',
                    pathColor: overallPercentage <= 50 ? 'green' : overallPercentage <= 75 ? 'blue' : 'red',
                    textColor: '#fff',
                    trailColor: '#f0f0f0',
                  })}
                />
              </div>
              <FaLeaf className="text-green-600 text-3xl animate-bounce ml-2" />
            </div>
            <p className="text-lg font-semibold">Keep it Green and Keep recycling and reducing waste to improve this percentage!</p>

            {/* Conditionally show the "Collect Waste" button when the overall percentage exceeds 75% */}
            {overallPercentage > 75 && (
              <button className="mt-4 bg-red-600 text-white font-bold py-2 px-6 rounded-full hover:bg-red-700 transition-all" onClick={goToForm}>
                Collect Waste
              </button>
            )}
          </div>

          {/* Individual bins UI */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Food Bin */}
            <div className="bg-green-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-right">
              <h2 className="text-xl font-bold">Food Bin</h2>
              <FaUtensils className="text-green-600 text-4xl my-2" />
              <p className="text-lg font-semibold">{foodBin} / {maxCapacity} kg</p>
              <div className="w-24 h-24 mx-auto mt-4">
                <CircularProgressbar
                  value={getPercentage(foodBin)}
                  text={`${getPercentage(foodBin)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: foodBin <= 50 ? 'green' : foodBin <= 75 ? 'blue' : 'red',
                    textColor: 'black',
                    trailColor: '#f0f0f0',
                  })}
                />
              </div>
              <div className="flex justify-around mt-4">
              <button onClick={() => handleIncrease(setFoodBin, foodBin, 'foodBin')} className="bg-green-500 text-white rounded-full px-4 py-2 hover:bg-green-600">
                  <FaRecycle /> Increase
                </button>
                <button onClick={() => handleDecrease(setFoodBin, foodBin, 'foodBin')} className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600">
                  <FaTrash /> Decrease
                </button>
              </div>
            </div>

            {/* Plastic Bin */}
            <div className="bg-yellow-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-up">
              <h2 className="text-xl font-bold">Plastic Bin</h2>
              <FaRecycle className="text-yellow-600 text-4xl my-2" />
              <p className="text-lg font-semibold">{plasticBin} / {maxCapacity} kg</p>
              <div className="w-24 h-24 mx-auto mt-4">
                <CircularProgressbar
                  value={getPercentage(plasticBin)}
                  text={`${getPercentage(plasticBin)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: plasticBin <= 50 ? 'green' : plasticBin <= 75 ? 'blue' : 'red',
                    textColor: 'black',
                    trailColor: '#f0f0f0',
                  })}
                />
              </div>
              <div className="flex justify-center mt-4">
              <button onClick={() => handleIncrease(setPlasticBin, plasticBin, 'plasticBin')} className="bg-blue-500 text-white rounded-full px-4 py-2 hover:bg-blue-600">
                  <FaRecycle /> Increase
                </button>
                <button onClick={() => handleDecrease(setPlasticBin, plasticBin, 'plasticBin')} className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600">
                  <FaTrash /> Decrease
                </button>
              </div>
            </div>

            {/* Paper Bin */}
            <div className="bg-blue-100 p-4 rounded-lg shadow-md text-center" data-aos="fade-left">
              <h2 className="text-xl font-bold">Paper Bin</h2>
              <FaClipboardList className="text-blue-600 text-4xl my-2" />
              <p className="text-lg font-semibold">{paperBin} / {maxCapacity} kg</p>
              <div className="w-24 h-24 mx-auto mt-4">
                <CircularProgressbar
                  value={getPercentage(paperBin)}
                  text={`${getPercentage(paperBin)}%`}
                  styles={buildStyles({
                    textSize: '16px',
                    pathColor: paperBin <= 50 ? 'green' : paperBin <= 75 ? 'blue' : 'red',
                    textColor: 'black',
                    trailColor: '#f0f0f0',
                  })}
                />
              </div>
              <div className="flex justify-center mt-4">
              <button onClick={() => handleIncrease(setPaperBin, paperBin, 'paperBin')} className="bg-yellow-500 text-white rounded-full px-4 py-2 hover:bg-yellow-600">
                  <FaRecycle /> Increase
                </button>
                <button onClick={() => handleDecrease(setPaperBin, paperBin, 'paperBin')} className="bg-red-500 text-white rounded-full px-4 py-2 hover:bg-red-600">
                  <FaTrash /> Decrease
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
