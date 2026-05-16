// lib/formSchemas.ts

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
    name: "gn_extraction",
    description: "Extracts information for a Grama Niladhari certificate",
    strict: true,
    schema: {
      type: "object",
      properties: {
        fullName: {
          type: "string",
          description: "The user's full name."
        },
        nationalId: {
          type: "string",
          description: "NIC number."
        },
        address: {
          type: "string",
          description: "Permanent address."
        },
        reason: {
          type: "string",
          description: "Reason for requesting the certificate."
        },
        district: {
          type: "string",
          description: "District in Sri Lanka."
        }
      },
      required: [
        "fullName",
        "nationalId",
        "address",
        "reason",
        "district"
      ],
      additionalProperties: false
    }
  };
  
  export const businessSchema = {
    name: "business_extraction",
    description: "Extracts information for business registration",
    strict: true,
    schema: {
      type: "object",
      properties: {
        businessName: {
          type: "string",
          description: "Name of the business."
        },
        ownerName: {
          type: "string",
          description: "Full name of the owner."
        },
        nationalId: {
          type: "string",
          description: "NIC number."
        },
        businessAddress: {
          type: "string",
          description: "Business address."
        },
        businessType: {
          type: "string",
          description: "Type of business."
        },
        district: {
          type: "string",
          description: "District where business operates."
        }
      },
      required: [
        "businessName",
        "ownerName",
        "nationalId",
        "businessAddress",
        "businessType",
        "district"
      ],
      additionalProperties: false
    }
  };