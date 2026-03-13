import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "DocMind AI | Asistente de documentos con IA",
  description:
    "Aplicación de consulta inteligente sobre documentos PDF usando RAG, FastAPI, Ollama y ChromaDB.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
