import { Table, Alert } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export default function ResolvedIssues() {
  const [resolvedIssues, setResolvedIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchResolvedIssues = async () => {
      try {
        const res = await fetch(`/api/issue/resolved-issues-collector/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch resolved issues');
          return;
        }
        setResolvedIssues(data);
      } catch (error) {
        console.error('Error fetching resolved issues:', error);
        setError('Error occurred while fetching resolved issues');
      } finally {
        setLoading(false);
      }
    };

    fetchResolvedIssues();
  }, [currentUser._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Resolved Issues</h2>

      {error ? (
        <Alert color="failure" className="my-4">{error}</Alert>
      ) : (
        <div className="p-4 bg-white shadow-md rounded-lg">
          {resolvedIssues.length > 0 ? (
            <Table hoverable={true}>
              <Table.Head>
                <Table.HeadCell>Bin ID</Table.HeadCell>
                <Table.HeadCell>Issue Type</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Reported At</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {resolvedIssues.map((issue) => (
                  <Table.Row key={issue._id} className="bg-white">
                    <Table.Cell>{issue.binId}</Table.Cell>
                    <Table.Cell>{issue.issueType}</Table.Cell>
                    <Table.Cell>{issue.description}</Table.Cell>
                    <Table.Cell>
                      <span className="text-green-600">{issue.status}</span>
                    </Table.Cell>
                    <Table.Cell>{new Date(issue.reportedAt).toLocaleString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>No resolved issues found.</p>
          )}
        </div>
      )}
    </div>
  );
}
