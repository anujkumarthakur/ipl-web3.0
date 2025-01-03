import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import loginBgImage from '../assets/login-bg-image2.jpg';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

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
        setSuccess('');

        try {
            const response = await fetch(import.meta.env.VITE_BASE_URL + 'users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess('User registered successfully');
                // Redirect to another page or clear the form after a delay
                setTimeout(() => {
                    navigate('/');
                }, 2000);
            } else {
                setError(data.message || 'Failed to register. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while registering. Please try again.');
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
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Sign Up</h2>

                {error && <div className="mb-4 text-red-600 text-center">{error}</div>}
                {success && <div className="mb-4 text-green-600 text-center">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-600">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                            Email / Phone Number
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email / phone number"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-300 focus:outline-none"
                    >
                        Sign Up
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Signup;
