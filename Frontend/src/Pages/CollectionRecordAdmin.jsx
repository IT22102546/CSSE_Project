import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert } from 'flowbite-react';

export default function CollectionRecordAdmin() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch all records using the API
    const fetchRecords = async () => {
      try {
        const response = await fetch('/api/record-bin-details/get-all-records');
        if (!response.ok) {
          throw new Error('Failed to fetch records');
        }
        const data = await response.json();
        setRecords(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching records:', error);
        setError('Failed to fetch records.');
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center mt-8">
        <Spinner size="xl" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <Alert color="failure">
          {error}
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-semibold my-4">Reported Collection Records</h2>
      <Table hoverable={true}>
        <Table.Head>
          <Table.HeadCell>User Name</Table.HeadCell>
          <Table.HeadCell>User Email</Table.HeadCell>
          <Table.HeadCell>Food Bin Level</Table.HeadCell>
          <Table.HeadCell>Plastic Bin Level</Table.HeadCell>
          <Table.HeadCell>Paper Bin Level</Table.HeadCell>
          <Table.HeadCell>Recorded At</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {records.map((record) => (
            <Table.Row key={record._id} className="bg-white dark:bg-gray-800">
              <Table.Cell>{record.userName}</Table.Cell>
              <Table.Cell>{record.userEmail}</Table.Cell>
              <Table.Cell>{record.foodBin}%</Table.Cell>
              <Table.Cell>{record.plasticBin}%</Table.Cell>
              <Table.Cell>{record.paperBin}%</Table.Cell>
              <Table.Cell>{new Date(record.recordedAt).toLocaleString()}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
}
