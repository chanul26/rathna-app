import {
  filterSessionCalls,
  findActiveCall,
  getAgentId,
  isLiveCall,
  listCallMessages,
  listCalls,
  messagesToTranscript,
} from '@/lib/beyApi'
import { extractFormData } from '@/lib/extractFormData'
import type { FormService } from '@/lib/formSchemas'

export interface BeySyncInput {
  service: FormService
  agentId: string | null
  activeCallId: string | null
  completedCallIds: string[]
  lastMessageCount: number
  sessionStartedAt: string
}

export interface BeySyncResult {
  formData: Record<string, string>
  activeCallId: string | null
  messageCount: number
  awaitingCall: boolean
  callEnded: boolean
}

export async function syncFormFromBey(
  input: BeySyncInput,
): Promise<BeySyncResult> {
  const emptyResult = (
    overrides: Partial<BeySyncResult> = {},
  ): BeySyncResult => ({
    formData: {},
    activeCallId: null,
    messageCount: 0,
    awaitingCall: true,
    callEnded: false,
    ...overrides,
  })

  const agentId = input.agentId ?? getAgentId()
  if (!agentId || !process.env.BEYOND_PRESENCE_API_KEY) {
    return emptyResult()
  }

  const completed = new Set(input.completedCallIds)
  const allCalls = await listCalls()
  const sessionCalls = filterSessionCalls(
    allCalls,
    agentId,
    input.sessionStartedAt,
  )

  const pinned =
    input.activeCallId &&
    sessionCalls.find(
      (c) => c.id === input.activeCallId && !completed.has(c.id),
    )

  const call =
    pinned ??
    findActiveCall(
      sessionCalls.filter((c) => isLiveCall(c)),
      completed,
    )

  if (!call) {
    return emptyResult()
  }

  const messages = await listCallMessages(call.id)
  const messageCount = messages.length
  const transcript = messagesToTranscript(messages)
  const hasNewMessages = messageCount > input.lastMessageCount

  if (!hasNewMessages || !transcript.trim()) {
    return {
      formData: {},
      activeCallId: call.id,
      messageCount,
      awaitingCall: false,
      callEnded: false,
    }
  }

  const formData = await extractFormData(transcript, input.service)

  return {
    formData,
    activeCallId: call.id,
    messageCount,
    awaitingCall: false,
    callEnded: false,
  }
}
