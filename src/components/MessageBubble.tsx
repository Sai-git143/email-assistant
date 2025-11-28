import { Message } from '../hooks/useEmailAssistant';

interface MessageBubbleProps {
    message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4 animate-fade-in-up`}>
            <div
                className={`max-w-[80%] lg:max-w-[70%] px-6 py-4 rounded-2xl shadow-sm ${isUser
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                    }`}
            >
                <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                </div>
            </div>
        </div>
    );
}
