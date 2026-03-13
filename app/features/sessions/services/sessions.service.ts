import { apiClient } from "@/shared/lib/api/api-client"

export interface SessionItem {
  id: string
  created_at: string
  last_updated: string
  message_count: number
}

export interface SessionsResponse {
  sessions: SessionItem[]
}

export interface SessionData {
  session_id: string
  messages: Array<{
    role: string
    content: string
    timestamp: string
  }>
  document_ids: string[]
}

class SessionsService {
  async listSessions(): Promise<SessionsResponse> {
    return apiClient.get("/sessions")
  }

  async getSession(sessionId: string): Promise<SessionData> {
    return apiClient.get(`/sessions/${sessionId}`)
  }
}

export const sessionsService = new SessionsService()