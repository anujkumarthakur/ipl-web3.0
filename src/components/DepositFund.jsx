import React, { useState, useEffect } from "react";
import Cookies from "js-cookie"; // Import js-cookie to get the token

const DepositFunds = () => {
    const [user, setUser] = useState(null);
    const [amount, setAmount] = useState("");
    const [transactionId, setTransactionId] = useState("");
    const [screenshot, setScreenshot] = useState(null);
    const [screenshotPreview, setScreenshotPreview] = useState(null);
    const [message, setMessage] = useState("");
    const adminUpiId = "adminupi@bank";

    useEffect(() => {
        const token = Cookies.get("token");
        if (!token) {
            setMessage("User not authenticated");
            return;
        }
        fetchUserProfile(token);
    }, []);

    const fetchUserProfile = async (token) => {
        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + "users/profile", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setUser(data);
            } else {
                setMessage("Failed to load user profile");
            }
        } catch (error) {
            console.error("Error fetching user profile:", error);
            setMessage("Error fetching user profile");
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setMessage("User not authenticated");
            return;
        }

        if (!amount || !transactionId || !screenshot) {
            setMessage("Please fill in all the fields and upload the screenshot.");
            return;
        }

        const token = Cookies.get("token");
        if (!token) {
            setMessage("User not authenticated");
            return;
        }

        const formData = new FormData();
        formData.append("user_id", user.user_id); // Use actual user ID
        formData.append("amount", amount);
        formData.append("transaction_id", transactionId);
        formData.append("screenshot", screenshot);

        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + "payment/deposit", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`, // Send token in headers
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                setMessage("Deposit request submitted successfully!");
                setAmount("");
                setTransactionId("");
                setScreenshot(null);
                setScreenshotPreview(null);
            } else {
                setMessage(result.error || "Failed to submit the request. Please try again.");
            }
        } catch (error) {
            console.error("Error:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setScreenshot(file);
            setScreenshotPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg p-6 mt-10">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Deposit Funds</h2>
            <p className="text-sm text-gray-600 text-center mb-6">
                Admin UPI ID: <span className="font-semibold text-gray-800">{adminUpiId}</span>
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="amount" className="block text-gray-700 font-medium mb-1">Amount:</label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="transactionId" className="block text-gray-700 font-medium mb-1">Transaction ID:</label>
                    <input
                        type="text"
                        id="transactionId"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                </div>
                <div>
                    <label htmlFor="screenshot" className="block text-gray-700 font-medium mb-1">Upload Screenshot:</label>
                    <input
                        type="file"
                        id="screenshot"
                        onChange={handleFileChange}
                        accept="image/*"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2"
                    />
                    {screenshotPreview && (
                        <img src={screenshotPreview} alt="Screenshot Preview" className="mt-3 w-full h-auto rounded-lg shadow" />
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                    Submit
                </button>
            </form>
            {message && (
                <p className={`mt-4 text-center ${message.includes("successfully") ? "text-green-600" : "text-red-600"}`}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default DepositFunds;
