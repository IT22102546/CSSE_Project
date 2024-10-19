import React, { useEffect, useState } from "react";
import { Table, Button, Modal } from "flowbite-react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashAdminViewAssignedRoutes() {
  const [assignedRoutes, setAssignedRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [routeIdToDelete, setRouteIdToDelete] = useState("");

  useEffect(() => {
    const fetchAssignedRoutes = async () => {
      try {
        const response = await fetch("/api/assign-route/get-all-assigned-routes");
        if (response.ok) {
          const data = await response.json();
          setAssignedRoutes(data);
        } else {
          setError("Failed to fetch assigned routes");
        }
      } catch (error) {
        setError("Error occurred while fetching assigned routes");
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedRoutes();
  }, []);

  const handleDeleteRoute = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/assign-route/delete-assigned-route/${routeIdToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setAssignedRoutes((prev) => prev.filter((route) => route._id !== routeIdToDelete));
        alert("Assigned route deleted successfully.");
      } else {
        alert("Failed to delete the assigned route.");
      }
    } catch (error) {
      console.error("Error deleting assigned route:", error);
      alert("An error occurred while deleting the assigned route.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {/* Table Section */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-sans">Assigned Routes List</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>User ID</Table.HeadCell>
            <Table.HeadCell>User Name</Table.HeadCell>
            <Table.HeadCell>Truck ID</Table.HeadCell>
            <Table.HeadCell>Address</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {assignedRoutes.map((route) => (
              <Table.Row key={route._id} className="bg-white">
                <Table.Cell className="font-medium">{route.userId}</Table.Cell>
                <Table.Cell>{route.userName}</Table.Cell>
                <Table.Cell>{route.truckId}</Table.Cell>
                <Table.Cell>{route.address}</Table.Cell>
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
                  <div className="flex gap-2">
                    <Link to={`/update-assigned-route/${route._id}`}>
                      <Button size="xs" color="success">
                        Update
                      </Button>
                    </Link>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => {
                        setShowModal(true);
                        setRouteIdToDelete(route._id);
                      }}
                    >
                      Delete
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      </div>

      {/* Modal for Delete Confirmation */}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size="md"
      >
        <Modal.Header />
        <Modal.Body>
          <div className="text-center">
            <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 mb-4 mx-auto" />
            <h3 className="mb-5 text-lg text-gray-500">
              Are you sure you want to delete this assigned route?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteRoute}>
              Yes, I am sure
            </Button>
            <Button color="gray" onClick={() => setShowModal(false)}>
              No, cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
