import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBgImage from '../assets/login-bg-image2.jpg';
import Cookies from 'js-cookie'; // For managing cookies

const Login = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState('');

    // Check if token exists on component mount and redirect if logged in
    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            // If token is present, redirect to dashboard (or home page)
            navigate('/dashboard');
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Use the full URL for the login API
        const apiUrl = 'http://localhost:8080/api/v1/users/login';

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                // Store the token in cookies
                Cookies.set('token', data.token);
                navigate('/dashboard'); // Redirect to dashboard or home page
            } else {
                setError(data.message || 'Failed to login. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while logging in. Please try again.');
        }
    };

    return (
        <div
            className="flex justify-center items-center min-h-screen"
            style={{
                backgroundImage: `url(${loginBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="bg-white/90 p-8 rounded-lg shadow-2xl max-w-md w-full border-t-4 border-indigo-500">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 focus:outline-none focus:ring-4 focus:ring-indigo-400 focus:border-indigo-500 transition duration-300"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-700 mb-2"
                        >
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-gradient-to-r from-yellow-100 via-orange-100 to-red-100 focus:outline-none focus:ring-4 focus:ring-orange-400 focus:border-orange-500 transition duration-300"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold hover:shadow-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-purple-300"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-700">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/signup')}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Sign Up
                    </button>
                </p>

                <p className="mt-2 text-center text-sm text-gray-700">
                    <button
                        onClick={() => navigate('/forgot-password')}
                        className="text-indigo-600 font-semibold hover:underline"
                    >
                        Forgot Password?
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
