import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const CollectionTrigger = ({ overallPercentage }) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (overallPercentage >= 75) {
      setShowModal(true);
    } else {
      setShowModal(false);
    }
  }, [overallPercentage]);

  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-md w-full text-center">
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Collection Required!</h2>
            <p className="text-lg text-gray-600 mb-6">
              Your waste bins have reached <strong>{overallPercentage}%</strong> capacity. It's time for a collection.
            </p>
            <button
              className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600"
              onClick={() => setShowModal(false)}
            >
              Acknowledge
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CollectionTrigger;
