import React, { useState } from 'react';
import { Alert, Button, Select, Textarea, TextInput } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function SubmitIssue() {
    const { currentUser } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const userId = currentUser._id;
  const [formData, setFormData] = useState({
    userId,
    collectorId: '',
    binId: '',
    issueType: '',
    description: '',
    status: 'Pending',
  });
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    const res = await fetch('/api/issue/create-issue', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        setSubmitError(data.message);
        return;
      }

      setSubmitError(null);
      setSubmitSuccess('Issue reported successfully!');
      setFormData({
        collectorId: '',
        binId: '',
        issueType: '',
        description: '',
        
      });
      navigate('/dashboard?tab=reportIssue');
    } catch (error) {
      console.error('Error reporting the issue:', error);
      setSubmitError('An error occurred while reporting the issue.');
    }
  };

  return (
    <div className="p-4 mx-auto max-w-lg">
      <h1 className="text-center text-2xl mb-6 font-semibold">Report Issue</h1>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        {/* Collector ID */}
        <label className="font-semibold">Collector ID</label>
        <TextInput
          type="text"
          required
          id="collectorId"
          name="collectorId"
          value={formData.collectorId}
          onChange={handleChange}
          placeholder="Enter your Collector ID"
        />

        {/* Bin ID */}
        <label className="font-semibold">Bin ID</label>
        <TextInput
          type="text"
          required
          id="binId"
          name="binId"
          value={formData.binId}
          onChange={handleChange}
          placeholder="Enter Bin ID"
        />

        {/* Issue Type */}
        <label className="font-semibold">Issue Type</label>
        <Select
          id="issueType"
          name="issueType"
          value={formData.issueType}
          onChange={handleChange}
          required
        >
          <option value="" disabled >Please Select</option>
          <option value="Damage">Damage</option>
          <option value="Overfilled">Overfilled</option>
          <option value="Access Issue">Access Issue</option>
          <option value="Other">Other</option>
        </Select>

        {/* Description */}
        <label className="font-semibold">Description</label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          placeholder="Describe the issue in detail"
        />

        {/* Status */}
        {/* <label className="font-semibold">Status</label>
        <Select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          required
        >
          <option value="Pending">Pending</option>
          <option value="Resolved">Resolved</option>
        </Select> */}

        <Button type="submit" className="bg-blue-700 hover:bg-blue-800 p-2 rounded-lg text-white">
          Report Issue
        </Button>

        {submitError && (
          <Alert className="mt-3" color="failure">
            {submitError}
          </Alert>
        )}

        {submitSuccess && (
          <Alert className="mt-3" color="success">
            {submitSuccess}
          </Alert>
        )}
      </form>
    </div>
  );
}
