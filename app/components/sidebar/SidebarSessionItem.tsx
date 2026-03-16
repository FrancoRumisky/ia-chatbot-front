import type { SessionItem } from "@/features/sessions/services/sessions.service"

interface SidebarSessionItemProps {
  session: SessionItem
  isActive: boolean
  onClick: () => void
}

function formatSessionDate(value: string): string {
  const parsed = new Date(value)

  if (Number.isNaN(parsed.getTime())) {
    return "Reciente"
  }

  return parsed.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  })
}

export default function SidebarSessionItem({
  session,
  isActive,
  onClick,
}: SidebarSessionItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-3 text-left transition ${
        isActive
          ? "border-[#4F8CFF] bg-[#182235] shadow-[0_0_0_1px_rgba(79,140,255,0.2)]"
          : "border-[#26324A] bg-[#121A2B] hover:border-[#3D78E6] hover:bg-[#182235]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p
            className={`truncate text-sm font-medium ${
              isActive ? "text-white" : "text-[#E6ECF8]"
            }`}
          >
            Sesión {session.id.slice(0, 8)}
          </p>
          <p className="mt-1 text-xs text-[#6F7C96]">
            {session.message_count} mensajes ·{" "}
            {formatSessionDate(session.last_updated)}
          </p>
        </div>

        <div
          className={`mt-1 h-2.5 w-2.5 rounded-full ${
            isActive ? "bg-[#35D6C1]" : "bg-[#26324A]"
          }`}
        />
      </div>
    </button>
  )
}
