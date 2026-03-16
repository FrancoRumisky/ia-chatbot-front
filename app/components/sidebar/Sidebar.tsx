"use client"

import SessionManager from "@/features/sessions/components/session-manager"
import SidebarSection from "./SidebarSection"
import DocumentUpload from "@/features/documents/components/document-upload"
import DocumentList from "@/features/documents/components/document-list"
import type { DocumentItem } from "@/features/documents/types/documents.types"

interface SidebarProps {
  currentSessionId: string | null
  onSessionChange: (sessionId: string) => void
  documents: DocumentItem[]
  selectedDocs: string[]
  toggleDoc: (id: string) => void
  onUpload: (file: File, type: string) => void
  isUploading: boolean
  isLoadingDocuments: boolean
  loadDocs: () => Promise<void>
  userId: string | null
}

export default function Sidebar({
  currentSessionId,
  onSessionChange,
  documents,
  selectedDocs,
  toggleDoc,
  onUpload,
  isUploading,
  isLoadingDocuments,
  loadDocs,
  userId,
}: SidebarProps) {
  const createNewSession = () => {
    const newSessionId = crypto.randomUUID()
    onSessionChange(newSessionId)
  }

  return (
    <aside className="flex min-h-[70vh] flex-col rounded-[28px] border border-[#26324A] bg-[linear-gradient(180deg,#121A2B_0%,#101827_100%)] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
      <button
        type="button"
        onClick={createNewSession}
        className="mb-5 w-full rounded-2xl bg-[#4F8CFF] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#3D78E6]"
      >
        + Nueva sesión
      </button>

      <div className="space-y-5">
        <SessionManager
          currentSessionId={currentSessionId}
          onSessionChange={onSessionChange}
          userId={userId}
        />

        <SidebarSection
          title="Subir PDF"
          action={
            <button
              type="button"
              onClick={() => void loadDocs()}
              className="rounded-xl border border-[#26324A] px-2.5 py-1.5 text-[11px] text-[#A7B4CE] transition hover:border-[#4F8CFF] hover:text-white"
            >
              Recargar
            </button>
          }
        >
          {isUploading ? (
            <div className="rounded-3xl border border-[#26324A] bg-[#182235] p-6 text-center text-sm text-[#A7B4CE]">
              Subiendo documento...
            </div>
          ) : (
            <DocumentUpload onUpload={onUpload} />
          )}
        </SidebarSection>

        <SidebarSection title="Archivos cargados">
          {isLoadingDocuments ? (
            <div className="rounded-2xl border border-[#26324A] bg-[#182235] p-4 text-sm text-[#A7B4CE]">
              Cargando documentos...
            </div>
          ) : documents.length === 0 ? (
            <div className="rounded-2xl border border-[#26324A] bg-[#182235] p-4 text-sm text-[#A7B4CE]">
              Todavía no hay documentos disponibles.
            </div>
          ) : (
            <DocumentList
              documents={documents}
              selected={selectedDocs}
              toggle={toggleDoc}
            />
          )}
        </SidebarSection>
      </div>
    </aside>
  )
}
