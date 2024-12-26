import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useToken } from '../context/TokenContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const MatchProfile = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { balance, updateBalance } = useToken();
    const [match, setMatch] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [betAmountIndia, setBetAmountIndia] = useState('');
    const [betAmountWestIndies, setBetAmountWestIndies] = useState('');
    const [betResult, setBetResult] = useState(null);
    const [odds, setOdds] = useState({ India: 1.5, WestIndies: 1.8 });
    const [potentialReturn, setPotentialReturn] = useState(0);

    useEffect(() => {
        // Fetch match data from API
        const fetchMatchData = async () => {
            const response = await fetch(`http://localhost:8080/api/v1/live/match/${matchId}`);
            const data = await response.json();

            if (data.status) {
                setMatch(data.data);
            } else {
                toast.error('Error fetching match data.');
            }
        };

        fetchMatchData();
    }, [matchId]);

    useEffect(() => {
        if (selectedTeam === 'India' && betAmountIndia) {
            setPotentialReturn(parseFloat(betAmountIndia) * odds['India']);
        } else if (selectedTeam === 'WestIndies' && betAmountWestIndies) {
            setPotentialReturn(parseFloat(betAmountWestIndies) * odds['WestIndies']);
        } else {
            setPotentialReturn(0); // Reset to 0 if no valid bet amount
        }
    }, [selectedTeam, betAmountIndia, betAmountWestIndies, odds]);

    if (!match) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-700">
                <p className="text-xl">Loading match data...</p>
            </div>
        );
    }

    const chartData = {
        labels: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        datasets: [
            {
                label: `${match.team_a} Score`,
                data: [0, 30, 60, 90, 120, 150, 180, 220, 250, 280, 311], // Update with real-time scores
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: `${match.team_b} Score`,
                data: [0, 5, 15, 25, 35, 45, 55, 62], // Update with real-time scores
                borderColor: 'rgba(239, 68, 68, 1)',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                fill: true,
                tension: 0.3
            }
        ]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Score over Time',
                font: {
                    size: 18,
                    family: 'Poppins, sans-serif'
                }
            },
            tooltip: {
                mode: 'index',
                intersect: false
            }
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Overs',
                    font: {
                        family: 'Poppins, sans-serif'
                    }
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Runs',
                    font: {
                        family: 'Poppins, sans-serif'
                    }
                },
                ticks: {
                    beginAtZero: true
                }
            }
        }
    };

    const handleBet = () => {
        if (!selectedTeam || (!betAmountIndia && !betAmountWestIndies)) {
            toast.error('Please select a team and enter a valid bet amount.');
            return;
        }

        const betAmount = selectedTeam === 'India' ? betAmountIndia : betAmountWestIndies;
        const amount = parseFloat(betAmount);

        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid bet amount.');
            return;
        }

        if (amount > balance) {
            toast.error('Insufficient token balance.');
            return;
        }

        // Deduct the bet amount immediately
        updateBalance(-amount);
        toast.success('Bet placed successfully! You will be notified of the match outcome after it concludes.');

        // Store bet details for later result processing (this could also be sent to a backend)
        const betDetails = {
            team: selectedTeam,
            amount,
            odds: odds[selectedTeam]
        };
        console.log('Bet details saved for later processing:', betDetails);

        // Reset input fields and selected team
        setBetAmountIndia('');
        setBetAmountWestIndies('');
        setSelectedTeam('');
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-200 p-6"

        >
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
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        {['India', 'WestIndies'].map((team) => (
                            <div key={team} className="flex flex-col items-center bg-white p-4 rounded-xl shadow-lg hover:shadow-2xl transition duration-300">
                                <button
                                    className={`text-lg font-semibold ${selectedTeam === team ? 'text-purple-600' : 'text-gray-600'}`}
                                    onClick={() => setSelectedTeam(team)}
                                >
                                    {team}
                                </button>
                                <p className="text-gray-600 mt-2">Odds: {odds[team]}</p>
                                <input
                                    type="number"
                                    className="border p-2 rounded-lg mt-4 w-full"
                                    value={team === 'India' ? betAmountIndia : betAmountWestIndies}
                                    onChange={(e) =>
                                        team === 'India'
                                            ? setBetAmountIndia(e.target.value)
                                            : setBetAmountWestIndies(e.target.value)
                                    }
                                    placeholder="Enter Bet Amount"
                                />
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-center">
                        <p className="text-xl font-semibold text-gray-700">Potential Return: {potentialReturn.toFixed(2)} tokens</p>
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

                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MatchProfile;
