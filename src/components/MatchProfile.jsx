import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MatchSquad from "./MatchSquad";
import Cookies from 'js-cookie';

const MatchProfile = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const [balance, setBalance] = useState(0); // Fetch balance dynamically
    const [match, setMatch] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [betAmount, setBetAmount] = useState('');
    const [potentialReturn, setPotentialReturn] = useState(0);

    const matchIdInt = parseInt(matchId, 10); // Convert matchId to integer

    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BASE_URL + `live/match/${matchIdInt}`); // Use matchIdInt
                const data = await response.json();

                if (data.status) {
                    setMatch(data.data);
                } else {
                    toast.error('Error fetching match data.');
                }
            } catch (error) {
                console.error('Error fetching match data:', error);
                toast.error('Unable to load match details.');
            }
        };

        fetchMatchData();
    }, [matchIdInt]); // Add matchIdInt as dependency

    const fetchBalance = async () => {
        try {
            const token = Cookies.get('token');
            const response = await fetch(import.meta.env.VITE_BASE_URL + 'payment/balance', {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            if (data.balance !== undefined) {
                setBalance(data.balance); // Update balance state
            } else {
                console.error('Unexpected API response format:', data);
            }
        } catch (error) {
            console.error('Error fetching balance:', error);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    // Calculate potential return whenever betAmount or selectedTeam changes
    useEffect(() => {
        const amount = parseFloat(betAmount);
        if (!isNaN(amount) && amount > 0 && selectedTeam) {
            setPotentialReturn(amount * 1.5); // 50% extra return
        } else {
            setPotentialReturn(0);
        }
    }, [betAmount, selectedTeam]);

    const handleBet = () => {
        if (!selectedTeam || !betAmount) {
            toast.error('Please select a team and enter a valid bet amount.');
            return;
        }

        const amount = parseFloat(betAmount);

        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid bet amount.');
            return;
        }

        if (amount > balance) {
            toast.error('Insufficient token balance.');
            return;
        }

        const placeBet = async () => {
            try {
                const token = Cookies.get('token');
                const response = await fetch(import.meta.env.VITE_BASE_URL + 'bet/place', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json', // Ensure you are sending JSON
                    },
                    body: JSON.stringify({
                        match_id: matchIdInt, // Pass matchIdInt as integer
                        bet_on: selectedTeam,  // Use selected team (team_a or team_b)
                        amount: amount,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    // setBalance(balance - amount);
                    toast.success(data.message);
                } else {
                    // Show error message from API response
                    if (data.message) {
                        toast.error(data.message); // Display the error message from API
                    } else {
                        toast.error('Error placing bet.');
                    }
                }
            } catch (error) {
                console.error('Error placing bet:', error);
                toast.error('Unable to place bet.');
            }
        };

        placeBet();
        setBetAmount('');
        setSelectedTeam('');
    };



    if (!match) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-700">
                <p className="text-xl">Loading match data...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 transition duration-300"
            >
                <FiArrowLeft size={24} />
                <span className="text-lg font-semibold">Back to Matches</span>
            </button>

            <div className="bg-white p-8 rounded-3xl shadow-lg max-w-4xl mx-auto space-y-6">
                <div className="text-center">
                    <h2 className="text-4xl font-extrabold text-purple-700 mb-2">{`${match.team_a} vs ${match.team_b}`}</h2>
                    <p className="text-lg text-gray-600 mb-4">{match.match_status}</p>
                    <div className="flex justify-center gap-6 mb-8">
                        <div className="flex flex-col items-center w-1/2">
                            <img src={match.team_a_img} alt={match.team_a} className="w-32 h-32 object-contain mb-4" />
                            <p className="text-xl font-semibold text-purple-700">{match.team_a}</p>
                            <p className="text-gray-600">Score: {match.team_a_scores}</p>
                            <p className="text-gray-600">Overs: {match.team_a_over}</p>
                        </div>
                        <div className="flex flex-col items-center w-1/2">
                            <img src={match.team_b_img} alt={match.team_b} className="w-32 h-32 object-contain mb-4" />
                            <p className="text-xl font-semibold text-purple-700">{match.team_b}</p>
                            <p className="text-gray-600">Score: {match.team_b_scores || 'N/A'}</p>
                            <p className="text-gray-600">Overs: {match.team_b_over || 'N/A'}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-100 to-indigo-200 p-6 rounded-xl shadow-lg mb-6">
                    <h3 className="text-2xl font-bold text-center text-purple-700">Place Your Bet</h3>
                    <div className="mt-4 mb-6 text-center">
                        <p className="text-lg text-gray-600">Token Balance: <span className="font-bold text-green-600">{balance}</span></p>
                        <p className="text-lg text-gray-600">Potential Return: <span className="font-bold text-blue-600">{potentialReturn.toFixed(2)}</span></p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {[match.team_a, match.team_b].map((team) => (
                            <div key={team} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                                <button
                                    className={`text-lg font-semibold ${selectedTeam === team ? 'text-purple-600' : 'text-gray-600'}`}
                                    onClick={() => setSelectedTeam(team)}
                                >
                                    {team}
                                </button>
                                <input
                                    type="number"
                                    className="border p-2 rounded-lg mt-4 w-full"
                                    value={selectedTeam === team ? betAmount : ''}
                                    onChange={(e) => setBetAmount(e.target.value)}
                                    placeholder="Enter Bet Amount"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-center gap-6 mt-6">
                        <button
                            className="bg-purple-600 text-white py-3 px-8 rounded-lg shadow-lg hover:bg-purple-700 transition duration-300"
                            onClick={handleBet}
                        >
                            Place Bet
                        </button>
                    </div>
                </div>

                <div>
                    <MatchSquad matchId={match.match_id} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MatchProfile;
