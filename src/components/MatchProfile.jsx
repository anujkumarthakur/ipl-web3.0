import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

// Sample match data
const matchData = {
    1: {
        teams: 'India vs Pakistan',
        status_s: '2nd Innings - IND 150/3',
        status_f: '1st Innings - PAK 183/8',
        location: 'Dubai International Stadium',
        date: 'December 10, 2024',
        overs: [0, 5, 10, 15, 20, 25, 30, 35], // Overs timeline
        runningScores: [0, 30, 60, 90, 120, 140, 150, 180], // Running score at each over
        wickets: [0, 1, 2, 2, 3, 4, 5, 6], // Wickets taken at each over
        topBatting: [
            { player: 'Rohit Sharma', runs: '60', sr: '133.33' },
            { player: 'Shubman Gill', runs: '45', sr: '112.50' },
            { player: 'Virat Kohli', runs: '25', sr: '83.33' }
        ],
        topBowling: [
            { player: 'Jasprit Bumrah', overs: '4', wickets: '1' },
            { player: 'Mohammad Siraj', overs: '5', wickets: '0' }
        ]
    }
};

const MatchProfile = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();

    const match = matchData[matchId];

    if (!match) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-700">
                <p>Match not found.</p>
            </div>
        );
    }

    // Data for the chart
    const chartData = {
        labels: match.overs, // x-axis for overs
        datasets: [
            {
                label: 'Running Score',
                data: match.runningScores,
                borderColor: 'rgba(34, 197, 94, 1)', // Green color for score
                backgroundColor: 'rgba(34, 197, 94, 0.2)', // Light green for score area
                fill: true, // Fill the area under the line
                tension: 0.3
            },
            {
                label: 'Wickets Taken',
                data: match.wickets,
                borderColor: 'rgba(239, 68, 68, 1)', // Red color for wickets
                backgroundColor: 'rgba(239, 68, 68, 0.2)', // Light red for wicket area
                fill: true, // Fill the area under the line
                tension: 0.3
            }
        ]
    };

    // Chart options for customization
    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Score and Wickets Over Time'
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
                    text: 'Overs'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Runs / Wickets'
                },
                ticks: {
                    beginAtZero: true
                }
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-6">
            <button
                onClick={() => navigate(-1)}
                className="flex items-center gap-2 mb-6 text-purple-600 hover:text-purple-800"
            >
                <FiArrowLeft size={24} />
                <span className="text-lg font-semibold">Back to Matches</span>
            </button>

            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
                <div className="text-center mb-6">
                    <h2 className="text-3xl font-bold text-purple-700">{match.teams}</h2>
                    <p className="text-lg font-semibold text-gray-600">{match.status_f}</p>
                    <p className="text-lg font-semibold text-gray-600">{match.status_s}</p>
                    <p className="text-sm text-gray-500">{match.location} | {match.date}</p>
                </div>

                {/* Match Details */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">India - Top Batting</h3>
                    <ul>
                        {match.topBatting.map((batsman, index) => (
                            <li key={index} className="flex justify-between text-gray-700 py-2 border-b">
                                <span>{batsman.player}</span>
                                <span>{batsman.runs} runs (SR: {batsman.sr})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">Pakistan - Top Batting</h3>
                    <ul>
                        {match.topBatting.map((batsman, index) => (
                            <li key={index} className="flex justify-between text-gray-700 py-2 border-b">
                                <span>{batsman.player}</span>
                                <span>{batsman.runs} runs (SR: {batsman.sr})</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="mb-6">
                    <h3 className="text-xl font-semibold text-purple-600 mb-4">Top Bowling</h3>
                    <ul>
                        {match.topBowling.map((bowler, index) => (
                            <li key={index} className="flex justify-between text-gray-700 py-2 border-b">
                                <span>{bowler.player}</span>
                                <span>{bowler.overs} overs, {bowler.wickets} wickets</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Displaying the chart */}
                <div className="mb-6">
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        </div>
    );
};

export default MatchProfile;
