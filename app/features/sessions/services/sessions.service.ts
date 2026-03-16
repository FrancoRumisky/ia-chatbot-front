import { apiClient } from "@/shared/lib/api/api-client"

export interface SessionMessage {
  role: "user" | "assistant"
  content: string
  timestamp?: string
}

export interface SessionItem {
  id: string
  created_at: string
  last_updated: string
  message_count: number
}

export interface SessionsResponse {
  sessions: SessionItem[]
  total_sessions?: number
}

export interface SessionData {
  session_id: string
  messages: SessionMessage[]
  document_ids: string[]
}

function buildFallbackDate(): string {
  return new Date().toISOString()
}

function normalizeSession(raw: unknown): SessionItem | null {
  if (typeof raw === "string") {
    const now = buildFallbackDate()

    return {
      id: raw,
      created_at: now,
      last_updated: now,
      message_count: 0,
    }
  }

  if (raw && typeof raw === "object") {
    const candidate = raw as Partial<SessionItem> & { session_id?: string }
    const id = candidate.id ?? candidate.session_id

    if (!id) {
      return null
    }

    const now = buildFallbackDate()

    return {
      id,
      created_at: candidate.created_at ?? now,
      last_updated: candidate.last_updated ?? candidate.created_at ?? now,
      message_count: candidate.message_count ?? 0,
    }
  }

  return null
}

class SessionsService {
  async listSessions(userId: string): Promise<SessionsResponse> {
    if (!userId) {
      throw new Error("user_id is required")
    }
    const response = await apiClient.get<unknown>(`/sessions?user_id=${encodeURIComponent(userId)}`)

    if (
      response &&
      typeof response === "object" &&
      "sessions" in response &&
      Array.isArray((response as { sessions: unknown[] }).sessions)
    ) {
      const sessions = (response as { sessions: unknown[] }).sessions
        .map(normalizeSession)
        .filter((item): item is SessionItem => item !== null)

      return {
        sessions,
        total_sessions:
          typeof (response as { total_sessions?: unknown }).total_sessions ===
          "number"
            ? (response as unknown as { total_sessions: number }).total_sessions
            : sessions.length,
      }
    }

    if (Array.isArray(response)) {
      const sessions = response
        .map(normalizeSession)
        .filter((item): item is SessionItem => item !== null)

      return { sessions, total_sessions: sessions.length }
    }

    return { sessions: [], total_sessions: 0 }
  }

  async getSession(sessionId: string, userId: string): Promise<SessionData> {
    if (!userId) {
      throw new Error("user_id is required")
    }
    return apiClient.get<SessionData>(`/sessions/${sessionId}?user_id=${encodeURIComponent(userId)}`)
  }
}

export const sessionsService = new SessionsService()

