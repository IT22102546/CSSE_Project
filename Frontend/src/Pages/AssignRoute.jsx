import React, { useEffect, useState } from "react";
import { Alert, Button, Select, TextInput } from "flowbite-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function AssignRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    binId:"",
    userId: "",
    userName: "",
    longitude: "",
    latitude: "",
    address: "",
    driverId: "",
    truckId: "",
    status: "Pending", // Default value
  });
  const [binData, setBinData] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [assignError, setAssignError] = useState(null);
  const { id } = useParams(); // Get the bin ID from the URL params
  const navigate = useNavigate();

  // Fetch the bin details and trucks
  useEffect(() => {
    const fetchBinDetails = async () => {
      try {
        const res = await fetch(`/api/bin/get-bin/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setBinData(data);
          setFormData((prev) => ({
            ...prev,
            binId: data._id,
            userId: data.userId,
            userName: data.userName,
            address: data.address,
            longitude: data.longitude,
            latitude: data.latitude,
          }));
        }
      } catch (error) {
        console.error("Error fetching the bin details:", error);
      }
    };

    const fetchTrucks = async () => {
      try {
        const res = await fetch("/api/truck/get-all-trucks");
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else if (Array.isArray(data)) {
          setTrucks(data);
        } else {
          console.error("Trucks data is not in the expected format:", data);
          setTrucks([]);
        }
      } catch (error) {
        console.error("Error fetching trucks:", error);
        setTrucks([]);
      }
    };

    fetchBinDetails();
    fetchTrucks();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  console.log(formData)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assign-route/create-assign-route`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setAssignError(data.message);
        return;
      }

      setAssignError(null);
      alert("Route assigned successfully!");
      navigate("/dashboard?tab=routes");
    } catch (error) {
      console.error(error);
      setAssignError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      
      <h1 className="text-center text-3xl my-7 font-semibold">Assign Truck to Bin</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center gap-4">
          {/* Bin Details */}
          {binData && (
            <div className="mb-4">
              <p className="font-semibold text-green-500">Bin Location: {binData.address}</p>
              <p>Overall Percentage: {binData.overallPercentage}%</p>
            </div>
          )}

          {/* User ID */}
          <label className="font-semibold">User ID</label>
          <TextInput
            type="text"
            name="userId"
            value={formData.userId}
            onChange={handleChange}
            label="User ID"
            placeholder="Enter User ID"
            required
          />

          {/* User Name */}
          <label className="font-semibold">User Name</label>
          <TextInput
            type="text"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            label="User Name"
            placeholder="Enter User Name"
            required
          />

          {/* Longitude */}
          <label className="font-semibold">Longitude</label>
          <TextInput
            type="number"
            name="longitude"
            value={formData.longitude}
            onChange={handleChange}
            label="Longitude"
            placeholder="Enter Longitude"
            required
          />

          {/* Latitude */}
          <label className="font-semibold">Latitude</label>
          <TextInput
            type="number"
            name="latitude"
            value={formData.latitude}
            onChange={handleChange}
            label="Latitude"
            placeholder="Enter Latitude"
            required
          />

          {/* Address */}
          <label className="font-semibold">Address</label>
          <TextInput
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            label="Address"
            placeholder="Enter Address"
            required
          />

          {/* Select Truck */}
          <label className="font-semibold">Select Truck</label>
          <Select
            id="truckId"
            name="truckId"
            className="p-2 mb-2"
            value={formData.truckId}
            onChange={handleChange}
            required
          >
            <option value="">Select a truck</option>
            {trucks.map((truck) => (
              <option key={truck._id} value={truck.truckId}>
                Truck ID: {truck.truckId} - Driver: {truck.driver}
              </option>
            ))}
          </Select>

          {/* Status */}
          <label className="font-semibold">Status</label>
          <Select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="p-2 mb-2"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </div>

        <Button type="submit" className="mt-4 w-full bg-blue-700 hover:bg-blue-800 text-white">
          Assign Truck
        </Button>

        {assignError && (
          <Alert color="failure" className="mt-5">
            {assignError}
          </Alert>
        )}
      </form>
    </div>
  );
}
