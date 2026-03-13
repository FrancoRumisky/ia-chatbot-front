import { apiClient } from "@/shared/lib/api/api-client"

export interface HealthResponse {
  status: string
  chat_model: string
  embedding_model: string
  collection: string
}

export interface LogEntry {
  session_id: string
  question: string
  document_ids: string[]
  context_used: string
  response: string
  latency_ms: number
  timestamp: string
}

export interface LogsResponse {
  logs: LogEntry[]
}

class SystemService {
  async getHealth(): Promise<HealthResponse> {
    return apiClient.get("/health")
  }

  async getRecentLogs(limit: number = 20): Promise<LogsResponse> {
    return apiClient.get(`/logs/recent?limit=${limit}`)
  }
}

export const systemService = new SystemService()