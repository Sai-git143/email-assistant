import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { purpose, subject } = await request.json();

        if (!purpose || !subject) {
            return NextResponse.json({ error: 'Missing purpose or subject' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Write a professional email body for the following:

Subject: ${subject}
Purpose/Content: ${purpose}

Make it clear, polite, and professional. Keep it concise. End with a professional closing.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const draftBody = response.text().trim();

        return NextResponse.json({ body: draftBody });
    } catch (error) {
        console.error('Error generating draft:', error);
        return NextResponse.json({ error: 'Failed to generate draft' }, { status: 500 });
    }
}