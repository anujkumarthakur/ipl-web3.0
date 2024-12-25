import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginBgImage from '../assets/login-bg-image2.jpg';

const Signup = () => {
    const navigate = useNavigate();
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

                <form>
                    <div className="mb-6">
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-600">
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Enter your name"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                            Email / Phone Number
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email / phone number"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <div className="mb-6">
                        <label htmlFor="password" className="block text-sm font-semibold text-gray-600">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter your password"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
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
