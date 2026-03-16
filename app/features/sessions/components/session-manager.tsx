"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import SidebarSection from "@/components/sidebar/SidebarSection"
import SidebarSessionItem from "@/components/sidebar/SidebarSessionItem"
import { sessionsService, type SessionItem } from "../services/sessions.service"

interface Props {
  currentSessionId: string | null
  onSessionChange: (sessionId: string) => void
  userId: string | null
}

function sortSessionsByUpdatedAt(sessions: SessionItem[]): SessionItem[] {
  return [...sessions].sort((a, b) => {
    const aDate = new Date(a.last_updated).getTime()
    const bDate = new Date(b.last_updated).getTime()
    return bDate - aDate
  })
}

export default function SessionManager({
  currentSessionId,
  onSessionChange,
  userId,
}: Props) {
  const [sessions, setSessions] = useState<SessionItem[]>([])
  const [isLoading, setIsLoading] = useState(false)

  async function loadSessions() {
    if (!userId) return

    setIsLoading(true)

    try {
      const response = await sessionsService.listSessions(userId)

      const enrichedSessions = await Promise.all(
        response.sessions.map(async (session) => {
          try {
            const sessionData = await sessionsService.getSession(session.id, userId)
            const messageCount = sessionData.messages.length

            return {
              ...session,
              message_count: messageCount,
              last_updated:
                messageCount > 0 ? new Date().toISOString() : session.last_updated,
            }
          } catch (error) {
            console.error(`Error loading session ${session.id}:`, error)
            return session
          }
        })
      )

      setSessions(sortSessionsByUpdatedAt(enrichedSessions))
    } catch (error) {
      console.error("Error loading sessions:", error)
      const errorMessage = error instanceof Error && error.message.includes('No se puede conectar')
        ? "No se puede conectar al servidor backend. Asegúrate de que esté corriendo en http://localhost:8000"
        : "Error al cargar las sesiones."
      alert(errorMessage)
      setSessions([])
    } finally {
      setIsLoading(false)
    }
  }

  const loadSessionsMemo = useCallback(loadSessions, [userId])

  useEffect(() => {
    void loadSessionsMemo()
  }, [currentSessionId, loadSessionsMemo])

  const hasSessions = useMemo(() => sessions.length > 0, [sessions])

  return (
    <SidebarSection
      title="Sesiones"
      action={
        <button
          type="button"
          onClick={() => void loadSessionsMemo()}
          className="rounded-xl border border-[#26324A] px-2.5 py-1.5 text-[11px] text-[#A7B4CE] transition hover:border-[#4F8CFF] hover:text-white"
        >
          Recargar
        </button>
      }
    >
      {isLoading ? (
        <div className="rounded-2xl border border-[#26324A] bg-[#182235] p-4 text-sm text-[#A7B4CE]">
          Cargando sesiones...
        </div>
      ) : !hasSessions ? (
        <div className="rounded-2xl border border-[#26324A] bg-[#182235] p-4 text-sm text-[#A7B4CE]">
          No hay sesiones guardadas todavía.
        </div>
      ) : (
        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
          {sessions.map((session) => (
            <SidebarSessionItem
              key={session.id}
              session={session}
              isActive={session.id === currentSessionId}
              onClick={() => onSessionChange(session.id)}
            />
          ))}
        </div>
      )}
    </SidebarSection>
  )
}

