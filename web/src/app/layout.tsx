import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rumbo — Transporte Público en Tiempo Real",
  description: "Sé a dónde vas. Llega con certeza.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
