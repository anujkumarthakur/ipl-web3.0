import React from 'react';

const ForgetPassword = ({ toggleView }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
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
                    <button onClick={() => toggleView('login')} className="text-blue-500 hover:underline">
                        Login
                    </button>
                </p>
            </div>
        </div>
    );
};

export default ForgetPassword;
