import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Missing message' }, { status: 400 });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const prompt = `Parse the following natural language message to extract email details and generate a professional, polite email body. Return a JSON object with keys: to (recipient email), subject (email subject), body (professional email content that is clear, concise, and well-written).

Message: "${message}"

Respond only with valid JSON, no extra text.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Try to parse the JSON
        try {
            const parsed = JSON.parse(text);
            return NextResponse.json(parsed);
        } catch (parseError) {
            // Fallback parsing
            const toMatch = text.match(/to["\s:]+([^\s,"]+)/i);
            const subjectMatch = text.match(/subject["\s:]+([^,\n}]+)/i);
            const bodyMatch = text.match(/body["\s:]+([^}]+)/i);

            const fallback = {
                to: toMatch ? toMatch[1].replace(/["']/g, '') : '',
                subject: subjectMatch ? subjectMatch[1].replace(/["']/g, '') : '',
                body: bodyMatch ? bodyMatch[1].replace(/["']/g, '') : message,
            };

            return NextResponse.json(fallback);
        }
    } catch (error) {
        console.error('Error parsing message:', error);
        return NextResponse.json({ error: 'Failed to parse message' }, { status: 500 });
    }
}