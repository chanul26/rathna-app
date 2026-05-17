import {
  createAgent,
  getAgentId,
  retrieveAgent,
  type CreateAgentPayload,
} from '@/lib/beyApi'
import {
  buildRathnaAgentName,
  buildRathnaGreeting,
  buildRathnaSystemPrompt,
  type RathnaLanguage,
} from '@/lib/rathnaAgentPrompt'
import type { FormService } from '@/lib/formSchemas'

export interface RathnaSessionAgent {
  agentId: string
  embedUrl: string
}

export async function createRathnaSessionAgent(
  service: FormService,
  language: RathnaLanguage,
): Promise<RathnaSessionAgent | null> {
  const baseAgentId = getAgentId()
  if (!baseAgentId) return null

  const base = await retrieveAgent(baseAgentId)
  if (!base?.avatar_id) return null

  const payload: CreateAgentPayload = {
    name: buildRathnaAgentName(service),
    avatar_id: base.avatar_id,
    system_prompt: buildRathnaSystemPrompt(service, language),
    greeting: buildRathnaGreeting(service, language),
    language: 'en',
  }

  if (base.capabilities?.length) {
    payload.capabilities = base.capabilities
  }
  if (base.llm) {
    payload.llm = base.llm
  }
  if (base.max_session_length_minutes) {
    payload.max_session_length_minutes = base.max_session_length_minutes
  }

  const created = await createAgent(payload)
  if (!created?.id) return null

  return {
    agentId: created.id,
    embedUrl: `https://bey.chat/${created.id}`,
  }
}
