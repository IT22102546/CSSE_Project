import React, { useEffect, useState } from "react";
import { Alert, Button, Select } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function UpdateAssignedRouteAdmin() {
  const { currentUser } = useSelector((state) => state.user);
  const [formData, setFormData] = useState({
    truckId: "",
    status: "Pending", // Default status value for collectors
  });
  const [assignedRoute, setAssignedRoute] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [updateError, setUpdateError] = useState(null);
  const { id } = useParams(); // Get the assigned route ID from the URL params
  const navigate = useNavigate();

  // Fetch the assigned route and truck details using the ID
  useEffect(() => {
    const fetchAssignedRoute = async () => {
      try {
        const res = await fetch(`/api/assign-route/get-a-assigned-route/${id}`);
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setAssignedRoute(data);
          setFormData((prev) => ({
            ...prev,
            truckId: data.truckId,
            status: data.status || "Pending",
          }));
        }
      } catch (error) {
        console.error("Error fetching the assigned route details:", error);
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

    fetchAssignedRoute();
    fetchTrucks();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/assign-route/update-assigned-route/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message);
        return;
      }

      setUpdateError(null);
      alert("Assigned route updated successfully!");
      navigate("/dashboard?tab=AssignedroutesAdminView"); // Navigate back to the assigned routes page
    } catch (error) {
      console.error(error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Assigned Route</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Truck ID Select */}
          <label className="font-semibold">Select Truck</label>
          {currentUser?.isAdmin && (

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
          )}

          {/* Collection Status (only for collectors) */}
          {currentUser?.isCollector && (
            <>
              <label className="font-semibold">Update Collection Status</label>
              <Select
                id="status"
                name="status"
                className="p-2 mb-2"
                value={formData.status}
                onChange={handleChange}
                required
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </Select>
            </>
          )}
        </div>

        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-white">
          Update Assigned Route
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
