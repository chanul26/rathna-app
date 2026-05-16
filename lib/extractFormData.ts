import { openai } from '@/lib/openai'
import {
  getSchemaForService,
  type FormService,
} from '@/lib/formSchemas'

const systemPrompt = `You are an expert data extraction assistant.
A user is speaking in English, Sinhala, or Tamil to a government assistant named Rathna.
You receive ONE applicant's conversation transcript only.
Extract only information for this applicant from lines starting with "user:".
If the agent confirms a detail and the user agreed, you may use that confirmed value.
If a field was not mentioned for this applicant, return an empty string "" for that field.
You are given the FULL conversation so far — include every detail the user has already stated in this chat, not only their latest line.
Do not reuse data from other people or prior conversations. Do not guess.
Translate Sinhala or Tamil into English for form values.
For names: put family name in surname (passport) or full name in fullName (GN) / ownerName (business) as appropriate.`

export async function extractFormData(
  transcript: string,
  service: FormService,
): Promise<Record<string, string>> {
  if (!transcript.trim()) return {}

  const schema = getSchemaForService(service)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: systemPrompt },
      {
        role: 'user',
        content: `Service: ${service}\n\nConversation transcript:\n${transcript}`,
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: schema,
    },
    temperature: 0.1,
  })

  const raw = completion.choices[0].message.content || '{}'
  return JSON.parse(raw) as Record<string, string>
}
