import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SettingsProvider } from "@/lib/settings-context";
import SettingsOverlay from "@/components/settings/SettingsOverlay";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Cockpit — 구매대행 AI 에이전트",
  description: "기업 구매대행 AI 에이전트 cockpit 프로토타입",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" className={inter.variable}>
      <body>
        <SettingsProvider>
          {children}
          <SettingsOverlay />
        </SettingsProvider>
      </body>
    </html>
  );
}
