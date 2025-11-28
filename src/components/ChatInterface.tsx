import { useEffect, useRef } from 'react';
import { Message } from '../hooks/useEmailAssistant';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import InputArea from './InputArea';

interface ChatInterfaceProps {
    messages: Message[];
    isLoading: boolean;
    onSend: (message: string) => void;
    onReset: () => void;
}

export default function ChatInterface({ messages, isLoading, onSend, onReset }: ChatInterfaceProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    return (
        <div className="flex flex-col h-screen bg-gray-50">
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 sticky top-0 z-10">
                <div className="max-w-3xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-lg">
                            EA
                        </div>
                        <div>
                            <h1 className="font-bold text-gray-800">Email Assistant</h1>
                            <p className="text-xs text-green-500 font-medium flex items-center">
                                <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                                Online
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onReset}
                        className="text-sm text-gray-500 hover:text-indigo-600 font-medium px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors"
                    >
                        Start New Email
                    </button>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth">
                <div className="max-w-3xl mx-auto space-y-6 pb-4">
                    {messages.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                    ))}
                    {isLoading && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                </div>
            </div>

            <InputArea onSend={onSend} isLoading={isLoading} />
        </div>
    );
}
