import { useState, KeyboardEvent } from 'react';

interface InputAreaProps {
    onSend: (message: string) => void;
    isLoading: boolean;
}

export default function InputArea({ onSend, isLoading }: InputAreaProps) {
    const [input, setInput] = useState('');

    const handleSend = () => {
        if (input.trim() && !isLoading) {
            onSend(input);
            setInput('');
        }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="bg-white/80 backdrop-blur-md border-t border-gray-100 p-4 pb-6">
            <div className="max-w-3xl mx-auto relative">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Describe the email you want to send..."
                    disabled={isLoading}
                    className="w-full bg-gray-50 border-0 rounded-2xl pl-6 pr-16 py-4 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all shadow-sm"
                />
                <button
                    onClick={handleSend}
                    disabled={!input.trim() || isLoading}
                    className={`absolute right-2 top-2 p-2 rounded-xl transition-all ${input.trim() && !isLoading
                            ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                        <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
