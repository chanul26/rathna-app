import { openai } from '@/lib/openai'
import {
  getSchemaForService,
  type FormService,
} from '@/lib/formSchemas'

const systemPrompt = `You are an expert data extraction assistant for GovMind, a Sri Lankan government forms app.
A user is speaking in English, Sinhala, or Tamil to the GovMind avatar assistant.
You receive ONE applicant's conversation transcript only.

RULES:
- Extract from "user:" lines first. If GovMind confirmed a value in an "agent:" line and the user agreed, you may use that confirmed value.
- The Service field defines which form is active — extract ONLY those fields. Ignore fields from other services.
- If a field was not mentioned, return an empty string "" for that field.
- Use the FULL conversation so far, not only the latest line.
- Do not reuse data from other people or prior conversations. Do not guess or invent values.
- Translate Sinhala or Tamil into English for form values unless the field is a proper name that should stay as given.
- Dates: prefer YYYY-MM-DD when possible.
- NIC: keep as spoken (9 digits with V/X or 12 digits).
- Gender: Male or Female only. Service type: Normal or One Day only.
- Names: surname/otherNames for passport; fullName for GN, birth, driving, police, nicRenewal; ownerName for business.`

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
