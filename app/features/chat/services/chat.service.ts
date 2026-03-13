import { apiClient } from "@/shared/lib/api/api-client"
import type {
  ChatRequest,
  ChatResponse,
} from "../types/chat.types"

class ChatService {
  async sendMessage(
    payload: ChatRequest
  ): Promise<ChatResponse> {
    return apiClient.postJSON("/chat", payload)
  }

  async *sendMessageStream(
    payload: ChatRequest
  ): AsyncGenerator<string> {
    const response = await fetch(`${apiClient.baseURL}/chat/stream`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error("No response body")
    }

    try {
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        yield chunk
      }
    } finally {
      reader.releaseLock()
    }
  }
}

export const chatService = new ChatService()