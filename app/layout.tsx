import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Examen práctico",
  description: "Login con Firebase",
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