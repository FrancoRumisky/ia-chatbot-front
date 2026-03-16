interface SidebarSectionProps {
  title: string
  children: React.ReactNode
  action?: React.ReactNode
}

export default function SidebarSection({
  title,
  children,
  action,
}: SidebarSectionProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-[#6F7C96]">
          {title}
        </h3>
        {action}
      </div>

      <div className="space-y-2">{children}</div>
    </section>
  )
}
