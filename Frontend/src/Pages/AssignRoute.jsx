import React, { useEffect, useState } from "react";
import { Alert, Button, Select } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function AssignRoute() {
  const [formData, setFormData] = useState({
    truckId: "",
  });
  const [binData, setBinData] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [assignError, setAssignError] = useState(null);
  const { id } = useParams(); // Get the bin ID from the URL params
  const navigate = useNavigate();

  // Fetch the bin details using the ID
  useEffect(() => {
    const fetchBinDetails = async () => {
      try {
        const res = await fetch(`/api/bin/get-bin/${id}`); // Fetching the bin details by ID
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setBinData(data);
        }
      } catch (error) {
        console.error("Error fetching the bin details:", error);
      }
    };

    const fetchTrucks = async () => {
      try {
        const res = await fetch("/api/truck/get-all-trucks"); // Fetching all trucks
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else if (Array.isArray(data)) {
          setTrucks(data); // Set the fetched trucks directly as they are in an array
        } else {
          console.error("Trucks data is not in the expected format:", data);
          setTrucks([]); // Set to an empty array if the response doesn't contain trucks
        }
      } catch (error) {
        console.error("Error fetching trucks:", error);
        setTrucks([]); // Set to an empty array in case of error
      }
    };

    fetchBinDetails();
    fetchTrucks();
  }, [id]);

  const handleTruckChange = (e) => {
    setFormData({ ...formData, truckId: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assign-route/${id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send selected truck ID
      });

      const data = await res.json();
      if (!res.ok) {
        setAssignError(data.message);
        return;
      }

      setAssignError(null);
      alert("Route assigned successfully!");
      navigate("/dashboard?tab=AssignedRoutes"); // Navigate back to the assigned routes page
    } catch (error) {
      console.error(error);
      setAssignError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Assign Truck to Bin</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Bin Details */}
          {binData && (
            <div className="mb-4">
              <p className="font-semibold">Bin Location: {binData.address}</p>
              <p>Overall Percentage: {binData.overallPercentage}%</p>
            </div>
          )}

          {/* Select Truck */}
          <label className="font-semibold">Select Truck</label>
          <Select
            id="truckId"
            name="truckId"
            className="p-2 mb-2"
            value={formData.truckId}
            onChange={handleTruckChange}
          >
            <option value="">Select a truck</option>
            {trucks.map((truck) => (
              <option key={truck._id} value={truck._id}>
                Truck ID: {truck.truckId} - Driver: {truck.driver}
              </option>
            ))}
          </Select>
        </div>

        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-white">
          Assign Truck
        </Button>

        {assignError && (
          <Alert className="mt-5" color="failure">
            {assignError}
          </Alert>
        )}
      </form>
    </div>
  );
}
