import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Textarea, TextInput } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateTruck() {
  const [formData, setFormData] = useState({
    truckId: '',
    driver: '',
    capacity: '',
    location: '',
    route: '',
    status: true, // true indicates "Available" and false indicates "On Job"
  });
  const [updateError, setUpdateError] = useState(null);
  const { id } = useParams(); // Get the ID from the URL params
  const navigate = useNavigate();

  // Fetch the truck details using id
  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const res = await fetch(`/api/truck/get-a-truck/${id}`); // Fetching the truck by ID
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setFormData({
            ...data,
            status: data.status ? "available" : "on_job", // Map status to a string for the dropdown
          }); // Pre-populate the form with truck data
        }
      } catch (error) {
        console.error("Error fetching the truck details:", error);
      }
    };

    fetchTruck();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert status string back to boolean
      const updatedData = {
        ...formData,
        status: formData.status === "available",
      };

      const res = await fetch(`/api/truck/update-truck/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData), // Send updated form data
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message);
        return;
      }

      setUpdateError(null);
      alert("Truck details updated successfully!");
      navigate("/dashboard?tab=trucks"); // Navigate back to trucks page
    } catch (error) {
      console.error(error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Truck Details</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Truck ID */}
          <label className="font-semibold">Truck ID</label>
          <TextInput
            type="text"
            required
            id="truckId"
            name="truckId"
            className="p-2 mb-2"
            value={formData.truckId}
            onChange={handleChange}
            placeholder="Enter truck ID"
          />

          {/* Driver */}
          <label className="font-semibold">Driver</label>
          <TextInput
            type="text"
            required
            id="driver"
            name="driver"
            className="p-2 mb-2"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Enter driver name"
          />

          {/* Capacity */}
          <label className="font-semibold">Capacity (kg)</label>
          <TextInput
            type="number"
            required
            id="capacity"
            name="capacity"
            className="p-2 mb-2"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Enter capacity"
          />

          {/* Location */}
          <label className="font-semibold">Location</label>
          <TextInput
            type="text"
            id="location"
            name="location"
            className="p-2 mb-2"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter location"
          />

          {/* Route */}
          <label className="font-semibold">Route</label>
          <Textarea
            id="route"
            name="route"
            className="p-2 mb-2"
            value={formData.route}
            onChange={handleChange}
            placeholder="Enter route"
          />

          {/* Status */}
          <label className="font-semibold">Status</label>
          <Select
            id="status"
            name="status"
            className="p-2 mb-2"
            value={formData.status}
            onChange={handleStatusChange}
          >
            <option value="available">Available</option>
            <option value="on_job">On Job</option>
          </Select>
        </div>

        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-white">
          Update Truck
        </Button>

        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
