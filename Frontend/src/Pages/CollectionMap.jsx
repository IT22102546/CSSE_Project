import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "mapbox-gl/dist/mapbox-gl.css";
import { Button, Alert } from "flowbite-react";
mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function CollectionMap() {
  const location = useLocation();
  const navigate = useNavigate();
  const { route } = location.state; // Get the route details passed from DashAssignedRoutes
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [routeDetails, setRouteDetails] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!route) return; // If no route is provided, exit

    const fetchRouteDetails = async () => {
      try {
        const res = await fetch(`/api/assign-route/get-a-assigned-route/${route._id}`);
        const data = await res.json();
        if (res.ok) {
          setRouteDetails(data);
        } else {
          setError("Failed to fetch route details.");
        }
      } catch (error) {
        console.error("Error fetching route details:", error);
        setError("An error occurred while fetching route details.");
      }
    };

    fetchRouteDetails();
  }, [route]);

  useEffect(() => {
    if (!routeDetails) return; // If no route details are available, exit

    if (map.current) return; // If map is already initialized, do nothing

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11', // Map style
      center: [routeDetails.longitude, routeDetails.latitude], // Initial map center
      zoom: 12, // Initial zoom level
    });

    // Add marker for the bin location
    new mapboxgl.Marker()
      .setLngLat([routeDetails.longitude, routeDetails.latitude])
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${routeDetails.userName}</h3><p>${routeDetails.address}</p>`))
      .addTo(map.current);

    // Add user's current location marker and fetch directions
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = [position.coords.longitude, position.coords.latitude];
          new mapboxgl.Marker({ color: "blue" })
            .setLngLat(userLocation)
            .setPopup(new mapboxgl.Popup().setHTML("<h3>Your Location</h3>"))
            .addTo(map.current);

          // Fit the map bounds to show both the user location and the bin location
          const bounds = new mapboxgl.LngLatBounds();
          bounds.extend(userLocation);
          bounds.extend([routeDetails.longitude, routeDetails.latitude]);
          map.current.fitBounds(bounds, { padding: 50 });

          // Fetch directions from Mapbox Directions API
          getRoute(userLocation, [routeDetails.longitude, routeDetails.latitude]);
        },
        (error) => {
          console.error("Error fetching user's location:", error);
        },
        { enableHighAccuracy: true }
      );
    }

    // Function to fetch and display the route
    const getRoute = async (start, end) => {
      const directionsUrl = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(directionsUrl);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const routeGeoJSON = {
          type: "Feature",
          geometry: data.routes[0].geometry,
        };

        // Add the route to the map
        map.current.addLayer({
          id: "route",
          type: "line",
          source: {
            type: "geojson",
            data: routeGeoJSON,
          },
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#007AFF",
            "line-width": 4,
          },
        });
      }
    };
  }, [routeDetails]);

  const handleUpdateStatus = async (newStatus) => {
    try {
      const res = await fetch(`/api/assign-route/update-assigned-route/${route._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        alert(`Status updated to ${newStatus}`);
        // Refetch route details after updating
        setRouteDetails((prev) => ({ ...prev, status: newStatus }));

        // If the status is marked as "Completed," reset the bin level
        if (newStatus === "Completed") {
          resetBinLevel(route.binId);
        }
      } else {
        setError("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      setError("An error occurred while updating the status.");
    }
  };

  const resetBinLevel = async (binId) => {
    try {
      const res = await fetch(`/api/bin/resetBins/${binId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (res.ok) {
        alert("Bin level reset to 0 successfully.");
      } else {
        setError("Failed to reset bin level.");
      }
    } catch (error) {
      console.error("Error resetting bin level:", error);
      setError("An error occurred while resetting the bin level.");
    }
  };

  const handleRecordCollectionDetails = () => {
    navigate("/dashboard?tab=reportCollectionData", {
      state: { binId: route.binId },
    });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-left text-2xl my-7 font-semibold font-sans">Collection Map</h1>

      {error && <Alert color="failure" className="mb-4">{error}</Alert>}

      <div
        ref={mapContainer}
        className="map-container"
        style={{ height: "500px", borderRadius: "8px" }}
      />

      <div className="flex flex-wrap">
        <Link to="/dashboard?tab=assignedRoutes">
          <button className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm rounded-3xl p-3 mb-5 mt-5 px-10">
            Return
          </button>
        </Link>
        <Button
          onClick={handleRecordCollectionDetails}
          className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm rounded-3xl p-1 mb-5 mt-5 px-10 ml-3"
        >
          Record Collection Details
        </Button>
      </div>
      <div>
        <h1 className="text-left text-2xl my-7 font-semibold font-sans">Current Bin</h1>
        <div className="flex gap-2">
          {routeDetails && (
            <>
              {routeDetails.status !== "Completed" && (
                <Button
                  onClick={() => handleUpdateStatus("Processing")}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white rounded-3xl"
                >
                  Mark as Processing
                </Button>
              )}
              {routeDetails.status === "Processing" && (
                <Button
                  onClick={() => handleUpdateStatus("Completed")}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-3xl"
                >
                  Mark as Completed
                </Button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
