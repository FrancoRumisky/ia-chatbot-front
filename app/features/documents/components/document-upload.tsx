"use client"

import { useMemo, useState } from "react"

interface Props {
  onUpload: (file: File, type: string) => void
}

const uploadTypes = [
  { value: "docs", label: "Documentos" },
  { value: "faq", label: "FAQ" },
  { value: "structured", label: "Estructurados" },
] as const

export default function DocumentUpload({ onUpload }: Props) {
  const [selectedType, setSelectedType] = useState<
    (typeof uploadTypes)[number]["value"]
  >("docs")

  const selectedLabel = useMemo(
    () =>
      uploadTypes.find((item) => item.value === selectedType)?.label ??
      "Documentos",
    [selectedType]
  )

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[#6F7C96]">
          Tipo de carga
        </p>

        <div className="grid grid-cols-3 gap-2">
          {uploadTypes.map((type) => {
            const isActive = selectedType === type.value

            return (
              <button
                key={type.value}
                type="button"
                onClick={() => setSelectedType(type.value)}
                className={`min-w-0 rounded-2xl border px-2 py-1.5 text-center text-[9px] font-medium leading-tight transition ${
                  isActive
                    ? "border-[#4F8CFF] bg-[#182235] text-white shadow-[0_0_0_1px_rgba(79,140,255,0.2)]"
                    : "border-[#26324A] bg-[#121A2B] text-[#A7B4CE] hover:border-[#3D78E6] hover:bg-[#182235] hover:text-white"
                }`}
              >
                <span className="block truncate">{type.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#26324A] bg-[#182235] p-6 text-center transition hover:border-[#4F8CFF] hover:bg-[#1C2940]">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(event) => {
            const file = event.target.files?.[0]
            if (file) onUpload(file, selectedType)
            event.currentTarget.value = ""
          }}
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121A2B] text-[#35D6C1]">
          ⤴
        </div>

        <p className="text-sm font-medium text-white">Subir PDF</p>
        <p className="mt-1 text-xs leading-5 text-[#A7B4CE]">
          Cargá un archivo en la categoría{" "}
          <span className="text-[#35D6C1]">{selectedLabel}</span>.
        </p>
      </label>
    </div>
  )
}

