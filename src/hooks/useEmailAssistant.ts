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
    recipientName?: string;
    senderName?: string;
};

export type Draft = {
    subject: string;
    body: string;
};

type Step = 'parse' | 'collect-info' | 'draft' | 'revise' | 'send';

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
                    const newEmailData = {
                        to: data.to,
                        subject: data.subject,
                        body: data.body,
                        recipientName: data.recipientName,
                        senderName: data.senderName,
                    };
                    setEmailData(newEmailData);

                    if (!newEmailData.recipientName || !newEmailData.senderName) {
                        nextStep = 'collect-info';
                        assistantResponse = "Could you please provide the recipient's name and your name? (e.g., 'Recipient is John, I am Sai' or just 'Skip')";
                    } else {
                        nextStep = 'draft';
                        // Generate draft immediately if names are present
                        const draftResponse = await fetch('/api/draft-email', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                purpose: data.body,
                                subject: data.subject,
                                recipientName: data.recipientName,
                                senderName: data.senderName,
                            }),
                        });
                        const draftData = await draftResponse.json();
                        const draftBody = draftResponse.ok ? draftData.body : data.body;
                        setDraft({ subject: data.subject, body: draftBody });
                        assistantResponse = `I've created a draft for you:\n\nTo: ${data.to}\nSubject: ${data.subject}\n\n${draftBody}\n\nDo you want to 'approve' and send, or 'revise' it?`;
                    }
                } else {
                    assistantResponse = "I couldn't understand your request. Please try again.";
                }
            } else if (currentStep === 'collect-info') {
                if (input.toLowerCase() === 'skip') {
                    // Proceed without names
                } else {
                    // Simple extraction (can be improved with AI)
                    // For now, assume user provides names or we just pass the input as context to the drafter? 
                    // Let's try to parse simply or just ask AI to extract again? 
                    // Actually, let's just use the input as "additional context" for now, or assume the user provided names.
                    // To be robust, let's just call parse again on this input specifically for names? 
                    // Or simpler: just proceed to draft and pass this input as "names context".
                    // Let's try to extract names using a regex or simple logic is hard.
                    // Let's just assume the user input IS the names info and pass it to draft-email as context?
                    // No, draft-email expects specific fields. 
                    // Let's do a quick "parse names" call or just regex.
                    // Regex is risky. Let's use the `parse-email` endpoint again but with a specific prompt? No, that endpoint is for full emails.
                    // Let's just store the input as `recipientName` and `senderName` loosely? No.

                    // Better approach: Just proceed to draft, but pass the *previous* body + this new input as the "purpose" to the drafter, 
                    // AND tell the drafter to extract names? 
                    // Actually, let's just ask the user to format it "Recipient: X, Sender: Y"? No, bad UX.

                    // Let's use a simple heuristic:
                    // If input contains "Recipient is X" or "To X", extract X.
                    // If input contains "I am Y" or "From Y", extract Y.

                    const rName = input.match(/(?:recipient|to)\s+(?:is\s+)?([a-z]+)/i)?.[1];
                    const sName = input.match(/(?:sender|from|i am)\s+(?:is\s+)?([a-z]+)/i)?.[1];

                    setEmailData(prev => ({
                        ...prev,
                        recipientName: rName || prev.recipientName,
                        senderName: sName || prev.senderName
                    }));
                }

                nextStep = 'draft';
                const draftResponse = await fetch('/api/draft-email', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        purpose: emailData.body, // Original purpose
                        subject: emailData.subject,
                        recipientName: input.match(/(?:recipient|to)\s+(?:is\s+)?([a-z]+)/i)?.[1] || emailData.recipientName, // Use extracted or existing
                        senderName: input.match(/(?:sender|from|i am)\s+(?:is\s+)?([a-z]+)/i)?.[1] || emailData.senderName,
                        additionalContext: input // Pass full input just in case (need to update API for this? No, just rely on names for now)
                    }),
                });
                const draftData = await draftResponse.json();
                const draftBody = draftResponse.ok ? draftData.body : emailData.body || '';
                setDraft({ subject: emailData.subject || '', body: draftBody });
                assistantResponse = `I've created a draft for you:\n\nTo: ${emailData.to}\nSubject: ${emailData.subject}\n\n${draftBody}\n\nDo you want to 'approve' and send, or 'revise' it?`;

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
                        recipientName: emailData.recipientName,
                        senderName: emailData.senderName
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
