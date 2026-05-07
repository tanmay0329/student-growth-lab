import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ChallengeProvider } from "@/store/ChallengeContext";
import { SensorWidget } from "@/components/SensorWidget";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Student Growth Lab",
  description: "Advanced Behavioral Intelligence Simulation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-black text-slate-50 min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <ChallengeProvider>
          {children}
          <SensorWidget />
        </ChallengeProvider>
      </body>
    </html>
  );
}
