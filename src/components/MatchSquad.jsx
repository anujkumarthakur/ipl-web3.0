import React, { useEffect, useState } from "react";

const MatchSquad = ({ matchId }) => {
    const [squadData, setSquadData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSquadData = async () => {
            try {
                const response = await fetch(import.meta.env.VITE_BASE_URL + `live/match/get-squad?match_id=${matchId}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                // console.log(data); // Log the fetched data to inspect

                if (data && data.team_a_players && data.team_b_players) {
                    setSquadData(data);
                    setLoading(false);
                } else {
                    setError('Error fetching squad data');
                    setLoading(false);
                }
            } catch (error) {
                console.error("Error fetching or parsing data:", error);
                setError('Error fetching squad data');
                setLoading(false);
            }
        };

        fetchSquadData();
    }, [matchId]);


    if (loading) return <div className="text-center text-lg">Loading...</div>;
    if (error) return <div className="text-center text-red-500 text-lg">Error: {error}</div>;

    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-gray-100 rounded-lg shadow-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">Match Squad</h1>

            {/* Team A Section */}
            <div className="bg-white p-4 mb-6 rounded-lg shadow-md">
                <h2 className="flex items-center text-2xl font-medium text-gray-700 mb-4">
                    <img
                        src={squadData.team_a_flag_url}
                        alt={squadData.team_a_name}
                        className="h-8 mr-3"
                    />
                    {squadData.team_a_name}
                </h2>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2 px-4 font-medium text-gray-600">Player</th>
                            <th className="py-2 px-4 font-medium text-gray-600">Role</th>
                            <th className="py-2 px-4 font-medium text-gray-600">Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squadData.team_a_players.map((player) => (
                            <tr key={player.player_id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 text-gray-700">{player.name}</td>
                                <td className="py-2 px-4 text-gray-600">{player.play_role}</td>
                                <td className="py-2 px-4">
                                    <img
                                        src={player.image}
                                        alt={player.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Team B Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                <h2 className="flex items-center text-2xl font-medium text-gray-700 mb-4">
                    <img
                        src={squadData.team_b_flag_url}
                        alt={squadData.team_b_name}
                        className="h-8 mr-3"
                    />
                    {squadData.team_b_name}
                </h2>
                <table className="min-w-full table-auto">
                    <thead>
                        <tr className="text-left border-b">
                            <th className="py-2 px-4 font-medium text-gray-600">Player</th>
                            <th className="py-2 px-4 font-medium text-gray-600">Role</th>
                            <th className="py-2 px-4 font-medium text-gray-600">Image</th>
                        </tr>
                    </thead>
                    <tbody>
                        {squadData.team_b_players.map((player) => (
                            <tr key={player.player_id} className="border-b hover:bg-gray-50">
                                <td className="py-2 px-4 text-gray-700">{player.name}</td>
                                <td className="py-2 px-4 text-gray-600">{player.play_role}</td>
                                <td className="py-2 px-4">
                                    <img
                                        src={player.image}
                                        alt={player.name}
                                        className="h-12 w-12 rounded-full object-cover"
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MatchSquad;
