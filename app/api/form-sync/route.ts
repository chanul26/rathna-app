import { NextResponse } from 'next/server'
import { syncFormFromBey } from '@/lib/syncFromBey'
import { isFormService } from '@/lib/formSchemas'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const serviceParam = searchParams.get('service')
  if (!isFormService(serviceParam)) {
    return NextResponse.json({ error: 'Invalid service' }, { status: 400 })
  }

  const agentId = searchParams.get('agentId') || null
  const activeCallId = searchParams.get('activeCallId') || null
  const completedRaw = searchParams.get('completed') || ''
  const completedCallIds = completedRaw
    ? completedRaw.split(',').map((id) => id.trim()).filter(Boolean)
    : []
  const lastMessageCount = Number(searchParams.get('lastMessageCount') || '0')
  const sessionStartedAt = searchParams.get('sessionStartedAt')
  if (!sessionStartedAt) {
    return NextResponse.json(
      { error: 'Missing sessionStartedAt' },
      { status: 400 },
    )
  }

  try {
    const result = await syncFormFromBey({
      service: serviceParam,
      agentId,
      activeCallId,
      completedCallIds,
      lastMessageCount,
      sessionStartedAt,
    })
    return NextResponse.json(result)
  } catch (error) {
    console.error('form-sync error:', error)
    return NextResponse.json(
      { error: 'Failed to sync from avatar' },
      { status: 500 },
    )
  }
}
