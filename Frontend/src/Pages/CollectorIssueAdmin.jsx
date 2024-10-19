import { Table, Button, Modal, Alert } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { HiOutlineExclamationCircle } from "react-icons/hi";
import { Link } from "react-router-dom";

export default function CollectorIssueAdmin() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [issueIdToDelete, setIssueIdToDelete] = useState("");

  useEffect(() => {
    // Fetch issues whenever the component is mounted
    const fetchIssues = async () => {
      try {
        const response = await fetch("/api/issue/get-all-issues");
        if (response.ok) {
          const data = await response.json();
          setIssues(data);
        } else {
          setError("Failed to fetch issues");
        }
      } catch (error) {
        console.error("Error occurred while fetching issues:", error);
        setError("Error occurred while fetching issues");
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  const handleDeleteIssue = async () => {
    setShowModal(false);
    try {
      const response = await fetch(
        `/api/issue/delete-issue/${issueIdToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        setIssues((prev) =>
          prev.filter((issue) => issue._id !== issueIdToDelete)
        );
        alert("Issue deleted successfully.");
      } else {
        alert("Failed to delete the issue.");
      }
    } catch (error) {
      console.error("Error deleting issue:", error);
      alert("An error occurred while deleting the issue.");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap gap-3 mb-6">
        <Link to="/dashboard?tab=complain">
          <button className="p-2 text-white bg-indigo-700 hover:bg-indigo-800 rounded-3xl px-5 text-sm shadow-lg border-solid">
            Customer Complaints
          </button>
        </Link>
        <Link to="/dashboard?tab=CollectorIssuesRecieved">
          <button className="p-2 text-white  bg-indigo-700 hover:bg-indigo-800 rounded-3xl px-5 text-sm shadow-lg border-solid">
            Collector Issues
          </button>
        </Link>
      </div>
      <h2 className="text-xl font-semibold mb-4 text-sans">All Issues List</h2>

      {error ? (
        <Alert color="failure" className="my-4">
          {error}
        </Alert>
      ) : (
        <div className="p-4 bg-white shadow-md rounded-lg text-center">
          <Table className="text-center">
            <Table.Head>
              <Table.HeadCell>Collector ID</Table.HeadCell>
              <Table.HeadCell>Bin ID</Table.HeadCell>
              <Table.HeadCell>Issue Type</Table.HeadCell>
              <Table.HeadCell>Description</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Reported At</Table.HeadCell>
              <Table.HeadCell>Solution</Table.HeadCell>
              <Table.HeadCell>Action</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {issues.map((issue) => (
                <Table.Row key={issue._id} className="bg-white">
                  <Table.Cell>{issue.collectorId}</Table.Cell>
                  <Table.Cell className="font-medium">{issue.binId}</Table.Cell>
                  <Table.Cell>{issue.issueType}</Table.Cell>
                  <Table.Cell>{issue.description}</Table.Cell>
                  <Table.Cell>
                    <span
                      className={`${
                        issue.status === "Resolved"
                          ? "text-green-600"
                          : "text-red-600"
                      } font-medium`}
                    >
                      {issue.status}
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    {new Date(issue.reportedAt).toLocaleString()}
                  </Table.Cell>
                  <Table.Cell>
                    {issue.solution ? issue.solution : "No solution yet"}
                  </Table.Cell>

                  <Table.Cell>
                    <div className="flex gap-2">
                      <Link to={`/update-issue/${issue._id}`}>
                        <Button size="xs" color="success">
                          Update
                        </Button>
                      </Link>
                      <Link to={`/postponed/${issue._id}`}>
                        <Button size="xs" color="blue">
                          Reschedule
                        </Button>
                      </Link>
                      <Button
                        size="xs"
                        color="failure"
                        onClick={() => {
                          setShowModal(true);
                          setIssueIdToDelete(issue._id);
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
      )}

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
              Are you sure you want to delete this issue?
            </h3>
          </div>
          <div className="flex justify-center gap-4">
            <Button color="failure" onClick={handleDeleteIssue}>
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
