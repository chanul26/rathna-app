const BEY_API_BASE = 'https://api.bey.dev/v1'

export interface BeyMessage {
  message: string
  sent_at: string
  sender: 'ai' | 'user'
}

export interface BeyCall {
  id: string
  agent_id: string
  status?: {
    type: string
    started_at: string
    ended_at?: string | null
  }
}

function getApiKey(): string | null {
  return process.env.BEYOND_PRESENCE_API_KEY ?? null
}

export function getAgentId(): string | null {
  return process.env.BEYOND_PRESENCE_AGENT_ID ?? null
}

export async function listCalls(limit = 15): Promise<BeyCall[]> {
  const apiKey = getApiKey()
  if (!apiKey) return []

  const res = await fetch(`${BEY_API_BASE}/calls?limit=${limit}`, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('Bey list calls failed:', res.status, await res.text())
    return []
  }

  const json = await res.json()
  return json.data ?? []
}

export async function listCallMessages(callId: string): Promise<BeyMessage[]> {
  const apiKey = getApiKey()
  if (!apiKey) return []

  const res = await fetch(`${BEY_API_BASE}/calls/${callId}/messages`, {
    headers: { 'x-api-key': apiKey },
    cache: 'no-store',
  })

  if (!res.ok) {
    console.error('Bey list messages failed:', res.status, await res.text())
    return []
  }

  const json = await res.json()
  if (Array.isArray(json)) return json as BeyMessage[]
  if (Array.isArray(json.value)) return json.value as BeyMessage[]
  if (Array.isArray(json.data)) return json.data as BeyMessage[]
  return []
}

export function isLiveCall(call: BeyCall): boolean {
  if (call.status?.type === 'completed') return false
  if (call.status?.ended_at) return false
  return true
}

/** Only calls that started during this browser session (not a previous visitor). */
export function isCallInSession(
  call: BeyCall,
  sessionStartedAt: string,
): boolean {
  const started = call.status?.started_at
  if (!started) return false
  const sessionMs = new Date(sessionStartedAt).getTime() - 15_000
  return new Date(started).getTime() >= sessionMs
}

export function filterSessionCalls(
  calls: BeyCall[],
  agentId: string,
  sessionStartedAt: string,
): BeyCall[] {
  return calls.filter(
    (c) => c.agent_id === agentId && isCallInSession(c, sessionStartedAt),
  )
}

export function findActiveCall(
  calls: BeyCall[],
  completedCallIds: Set<string>,
): BeyCall | null {
  return (
    calls.find((c) => isLiveCall(c) && !completedCallIds.has(c.id)) ?? null
  )
}

export function isCallEnded(call: BeyCall): boolean {
  return call.status?.type === 'completed' || Boolean(call.status?.ended_at)
}

export function messagesToTranscript(messages: BeyMessage[]): string {
  const lines: string[] = []
  let lastLine = ''

  for (const msg of messages) {
    const text = msg.message?.trim()
    if (!text) continue

    const role = msg.sender === 'user' ? 'user' : 'agent'
    const line = `${role}: ${text}`
    if (line === lastLine) continue

    lastLine = line
    lines.push(line)
  }

  return lines.join('\n')
}
