import React, { useState, useEffect } from 'react';
import { Button, Table } from 'flowbite-react';
import { format } from 'date-fns';
import mapboxgl from 'mapbox-gl';
import { Link } from 'react-router-dom';

// Mapbox access token
mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function DashRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/bin/getbins');
        const data = await res.json();
        if (res.ok) {
          // Filter bins where isRequested is true
          const filteredBins = data.bins.filter((bin) => bin.isRequested === true);
          setRequests(filteredBins);
          console.log('Fetched bin locations with isRequested = true:', filteredBins);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchRequests();
  }, []);
  

  useEffect(() => {
    if (!map && requests.length > 0) {
      const initializeMap = () => {
        // Check if the geolocation API is available
        if ('geolocation' in navigator) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;

              // Initialize the Mapbox map with the user's location as the center
              const mapInstance = new mapboxgl.Map({
                container: 'map', // Container ID
                style: 'mapbox://styles/mapbox/streets-v11', // Map style
                center: [longitude, latitude], // Initial map center (user's location)
                zoom: 12, // Initial zoom level
              });

              // Add user's current location as a blue marker
              new mapboxgl.Marker({ color: '#007bff' }) // Blue color for the marker
                .setLngLat([longitude, latitude])
                .setPopup(new mapboxgl.Popup().setText('Your Location'))
                .addTo(mapInstance);

              // Loop through each request and add a red marker for each bin location
              requests.forEach((request, index) => {
                if (request.longitude && request.latitude) {
                  console.log(`Adding marker for bin ${index + 1} at [${request.longitude}, ${request.latitude}]`);

                  new mapboxgl.Marker({ color: 'red' })
                    .setLngLat([request.longitude, request.latitude])
                    .setPopup(new mapboxgl.Popup().setText(`Bin at ${request.address}`))
                    .addTo(mapInstance);

                  // Fetch and draw the route from user's location to the bin location
                  fetchRoute([longitude, latitude], [request.longitude, request.latitude], mapInstance, index);
                } else {
                  console.error(`Bin ${index + 1} has invalid coordinates:`, request);
                }
              });

              // Set the map instance
              setMap(mapInstance);
            },
            (error) => {
              console.error('Error getting current location:', error);
              alert('Unable to retrieve your location. Please ensure location services are enabled.');
            }
          );
        } else {
          alert('Geolocation is not supported by your browser.');
        }
      };

      const fetchRoute = async (start, end, mapInstance, index) => {
        try {
          const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`
          );
          const routeData = await response.json();

          if (routeData.routes.length > 0) {
            const route = routeData.routes[0].geometry;

            // Create a unique layer ID for each route based on the index
            const layerId = `route-${index}`;
            if (mapInstance.getLayer(layerId)) {
              mapInstance.removeLayer(layerId);
              mapInstance.removeSource(layerId);
            }

            // Add the route as a layer to the map
            mapInstance.addLayer({
              id: layerId,
              type: 'line',
              source: {
                type: 'geojson',
                data: {
                  type: 'Feature',
                  properties: {},
                  geometry: route,
                },
              },
              layout: {
                'line-join': 'round',
                'line-cap': 'round',
              },
              paint: {
                'line-color': '#1DB954', // Route color
                'line-width': 4,
              },
            });
          }
        } catch (error) {
          console.error('Error fetching route:', error);
        }
      };

      initializeMap();
    }
  }, [map, requests]);

  return (
    <div className="p-4">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-xl font-bold mb-4 text-left">Collection Requests</h1>
          <div className='mb-5'>
          <Link to='/dashboard?tab=AssignedroutesAdminView'>
                <button className='p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>View truck assign</button>
          </Link>
          </div>
        <div id="map" className="w-full h-[60vh] mb-6 rounded-lg shadow-md mx-auto"></div>

        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : requests.length > 0 ? (
          <div className="overflow-x-auto">
            <Table hoverable className="shadow-md w-full">
              <Table.Head>
                <Table.HeadCell>Created At</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>Bin Levels</Table.HeadCell>
                <Table.HeadCell>Overall Percentage</Table.HeadCell>
                <Table.HeadCell>Assign Route</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {requests.map((request) => (
                  <Table.Row key={request._id}>
                    <Table.Cell>
                      {format(new Date(request.createdAt), 'MMMM d, yyyy HH:mm')}
                    </Table.Cell>
                    <Table.Cell>{request.userName}</Table.Cell>
                    <Table.Cell>{request.address}</Table.Cell>
                    <Table.Cell>
                      <div>Food Bin: {request.binLevels.foodBin}%</div>
                      <div>Plastic Bin: {request.binLevels.plasticBin}%</div>
                      <div>Paper Bin: {request.binLevels.paperBin}%</div>
                    </Table.Cell>
                    <Table.Cell>{request.overallPercentage}%</Table.Cell>
                    <Table.Cell>
                    <Link to={`/assign-route/${request._id}`}>
                      <Button size="xs" color="success">
                        Assign this Route
                      </Button>
                      </Link>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </div>
        ) : (
          <p className="text-center">No requests found.</p>
        )}
      </div>
    </div>
  );
}
