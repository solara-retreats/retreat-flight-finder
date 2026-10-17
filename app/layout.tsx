import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "elsewhere. – retreat i letenka na jednom místě",
  description: "Najdi retreat v teple a letenku z Prahy s celkovou cenou cesty.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="cs"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Script
          src="https://tp-em.com/NTg3MDA4.js?t=587008"
          strategy="beforeInteractive"
          data-cmp-ab="2"
        />
        {children}
      </body>
    </html>
  );
}