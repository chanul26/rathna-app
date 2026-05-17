import { openai } from '@/lib/openai'
import {
  getSchemaForService,
  type FormService,
} from '@/lib/formSchemas'

const systemPrompt = `You are an expert data extraction assistant.
A user is speaking in English, Sinhala, or Tamil to a government assistant named Rathna.
You receive ONE applicant's conversation transcript only.
Extract from "user:" lines first. If the agent (Rathna) repeats or confirms a value and the user agreed, use that confirmed value from "agent:" lines too.
The Service field tells you which form is active — extract ONLY the fields listed for that service. Ignore fields that belong to other services.
If a field was not mentioned for this applicant, return an empty string "" for that field.
You are given the FULL conversation so far — include every detail the user has already stated in this chat, not only their latest line.
Do not reuse data from other people or prior conversations. Do not guess.
Translate Sinhala or Tamil into English for form values.
For names: put family name in surname (passport), full name in fullName (GN, birth, driving, police, nicRenewal), or ownerName (business) as appropriate.`

const serviceHints: Record<FormService, string> = {
  passport:
    'Fields: surname, otherNames, nationalId, dateOfBirth, placeOfBirth, gender, address, district, phone, serviceType (Normal or One Day).',
  gn: 'Fields: fullName, nationalId, address, reason (why they need the GN certificate), district.',
  business:
    'Fields: businessName, ownerName, nationalId (owner), businessAddress, businessType, district.',
  birth:
    'Fields: fullName, dateOfBirth, placeOfBirth, motherName, fatherName, nationalId, district.',
  driving:
    'Fields: fullName, nationalId, address, bloodGroup, vehicleCategory, phone, licenseType.',
  police:
    'Fields: fullName, nationalId, passportNumber, address, countryApplyingFor, reason, phone.',
  nicRenewal:
    'Fields: fullName, nationalId, dateOfBirth, address, phone, reasonForRenewal, district.',
}

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
        content: `Service: ${service}\n${serviceHints[service]}\n\nConversation transcript:\n${transcript}`,
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
