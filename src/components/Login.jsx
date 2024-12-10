import React from 'react';

const Login = ({ toggleView }) => {
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Login</h2>

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
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300 focus:outline-none"
                    >
                        Login
                    </button>
                </form>

                <p className="mt-4 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <button onClick={() => toggleView('signup')} className="text-blue-500 hover:underline">
                        Sign Up
                    </button>
                </p>

                <p className="mt-2 text-center text-sm text-gray-600">
                    <button onClick={() => toggleView('forgot')} className="text-blue-500 hover:underline">
                        Forgot Password?
                    </button>
                </p>
            </div>
        </div>
    );
};

export default Login;
