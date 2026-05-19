import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);

            if (result.success) {
                navigate('/dashboard');
            } else {
                setError(result.error || 'Login failed. Please try again.');
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <img
                        src={logo}
                        alt="Tattvix Logo"
                        className="h-40 mx-auto mb-6 object-contain"
                    />

                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-slate-800 mb-2 text-center">Welcome to Tattvix</h1>
                    <p className="text-slate-600 text-center mb-6">Sign in to your account to continue</p>
                    {/* divide horizontal line */}
                    <div className="flex items-center mb-3">
                        <div className="w-full h-px bg-slate-200"></div>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Error Message */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                name="email"
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                required
                                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input
                                    type="checkbox"
                                    className="w-4 h-4 text-red-600 border-slate-300 rounded focus:ring-red-500"
                                />
                                <span className="ml-2 text-sm text-slate-600">Remember me</span>
                            </label>
                            <a href="#" className="text-sm text-red-600 hover:text-red-700 font-medium">
                                Forgot password?
                            </a>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            Don't have an account?{' '}
                            <a href="#" className="text-red-600 hover:text-red-700 font-medium">
                                Contact Admin
                            </a>
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-8 text-center text-sm text-slate-500">
                    © 2024 Tattvix. All rights reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
