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
}

export const chatService = new ChatService()