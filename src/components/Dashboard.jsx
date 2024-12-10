import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiCreditCard, FiChevronRight } from 'react-icons/fi';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('live');
    const navigate = useNavigate();

    // Sample match data
    const matches = {
        live: [
            {
                id: 1,
                teams: 'IND vs PAK',
                status: '2nd Innings - IND 150/3',
            },
            {
                id: 2,
                teams: 'AUS vs ENG',
                status: '1st Innings - AUS 220/5',
            },
        ],
        upcoming: [
            { id: 3, teams: 'NZ vs SA', time: 'Tomorrow 3:00 PM' },
            { id: 4, teams: 'BAN vs SL', time: 'Sunday 5:00 PM' },
        ],
    };

    // Toggle sidebar
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    // Close sidebar
    const closeSidebar = () => {
        setIsSidebarOpen(false);
    };

    // Logout handler
    const handleLogout = () => {
        closeSidebar();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <div
                className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'
                    } transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-64`}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-bold">IPLW3.0 Gaming</h2>
                        <button onClick={closeSidebar} className="md:hidden text-2xl">
                            <FiX />
                        </button>
                    </div>
                    <nav className="flex flex-col space-y-4">
                        <Link to="/profile" className="flex items-center gap-2 hover:text-purple-300">
                            <FiUser /> View Profile
                        </Link>
                        <Link to="/buy-tokens" className="flex items-center gap-2 hover:text-purple-300">
                            <FiCreditCard /> Connect Wallet
                        </Link>
                        <Link to="" className="flex items-center gap-2 hover:text-purple-300">
                            <FiCreditCard /> Total Token: 100 IPLW
                        </Link>
                        <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400">
                            <FiLogOut /> Logout
                        </button>
                    </nav>
                    <div className="mt-auto">
                        <p className="text-sm opacity-75">&copy; 2024 IPL Gaming App</p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
                    <button onClick={toggleSidebar} className="text-2xl md:hidden focus:outline-none">
                        <FiMenu />
                    </button>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <div className="flex items-center space-x-4">
                        <span className="font-semibold">Token: 100 IPLW</span>
                        <Link to="/profile" className="hover:text-purple-600">
                            <FiUser size={24} />
                        </Link>
                    </div>
                </header>

                {/* Dashboard Content */}
                <main className="p-6 flex-grow bg-gradient-to-b from-gray-100 to-gray-200">
                    <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Welcome to Your Dashboard!</h2>

                    {/* Category Buttons */}
                    <div className="flex justify-center space-x-4 mb-6">
                        <button
                            className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedCategory === 'live'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            onClick={() => setSelectedCategory('live')}
                        >
                            Live Matches
                        </button>
                        <button
                            className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedCategory === 'upcoming'
                                ? 'bg-purple-600 text-white shadow-md'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                            onClick={() => setSelectedCategory('upcoming')}
                        >
                            Upcoming Matches
                        </button>
                    </div>

                    {/* Match List */}
                    <div className="space-y-4">
                        {selectedCategory === 'live' &&
                            matches.live.map((match) => (
                                <Link
                                    to={`/match/${match.id}`}
                                    key={match.id}
                                    className="block p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                                >
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <h4 className="text-xl font-bold">{match.teams}</h4>
                                            <p className="text-sm">{match.status}</p>
                                            <p className="text-sm">{match.overs}</p>
                                            <p className="text-sm">{match.batsmen}</p>
                                            <p className="text-sm">{match.bowler}</p>
                                        </div>
                                        <FiChevronRight size={24} />
                                    </div>
                                </Link>
                            ))}

                        {selectedCategory === 'upcoming' &&
                            matches.upcoming.map((match) => (
                                <Link
                                    to={`/match/${match.id}`}
                                    key={match.id}
                                    className="block p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105"
                                >
                                    <h4 className="text-xl font-bold">{match.teams}</h4>
                                    <p className="text-sm">{match.time}</p>
                                </Link>
                            ))}
                    </div>
                </main>
            </div>

            {/* Overlay for Mobile Sidebar */}
            {isSidebarOpen && <div className="fixed inset-0 bg-black opacity-50 md:hidden" onClick={closeSidebar}></div>}
        </div>
    );
};

export default Dashboard;
