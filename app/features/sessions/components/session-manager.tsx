"use client";

import { useEffect, useState } from "react";
import { sessionsService, type SessionItem } from "../services/sessions.service";

interface Props {
  currentSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export default function SessionManager({ currentSessionId, onSessionChange }: Props) {
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  async function loadSessions() {
    setIsLoading(true);
    try {
      const res = await sessionsService.listSessions();
      setSessions(res.sessions);
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setIsLoading(false);
    }
  }

  function createNewSession() {
    const newSessionId = crypto.randomUUID();
    onSessionChange(newSessionId);
    setShowDropdown(false);
  }

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 rounded-lg border border-[#26324A] bg-[#182235] px-3 py-2 text-sm text-white hover:border-[#4F8CFF] focus:outline-none"
      >
        <span>💬</span>
        <span className="max-w-32 truncate">
          {currentSession ? `Sesión ${currentSession.id.slice(0, 8)}` : "Nueva sesión"}
        </span>
        <span className="text-xs">▼</span>
      </button>

      {showDropdown && (
        <div className="absolute top-full mt-1 w-64 rounded-lg border border-[#26324A] bg-[#182235] p-2 shadow-lg z-10">
          <button
            onClick={createNewSession}
            className="w-full rounded px-3 py-2 text-left text-sm text-[#35D6C1] hover:bg-[#1C2940]"
          >
            ➕ Nueva sesión
          </button>

          <div className="my-2 border-t border-[#26324A]"></div>

          <div className="max-h-40 overflow-y-auto">
            {sessions.map((session) => (
              <button
                key={session.id}
                onClick={() => {
                  onSessionChange(session.id);
                  setShowDropdown(false);
                }}
                className={`w-full rounded px-3 py-2 text-left text-sm hover:bg-[#1C2940] ${
                  session.id === currentSessionId ? "bg-[#4F8CFF] text-white" : "text-white"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="truncate">Sesión {session.id.slice(0, 8)}</span>
                  <span className="text-xs text-[#A7B4CE]">{session.message_count} msgs</span>
                </div>
                <div className="text-xs text-[#A7B4CE]">
                  {new Date(session.last_updated).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}