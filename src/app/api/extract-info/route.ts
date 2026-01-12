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

        const prompt = `Extract the recipient's name and the sender's name from the following text. 
        
        Text: "${message}"
        
        Return a JSON object with:
        - recipientName: The name of the person receiving the email (or null if not found)
        - senderName: The name of the person sending the email (or null if not found)
        
        Respond ONLY with valid JSON.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Clean up markdown code blocks if present
        const jsonStr = text.replace(/^```json\s*/, '').replace(/\s*```$/, '');

        try {
            const parsed = JSON.parse(jsonStr);
            return NextResponse.json(parsed);
        } catch (parseError) {
            console.error('JSON Parse error:', parseError, 'Text:', text);
            // Fallback: very basic regex or just return nulls
            return NextResponse.json({ recipientName: null, senderName: null });
        }
    } catch (error) {
        console.error('Error extracting info:', error);
        return NextResponse.json({ error: 'Failed to extract info' }, { status: 500 });
    }
}
