import { NextResponse } from 'next/server'
import { getAgentId } from '@/lib/beyApi'

export async function GET() {
  const agentId = getAgentId()
  if (!agentId) {
    return NextResponse.json(
      { error: 'BEYOND_PRESENCE_AGENT_ID is not configured' },
      { status: 500 },
    )
  }

  return NextResponse.json({
    agentId,
    embedUrl: `https://bey.chat/${agentId}`,
  })
}
