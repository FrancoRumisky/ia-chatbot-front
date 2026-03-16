import { apiClient } from "@/shared/lib/api/api-client"
import type {
  DocumentsResponse,
  IngestResponse,
} from "../types/documents.types"

class DocumentsService {
  async listDocuments(userId: string): Promise<DocumentsResponse> {
    if (!userId) {
      throw new Error("user_id is required")
    }
    return apiClient.get(`/documents?user_id=${encodeURIComponent(userId)}`)
  }

  async uploadDocument(file: File, type: string = "docs", userId: string): Promise<IngestResponse> {
    if (!userId) {
      throw new Error("user_id is required")
    }
    const formData = new FormData()

    formData.append("file", file)
    formData.append("type", type)
    formData.append("user_id", userId)

    return apiClient.postFormData("/ingest", formData)
  }
}

export const documentsService = new DocumentsService()