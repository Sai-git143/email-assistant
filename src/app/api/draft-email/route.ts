import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { purpose, subject, recipientName, senderName } = await request.json();

        if (!purpose || !subject) {
            return NextResponse.json({ error: 'Missing purpose or subject' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Write a professional email body for the following:

Subject: ${subject}
Purpose/Content: ${purpose}
Recipient Name: ${recipientName || 'Not specified'}
Sender Name: ${senderName || 'Not specified'}

Instructions:
1. Do NOT include the "Subject:" line in the output. Only write the email body.
2. Use the Recipient Name in the salutation if provided (e.g., "Dear [Name],").
3. Use the Sender Name in the sign-off if provided (e.g., "Best regards, [Name]").
4. Make it clear, polite, and professional. Keep it concise.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const draftBody = response.text().trim();

        return NextResponse.json({ body: draftBody });
    } catch (error) {
        console.error('Error generating draft:', error);
        return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
    }
}