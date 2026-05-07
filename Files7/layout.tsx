import type { Metadata } from "next";
import { Quicksand, DM_Sans } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  subsets: ["latin"],
  variable: "--font-quicksand",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Mi Agenda Semanal",
  description: "Agenda semanal interactiva con disponibilidad personalizada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${quicksand.variable} ${dmSans.variable}`}>
      <body className="font-body antialiased">
        {children}
      </body>
    </html>
  );
}
