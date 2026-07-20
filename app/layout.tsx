import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/organisms/Sidebar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rankline — AI Visibility Intelligence",
  description:
    "Compare how free OpenRouter models rank your products across search queries",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col md:h-screen md:overflow-hidden">
        <Sidebar />
        <main className="workspace-grid min-h-screen min-w-0 flex-1 overflow-auto md:ml-72 md:h-screen md:min-h-0 md:overflow-y-auto">
          <div className="animate-fade-in">{children}</div>
        </main>
      </body>
    </html>
  );
}
