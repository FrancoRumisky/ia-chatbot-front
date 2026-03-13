import type { DocumentItem } from "../types/documents.types";

interface Props {
  documents: DocumentItem[];
  selected: string[];
  toggle: (id: string) => void;
}

export default function DocumentList({
  documents,
  selected,
  toggle,
}: Props) {
  return (
    <div className="space-y-3">
      {documents.map((doc) => {
        const active = selected.includes(doc.document_id);

        return (
          <button
            key={doc.document_id}
            onClick={() => toggle(doc.document_id)}
            className={`w-full rounded-2xl border p-4 text-left transition ${
              active
                ? "border-[#4F8CFF] bg-[#182235] shadow-[0_0_0_1px_rgba(79,140,255,0.15)]"
                : "border-[#26324A] bg-[#121A2B] hover:border-[#3D78E6] hover:bg-[#182235]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-white">{doc.filename}</p>
                <p className="mt-1 text-xs text-[#6F7C96]">{doc.document_id}</p>
              </div>

              <div
                className={`mt-1 h-3 w-3 rounded-full ${
                  active ? "bg-[#35D6C1]" : "bg-[#26324A]"
                }`}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}