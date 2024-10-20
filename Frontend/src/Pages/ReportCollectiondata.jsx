import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { Label, TextInput, Button, Alert } from 'flowbite-react';

export default function ReportCollectionData() {
  const location = useLocation();
  const navigate = useNavigate(); // Hook for navigation
  const { binId } = location.state; // Get the binId passed from CollectionMap
  const [binData, setBinData] = useState({
    binId: binId,
    foodBin: '',
    plasticBin: '',
    paperBin: '',
    userName: '',
    userEmail: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch bin details using the API
    const fetchBinDetails = async () => {
      try {
        const response = await axios.get(`/api/bin/get-bin/${binId}`);
        const data = response.data;

        // Set state with the fetched bin details and keep the binId intact
        setBinData((prevData) => ({
          ...prevData,
          foodBin: data.binLevels.foodBin,
          plasticBin: data.binLevels.plasticBin,
          paperBin: data.binLevels.paperBin,
          userName: data.userName,
          userEmail: data.userEmail
        }));

        setLoading(false);
      } catch (error) {
        console.error('Error fetching bin details:', error);
        setError('Failed to fetch bin details.');
      }
    };

    fetchBinDetails();
  }, [binId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBinData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Submit the updated bin details to the recording endpoint
      await axios.post('/api/record-bin-details/create-record', binData);
      alert('Details recorded successfully!');
      // Navigate to /dashboard?tab=collectionmap after successful submission
      navigate('/dashboard?tab=assignedRoutes');
    } catch (error) {
      console.error('Error recording details:', error);
      alert('Failed to record details.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 w-10/12">
      <h2 className="text-left text-2xl my-7 font-semibold mx-auto">Report Collection Data</h2>
      {error && <Alert color="failure" className="mb-4">{error}</Alert>}
      <form onSubmit={handleSubmit} className='w-10/12 mx-auto'>
        <div className="mb-4">
          <Label htmlFor="foodBin" value="Food Bin Level" />
          <TextInput
            type="number"
            id="foodBin"
            name="foodBin"
            value={binData.foodBin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="plasticBin" value="Plastic Bin Level" />
          <TextInput
            type="number"
            id="plasticBin"
            name="plasticBin"
            value={binData.plasticBin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="paperBin" value="Paper Bin Level" />
          <TextInput
            type="number"
            id="paperBin"
            name="paperBin"
            value={binData.paperBin}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="userName" value="User Name" />
          <TextInput
            type="text"
            id="userName"
            name="userName"
            value={binData.userName}
            readOnly
          />
        </div>
        <div className="mb-4">
          <Label htmlFor="userEmail" value="User Email" />
          <TextInput
            type="email"
            id="userEmail"
            name="userEmail"
            value={binData.userEmail}
            readOnly
          />
        </div>
        <Button type="submit" className="mt-4 bg-indigo-600 hover:bg-indigo-700" >
          Submit
        </Button>
      </form>
    </div>
  );
}
