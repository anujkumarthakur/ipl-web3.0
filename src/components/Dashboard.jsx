import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiUser, FiLogOut, FiCreditCard } from 'react-icons/fi';
import Cookies from 'js-cookie';
import loginBgImage from '../assets/rb_86547.png';

const Dashboard = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('live');
    const [liveMatches, setLiveMatches] = useState([]);
    const [upcomingMatches, setUpcomingMatches] = useState([]);
    const [selectedMatchType, setSelectedMatchType] = useState('all');
    const navigate = useNavigate();

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => setIsSidebarOpen(false);

    const fetchLiveMatches = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/live/matches');
            const json = await response.json();
            console.log('API Response:', json.data);  // Log the response to inspect the data
            if (json.data.length > 0) {
                setLiveMatches(json.data);  // Directly set the liveMatches without using .map()
            } else {
                console.log('No live matches found or status is false');
            }
        } catch (error) {
            console.error('Error fetching live matches:', error);
        }
    };




    const fetchUpcomingMatches = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/matches/upcoming');
            const data = await response.json();
            if (data.status && data.data) setUpcomingMatches(data.data);
        } catch (error) {
            console.error('Error fetching upcoming matches:', error);
        }
    };

    const handleCategoryChange = (category) => {
        setSelectedCategory(category);

        if (category === 'live') {
            fetchLiveMatches();  // Fetch live matches only when the "Live Matches" is clicked
        } else if (category === 'upcoming') {
            fetchUpcomingMatches();  // Fetch upcoming matches only when the "Upcoming Matches" is clicked
        }
    };


    const handleLogout = () => {
        Cookies.remove('token');
        closeSidebar();
        navigate('/');
    };

    const filterMatchesByType = (matches) => {
        if (selectedMatchType === 'all') return matches;
        return matches.filter((match) => match.match_type.toLowerCase() === selectedMatchType.toLowerCase());
    };

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900">
            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gradient-to-b from-purple-600 to-pink-600 text-white shadow-lg transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-64'} transition-transform duration-300 ease-in-out md:translate-x-0 md:relative md:w-64`}>
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

                    {/* Add image above the footer */}

                    <div className="mt-auto">
                        <div className="mt-6 mr-1 flex flex-col items-center justify-center h-40"> {/* Adjusted height and flex centering */}
                            <img src={loginBgImage} alt="Sidebar Image" className="w-full h-auto rounded-lg shadow-md" />
                        </div>

                    </div>
                    <div className="mt-auto">

                        <p className="text-sm opacity-75 text-center mt-4">&copy; 2024 IPL Gaming App</p> {/* Center text and added margin-top */}
                    </div>

                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
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
                <main className="p-6 flex-grow bg-gradient-to-b from-gray-100 to-gray-200 overflow-y-auto">
                    <h2 className="text-3xl font-bold mb-6 text-center text-purple-700">Welcome to Your Dashboard!</h2>

                    {/* Category Buttons */}
                    <div className="flex justify-center space-x-4 mb-6 flex-wrap">
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedCategory === 'live' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                            onClick={() => handleCategoryChange('live')}>
                            Live Matches
                        </button>
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedCategory === 'upcoming' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() =>
                            handleCategoryChange('upcoming')}>
                            Upcoming Matches
                        </button>
                    </div>

                    {/* Match Type Filter */}
                    <div className="flex justify-center space-x-4 mb-6 flex-wrap">
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedMatchType === 'all' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedMatchType('all')}>
                            All Types
                        </button>
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedMatchType === 'T10' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedMatchType('T10')}>
                            T10
                        </button>
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedMatchType === 'T20' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedMatchType('T20')}>
                            T20
                        </button>
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedMatchType === 'Test' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedMatchType('Test')}>
                            Test
                        </button>
                        <button className={`px-6 py-2 rounded-full text-lg font-semibold transition ${selectedMatchType === 'ODI' ? 'bg-purple-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} onClick={() => setSelectedMatchType('ODI')}>
                            ODI
                        </button>
                    </div>

                    {/* Match List */}
                    <div className="space-y-4">
                        {selectedCategory === 'live' && liveMatches.length > 0 ? (
                            liveMatches.map((match) => (
                                <Link to={`/match/${match.id}`} key={match.id} className="block p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-center">
                                            <img src={match.data.team_a_img} alt={match.data.team_a} className="w-16 h-16 rounded-full object-cover" />
                                            <h4 className="text-xs text-center">{match.data.team_a}</h4>
                                        </div>
                                        <div className="flex flex-col justify-center items-center text-center">
                                            <h4 className="text-xl font-bold">{match.data.team_a} vs {match.data.team_b}</h4>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img src={match.data.team_b_img} alt={match.data.team_b} className="w-16 h-16 rounded-full object-cover" />
                                            <h4 className="text-xs text-center">{match.data.team_b}</h4>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm">{match.data.match_status} | {match.data.match_time} {match.data.match_date}</p>
                                        <p className="text-sm">{match.data.venue}</p>
                                        <p className="text-sm">{match.data.toss || 'Toss: Not available'}</p>
                                    </div>

                                    {/* Display Inning Information */}
                                    <div className="mt-4 text-sm">
                                        {match.data.team_a_scores_over && match.data.team_a_scores_over.length > 0 && (
                                            <div className="mb-2">
                                                <p className="font-semibold">{match.data.team_a} (Inning) / Score: {match.data.team_a_scores_over[0]?.score} / Overs: {match.data.team_a_scores_over[0]?.over}</p>
                                            </div>
                                        )}

                                        {/* Uncomment and handle team_b inning similarly if needed */}
                                    </div>

                                    <div className="mt-4 text-sm">
                                        {match.data.team_b_scores_over && match.data.team_b_scores_over.length > 0 && (
                                            <div className="mb-2">
                                                <p className="font-semibold">{match.data.team_b} (Inning) / Score: {match.data.team_b_scores_over[0]?.score} / Overs: {match.data.team_b_scores_over[0]?.over}</p>
                                            </div>
                                        )}

                                        {/* Uncomment and handle team_b inning similarly if needed */}
                                    </div>
                                </Link>
                            ))
                        ) : (
                            selectedCategory === 'live' && <p>No live matches available</p>
                        )}

                        {selectedCategory === 'upcoming' && filterMatchesByType(upcomingMatches).length > 0 ? (
                            filterMatchesByType(upcomingMatches).map((match) => (
                                <Link to={`/match/${match.match_id}`} key={match.match_id} className="block p-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg shadow-md hover:shadow-lg transition transform hover:scale-105">
                                    <div className="flex items-center justify-between">
                                        <div className="flex flex-col items-center">
                                            <img src={match.team_a_img} alt={match.team_a} className="w-16 h-16 rounded-full object-cover" />
                                            <h4 className="text-xs text-center">{match.team_a}</h4>
                                        </div>
                                        <div className="flex flex-col justify-center items-center text-center">
                                            <h4 className="text-xl font-bold">{match.team_a} vs {match.team_b}</h4>
                                        </div>
                                        <div className="flex flex-col items-center">
                                            <img src={match.team_b_img} alt={match.team_b} className="w-16 h-16 rounded-full object-cover" />
                                            <h4 className="text-xs text-center">{match.team_b}</h4>
                                        </div>
                                    </div>
                                    <div className="mt-2 text-center">
                                        <p className="text-sm">{match.match_time} {match.date_wise} ({match.match_type})</p>
                                        <p className="text-sm">{match.venue}</p>
                                    </div>
                                </Link>
                            ))
                        ) : (
                            selectedCategory === 'upcoming' && <p>No upcoming matches available</p>
                        )}
                    </div>
                </main>
            </div>
        </div>

    );
};

export default Dashboard;
