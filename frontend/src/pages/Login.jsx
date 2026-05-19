import React, { useState } from 'react';
import api from '../api/axios';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username || !password) {
            setError('Please enter both username/email and password.');
            setLoading(false);
            return;
        }

        try {
            // Using 'email' as the field name as per backend expectation, but keeping 'username' state for UI
            const response = await api.post('/login', { email: username, password });
            console.log('Login success:', response.data);

            // Store only the token (no sensitive data)
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }

            onLogin();
        } catch (err) {
            console.error('Login failed:', err);
            setError(err.response?.data?.message || 'Login failed. Please check your credentials and server connection.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
            {/* Background decoration circles */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
            <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

            <div className="relative bg-white/80 backdrop-blur-md p-8 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 animate-fade-in-up">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold text-slate-800 mb-2">Welcome Back</h1>
                    <p className="text-slate-500">Please enter your details to sign in</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                        {error}
                    </div>
                )}

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 block pl-1">Email</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 text-slate-800 placeholder-gray-400"
                                placeholder="Enter your email"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-slate-600 block pl-1">Password</label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                            <input
                                type="password"
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 transition-all duration-200 text-slate-800 placeholder-gray-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center space-x-2 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-red-500 focus:ring-red-500/20 transition duration-150" />
                            <span className="text-slate-500 group-hover:text-slate-700 transition">Remember me</span>
                        </label>
                        <a href="#" className="text-red-500 hover:text-red-600 font-medium transition-colors">Forgot password?</a>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-3.5 px-4 bg-gradient-to-r from-red-500 to-indigo-600 hover:from-red-600 hover:to-indigo-700 text-white font-bold rounded-lg shadow-lg shadow-red-500/30 transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-red-500/20 active:translate-y-0.5 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                </form>

                <div className="mt-8 text-center text-sm text-slate-500">
                    Don't have an account? <a href="#" className="text-red-500 hover:text-red-600 font-bold transition-colors">Create one</a>
                </div>
            </div>
        </div>
    );
};

export default Login;
