import { NextResponse } from 'next/server'
import { getAgentId } from '@/lib/beyApi'
import { createRathnaSessionAgent } from '@/lib/createRathnaSessionAgent'
import { isFormService, type FormService } from '@/lib/formSchemas'
import type { RathnaLanguage } from '@/lib/rathnaAgentPrompt'

export const dynamic = 'force-dynamic'

function parseLanguage(value: string | null): RathnaLanguage {
  if (value === 'si' || value === 'ta') return value
  return 'en'
}

export async function GET(req: Request) {
  const baseAgentId = getAgentId()
  if (!baseAgentId) {
    return NextResponse.json(
      { error: 'BEYOND_PRESENCE_AGENT_ID is not configured' },
      { status: 500 },
    )
  }

  const { searchParams } = new URL(req.url)
  const serviceParam = searchParams.get('service')
  const service: FormService | null = isFormService(serviceParam)
    ? serviceParam
    : null
  const language = parseLanguage(searchParams.get('language'))

  if (!service) {
    return NextResponse.json({
      agentId: baseAgentId,
      embedUrl: `https://bey.chat/${baseAgentId}`,
      useBaseAgent: true,
    })
  }

  const session = await createRathnaSessionAgent(service, language)
  if (!session) {
    return NextResponse.json(
      {
        error:
          'Could not create a service-specific GovMind agent. Check BEYOND_PRESENCE_API_KEY and base agent settings.',
        agentId: baseAgentId,
        embedUrl: `https://bey.chat/${baseAgentId}`,
        useBaseAgent: true,
      },
      { status: 502 },
    )
  }

  return NextResponse.json({
    agentId: session.agentId,
    embedUrl: session.embedUrl,
    service,
    useBaseAgent: false,
  })
}
