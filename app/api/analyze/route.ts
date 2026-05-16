import { NextResponse } from 'next/server'
import { extractFormData } from '@/lib/extractFormData'
import type { FormService } from '@/lib/formSchemas'

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { transcript, service } = body as {
      transcript?: string
      service?: FormService
    }

    if (!transcript) {
      return NextResponse.json(
        { error: 'No transcript provided' },
        { status: 400 },
      )
    }

    if (!service || !['passport', 'gn', 'business'].includes(service)) {
      return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
    }

    const extractedData = await extractFormData(transcript, service)
    return NextResponse.json(extractedData)
  } catch (error) {
    console.error('Extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to analyze transcript' },
      { status: 500 },
    )
  }
}
