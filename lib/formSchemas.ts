// lib/formSchemas.ts

export type FormService = 'passport' | 'gn' | 'business'

export const passportSchema = {
    name: "passport_extraction",
    description: "Extracts personal information for a Sri Lankan passport application",
    strict: true,
    schema: {
      type: "object",
      properties: {
        surname: { type: "string", description: "The person's surname or last name. Leave empty string if not mentioned." },
        otherNames: { type: "string", description: "The person's given names or first names. Leave empty string if not mentioned." },
        nationalId: { type: "string", description: "Sri Lankan National Identity Card (NIC) number. Usually 9 digits with a V/X, or 12 digits." },
        dateOfBirth: { type: "string", description: "Date of birth, formatted as YYYY-MM-DD if possible." },
        placeOfBirth: { type: "string", description: "City or town of birth." },
        gender: { type: "string", description: "Male or Female." },
        address: { type: "string", description: "Full permanent address." },
        district: { type: "string", description: "District of residence in Sri Lanka." },
        phone: { type: "string", description: "Phone or mobile number." },
        serviceType: { type: "string", description: "Either 'Normal' or 'One Day'." }
      },
      required: ["surname", "otherNames", "nationalId", "dateOfBirth", "placeOfBirth", "gender", "address", "district", "phone", "serviceType"],
      additionalProperties: false
    }
  }

export const gnSchema = {
  name: 'gn_extraction',
  description: 'Extracts information for a Grama Niladhari certificate request',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        description:
          'Full legal name of the applicant. Leave empty string if not mentioned.',
      },
      nationalId: {
        type: 'string',
        description:
          'Sri Lankan NIC number (9 digits with V/X or 12 digits). Leave empty string if not mentioned.',
      },
      address: {
        type: 'string',
        description:
          'Residential address. Leave empty string if not mentioned.',
      },
      reason: {
        type: 'string',
        description:
          'Reason for requesting the certificate (e.g. bank loan, visa). Leave empty string if not mentioned.',
      },
      district: {
        type: 'string',
        description:
          'District of residence in Sri Lanka. Leave empty string if not mentioned.',
      },
    },
    required: ['fullName', 'nationalId', 'address', 'reason', 'district'],
    additionalProperties: false,
  },
}

export const businessSchema = {
  name: 'business_extraction',
  description: 'Extracts information for a business registration application',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      businessName: {
        type: 'string',
        description:
          'Registered or trading business name. Leave empty string if not mentioned.',
      },
      ownerName: {
        type: 'string',
        description:
          'Owner full legal name. Leave empty string if not mentioned.',
      },
      nationalId: {
        type: 'string',
        description:
          'Owner NIC number. Leave empty string if not mentioned.',
      },
      businessAddress: {
        type: 'string',
        description:
          'Business premises address. Leave empty string if not mentioned.',
      },
      businessType: {
        type: 'string',
        description:
          'Type of business (e.g. retail shop, restaurant). Leave empty string if not mentioned.',
      },
      district: {
        type: 'string',
        description:
          'District where the business operates. Leave empty string if not mentioned.',
      },
    },
    required: [
      'businessName',
      'ownerName',
      'nationalId',
      'businessAddress',
      'businessType',
      'district',
    ],
    additionalProperties: false,
  },
}

const schemaByService = {
  passport: passportSchema,
  gn: gnSchema,
  business: businessSchema,
} as const

export function getSchemaForService(service: FormService) {
  return schemaByService[service]
}