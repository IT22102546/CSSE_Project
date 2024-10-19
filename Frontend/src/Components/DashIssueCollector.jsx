import { Table, Alert } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

export default function DashIssueCollector() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await fetch(`/api/issue/get-a-issue-collector/${currentUser._id}`);
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to fetch issues');
          return;
        }
        setIssues(data);
      } catch (error) {
        console.error('Error fetching issues:', error);
        setError('Error occurred while fetching issues');
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, [currentUser._id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <div className='flex flex-wrap gap-3 mb-6'>
        <Link to='/submittIssue'>
          <button className='p-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-3xl px-5 text-sm shadow-lg border-solid'>
            Submit Issue
          </button>
        </Link>
        <Link to='/dashboard?tab=submittedIssue'>
          <button className='p-2 text-white bg-yellow-400 hover:bg-yellow-300 rounded-3xl px-5 text-sm shadow-lg border-solid'>
            Reported Issues
          </button>
        </Link>
        <Link to='/dashboard?tab=resolvedIssue'>
          <button className='p-2 text-white bg-green-600 hover:bg-green-700 rounded-3xl px-5 text-sm shadow-lg border-solid'>
            Resolved Issues
          </button>
        </Link>
      </div>

      {error ? (
        <Alert color="failure" className="my-4">{error}</Alert>
      ) : (
        <div className="p-4 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Issues Submitted by You</h2>
          {issues.length > 0 ? (
            <Table hoverable={true}>
              <Table.Head>
                <Table.HeadCell>Bin ID</Table.HeadCell>
                <Table.HeadCell>Issue Type</Table.HeadCell>
                <Table.HeadCell>Description</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Reported At</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {issues.map((issue) => (
                  <Table.Row key={issue._id} className="bg-white">
                    <Table.Cell>{issue.binId}</Table.Cell>
                    <Table.Cell>{issue.issueType}</Table.Cell>
                    <Table.Cell>{issue.description}</Table.Cell>
                    <Table.Cell>
                      <span className={`${
                        issue.status === 'Resolved' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {issue.status}
                      </span>
                    </Table.Cell>
                    <Table.Cell>{new Date(issue.reportedAt).toLocaleString()}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          ) : (
            <p>No issues reported yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
