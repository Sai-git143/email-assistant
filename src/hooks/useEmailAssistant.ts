import { useState, useCallback } from 'react';

export type Message = {
    role: 'assistant' | 'user';
    content: string;
};

export type EmailData = {
    gmailUser?: string;
    gmailAppPassword?: string;
    to?: string;
    subject?: string;
    body?: string;
};

export type Draft = {
    subject: string;
    body: string;
};

type Step = 'parse' | 'draft' | 'revise' | 'send';

export function useEmailAssistant() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [gmailUser, setGmailUser] = useState('');
    const [gmailAppPassword, setGmailAppPassword] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: "Hi! Tell me what email you want to send. For example: 'Send an email to john@example.com saying I'm busy and can't come.'" }
    ]);
    const [emailData, setEmailData] = useState<EmailData>({});
    const [currentStep, setCurrentStep] = useState<Step>('parse');
    const [draft, setDraft] = useState<Draft | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const login = useCallback((user: string, pass: string) => {
        if (user && pass) {
            setGmailUser(user);
            setGmailAppPassword(pass);
            setLoggedIn(true);
        }
    }, []);

    const addMessage = useCallback((role: 'assistant' | 'user', content: string) => {
        setMessages(prev => [...prev, { role, content }]);
    }, []);

    const processMessage = useCallback(async (input: string) => {
        if (!input.trim()) return;

        addMessage('user', input);
        setIsLoading(true);

        let nextStep = currentStep;
        let assistantResponse = '';

        try {
            if (currentStep === 'parse') {
                const response = await fetch('/api/parse-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: input }),
                });
                const data = await response.json();

                if (response.ok) {
                    setEmailData({
                        to: data.to,
                        subject: data.subject,
                        body: data.body,
                    });
                    nextStep = 'draft';

                    // Generate draft
                    const draftResponse = await fetch('/api/draft-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            purpose: data.body,
                            subject: data.subject,
                        }),
                    });
                    const draftData = await draftResponse.json();

                    const draftBody = draftResponse.ok ? draftData.body : data.body;
                    setDraft({ subject: data.subject, body: draftBody });

                    assistantResponse = `I've created a draft for you:\n\nTo: ${data.to}\nSubject: ${data.subject}\n\n${draftBody}\n\nDo you want to 'approve' and send, or 'revise' it?`;
                } else {
                    assistantResponse = "I couldn't understand your request. Please try again.";
                }
            } else if (currentStep === 'draft') {
                if (input.toLowerCase().includes('approve') || input.toLowerCase().includes('send')) {
                    nextStep = 'send';
                    assistantResponse = "Are you sure you want to send this email?";
                } else if (input.toLowerCase().includes('revise')) {
                    nextStep = 'revise';
                    assistantResponse = "What changes would you like to make?";
                } else {
                    assistantResponse = "Please say 'approve' to send or 'revise' to make changes.";
                }
            } else if (currentStep === 'revise') {
                const response = await fetch('/api/draft-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        purpose: input,
                        subject: draft?.subject || '',
                    }),
                });
                const data = await response.json();
                const newBody = response.ok ? data.body : input;

                setDraft(prev => prev ? { ...prev, body: newBody } : null);
                assistantResponse = `Updated draft:\n\nSubject: ${draft?.subject}\n\n${newBody}\n\nDo you want to 'approve' and send, or 'revise' it?`;
                nextStep = 'draft';
            } else if (currentStep === 'send') {
                if (input.toLowerCase().includes('yes') || input.toLowerCase().includes('sure')) {
                    const response = await fetch('/api/send-email', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            gmailUser,
                            gmailAppPassword,
                            to: emailData.to,
                            subject: draft?.subject,
                            body: draft?.body,
                        }),
                    });

                    if (response.ok) {
                        assistantResponse = "Email sent successfully! What would you like to do next?";
                        nextStep = 'parse';
                        setDraft(null);
                        setEmailData({});
                    } else {
                        assistantResponse = "Failed to send email. Please try again.";
                    }
                } else {
                    nextStep = 'draft';
                    assistantResponse = "Okay, back to the draft. Approve or revise?";
                }
            }
        } catch (error) {
            assistantResponse = "An error occurred. Please try again.";
        }

        setCurrentStep(nextStep);
        addMessage('assistant', assistantResponse);
        setIsLoading(false);
    }, [currentStep, draft, emailData, gmailUser, gmailAppPassword, addMessage]);

    const resetConversation = useCallback(() => {
        setMessages([
            { role: 'assistant', content: "Hi! Tell me what email you want to send. For example: 'Send an email to john@example.com saying I'm busy and can't come.'" }
        ]);
        setEmailData({});
        setCurrentStep('parse');
        setDraft(null);
        setIsLoading(false);
    }, []);

    return {
        loggedIn,
        messages,
        isLoading,
        login,
        processMessage,
        resetConversation,
    };
}
