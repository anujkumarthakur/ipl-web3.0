import React, { useState } from 'react';
import AdminDepositsPage from './AdminDepositsPage';  // Adjust the path as needed
import LiveMatch from './LiveMatch';  // Adjust the path as needed

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('deposits'); // Default tab

    const renderContent = () => {
        switch (activeTab) {
            case 'deposits':
                return <AdminDepositsPage />;
            case 'liveMatches':
                return <LiveMatch />;
            default:
                return <AdminDepositsPage />;
        }
    };

    return (
        <div className="flex min-h-screen bg-gray-900 text-gray-100">
            {/* Sidebar */}
            <div className="w-1/5 bg-gradient-to-r from-blue-600 to-blue-800 p-6">
                <h1 className="text-3xl text-white font-bold mb-8">Admin Dashboard</h1>
                <ul className="space-y-6">
                    {/* Sidebar Item - Manage Deposits */}
                    <li
                        onClick={() => setActiveTab('deposits')}
                        className={`text-lg cursor-pointer rounded-lg p-2 transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105 ${activeTab === 'deposits' ? 'text-yellow-400' : 'text-white'}`}
                    >
                        <i className="fas fa-wallet mr-2"></i> Manage Deposits
                    </li>

                    {/* Sidebar Item - Manage Live Matches */}
                    <li
                        onClick={() => setActiveTab('liveMatches')}
                        className={`text-lg cursor-pointer rounded-lg p-2 transition-all duration-300 ease-in-out transform hover:bg-blue-500 hover:scale-105 ${activeTab === 'liveMatches' ? 'text-yellow-400' : 'text-white'}`}
                    >
                        <i className="fas fa-futbol mr-2"></i> Manage Live Matches
                    </li>
                </ul>
            </div>

            {/* Main Content */}
            <div className="w-4/5 p-6 overflow-y-auto">
                <header className="mb-6">
                    <h2 className="text-3xl font-semibold text-white">
                        {activeTab === 'deposits' ? 'Manage Deposits' : 'Manage Live Matches'}
                    </h2>
                </header>

                {/* Content Section with Improved UI */}
                <div className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition-shadow duration-300">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
