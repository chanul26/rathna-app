// lib/formSchemas.ts

export type FormService =
  | 'passport'
  | 'gn'
  | 'business'
  | 'birth'
  | 'driving'
  | 'police'
  | 'nicRenewal'

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

export const birthSchema = {
  name: 'birth_extraction',
  description: 'Extracts information for a birth certificate request',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      fullName: {
        type: 'string',
        description: 'Full legal name. Leave empty string if not mentioned.',
      },
      dateOfBirth: {
        type: 'string',
        description: 'Date of birth (YYYY-MM-DD if possible).',
      },
      placeOfBirth: {
        type: 'string',
        description: 'Place of birth.',
      },
      motherName: {
        type: 'string',
        description: "Mother's full name.",
      },
      fatherName: {
        type: 'string',
        description: "Father's full name.",
      },
      nationalId: {
        type: 'string',
        description: 'NIC number.',
      },
      district: {
        type: 'string',
        description: 'District.',
      },
    },
    required: [
      'fullName',
      'dateOfBirth',
      'placeOfBirth',
      'motherName',
      'fatherName',
      'nationalId',
      'district',
    ],
    additionalProperties: false,
  },
}

export const drivingSchema = {
  name: 'driving_extraction',
  description: 'Extracts information for a driving license application',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      fullName: { type: 'string', description: 'Full legal name.' },
      nationalId: { type: 'string', description: 'NIC number.' },
      address: { type: 'string', description: 'Residential address.' },
      bloodGroup: { type: 'string', description: 'Blood group (e.g. A+).' },
      vehicleCategory: {
        type: 'string',
        description: 'Vehicle category (e.g. Light Vehicle).',
      },
      phone: { type: 'string', description: 'Phone number.' },
      licenseType: {
        type: 'string',
        description: 'License type (e.g. New License, Renewal).',
      },
    },
    required: [
      'fullName',
      'nationalId',
      'address',
      'bloodGroup',
      'vehicleCategory',
      'phone',
      'licenseType',
    ],
    additionalProperties: false,
  },
}

export const policeSchema = {
  name: 'police_extraction',
  description: 'Extracts information for a police clearance certificate',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      fullName: { type: 'string', description: 'Full legal name.' },
      nationalId: { type: 'string', description: 'NIC number.' },
      passportNumber: { type: 'string', description: 'Passport number.' },
      address: { type: 'string', description: 'Residential address.' },
      countryApplyingFor: {
        type: 'string',
        description: 'Country applying for clearance.',
      },
      reason: { type: 'string', description: 'Reason for clearance.' },
      phone: { type: 'string', description: 'Phone number.' },
    },
    required: [
      'fullName',
      'nationalId',
      'passportNumber',
      'address',
      'countryApplyingFor',
      'reason',
      'phone',
    ],
    additionalProperties: false,
  },
}

export const nicRenewalSchema = {
  name: 'nic_renewal_extraction',
  description: 'Extracts information for NIC renewal',
  strict: true,
  schema: {
    type: 'object',
    properties: {
      fullName: { type: 'string', description: 'Full legal name.' },
      nationalId: { type: 'string', description: 'NIC number.' },
      dateOfBirth: { type: 'string', description: 'Date of birth.' },
      address: { type: 'string', description: 'Residential address.' },
      phone: { type: 'string', description: 'Phone number.' },
      reasonForRenewal: {
        type: 'string',
        description: 'Reason for renewal (e.g. Lost NIC).',
      },
      district: { type: 'string', description: 'District.' },
    },
    required: [
      'fullName',
      'nationalId',
      'dateOfBirth',
      'address',
      'phone',
      'reasonForRenewal',
      'district',
    ],
    additionalProperties: false,
  },
}

const schemaByService = {
  passport: passportSchema,
  gn: gnSchema,
  business: businessSchema,
  birth: birthSchema,
  driving: drivingSchema,
  police: policeSchema,
  nicRenewal: nicRenewalSchema,
} as const

export function getSchemaForService(service: FormService) {
  return schemaByService[service]
}