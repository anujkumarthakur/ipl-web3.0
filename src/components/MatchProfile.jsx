import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useToken } from '../context/TokenContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MatchSquad from "./MatchSquad";

const MatchProfile = () => {
    const { matchId } = useParams();
    const navigate = useNavigate();
    const { balance, updateBalance } = useToken();
    const [match, setMatch] = useState(null);
    const [selectedTeam, setSelectedTeam] = useState('');
    const [betAmountTeamA, setBetAmountTeamA] = useState('');
    const [betAmountTeamB, setBetAmountTeamB] = useState('');
    const [potentialReturn, setPotentialReturn] = useState(0);
    const [odds, setOdds] = useState({});

    useEffect(() => {
        // Fetch match data from the API
        const fetchMatchData = async () => {
            const response = await fetch(import.meta.env.VITE_BASE_URL + `live/match/${matchId}`);
            const data = await response.json();

            if (data.status) {
                setMatch(data.data);
                // Set odds dynamically
                setOdds({ [data.data.team_a]: 1.5, [data.data.team_b]: 1.8 });
            } else {
                toast.error('Error fetching match data.');
            }
        };

        fetchMatchData();
    }, [matchId]);

    useEffect(() => {
        // Calculate potential return based on selected team and bet amount
        if (selectedTeam === match?.team_a && betAmountTeamA) {
            setPotentialReturn(parseFloat(betAmountTeamA) * odds[match.team_a]);
        } else if (selectedTeam === match?.team_b && betAmountTeamB) {
            setPotentialReturn(parseFloat(betAmountTeamB) * odds[match.team_b]);
        } else {
            setPotentialReturn(0);
        }
    }, [selectedTeam, betAmountTeamA, betAmountTeamB, odds, match]);

    if (!match) {
        return (
            <div className="h-screen flex items-center justify-center text-gray-700">
                <p className="text-xl">Loading match data...</p>
            </div>
        );
    }

    const handleBet = () => {
        if (!selectedTeam || (!betAmountTeamA && !betAmountTeamB)) {
            toast.error('Please select a team and enter a valid bet amount.');
            return;
        }

        const betAmount = selectedTeam === match.team_a ? betAmountTeamA : betAmountTeamB;
        const amount = parseFloat(betAmount);

        if (isNaN(amount) || amount <= 0) {
            toast.error('Please enter a valid bet amount.');
            return;
        }

        if (amount > balance) {
            toast.error('Insufficient token balance.');
            return;
        }

        // Deduct tokens and notify the user
        updateBalance(-amount);
        toast.success('Bet placed successfully! You will be notified of the match outcome after it concludes.');

        const betDetails = {
            team: selectedTeam,
            amount,
            odds: odds[selectedTeam],
        };
        console.log('Bet details saved for later processing:', betDetails);

        // Reset the form
        setBetAmountTeamA('');
        setBetAmountTeamB('');
        setSelectedTeam('');
    };

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
                                <p className="text-gray-600 mt-2">Odds: {odds[team]}</p>
                                <input
                                    type="number"
                                    className="border p-2 rounded-lg mt-4 w-full"
                                    value={team === match.team_a ? betAmountTeamA : betAmountTeamB}
                                    onChange={(e) =>
                                        team === match.team_a
                                            ? setBetAmountTeamA(e.target.value)
                                            : setBetAmountTeamB(e.target.value)
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

                <div>
                    <MatchSquad matchId={match.match_id} />
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default MatchProfile;
