"use client"

import { useEffect, useRef } from "react"
import type { ChatMessage } from "../types/chat.types"

interface Props {
  messages: ChatMessage[]
}

function TypingIndicator() {
  return (
    <div className="flex items-center gap-2">
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#35D6C1] [animation-delay:-0.3s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#35D6C1] [animation-delay:-0.15s]" />
      <span className="h-2.5 w-2.5 animate-bounce rounded-full bg-[#35D6C1]" />
    </div>
  )
}

export default function ChatPanel({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto pr-1">
      <div className="space-y-4">
        {messages.length === 0 && (
          <div className="rounded-3xl border border-[#26324A] bg-[#182235] p-6 text-sm text-[#A7B4CE] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
            <p className="text-base font-medium text-white">Bienvenido a DocMind AI</p>
            <p className="mt-2 leading-6">
              Seleccioná uno o varios documentos, escribí una pregunta y el asistente
              responderá usando el contexto recuperado desde tus PDFs.
            </p>
          </div>
        )}

        {messages.map((message) => {
          const isUser = message.role === "user"

          return (
            <div
              key={message.id}
              className={`max-w-4xl rounded-3xl border p-5 shadow-[0_10px_30px_rgba(0,0,0,0.18)] ${
                isUser
                  ? "ml-auto border-[#4F8CFF] bg-[linear-gradient(180deg,#1A2B52_0%,#152342_100%)]"
                  : "border-[#26324A] bg-[#182235]"
              }`}
            >
              <div className="mb-3 flex items-center gap-2">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold ${
                    isUser
                      ? "bg-[#4F8CFF] text-white"
                      : "bg-[#35D6C1] text-[#0B1020]"
                  }`}
                >
                  {isUser ? "Tú" : "AI"}
                </div>

                <p className="text-xs uppercase tracking-[0.2em] text-[#6F7C96]">
                  {isUser ? "Usuario" : "Asistente"}
                </p>
              </div>

              {message.isLoading ? (
                <TypingIndicator />
              ) : (
                <p className="whitespace-pre-wrap text-sm leading-7 text-[#F3F7FF]">
                  {message.content}
                </p>
              )}

              {!message.isLoading && message.context && (
                <details className="mt-5 rounded-2xl border border-[#26324A] bg-[#121A2B] p-4">
                  <summary className="cursor-pointer text-sm font-medium text-[#35D6C1]">
                    Ver contexto usado
                  </summary>
                  <pre className="mt-4 whitespace-pre-wrap text-xs leading-6 text-[#A7B4CE]">
                    {message.context}
                  </pre>
                </details>
              )}
            </div>
          )
        })}

        <div ref={bottomRef} />
      </div>
    </div>
  )
}