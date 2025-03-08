import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminDepositsPage = () => {
    const [deposits, setDeposits] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [actionLoading, setActionLoading] = useState(null);

    const BASE_URL = import.meta.env.VITE_BASE_URL;

    const fetchDeposits = async () => {
        if (!startDate) {
            setError("Please select a start date.");
            return;
        }

        setLoading(true);
        setError("");
        setMessage("");

        try {
            console.log("Fetching deposits for:", startDate);

            const response = await axios.get(`${BASE_URL}payment/admin/deposits`, {
                params: { start_date: startDate },
                withCredentials: true,
            });

            console.log("Deposits Response:", response.data);
            setDeposits(response.data.deposits || []);
        } catch (err) {
            console.error("Fetch error:", err);
            setError(err.response?.data?.message || "Failed to fetch deposits");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (deposit_id, action) => {
        setActionLoading(deposit_id);
        try {
            const response = await fetch(`${BASE_URL}payment/${action}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ deposit_id }),
            });

            if (!response.ok) throw new Error(`${action} failed`);

            setDeposits((prevDeposits) =>
                prevDeposits.map((deposit) =>
                    deposit.deposit_id === deposit_id ? { ...deposit, status: action } : deposit
                )
            );

            setMessage(`Deposit successfully ${action}d`);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionLoading(null);
        }
    };

    useEffect(() => {
        if (startDate) fetchDeposits();
    }, [startDate]);

    return (
        <div className="container mx-auto p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Admin - Deposit Management</h1>

            <div className="flex items-center mb-6 space-x-4">
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border p-2 rounded-md shadow-md focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
                <button
                    onClick={fetchDeposits}
                    className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-300 shadow-md disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Loading..." : "Fetch Deposits"}
                </button>
            </div>

            {error && <p className="text-red-500 bg-red-100 p-3 rounded-md mb-4">{error}</p>}
            {message && <p className="text-green-500 bg-green-100 p-3 rounded-md mb-4">{message}</p>}

            <div className="overflow-x-auto bg-white shadow-lg rounded-lg p-4">
                <table className="w-full text-gray-800">
                    <thead className="bg-gray-100 text-gray-900">
                        <tr>
                            {["Deposit ID", "User ID", "User", "Email", "Amount", "Transaction ID", "Status", "Date", "Screenshot", "Actions"].map((header) => (
                                <th key={header} className="py-3 px-6 text-left text-sm font-semibold">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white">
                        {deposits.length > 0 ? (
                            deposits.map((deposit) => (
                                <tr key={deposit.deposit_id} className="border-b hover:bg-gray-50 transition-all">
                                    <td className="py-3 px-6">{deposit.deposit_id}</td>
                                    <td className="py-3 px-6">{deposit.user_id}</td>
                                    <td className="py-3 px-6">{deposit.user_name}</td>
                                    <td className="py-3 px-6">{deposit.user_email}</td>
                                    <td className="py-3 px-6 font-semibold text-green-600">${deposit.amount}</td>
                                    <td className="py-3 px-6">{deposit.transaction_id}</td>
                                    <td className="py-3 px-6">
                                        <span
                                            className={`px-3 py-1 text-xs font-semibold rounded-full ${deposit.status === "approved"
                                                ? "bg-green-200 text-green-800"
                                                : deposit.status === "rejected"
                                                    ? "bg-red-200 text-red-800"
                                                    : "bg-yellow-200 text-yellow-800"
                                                }`}
                                        >
                                            {deposit.status}
                                        </span>
                                    </td>
                                    <td className="py-3 px-6">{new Date(deposit.created_at).toLocaleString()}</td>
                                    <td className="py-3 px-6">
                                        {deposit.screenshot ? (
                                            <img
                                                src={deposit.screenshot}
                                                alt="Screenshot"
                                                className="w-16 h-16 rounded-md shadow-md border border-gray-300"
                                            />
                                        ) : (
                                            <span className="text-gray-500">No screenshot</span>
                                        )}
                                    </td>
                                    <td className="py-3 px-6">
                                        {deposit.status === "pending" && (
                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => handleAction(deposit.deposit_id, "approve")}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all disabled:opacity-50"
                                                    disabled={actionLoading === deposit.deposit_id}
                                                >
                                                    {actionLoading === deposit.deposit_id ? "Processing..." : "Approve"}
                                                </button>
                                                <button
                                                    onClick={() => handleAction(deposit.deposit_id, "reject")}
                                                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all disabled:opacity-50"
                                                    disabled={actionLoading === deposit.deposit_id}
                                                >
                                                    {actionLoading === deposit.deposit_id ? "Processing..." : "Reject"}
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="10" className="py-4 px-6 text-center text-gray-500">
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
