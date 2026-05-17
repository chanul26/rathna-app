import { NextResponse } from 'next/server'
import { extractFormData } from '@/lib/extractFormData'
import { isFormService, type FormService } from '@/lib/formSchemas'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { transcript, service: serviceRaw } = body as {
      transcript?: string
      service?: string
    }

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 },
      )
    }

    if (!isFormService(serviceRaw ?? null)) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const extractedData = await extractFormData(
      transcript,
      serviceRaw as FormService,
    )
    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 },
    )
  }
}
