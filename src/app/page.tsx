'use client';

import { useEmailAssistant } from '@/hooks/useEmailAssistant';
import LoginScreen from '@/components/LoginScreen';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const { loggedIn, messages, isLoading, login, processMessage, resetConversation } = useEmailAssistant();

  if (!loggedIn) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <ChatInterface
      messages={messages}
      isLoading={isLoading}
      onSend={processMessage}
      onReset={resetConversation}
    />
  );
}
