'use client';

import { useEmailAssistant } from '@/hooks/useEmailAssistant';
import LandingPage from '@/components/LandingPage';
import ChatInterface from '@/components/ChatInterface';

export default function Home() {
  const { loggedIn, messages, isLoading, login, processMessage, resetConversation } = useEmailAssistant();

  if (!loggedIn) {
    return <LandingPage onLogin={login} />;
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
