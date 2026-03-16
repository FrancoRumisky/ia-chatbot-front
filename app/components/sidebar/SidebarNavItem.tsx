interface SidebarNavItemProps {
  label: string
  isActive?: boolean
  onClick?: () => void
}

export default function SidebarNavItem({
  label,
  isActive = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-2xl border px-3 py-2.5 text-left text-sm font-medium transition ${
        isActive
          ? "border-[#4F8CFF] bg-[#182235] text-white shadow-[0_0_0_1px_rgba(79,140,255,0.2)]"
          : "border-[#26324A] bg-[#121A2B] text-[#A7B4CE] hover:border-[#3D78E6] hover:bg-[#182235] hover:text-white"
      }`}
    >
      {label}
    </button>
  )
}
