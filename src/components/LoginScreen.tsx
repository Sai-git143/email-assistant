import { useState } from 'react';

interface LoginScreenProps {
    onLogin: (user: string, pass: string) => void;
}

export default function LoginScreen({ onLogin }: LoginScreenProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform transition-all hover:scale-[1.01]">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Email Assistant</h1>
                    <p className="text-blue-100">Sign in to start composing</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">
                            Gmail Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="name@gmail.com"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-blue-100 mb-2">
                            App Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••••••••••"
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl active:scale-95 transform duration-200"
                    >
                        Get Started
                    </button>
                </form>

                <p className="text-xs text-blue-200 mt-6 text-center">
                    Your credentials are used locally and never stored on our servers.
                </p>
            </div>
        </div>
    );
}
