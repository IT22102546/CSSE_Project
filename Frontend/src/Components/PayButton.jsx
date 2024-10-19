import React from 'react';
import { useNavigate } from 'react-router-dom';

const PayButton = ({ userId, userName, userEmail, totalPrice, longitude, latitude, address, binLevels, overallPercentage }) => {
    const navigate = useNavigate();

    console.log("User ID:", userId);
    console.log("User Name:", userName);
    console.log("User Email:", userEmail);
    console.log("Total Price:", totalPrice);
    console.log("Longitude:", longitude);
    console.log("Latitude:", latitude);
    console.log("Address:", address);
    console.log("Bin Levels:", binLevels);
    console.log("Overall Percentage:", overallPercentage);
    const handleCheckout = async () => {
        try {
            const response = await fetch('/api/stripe/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    userName,
                    userEmail,
                    totalPrice,
                    longitude,
                    latitude,
                    address,
                    binLevels,
                    overallPercentage
                })
            });

            const data = await response.json();

            if (data.url) {
                window.location.href = data.url;
            } else {
                console.error('No URL returned from Stripe session creation');
            }
        } catch (error) {
            console.error('Error creating checkout session:', error);
        }
    };

    return (
        <button
            onClick={handleCheckout}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg shadow-lg hover:bg-blue-700 transition-all"
        >
            Proceed to Payment
        </button>
    );
};

export default PayButton;
