import React, { useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = 'pk.eyJ1IjoiYWR3eDIwMDEiLCJhIjoiY20yZTdvMG04MDJodjJrcHZ6YXdwYnFqcyJ9.7xBkMPBN3cuuiFQSeJOnbA';

export default function WasteCollectorInterface() {
  const [map, setMap] = useState(null);
  const [collectorLocation, setCollectorLocation] = useState(null);
  const [binLocation] = useState({ lat: 7.737232299909295, lng: 80.54806395490593 });

  // Function to get the collector's location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCollectorLocation([longitude, latitude]);
        },
        (error) => {
          console.error("Error fetching location: ", error);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  }, []);

  // Initialize Mapbox map and set up route when locations are available
  useEffect(() => {
    if (collectorLocation && binLocation) {
      const map = new mapboxgl.Map({
        container: "map",
        style: "mapbox://styles/mapbox/streets-v11",
        center: collectorLocation,
        zoom: 12,
      });

      // Add markers for the collector and bin locations
      new mapboxgl.Marker().setLngLat(collectorLocation).addTo(map);
      new mapboxgl.Marker().setLngLat([binLocation.lng, binLocation.lat]).addTo(map);

      // Fetch route from collector to bin using Mapbox Directions API
      const fetchRoute = async () => {
        const response = await fetch(
          `https://api.mapbox.com/directions/v5/mapbox/driving/${collectorLocation[0]},${collectorLocation[1]};${binLocation.lng},${binLocation.lat}?geometries=geojson&access_token=${mapboxgl.accessToken}`
        );
        const data = await response.json();
        const route = data.routes[0].geometry;

        // Add the route to the map
        map.on("load", () => {
          map.addLayer({
            id: "route",
            type: "line",
            source: {
              type: "geojson",
              data: {
                type: "Feature",
                properties: {},
                geometry: route,
              },
            },
            layout: {
              "line-join": "round",
              "line-cap": "round",
            },
            paint: {
              "line-color": "#007bff",
              "line-width": 4,
            },
          });
        });
      };

      fetchRoute();

      setMap(map);

      // Clean up map when the component unmounts
      return () => map.remove();
    }
  }, [collectorLocation, binLocation]);

  return (
    <div
      id="map"
      style={{ height: "500px", width: "100%" }}
      className="rounded-md border"
    ></div>
  );
}
