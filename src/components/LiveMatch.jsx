import React, { useState, useEffect } from 'react';

// LiveMatch Component
const LiveMatch = () => {
    const [matches, setMatches] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetch(import.meta.env.VITE_BASE_URL + 'live/matches')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setMatches(data.data); // Access the 'data' array directly
                setIsLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching data:', error);
                setIsLoading(false);
            });
    }, []);

    const handleFieldChange = (matchId, field, value, index = -1) => {
        setMatches((prevMatches) =>
            prevMatches.map((match) =>
                match.id === matchId
                    ? {
                        ...match,
                        data: {
                            ...match.data,
                            [field]: field === 'team_a_scores_over' || field === 'team_b_scores_over'
                                ? match.data[field].map((over, i) =>
                                    i === index ? { ...over, score: value } : over
                                ) // Update specific over score
                                : value,
                        },
                    }
                    : match
            )
        );
    };

    const handleOverChange = (matchId, field, value, index) => {
        setMatches((prevMatches) =>
            prevMatches.map((match) =>
                match.id === matchId
                    ? {
                        ...match,
                        data: {
                            ...match.data,
                            [field]: match.data[field].map((over, i) =>
                                i === index ? { ...over, over: value } : over
                            ),
                        },
                    }
                    : match
            )
        );
    };

    const handleAddOver = (matchId, field) => {
        setMatches((prevMatches) =>
            prevMatches.map((match) =>
                match.id === matchId
                    ? {
                        ...match,
                        data: {
                            ...match.data,
                            [field]: [
                                ...match.data[field],
                                { over: '', score: '' }, // Adding a new empty over object
                            ],
                        },
                    }
                    : match
            )
        );
    };

    const handleUpdateMatch = (matchId, updatedData) => {
        fetch(import.meta.env.VITE_BASE_URL + 'live/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                match_id: matchId,
                updated_data: updatedData,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    alert('Match data updated successfully');
                } else {
                    alert('Error updating match data');
                }
            })
            .catch((error) => {
                console.error('Error updating match data:', error);
            });
    };

    const handleSubmitUpdate = (matchId) => {
        const updatedData = {
            match_status: matches.find((match) => match.id === matchId).data.match_status,
            team_a_scores_over: matches.find((match) => match.id === matchId).data.team_a_scores_over,
            team_b_scores_over: matches.find((match) => match.id === matchId).data.team_b_scores_over,
        };

        handleUpdateMatch(matchId, updatedData);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 flex justify-center items-center">
                <p className="text-2xl text-white font-semibold">Loading matches...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-gray-100">
            <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-6 w-full text-center">
                <h1 className="text-4xl font-bold">Live Cricket Matches</h1>
            </header>

            <div className="max-w-5xl mx-auto mt-8 px-4">
                {matches.length === 0 ? (
                    <p className="text-center text-lg text-gray-300">No live matches available.</p>
                ) : (
                    matches.map((match) => {
                        const {
                            match_status,
                            match_time,
                            match_date,
                            match_type,
                            series,
                            toss,
                            venue,
                            team_a,
                            team_b,
                            team_a_img,
                            team_b_img,
                            team_a_scores,
                            team_b_scores,
                            team_a_scores_over,
                            team_b_scores_over,
                            max_rate,
                            min_rate,
                            fav_team,
                            is_hundred,
                            day_stumps,
                        } = match.data;

                        return (
                            <div
                                key={match.id}
                                className="bg-gradient-to-r from-gray-800 to-gray-700 shadow-lg rounded-xl p-6 my-6 transition-transform transform hover:scale-105"
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <div className="text-2xl font-bold text-blue-400">
                                        {team_a} vs {team_b}
                                    </div>
                                    <div className="flex space-x-4">
                                        <img
                                            src={team_a_img}
                                            alt={team_a}
                                            className="w-20 h-20 object-cover rounded-full ring-4 ring-blue-400"
                                        />
                                        <img
                                            src={team_b_img}
                                            alt={team_b}
                                            className="w-20 h-20 object-cover rounded-full ring-4 ring-blue-400"
                                        />
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-4 mb-4">
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                                        <div className="flex items-center">
                                            <strong className="mr-2">Match Date:</strong>
                                            <span>{match_date}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Match Time:</strong>
                                            <span>{match_time}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Match Type:</strong>
                                            <span>{match_type}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Series:</strong>
                                            <span>{series}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Toss:</strong>
                                            <span>{toss}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Venue:</strong>
                                            <span>{venue}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Favorite Team:</strong>
                                            <span>{fav_team}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Is Hundred Scored?:</strong>
                                            <span>{is_hundred === 1 ? 'Yes' : 'No'}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <strong className="mr-2">Day Stumps:</strong>
                                            <span>{day_stumps}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-gray-800 rounded-lg p-4 mt-4">
                                    <h4 className="text-lg font-semibold text-yellow-400 mb-3">Scores</h4>
                                    <div className="flex justify-between text-sm text-gray-300">
                                        <div className="w-1/2">
                                            <h5 className="font-medium text-blue-300">{team_a}</h5>
                                            <div>
                                                <strong>Score:</strong>
                                                <input
                                                    type="number"
                                                    value={team_a_scores}
                                                    onChange={(e) =>
                                                        handleFieldChange(match.id, 'team_a_scores', e.target.value)
                                                    }
                                                    className="w-full p-2 mt-2 text-gray-900 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <strong>Overs:</strong>
                                                {team_a_scores_over && team_a_scores_over.length > 0 ? (
                                                    team_a_scores_over.map((over, index) => (
                                                        <div key={index} className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={over.over}
                                                                onChange={(e) =>
                                                                    handleOverChange(match.id, 'team_a_scores_over', e.target.value, index)
                                                                }
                                                                className="w-1/4 p-2 bg-gray-700 text-gray-100 rounded-md"
                                                                placeholder="Over"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={over.score}
                                                                onChange={(e) =>
                                                                    handleFieldChange(match.id, 'team_a_scores_over', e.target.value, index)
                                                                }
                                                                className="w-1/4 p-2 bg-gray-700 text-gray-100 rounded-md"
                                                                placeholder="Score"
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No overs available</p>
                                                )}
                                                <button
                                                    onClick={() => handleAddOver(match.id, 'team_a_scores_over')}
                                                    className="text-blue-500 mt-2"
                                                >
                                                    Add Over
                                                </button>
                                            </div>
                                        </div>

                                        <div className="w-1/2">
                                            <h5 className="font-medium text-blue-300">{team_b}</h5>
                                            <div>
                                                <strong>Score:</strong>
                                                <input
                                                    type="number"
                                                    value={team_b_scores}
                                                    onChange={(e) =>
                                                        handleFieldChange(match.id, 'team_b_scores', e.target.value)
                                                    }
                                                    className="w-full p-2 mt-2 text-gray-900 rounded-lg bg-gray-700 border-2 border-gray-600 focus:outline-none"
                                                />
                                            </div>
                                            <div>
                                                <strong>Overs:</strong>
                                                {team_b_scores_over && team_b_scores_over.length > 0 ? (
                                                    team_b_scores_over.map((over, index) => (
                                                        <div key={index} className="flex items-center gap-2 mb-2">
                                                            <input
                                                                type="text"
                                                                value={over.over}
                                                                onChange={(e) =>
                                                                    handleOverChange(match.id, 'team_b_scores_over', e.target.value, index)
                                                                }
                                                                className="w-1/4 p-2 bg-gray-700 text-gray-100 rounded-md"
                                                                placeholder="Over"
                                                            />
                                                            <input
                                                                type="text"
                                                                value={over.score}
                                                                onChange={(e) =>
                                                                    handleFieldChange(match.id, 'team_b_scores_over', e.target.value, index)
                                                                }
                                                                className="w-1/4 p-2 bg-gray-700 text-gray-100 rounded-md"
                                                                placeholder="Score"
                                                            />
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p>No overs available</p>
                                                )}
                                                <button
                                                    onClick={() => handleAddOver(match.id, 'team_b_scores_over')}
                                                    className="text-blue-500 mt-2"
                                                >
                                                    Add Over
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-end">
                                    <button
                                        onClick={() => handleSubmitUpdate(match.id)}
                                        className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700"
                                    >
                                        Update Match
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default LiveMatch;
