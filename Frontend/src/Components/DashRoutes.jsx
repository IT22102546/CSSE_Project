import { Table, Alert } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function DashRoutes() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBins = async () => {
      try {
        const res = await fetch(`/api/bin/get-all-bins`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch bins');
          return;
        }
        setBins(data);
      } catch (error) {
        console.error('Error fetching bins:', error);
        setError('Error occurred while fetching bins');
      } finally {
        setLoading(false);
      }
    };

    fetchBins();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className='flex flex-wrap gap-3 pt-5 pl-5 pb-4'>
            <Link to='/addtruck'>
                <button className='p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Add Truck</button>
            </Link>
            <Link to='/dashboard?tab=trucks'>
                <button className='p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Available Trucks</button>
            </Link>
            <Link to='/dashboard?tab=bindetails'>
                <button className='p-2 text-white bg-indigo-600 hover:bg-indigo-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>Bin Details</button>
            </Link>

        </div>
      <h2 className="text-xl font-semibold mb-4">All Bin Locations</h2>

      {error ? (
        <Alert color="failure" className="my-4">{error}</Alert>
      ) : (
        <div className="p-4 bg-white shadow-md rounded-lg">
          {bins.length > 0 ? (
            <Table hoverable={true}>
              <Table.Head>
                <Table.HeadCell>Bin ID</Table.HeadCell>
                <Table.HeadCell>User Name</Table.HeadCell>
                <Table.HeadCell>Address</Table.HeadCell>
                <Table.HeadCell>Longitude</Table.HeadCell>
                <Table.HeadCell>Latitude</Table.HeadCell>
                <Table.HeadCell>Overall Percentage</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {bins.map((bin) => (
                  <Table.Row key={bin._id} className="bg-white">
                    <Table.Cell>{bin._id}</Table.Cell>
                    <Table.Cell>{bin.userName}</Table.Cell>
                    <Table.Cell>{bin.address}</Table.Cell>
                    <Table.Cell>{bin.longitude}</Table.Cell>
                    <Table.Cell>{bin.latitude}</Table.Cell>
                    <Table.Cell>{bin.overallPercentage}%</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>No bins available yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
