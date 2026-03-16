"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"

import ChatPanel from "@/features/chat/components/chat-panel"
import Sidebar from "@/components/sidebar/Sidebar"

import { documentsService } from "@/features/documents/services/documents.service"
import { chatService } from "@/features/chat/services/chat.service"
import { sessionsService } from "@/features/sessions/services/sessions.service"
import { getOrCreateUserId } from "@/shared/lib/auth/user-id"

import type { DocumentItem } from "@/features/documents/types/documents.types"
import type { ChatMessage } from "@/features/chat/types/chat.types"

function mapSessionMessagesToChatMessages(
  messages: Array<{ role: "user" | "assistant"; content: string }>
): ChatMessage[] {
  return messages.map((message, index) => ({
    id: `${message.role}-${index}-${crypto.randomUUID()}`,
    role: message.role,
    content: message.content,
  }))
}

export default function Home() {
  const [userId, setUserId] = useState<string | null>(null)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [documents, setDocuments] = useState<DocumentItem[]>([])
  const [selectedDocs, setSelectedDocs] = useState<string[]>([])
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [question, setQuestion] = useState("")
  const [isLoadingDocuments, setIsLoadingDocuments] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [isLoadingSession, setIsLoadingSession] = useState(false)

  const previousSessionIdRef = useRef<string | null>(null)

  const hasSelectedDocs = useMemo(() => selectedDocs.length > 0, [selectedDocs])

  useEffect(() => {
    const id = getOrCreateUserId()
    setUserId(id)
  }, [])

  useEffect(() => {
    const storedSessionId = localStorage.getItem("docmind_session_id")

    if (storedSessionId) {
      setSessionId(storedSessionId)
      return
    }

    const newSessionId = crypto.randomUUID()
    localStorage.setItem("docmind_session_id", newSessionId)
    setSessionId(newSessionId)
  }, [])

  async function loadSessionData(targetSessionId: string) {
    if (!userId) return

    setIsLoadingSession(true)

    try {
      const sessionData = await sessionsService.getSession(targetSessionId, userId)

      setMessages(mapSessionMessagesToChatMessages(sessionData.messages))
      setSelectedDocs(sessionData.document_ids ?? [])
    } catch (error) {
      console.error("Error loading session data:", error)
      const errorMessage = error instanceof Error && error.message.includes('No se puede conectar')
        ? "No se puede conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000"
        : "Error al cargar los datos de la sesión."
      alert(errorMessage)
      setMessages([])
      setSelectedDocs([])
    } finally {
      setIsLoadingSession(false)
    }
  }

  const loadSessionDataMemo = useCallback(loadSessionData, [userId])

  useEffect(() => {
    if (!sessionId) return

    localStorage.setItem("docmind_session_id", sessionId)

    if (previousSessionIdRef.current === sessionId) return

    previousSessionIdRef.current = sessionId
    void loadSessionDataMemo(sessionId)
  }, [sessionId, loadSessionDataMemo])

  async function loadDocs() {
    if (!userId) return

    setIsLoadingDocuments(true)

    try {
      const res = await documentsService.listDocuments(userId)
      setDocuments(res.documents)
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error && error.message.includes('No se puede conectar')
        ? "No se puede conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000"
        : "No se pudieron cargar los documentos."
      alert(errorMessage)
    } finally {
      setIsLoadingDocuments(false)
    }
  }

  const loadDocsMemo = useCallback(loadDocs, [userId])

  useEffect(() => {
    void loadDocsMemo()
  }, [loadDocsMemo])

  function toggleDoc(id: string) {
    setSelectedDocs((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    )
  }

  async function upload(file: File, type: string = "docs") {
    if (!userId) return

    setIsUploading(true)

    try {
      await documentsService.uploadDocument(file, type, userId)
      await loadDocs()
    } catch (error) {
      console.error(error)
      const errorMessage = error instanceof Error && error.message.includes('No se puede conectar')
        ? "No se puede conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000"
        : "No se pudo subir el PDF."
      alert(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  async function send() {
    if (!question.trim() || !hasSelectedDocs || isSending || !sessionId || !userId) return

    const currentQuestion = question.trim()

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: currentQuestion,
    }

    const loadingMessageId = crypto.randomUUID()

    const loadingMessage: ChatMessage = {
      id: loadingMessageId,
      role: "assistant",
      content: "",
      isLoading: true,
    }

    setMessages((prev) => [...prev, userMessage, loadingMessage])
    setQuestion("")
    setIsSending(true)

    try {
      const res = await chatService.sendMessage({
        user_id: userId,
        session_id: sessionId,
        document_ids: selectedDocs,
        message: currentQuestion,
      })

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content: res.response,
                context: res.context_used,
                isLoading: false,
              }
            : message
        )
      )
    } catch (error) {
      console.error(error)

      setMessages((prev) =>
        prev.map((message) =>
          message.id === loadingMessageId
            ? {
                id: loadingMessageId,
                role: "assistant",
                content:
                  error instanceof Error && error.message.includes('No se puede conectar')
                    ? "No se puede conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000"
                    : "Ocurrió un error al obtener la respuesta del asistente.",
                isLoading: false,
              }
            : message
        )
      )
    } finally {
      setIsSending(false)
    }
  }

  function handleQuestionKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault()
      void send()
    }
  }

  return (
    <main className="min-h-screen bg-[#0B1020] text-white">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-6 p-6">
        <header className="rounded-[28px] border border-[#26324A] bg-[linear-gradient(180deg,#121A2B_0%,#101827_100%)] p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#26324A] bg-[#182235] px-3 py-1 text-xs text-[#35D6C1]">
                <span className="h-2 w-2 rounded-full bg-[#35D6C1]" />
                RAG · PDF · Local AI
              </div>
              <div className="mb-5 rounded-2xl border border-[#3A465F] bg-[#182235] px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#35D6C1]">
                Modelo en fase de prueba
                </p>
                <p className="mt-2 text-sm leading-6 text-[#A7B4CE]">
                Las respuestas pueden demorar algunos segundos y, en ciertos casos, el
                asistente puede no encontrar suficiente contexto en los documentos para
                responder con precisión.
                </p>
              </div>

              <h1 className="text-3xl font-semibold tracking-tight text-white md:text-4xl">
                DocMind AI
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-7 text-[#A7B4CE] md:text-base">
                Asistente inteligente para lectura y consulta de documentos.
                Subí PDFs, seleccioná uno o varios archivos y obtené respuestas
                basadas en contexto usando RAG local.
              </p>
            </div>

            <div className="rounded-2xl border border-[#26324A] bg-[#182235] px-4 py-3">
              <p className="text-[11px] uppercase tracking-[0.2em] text-[#6F7C96]">
                Session ID
              </p>
              <p className="mt-2 break-all text-sm text-[#35D6C1]">
                {sessionId ?? "generando sesión..."}
              </p>
            </div>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 gap-6 lg:grid-cols-[360px_1fr]">
          <Sidebar
            currentSessionId={sessionId}
            onSessionChange={setSessionId}
            documents={documents}
            selectedDocs={selectedDocs}
            toggleDoc={toggleDoc}
            onUpload={upload}
            isUploading={isUploading}
            isLoadingDocuments={isLoadingDocuments}
            loadDocs={loadDocsMemo}
            userId={userId}
          />

          <section className="flex min-h-[70vh] flex-col rounded-[28px] border border-[#26324A] bg-[linear-gradient(180deg,#121A2B_0%,#101827_100%)] p-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)]">
            <div className="mb-5 flex items-center justify-between border-b border-[#26324A] pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">Chat de consulta</h2>
                <p className="mt-1 text-sm text-[#A7B4CE]">
                  {isLoadingSession
                    ? "Cargando sesión..."
                    : hasSelectedDocs
                    ? `${selectedDocs.length} documento(s) seleccionados`
                    : "Seleccioná al menos un documento para comenzar"}
                </p>
              </div>

              <div className="hidden rounded-2xl border border-[#26324A] bg-[#182235] px-4 py-2 text-xs text-[#A7B4CE] md:block">
                IA local · FastAPI · Ollama
              </div>
            </div>

            <ChatPanel messages={messages} />

            <div className="mt-5 border-t border-[#26324A] pt-5">
              <div className="rounded-[24px] border border-[#26324A] bg-[#182235] p-3 shadow-[0_10px_25px_rgba(0,0,0,0.16)]">
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  onKeyDown={handleQuestionKeyDown}
                  placeholder="Preguntá algo sobre los documentos seleccionados..."
                  className="min-h-[120px] w-full bg-transparent px-2 py-2 text-sm leading-7 text-white outline-none placeholder:text-[#6F7C96]"
                />

                <div className="mt-3 flex flex-col gap-3 border-t border-[#26324A] pt-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#6F7C96]">
                    {hasSelectedDocs
                      ? "Enter para enviar · Shift + Enter para salto de línea"
                      : "Primero seleccioná uno o varios documentos."}
                  </p>

                  <button
                    onClick={() => void send()}
                    disabled={
                      isSending ||
                      isLoadingSession ||
                      !question.trim() ||
                      !hasSelectedDocs ||
                      !sessionId ||
                      !userId
                    }
                    className="rounded-2xl bg-[#4F8CFF] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#3D78E6] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isSending ? "Consultando..." : "Enviar pregunta"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
