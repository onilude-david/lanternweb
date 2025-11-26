import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../../lib/firebase';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
import LanternButton from '../ui/LanternButton';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { user } = useApp(); // Get user from context

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to login. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Failed to login with Google.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-lantern-light p-4">
            <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <div className="w-12 h-12 bg-lantern-red rounded-xl flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                        L
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">Welcome Back!</h1>
                    <p className="text-gray-500">Sign in to continue your learning journey.</p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            placeholder="student@lantern.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-lantern-yellow focus:border-transparent outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <LanternButton
                        type="submit"
                        disabled={loading}
                        className="w-full"
                        size="lg"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign In"}
                    </LanternButton>
                </form>

                <div className="mt-4">
                    <LanternButton
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        variant="ghost"
                        className="w-full border-2 border-gray-200"
                        size="lg"
                    >
                        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                        Sign in with Google
                    </LanternButton>
                </div>

                <div className="mt-6 text-center text-sm text-gray-500">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-lantern-red font-bold hover:underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </div>
    );
}
