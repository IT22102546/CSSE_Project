import React, { useEffect, useState } from "react";
import { Alert, Button, Select, Textarea } from "flowbite-react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateCollectorIssue() {
  const [formData, setFormData] = useState({
    status: "Pending", // Default status
    solution: "",
  });
  const [updateError, setUpdateError] = useState(null);
  const { id } = useParams(); // Get the issue ID from the URL params
  const navigate = useNavigate();

  // Fetch the issue details using the ID
  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const res = await fetch(`/api/issue/get-a-issue/${id}`); // Fetching the issue by ID
        const data = await res.json();
        if (!res.ok) {
          console.error(res);
        } else {
          setFormData({
            status: data.status,
            solution: data.solution || "", // Pre-fill if a solution exists
          }); // Pre-populate the form with issue data
        }
      } catch (error) {
        console.error("Error fetching the issue details:", error);
      }
    };

    fetchIssue();
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStatusChange = (e) => {
    setFormData({ ...formData, status: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/issue/update-issue/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Send updated form data
      });

      const data = await res.json();
      if (!res.ok) {
        setUpdateError(data.message);
        return;
      }

      setUpdateError(null);
      alert("Issue updated successfully!");
      navigate("/dashboard?tab=CollectorIssuesRecieved"); // Navigate back to issues page
    } catch (error) {
      console.error(error);
      setUpdateError("Something went wrong");
    }
  };

  return (
    <div className="p-3 mx-auto">
      <h1 className="text-center text-3xl my-7 font-semibold">Update Issue Details</h1>
      <form className="flex max-w-3xl flex-col mx-auto pb-10" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center">
          {/* Status */}
          <label className="font-semibold">Status</label>
          <Select
            id="status"
            name="status"
            className="p-2 mb-2"
            value={formData.status}
            onChange={handleStatusChange}
          >
            <option value="Pending">Pending</option>
            <option value="Resolved">Resolved</option>
          </Select>

          {/* Solution */}
          <label className="font-semibold">Solution</label>
          <Textarea
            id="solution"
            name="solution"
            className="p-2 mb-2"
            value={formData.solution}
            onChange={handleChange}
            placeholder="Enter the solution for the issue (if any)"
          />
        </div>

        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-white">
          Update Issue
        </Button>

        {updateError && (
          <Alert className="mt-5" color="failure">
            {updateError}
          </Alert>
        )}
      </form>
    </div>
  );
}
