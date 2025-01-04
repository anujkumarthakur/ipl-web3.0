import React, { useState, useEffect } from 'react';

const AdminDepositsPage = () => {
    const [deposits, setDeposits] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [error, setError] = useState('');

    // Fetch deposits based on start date
    const fetchDeposits = async () => {
        if (!startDate) {
            setError('Please select a start date.');
            return;
        }

        try {
            const response = await fetch(`/admin/deposits?start_date=${startDate}`);
            const data = await response.json();

            if (response.ok) {
                setDeposits(data.deposits);
                setError('');
            } else {
                setError('Failed to fetch deposits');
            }
        } catch (err) {
            setError('Error connecting to the server');
            console.error(err);
        }
    };

    // Handle Approve Deposit
    const handleApprove = async (deposit_id) => {
        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + 'payment/approve', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deposit_id: deposit_id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update deposit status locally after successful approval
                setDeposits((prevDeposits) =>
                    prevDeposits.map((deposit) =>
                        deposit.deposit_id === deposit_id
                            ? { ...deposit, status: 'approved' }
                            : deposit
                    )
                );
            } else {
                setError('Failed to approve deposit');
            }
        } catch (err) {
            setError('Error connecting to the server while approving');
            console.error(err);
        }
    };

    // Handle Reject Deposit
    const handleReject = async (deposit_id) => {
        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + 'payment/reject', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deposit_id: deposit_id,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Update deposit status locally after successful rejection
                setDeposits((prevDeposits) =>
                    prevDeposits.map((deposit) =>
                        deposit.deposit_id === deposit_id
                            ? { ...deposit, status: 'rejected' }
                            : deposit
                    )
                );
            } else {
                setError('Failed to reject deposit');
            }
        } catch (err) {
            setError('Error connecting to the server while rejecting');
            console.error(err);
        }
    };

    useEffect(() => {
        if (startDate) {
            fetchDeposits();
        }
    }, [startDate]);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-semibold text-gray-800 mb-6">Admin - Deposit Details</h1>

            <div className="flex items-center mb-6">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border border-gray-300 p-2 rounded-md shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={fetchDeposits}
                    className="ml-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
                >
                    Fetch Deposits
                </button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <div className="overflow-x-auto bg-white shadow-md rounded-lg">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            <th className="py-3 px-6 text-left">User Name</th>
                            <th className="py-3 px-6 text-left">Email</th>
                            <th className="py-3 px-6 text-left">Amount</th>
                            <th className="py-3 px-6 text-left">Transaction ID</th>
                            <th className="py-3 px-6 text-left">Status</th>
                            <th className="py-3 px-6 text-left">Created At</th>
                            <th className="py-3 px-6 text-left">Wallet Balance</th>
                            <th className="py-3 px-6 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deposits.length > 0 ? (
                            deposits.map((deposit) => (
                                <tr key={deposit.deposit_id} className="border-b hover:bg-gray-50">
                                    <td className="py-3 px-6">{deposit.user_name}</td>
                                    <td className="py-3 px-6">{deposit.user_email}</td>
                                    <td className="py-3 px-6">{deposit.amount}</td>
                                    <td className="py-3 px-6">{deposit.transaction_id}</td>
                                    <td className="py-3 px-6">
                                        <span
                                            className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${deposit.status === 'approved' ? 'bg-green-200 text-green-800' : deposit.status === 'rejected' ? 'bg-red-200 text-red-800' : 'bg-yellow-200 text-yellow-800'
                                                }`}
                                        >
                                            {deposit.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">{new Date(deposit.created_at).toLocaleString()}</td>
                                    <td className="py-3 px-6">{deposit.wallet_balance}</td>
                                    <td className="py-3 px-6">
                                        {deposit.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleApprove(deposit.deposit_id)}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(deposit.deposit_id)}
                                                    className="ml-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none"
                                                >
                                                    Reject
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" className="py-3 px-6 text-center text-gray-500">
                                    No deposits found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDepositsPage;
