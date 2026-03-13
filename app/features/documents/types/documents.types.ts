export interface DocumentItem {
  document_id: string
  filename: string
  source: string
}

export interface DocumentsResponse {
  documents: DocumentItem[]
  total_documents: number
}

export interface IngestResponse {
  message: string
  chunks_added: number
  source: string
  document_id: string
}