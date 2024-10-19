import React, { useEffect, useState } from "react";
import { Table, Alert, Button, TextInput } from "flowbite-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function DashAssignedRoutes() {
  const { currentUser } = useSelector((state) => state.user);
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [filteredRoutes, setFilteredRoutes] = useState([]);
  const [truckId, setTruckId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if the page has been loaded before
    if (!localStorage.getItem("dashAssignedRoutesLoaded")) {
      // If not, set the flag and reload the page
      localStorage.setItem("dashAssignedRoutesLoaded", "true");
      window.location.reload();
    } else {
      // Remove the flag after reloading
      localStorage.removeItem("dashAssignedRoutesLoaded");
    }
  }, []);

  useEffect(() => {
    if (currentUser?.isCollector) {
      const fetchAssignedRoutes = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/assign-route/get-all-assigned-routes");
          const data = await res.json();
          if (res.ok) {
            setAssignedRoutes(data);
          } else {
            setError("Failed to fetch assigned routes.");
          }
        } catch (error) {
          console.error("Error fetching assigned routes:", error);
          setError("An error occurred while fetching assigned routes.");
        } finally {
          setLoading(false);
        }
      };

      fetchAssignedRoutes();
    }
  }, [currentUser]);

  const handleTruckIdChange = (e) => {
    setTruckId(e.target.value);
  };

  const handleFilter = () => {
    const filtered = assignedRoutes.filter((route) => route.truckId === truckId);
    setFilteredRoutes(filtered);
  };

  const handleStartCollecting = (route) => {
    navigate("/dashboard?tab=collectionmap", { state: { route } });
  };

  if (!currentUser?.isCollector) {
    return <div>Access Denied. This page is only accessible to collectors.</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-center text-3xl my-7 font-semibold">Assigned Routes</h1>
      
      {/* Form for entering truck ID */}
      <div className="mb-6">
        <TextInput
          id="truckId"
          type="text"
          placeholder="Enter your truck ID"
          value={truckId}
          onChange={handleTruckIdChange}
          required
          className="mb-2"
        />
        <Button onClick={handleFilter} className="bg-indigo-700 hover:bg-indigo-800 text-white rounded-3xl">
          Show Assigned Routes
        </Button>
      </div>

      {loading && <div>Loading...</div>}

      {error && <Alert color="failure">{error}</Alert>}

      {!loading && filteredRoutes.length > 0 && (
        <div className="p-4 bg-white shadow-md rounded-lg">
          <Table>
            <Table.Head>
              <Table.HeadCell>Customer Name</Table.HeadCell>
              <Table.HeadCell>Truck ID</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Coordinations</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {filteredRoutes.map((route) => (
                <Table.Row key={route._id} className="bg-white">
                  <Table.Cell>{route.userName}</Table.Cell>
                  <Table.Cell>{route.truckId}</Table.Cell>
                  <Table.Cell>{route.address}</Table.Cell>
                  <Table.Cell>{route.longitude} <br /> {route.latitude}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`${
                        route.status === "Completed" ? "text-green-600" : "text-red-600"
                      } font-medium`}
                    >
                      {route.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Button
                      onClick={() => handleStartCollecting(route)}
                      className="bg-indigo-700 hover:bg-indigo-800 text-white text-sm rounded-3xl"
                    >
                      Start Collecting
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        </div>
      )}

      {!loading && filteredRoutes.length === 0 && truckId && (
        <div className="text-center text-gray-500">No assigned routes found for this truck ID.</div>
      )}
    </div>
  );
}
