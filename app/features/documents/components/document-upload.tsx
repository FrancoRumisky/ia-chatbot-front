"use client";

import { useState } from "react";

interface Props {
  onUpload: (file: File, type: string) => void;
}

export default function DocumentUpload({ onUpload }: Props) {
  const [selectedType, setSelectedType] = useState("docs");

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="rounded-lg border border-[#26324A] bg-[#182235] px-3 py-2 text-sm text-white focus:border-[#4F8CFF] focus:outline-none"
        >
          <option value="docs">📄 Documentos</option>
          <option value="faq">❓ FAQ</option>
          <option value="structured">📊 Estructurados</option>
        </select>
      </div>

      <label className="group flex cursor-pointer flex-col items-center justify-center rounded-3xl border border-dashed border-[#26324A] bg-[#182235] p-6 text-center transition hover:border-[#4F8CFF] hover:bg-[#1C2940]">
        <input
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) onUpload(file, selectedType);
          }}
        />

        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#121A2B] text-[#35D6C1]">
          ⤴
        </div>

        <p className="text-sm font-medium text-white">Subir PDF</p>
        <p className="mt-1 text-xs leading-5 text-[#A7B4CE]">
          Cargá un documento para indexarlo y consultarlo con IA.
        </p>
      </label>
    </div>
  );
}