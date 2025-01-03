import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie to read cookies

const Profile = () => {
    const navigate = useNavigate();

    const [user, setUser] = useState({
        name: 'John Doe',
        email: 'john.doe@example.com',
        walletAddress: '0x1234abcd5678efgh9012ijkl',
        balance: 500,
        bettingHistory: [
            { match: 'India vs Pakistan', betOn: 'India', result: 'Win', amount: 100 },
            { match: 'Australia vs England', betOn: 'Australia', result: 'Loss', amount: 50 },
        ],
    });

    const [amount, setAmount] = useState('');
    const [useDefaultWallet, setUseDefaultWallet] = useState(true);
    const [customAddress, setCustomAddress] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if the token is present in cookies
        const token = Cookies.get('token');

        if (!token) {
            // If no token, redirect to login page
            navigate('/login');
        } else {
            // Optionally, you can verify the token by making an API request
            // to check its validity and fetch user data
            // For example, you could call an API endpoint to validate the token and fetch the user details
        }
    }, [navigate]);

    // Handle Withdrawal Logic
    const handleWithdraw = () => {
        if (!amount || amount <= 0) {
            alert('Please enter a valid withdrawal amount.');
            return;
        }

        if (amount > user.balance) {
            alert('Insufficient balance.');
            return;
        }

        const withdrawalAddress = useDefaultWallet ? user.walletAddress : customAddress;

        if (!withdrawalAddress) {
            alert('Please enter a valid crypto address.');
            return;
        }

        // Simulate withdrawal process
        setUser((prevUser) => ({
            ...prevUser,
            balance: prevUser.balance - amount,
        }));

        setMessage(`Withdrawal of ${amount} tokens to ${withdrawalAddress} was successful.`);

        // Reset form fields
        setAmount('');
        setCustomAddress('');
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
                    <p className="text-gray-600">
                        Wallet Address: <span className="font-mono">{user.walletAddress}</span>
                    </p>
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

                {/* Withdraw Section */}
                <div className="bg-gray-50 p-6 rounded-lg shadow mb-8">
                    <h4 className="text-xl font-semibold mb-4">Withdraw Tokens</h4>

                    <div className="space-y-4">
                        {/* Amount Input */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Withdrawal Amount</label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(Number(e.target.value))}
                                placeholder="Enter amount to withdraw"
                                className="w-full p-2 border rounded"
                            />
                        </div>

                        {/* Wallet Address Selection */}
                        <div>
                            <label className="block text-gray-700 font-semibold mb-2">Withdraw To</label>
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    checked={useDefaultWallet}
                                    onChange={() => setUseDefaultWallet(true)}
                                    className="mr-2"
                                />
                                <span>Default Wallet Address: <span className="font-mono">{user.walletAddress}</span></span>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    checked={!useDefaultWallet}
                                    onChange={() => setUseDefaultWallet(false)}
                                    className="mr-2"
                                />
                                <span>Other Wallet Address:</span>
                            </div>
                            {!useDefaultWallet && (
                                <input
                                    type="text"
                                    value={customAddress}
                                    onChange={(e) => setCustomAddress(e.target.value)}
                                    placeholder="Enter custom crypto address"
                                    className="w-full p-2 border rounded mt-2"
                                />
                            )}
                        </div>

                        {/* Withdraw Button */}
                        <button
                            onClick={handleWithdraw}
                            className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded"
                        >
                            Withdraw
                        </button>

                        {/* Success Message */}
                        {message && (
                            <p className="mt-4 text-lg font-semibold text-green-600 text-center">{message}</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
