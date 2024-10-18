import React, { useState } from 'react';
import { TextInput, Textarea, Button, Label } from 'flowbite-react';
import { Navigate, useNavigate } from 'react-router-dom';
export default function AddTruckForm() {
  const [truckId, setTruckId] = useState('');
  const [driver, setDriver] = useState('');
  const [capacity, setCapacity] = useState('');
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [route, setRoute] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!truckId || !driver || !capacity) {
      alert('Truck ID, Driver, and Capacity are required fields.');
      return;
    }

    if (capacity <= 0) {
      alert('Capacity must be a positive number.');
      return;
    }

    // Create the truck object
    const newTruck = {
      truckId,
      driver,
      capacity: Number(capacity),
      route: route || 'Not assigned yet',
    };

    try {
      const response = await fetch('/api/truck/add-truck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Specify that the content is JSON
        },
        body: JSON.stringify(newTruck), // Convert formData to JSON string
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Truck added successfully:', result);

        // Reset the form after submission
        setTruckId('');
        setDriver('');
        setCapacity('');
        setLatitude(0);
        setLongitude(0);
        setRoute('');

        alert('Truck added successfully');
        // Optionally navigate to another page or perform other actions
        navigate("/dashboard?tab=trucks");
      } else {
        console.error('Failed to add truck');
        alert('Error adding truck');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error occurred while adding truck');
    }
  };

  return (
    <div className="max-w-md mx-auto p-5 bg-white shadow-md rounded-lg pt-10 mt-10">
      <h2 className="text-lg font-semibold text-center">Add New Truck</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="truckId" value="Truck ID" className="mb-1" />
          <TextInput
            id="truckId"
            type="text"
            value={truckId}
            onChange={(e) => setTruckId(e.target.value)}
            required
            placeholder="Enter Truck ID"
          />
        </div>

        <div>
          <Label htmlFor="driver" value="Driver ID" className="mb-1" />
          <TextInput
            id="driver"
            type="text"
            value={driver}
            onChange={(e) => setDriver(e.target.value)}
            required
            placeholder="Enter Driver ID"
          />
        </div>

        <div>
          <Label htmlFor="capacity" value="Capacity (kg)" className="mb-1" />
          <TextInput
            id="capacity"
            type="number"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            required
            placeholder="Enter Capacity"
          />
        </div>

        <div>
          <Label htmlFor="route" value="Route" className="mb-1" />
          <Textarea
            id="route"
            value={route}
            onChange={(e) => setRoute(e.target.value)}
            placeholder="Enter route waypoints separated by commas"
          />
        </div>

        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-2xl">
          Add Truck
        </Button>
      </form>
    </div>
  );
}
