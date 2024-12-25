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

const matchData = {
    1: {
        teams: 'India Women vs West Indies Women',
        status: 'Live',
        location: 'Reliance Stadium, Vadodara',
        date: 'December 24, 2024',
        series: 'West Indies Women tour of India, 2024',
        matchTime: '01:30 PM',
        matchType: 'ODI',
        teamA: 'India Women',
        teamB: 'West Indies Women',
        teamAImg: 'https://cricketchampion.co.in/webroot/img/teams/1891199335_team.png',
        teamBImg: 'https://cricketchampion.co.in/webroot/img/teams/362776515_team.png',
        toss: 'India Women have won the toss and have opted to bat',
        teamAScore: '358-5',
        teamBScore: '62-3',
        teamAOver: '50.0',
        teamBOver: '15.4',
        teamAStatus: 'India Women are batting',
        teamBStatus: 'West Indies Women NEED 297 RUNS IN 34.2 OVERS TO WIN',
        seriesType: 'Women',
        matchID: 6506,
        teamAScoresOver: [{ over: '50.0', score: '358-5' }],
        teamBScoresOver: [{ over: '15.4', score: '62-3' }],
    }
};

const MatchProfile = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { balance, updateBalance } = useToken();
    const match = matchData[matchId];
    const [selectedTeam, setSelectedTeam] = useState('');
    const [betAmountIndia, setBetAmountIndia] = useState('');
    const [betAmountWestIndies, setBetAmountWestIndies] = useState('');
    const [betResult, setBetResult] = useState(null);
    const [odds, setOdds] = useState({ India: 1.5, WestIndies: 1.8 });
    const [potentialReturn, setPotentialReturn] = useState(0);

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
                <p>Match not found.</p>
            </div>
        );
    }

    const chartData = {
        labels: ['0', '5', '10', '15', '20', '25', '30', '35', '40', '45', '50'],
        datasets: [
            {
                label: 'India Women Score',
                data: [0, 30, 60, 90, 120, 150, 180, 220, 250, 280, 358],
                borderColor: 'rgba(34, 197, 94, 1)',
                backgroundColor: 'rgba(34, 197, 94, 0.2)',
                fill: true,
                tension: 0.3
            },
            {
                label: 'West Indies Women Score',
                data: [0, 5, 15, 25, 35, 45, 55, 62],
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

    // Example function to simulate match result fetching
    const fetchMatchResult = () => {
        // Simulate match result after a delay
        setTimeout(() => {
            const winningTeam = Math.random() < 0.5 ? 'India' : 'WestIndies';
            setBetResult(`The match has concluded. ${winningTeam} won the match.`);

            if (betResult && betResult.includes(selectedTeam)) {
                const winnings = betAmountIndia
                    ? betAmountIndia * odds['India']
                    : betAmountWestIndies * odds['WestIndies'];
                updateBalance(winnings);
                toast.success(`🎉 You won ${winnings.toFixed(2)} tokens!`);
            } else {
                toast.error(`😞 You lost. ${winningTeam} won the match.`);
            }
        }, 10000); // Delay of 10 seconds for simulation
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800 transition duration-300"
            >
                <FiArrowLeft size={24} />
                <span className="text-lg font-semibold">Back to Matches</span>
            </button>

            <div className="bg-white p-8 rounded-xl shadow-lg max-w-4xl mx-auto">
                <h2 className="text-4xl font-extrabold text-purple-700 mb-4 text-center">{match.teams}</h2>
                <p className="text-lg text-gray-600 text-center mb-8">{match.status}</p>

                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-purple-700">Match Details</h3>
                    <p className="text-gray-600 mt-2">Location: <span className="font-bold text-purple-600">{match.location}</span></p>
                    <p className="text-gray-600 mt-2">Date: <span className="font-bold text-purple-600">{match.date}</span></p>
                    <p className="text-gray-600 mt-2">Time: <span className="font-bold text-purple-600">{match.matchTime}</span></p>
                    <p className="text-gray-600 mt-2">Series: <span className="font-bold text-purple-600">{match.series}</span></p>
                </div>

                <div className="flex justify-center gap-6 mb-6">
                    <div className="w-1/2 text-center">
                        <h3 className="text-xl font-bold text-purple-700 mb-4">India Women</h3>
                        <img src={match.teamAImg} alt="India Women" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-gray-600">Score: {match.teamAScore}</p>
                        <p className="text-gray-600">Overs: {match.teamAOver}</p>
                    </div>
                    <div className="w-1/2 text-center">
                        <h3 className="text-xl font-bold text-purple-700 mb-4">West Indies Women</h3>
                        <img src={match.teamBImg} alt="West Indies Women" className="w-24 h-24 mx-auto mb-4" />
                        <p className="text-gray-600">Score: {match.teamBScore}</p>
                        <p className="text-gray-600">Overs: {match.teamBOver}</p>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-purple-700">Place Your Bet</h3>
                    <p className="text-gray-600 mt-2">Token Balance: <span className="font-bold text-green-600">{balance}</span></p>
                </div>

                <table className="w-full border-collapse text-left mb-6">
                    <thead>
                        <tr>
                            <th className="border p-4 text-gray-600 text-center">Team</th>
                            <th className="border p-4 text-gray-600 text-center">Odds</th>
                            <th className="border p-4 text-gray-600 text-center">Bet Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {['India', 'WestIndies'].map((team) => (
                            <tr key={team}>
                                <td className="border p-4 text-center">
                                    <label className="flex items-center justify-center">
                                        <input
                                            type="radio"
                                            name="team"
                                            value={team}
                                            checked={selectedTeam === team}
                                            onChange={() => setSelectedTeam(team)}
                                            className="hidden"
                                        />
                                        <div
                                            className={`w-8 h-8 border-2 rounded-full flex items-center justify-center ${selectedTeam === team ? 'bg-purple-600 text-white' : 'border-gray-600'}`}
                                        >
                                            {selectedTeam === team && <span className="text-xs">✔</span>}
                                        </div>
                                        <span className="ml-2 text-sm">{team === 'WestIndies' ? 'West Indies' : team}</span>
                                    </label>
                                </td>
                                <td className="border p-4 text-center">{odds[team]}</td>
                                <td className="border p-4 text-center">
                                    <input
                                        type="number"
                                        value={team === 'India' ? betAmountIndia : betAmountWestIndies}
                                        onChange={(e) =>
                                            team === 'India'
                                                ? setBetAmountIndia(e.target.value)
                                                : setBetAmountWestIndies(e.target.value)
                                        }
                                        className="border px-2 py-1 rounded text-center"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="text-center mb-6">
                    <p className="text-lg font-bold text-gray-600">
                        Potential Return: {potentialReturn > 0 ? `${potentialReturn.toFixed(2)} tokens` : 'N/A'}
                    </p>
                </div>

                <div className="text-center mb-6">
                    <button
                        onClick={handleBet}
                        className="bg-purple-600 text-white py-2 px-8 rounded-lg hover:bg-purple-700 transition duration-300"
                    >
                        Place Bet
                    </button>
                </div>

                {betResult && (
                    <div className="mt-6 text-center">
                        <p className="text-xl font-semibold text-purple-700">{betResult}</p>
                    </div>
                )}

                <div className="mt-6 text-center">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MatchProfile;
