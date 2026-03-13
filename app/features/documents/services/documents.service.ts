import { apiClient } from "@/shared/lib/api/api-client"
import type {
  DocumentsResponse,
  IngestResponse,
} from "../types/documents.types"

class DocumentsService {
  async listDocuments(): Promise<DocumentsResponse> {
    return apiClient.get("/documents")
  }

  async uploadDocument(file: File): Promise<IngestResponse> {
    const formData = new FormData()

    formData.append("file", file)

    return apiClient.postFormData("/ingest", formData)
  }
}

export const documentsService = new DocumentsService()