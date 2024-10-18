import React, { useState, useEffect } from 'react';
import { Table } from 'flowbite-react';
import { format } from 'date-fns'; // Using date-fns for formatting dates

export default function DashRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await fetch('/api/bin/getbins');
        const data = await res.json();
        if (res.ok) {
          setRequests(data.bins);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleCompleteRequest = async (id) => {
    try {
      // Mark the request as complete
      const res = await fetch(`/api/bin/bin/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isRequested: false }), // Update field to false to mark as complete
      });
  
      if (res.ok) {
        // Reset the bin levels
        const resetRes = await fetch(`/api/bin/resetBins/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        if (resetRes.ok) {
          const updatedRequests = await fetch('/api/bin/getbins');
          const updatedData = await updatedRequests.json();
          setRequests(updatedData.bins);
  
          // Notify homepage to update bins
          localStorage.setItem('refreshBins', 'true'); // Set a flag in localStorage to signal update
        } else {
          console.error('Failed to reset bin levels.');
        }
      } else {
        console.error('Failed to update request status.');
      }
    } catch (error) {
      console.error('Error completing request:', error);
    }
  };
  
  
  return (
    <div className="table-auto overflow-x-scroll mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <div className="w-full max-w-4xl">
        <h1 className="text-xl font-bold mb-4 text-center">Bin Collection Requests</h1>
        {loading ? (
          <p className="text-center">Loading requests...</p>
        ) : requests.length > 0 ? (
          <Table hoverable className="shadow-md w-full">
            <Table.Head>
            <Table.HeadCell>Created At</Table.HeadCell>
              <Table.HeadCell>User Name</Table.HeadCell>
              <Table.HeadCell>Address</Table.HeadCell>
              <Table.HeadCell>Bin Levels</Table.HeadCell>
              <Table.HeadCell>Overall Percentage</Table.HeadCell>
              <Table.HeadCell>Actions</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {requests.map((request) => (
                <Table.Row key={request._id}>
                    <Table.Cell>
                    {format(new Date(request.createdAt), 'MMMM d, yyyy HH:mm')} 
                  </Table.Cell>
                  <Table.Cell>{request.userName}</Table.Cell>
                  <Table.Cell>{request.address}</Table.Cell>
                  <Table.Cell>
                    <div>Food Bin: {request.binLevels.foodBin}%</div>
                    <div>Plastic Bin: {request.binLevels.plasticBin}%</div>
                    <div>Paper Bin: {request.binLevels.paperBin}%</div>
                  </Table.Cell>
                  <Table.Cell>{request.overallPercentage}%</Table.Cell>
                  {/* Display the creation date */}
                  
                  <Table.Cell>
                    {request.isRequested ? (
                      <button
                        className="text-red-500"
                        onClick={() => handleCompleteRequest(request._id)}
                      >
                        Complete Request
                      </button>
                    ) : (
                      <span className="text-green-500">Completed</span>
                    )}
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <p className="text-center">No requests found.</p>
        )}
      </div>
    </div>
  );
}
