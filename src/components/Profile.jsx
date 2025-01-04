import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to read cookies

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: '',
        email: '',
        balance: 0,
        bettingHistory: [],
    });

    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if the token is present in cookies
        const token = Cookies.get('token');

        if (!token) {
            // If no token, redirect to login page
            navigate('/login');
        } else {
            // Fetch the user profile data
            fetchUserProfile(token);
        }
    }, [navigate]);

    const fetchUserProfile = async (token) => {
        try {
            VITE_BASE_URL = https://ipl-web3-0-backend.onrender.com/api/v1/
            const response = await fetch(import.meta.env.VITE_BASE_URL + 'users/profile', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (response.ok) {
                // Ensure betting history is an array
                setUser({
                    ...data,
                    bettingHistory: Array.isArray(data.bettingHistory) ? data.bettingHistory : [],
                });
            } else {
                setMessage(data.message || 'Failed to load user profile');
            }
        } catch (error) {
            console.error('Error fetching user profile:', error);
            setMessage('Error fetching user profile');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-8 relative">
                {/* Back Arrow Button */}
                <button
                    className="absolute top-4 left-4 flex items-center text-purple-600 hover:text-purple-800"
                    onClick={() => navigate('/')}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Back to Dashboard
                </button>

                {/* Header */}
                <h2 className="text-3xl font-bold text-purple-600 text-center mb-6">Profile Page</h2>

                {/* User Info Section */}
                <div className="flex flex-col items-center mb-8">
                    <div className="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold mb-4">
                        {user.name.charAt(0)}
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                </div>

                {/* Token Balance */}
                <div className="bg-green-100 p-4 rounded-lg mb-8 text-center">
                    <h4 className="text-xl font-semibold text-green-600">Token Balance</h4>
                    <p className="text-2xl font-bold text-green-700">{user.balance} tokens</p>
                </div>

                {/* Betting History */}
                <div className="mb-8">
                    <h4 className="text-xl font-semibold mb-4">Betting History</h4>
                    <div className="bg-gray-50 p-4 rounded-lg shadow">
                        {user.bettingHistory.length === 0 ? (
                            <p className="text-gray-500 text-center">No betting history available.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-700">
                                        <th className="py-2">Match</th>
                                        <th className="py-2">Bet On</th>
                                        <th className="py-2">Result</th>
                                        <th className="py-2">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {user.bettingHistory.map((bet, index) => (
                                        <tr key={index} className="border-b">
                                            <td className="py-2">{bet.match}</td>
                                            <td className="py-2">{bet.betOn}</td>
                                            <td className={`py-2 font-semibold ${bet.result === 'Win' ? 'text-green-600' : 'text-red-600'}`}>
                                                {bet.result}
                                            </td>
                                            <td className="py-2">{bet.amount} tokens</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Error Message */}
                {message && (
                    <p className="mt-4 text-lg font-semibold text-red-600 text-center">{message}</p>
                )}
            </div>
        </div>
    );
};

export default Profile;
