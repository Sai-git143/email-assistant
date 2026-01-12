import { useState } from 'react';

interface LandingPageProps {
    onLogin: (user: string, pass: string) => void;
}

export default function LandingPage({ onLogin }: LandingPageProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(email, password);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white overflow-hidden selection:bg-indigo-500/30 font-sans relative">
            {/* Dynamic Background */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-900/40 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob" />
                <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-900/40 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-20%] left-[20%] w-[600px] h-[600px] bg-pink-900/40 rounded-full mix-blend-multiply filter blur-[128px] opacity-70 animate-blob animation-delay-4000" />
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 flex flex-col min-h-screen">
                {/* Navbar */}
                <nav className="flex items-center justify-between py-8 animate-fade-in-down">
                    <div className="flex items-center gap-3 group cursor-pointer">
                        <div className="relative w-10 h-10">
                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
                            <div className="relative w-full h-full bg-[#0A0A0B] rounded-xl border border-white/10 flex items-center justify-center">
                                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-purple-400">EA</span>
                            </div>
                        </div>
                        <span className="font-bold text-xl tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">Email Assistant</span>
                    </div>
                    <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-400">
                        <a href="#features" className="hover:text-white transition-colors">Features</a>
                        <a href="#" className="hover:text-white transition-colors">How it works</a>
                    </div>
                </nav>

                {/* Hero Section */}
                <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-24 py-12 lg:py-0">
                    {/* Hero Text */}
                    <div className="flex-1 space-y-10 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md text-indigo-300 text-xs font-semibold uppercase tracking-wider shadow-xl shadow-indigo-500/10 hover:border-indigo-500/50 transition-colors cursor-default">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                            </span>
                            Powered by Gemini 2.5 Flash
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-[1.1]">
                            Draft Emails <br />
                            <span className="bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 text-transparent bg-clip-text animate-shimmer">
                                With Superpowers.
                            </span>
                        </h1>

                        <p className="text-lg text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
                            Transform your scattered thoughts into polished, professional emails instantly.
                            Uses advanced AI to understand context, tone, and relationships.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400 pt-4">
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Context Aware</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/5">
                                <svg className="w-5 h-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                <span>Local-First Security</span>
                            </div>
                        </div>
                    </div>

                    {/* Login Card - Floating Effect */}
                    <div className="w-full max-w-md animate-float">
                        <div className="relative group perspective-1000">
                            {/* Glow Behind */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                            <div className="relative glass-card p-8 rounded-3xl">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
                                    <p className="text-sm text-gray-400">Sign in to access your intelligent workspace</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    <div className="space-y-2 group/input">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider group-focus-within/input:text-indigo-400 transition-colors">Gmail Address</label>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="name@gmail.com"
                                            className="w-full bg-[#0A0A0B]/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2 group/input">
                                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider group-focus-within/input:text-indigo-400 transition-colors">App Password</label>
                                        <input
                                            type="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="•••• •••• •••• ••••"
                                            className="w-full bg-[#0A0A0B]/50 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-gray-700 outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all hover:border-white/20"
                                            required
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full relative group overflow-hidden bg-white text-black font-bold py-4 rounded-xl shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)] hover:shadow-[0_0_25px_-5px_rgba(255,255,255,0.5)] transition-all transform active:scale-[0.98]"
                                    >
                                        <span className="relative z-10 flex items-center justify-center gap-2">
                                            Start Composing
                                            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </span>
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-100 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    </button>
                                </form>

                                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                                    <a href="https://support.google.com/accounts/answer/185833" target="_blank" rel="noopener noreferrer" className="text-xs text-gray-500 hover:text-white transition-colors flex items-center justify-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                        How to get an App Password?
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Features Grid - Bottom */}
                <div className="pb-20 pt-10" id="features">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Smart Parsing",
                                desc: "No stiff commands. Just speak naturally, and our AI understands exactly what you mean.",
                                icon: "M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z",
                                color: "text-yellow-400"
                            },
                            {
                                title: "Relationship Context",
                                desc: "It knows who 'Bob' is vs 'Robert'. It adjusts tone based on the recipient automatically.",
                                icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
                                color: "text-indigo-400"
                            },
                            {
                                title: "Interactive Drafting",
                                desc: "Collaborate with the AI. Revise, tweak, and perfect your message in a chat-like flow.",
                                icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
                                color: "text-pink-400"
                            }
                        ].map((feature, i) => (
                            <div key={i} className="group glass-card p-6 rounded-2xl hover:-translate-y-1 transition-transform duration-300">
                                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/5 group-hover:border-white/10`}>
                                    <svg className={`w-6 h-6 ${feature.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={feature.icon} /></svg>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-indigo-200 transition-colors">{feature.title}</h3>
                                <p className="text-sm text-gray-400 leading-relaxed font-light">{feature.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
