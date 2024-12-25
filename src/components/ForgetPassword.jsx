import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginBgImage from '../assets/login-bg-image.jpg';

const ForgetPassword = () => {
    const navigate = useNavigate();

    return (
        <div
            className="flex justify-center items-center min-h-screen"
            style={{
                backgroundImage: `url(${loginBgImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >            <div className="bg-white/90 p-8 rounded-lg shadow-2xl max-w-md w-full border-t-4 border-indigo-500">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Forgot Password</h2>

                <form>
                    <div className="mb-6">
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-600">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Enter your email"
                            className="w-full px-4 py-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-yellow-500 text-white py-3 rounded-lg hover:bg-yellow-600 transition duration-300 focus:outline-none"
                    >
                        Reset Password
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Remember your password?{' '}
                    <button onClick={() => navigate('/')} className="text-blue-500 hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgetPassword;
