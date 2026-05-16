// app/api/analyze/route.ts

import { NextResponse } from 'next/server';
import { openai } from '@/lib/openai';

import {
  passportSchema,
  gnSchema,
  businessSchema
} from '@/lib/formSchemas';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { transcript, service } = body;

    if (!transcript) {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    // Default schema = Passport
    let schemaToUse: any = passportSchema;

    // Dynamically switch schemas
    if (service === 'gn') {
      schemaToUse = gnSchema;
    } else if (service === 'business') {
      schemaToUse = businessSchema;
    }

    const systemPrompt = `
You are an expert data extraction assistant.

A user is speaking in English, Sinhala, or Tamil to a Sri Lankan government AI assistant.

Read their transcribed speech carefully and extract only the information relevant to the selected form.

Rules:
- Only extract information explicitly mentioned by the user.
- If a field is missing, return an empty string "".
- Never guess or invent information.
- Translate Sinhala or Tamil responses into English.
- Return ONLY valid JSON matching the schema.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",

      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: `Here is the ongoing conversation transcript: "${transcript}"`
        }
      ],

      response_format: {
        type: "json_schema",
        json_schema: schemaToUse
      },

      temperature: 0.1,
    });

    const extractedData = JSON.parse(
      completion.choices[0].message.content || '{}'
    );

    return NextResponse.json(extractedData);

  } catch (error) {

    console.error("Extraction error:", error);

    return NextResponse.json(
      { error: "Failed to analyze transcript" },
      { status: 500 }
    );
  }
}