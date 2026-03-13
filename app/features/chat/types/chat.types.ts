export interface ChatRequest {
  session_id: string
  document_ids: string[]
  message: string
}

export interface ChatResponse {
  response: string
  context_used: string
  session_id: string
  document_ids: string[]
}

export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  content: string
  context?: string
  isLoading?: boolean
}