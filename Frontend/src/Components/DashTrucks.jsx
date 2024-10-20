import { Table, Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function DashTrucks() {
  const [trucks, setTrucks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [truckIdToDelete, setTruckIdToDelete] = useState("");

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const response = await fetch("/api/truck/get-all-trucks");
        if (response.ok) {
          const data = await response.json();
          setTrucks(data);
        } else {
          setError("Failed to fetch trucks");
        }
      } catch (error) {
        setError("Error occurred while fetching trucks");
      } finally {
        setLoading(false);
      }
    };

    fetchTrucks();
  }, []);

  // Calculate counts for total trucks, available trucks, and trucks on the job
  const totalTrucks = trucks.length;
  const availableTrucks = trucks.filter((truck) => truck.status).length;
  const onJobTrucks = totalTrucks - availableTrucks;

  const handleDeleteTruck = async () => {
    setShowModal(false);
    try {
      const response = await fetch(`/api/truck/delete-truck/${truckIdToDelete}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setTrucks((prev) => prev.filter((truck) => truck._id !== truckIdToDelete));
        alert("Truck deleted successfully.");
      } else {
        alert("Failed to delete the truck.");
      }
    } catch (error) {
      console.error("Error deleting truck:", error);
      alert("An error occurred while deleting the truck.");
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
      <div className='flex flex-wrap gap-3 pt-5 pl-5 pb-4'>
            <Link to='/addtruck'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Add Truck</button>
            </Link>
            <Link to='/dashboard?tab=trucks'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Available Trucks</button>
            </Link>
            <Link to='/dashboard?tab=bindetails'>
                <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Bin Details</button>
            </Link>

        </div>
      {/* Tiles Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 rounded-lg bg-gradient-to-r from-blue-800 to-blue-900 text-white">
          <div className="flex items-center mb-2">
            <span className="inline-block w-2 h-2 bg-green-200 rounded-full mr-2"></span>
            <span className="text-sm">Total Trucks</span>
          </div>
          <p className="text-xs mb-1">As of Today</p>
          <p className="text-2xl font-semibold mb-2">
            {totalTrucks}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-700 to-indigo-900 text-white">
          <div className="flex items-center mb-2">
            <span className="inline-block w-2 h-2 bg-green-200 rounded-full mr-2"></span>
            <span className="text-sm">Trucks Available</span>
          </div>
          <p className="text-xs mb-1">As of Today</p>
          <p className="text-2xl font-semibold mb-2">
            {availableTrucks}
          </p>
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-red-700 to-red-800 text-white">
          <div className="flex items-center mb-2">
            <span className="inline-block w-2 h-2 bg-red-300 rounded-full mr-2"></span>
            <span className="text-sm">Trucks on Job</span>
          </div>
          <p className="text-xs mb-1">As of Today</p>
          <p className="text-2xl font-semibold mb-2">
            {onJobTrucks}
          </p>
        </div>
      </div>

      {/* Table Section */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-sans">Trucks List</h2>
        <Table>
          <Table.Head>
            <Table.HeadCell>Truck ID</Table.HeadCell>
            <Table.HeadCell>Driver</Table.HeadCell>
            <Table.HeadCell>Capacity (kg)</Table.HeadCell>
            <Table.HeadCell>Location</Table.HeadCell>
            <Table.HeadCell>Route</Table.HeadCell>
            <Table.HeadCell>Status</Table.HeadCell>
            <Table.HeadCell>Action</Table.HeadCell>
          </Table.Head>
          <Table.Body className="divide-y">
            {trucks.map((truck) => (
              <Table.Row key={truck._id} className="bg-white">
                <Table.Cell className="font-medium">{truck.truckId}</Table.Cell>
                <Table.Cell>{truck.driver}</Table.Cell>
                <Table.Cell>{truck.capacity}</Table.Cell>
                <Table.Cell>{truck.location || "N/A"}</Table.Cell>
                <Table.Cell>{truck.route}</Table.Cell>
                <Table.Cell>
                  <span
                    className={`${
                      truck.status ? "text-green-600" : "text-red-600"
                    } font-medium`}
                  >
                    {truck.status ? "Available" : "On Job"}
                  </span>
                </Table.Cell>
                <Table.Cell>
                  <div className="flex gap-2">
                    <Link to={`/update-truck/${truck._id}`}>
                      <Button size="xs" color="success">
                        Update
                      </Button>
                    </Link>
                    <Button
                      size="xs"
                      color="failure"
                      onClick={() => {
                        setShowModal(true);
                        setTruckIdToDelete(truck._id);
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
              Are you sure you want to delete this truck?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteTruck}>
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
