import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUtensils, faRecycle, faPaperPlane, faCheckCircle, faClock } from '@fortawesome/free-solid-svg-icons';
import 'aos/dist/aos.css';
import AOS from 'aos';

export default function DashMyRequest() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useSelector(state => state.user);
  const userId = currentUser._id;

  useEffect(() => {
    AOS.init({ duration: 1000 }); // Initialize AOS animations with duration

    const fetchRequests = async () => {
      try {
        const response = await fetch(`/api/bin/requests/${userId}`);
        const data = await response.json();
        setRequests(data);
      } catch (error) {
        console.error('Error fetching user requests:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [userId]);

  const formatPrice = (price) => `Rs ${price.toFixed(2)}`;

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen text-lg text-gray-600">Loading requests...</div>;
  }

  return (
    <div className="table-auto overflow-x-scroll mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500">
      <h2 className="text-2xl font-bold text-center mb-12 text-gray-700" data-aos="fade-down">
        My Waste Collection Requests
      </h2>
      <div className="flex flex-col items-center">
        <ul className="space-y-8 w-full max-w-4xl">
          {requests.length > 0 ? (
            requests.map(request => (
              <li
                key={request._id}
                className="bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transform hover:scale-105 transition duration-300"
                data-aos="zoom-in"
              >
                <p className="text-xl font-semibold mb-2"><strong>Address:</strong> {request.address}</p>
                <p className="mb-4"><strong>Overall Bin Usage:</strong> {request.overallPercentage}%</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center justify-center bg-red-400 p-4 rounded-lg text-white text-lg">
                    <FontAwesomeIcon icon={faUtensils} className="mr-2" />
                    <strong>Food Bin:</strong> {request.binLevels.foodBin}%
                  </div>
                  <div className="flex items-center justify-center bg-blue-400 p-4 rounded-lg text-white text-lg">
                    <FontAwesomeIcon icon={faRecycle} className="mr-2" />
                    <strong>Plastic Bin:</strong> {request.binLevels.plasticBin}%
                  </div>
                  <div className="flex items-center justify-center bg-green-400 p-4 rounded-lg text-white text-lg">
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    <strong>Paper Bin:</strong> {request.binLevels.paperBin}%
                  </div>
                </div>
                <p className="mt-6 text-xl"><strong>Total Price:</strong> {formatPrice(request.totalPrice)}</p>
                <p className="mt-2">
                  <strong>Status:</strong>{' '}
                  {request.isRequested ? (
                    <span className="text-orange-500 flex items-center">
                      <FontAwesomeIcon icon={faClock} className="mr-2" />
                      Pending
                    </span>
                  ) : (
                    <span className="text-green-500 flex items-center">
                      <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                      Completed
                    </span>
                  )}
                </p>
              </li>
            ))
          ) : (
            <p className="text-center text-xl text-gray-600" data-aos="fade-up">No requests found.</p>
          )}
        </ul>
      </div>
    </div>
  );
}
