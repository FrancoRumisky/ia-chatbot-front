import { apiClient } from "@/shared/lib/api/api-client"
import type {
  DocumentsResponse,
  IngestResponse,
} from "../types/documents.types"

class DocumentsService {
  async listDocuments(): Promise<DocumentsResponse> {
    return apiClient.get("/documents")
  }

  async uploadDocument(file: File, type: string = "docs"): Promise<IngestResponse> {
    const formData = new FormData()

    formData.append("file", file)
    formData.append("type", type)

    return apiClient.postFormData("/ingest", formData)
  }
}

export const documentsService = new DocumentsService()