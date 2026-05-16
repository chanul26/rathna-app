// app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';
import { passportSchema } from '@/lib/formSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { transcript, service } = body;

    if (!transcript) {
      return NextResponse.json({ error: "No transcript provided" }, { status: 400 });
    }

    // Right now we only handle passport, but this setup allows easy expansion for GN and Business
    let schemaToUse = passportSchema;
    let systemPrompt = `You are an expert data extraction assistant. 
    A user is speaking in English, Sinhala, or Tamil to a government assistant. 
    Read their transcribed speech and extract the relevant information to fill out the form.
    Only extract information that is explicitly stated. If a piece of information is missing, return an empty string "" for that field. 
    Do not guess or make up data. Translate Sinhala or Tamil answers into English for the form values.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Using mini for blazing fast hackathon speeds
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Here is the ongoing conversation transcript: "${transcript}"` }
      ],
      response_format: {
        type: "json_schema",
        json_schema: schemaToUse
      },
      temperature: 0.1, // Low temperature for factual extraction
    });

    const extractedData = JSON.parse(completion.choices[0].message.content || '{}');
    
    return NextResponse.json(extractedData);

  } catch (error) {
    console.error("Extraction error:", error);
    return NextResponse.json({ error: "Failed to analyze transcript" }, { status: 500 });
  }
}