import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Bias Lens - News Article Bias Detection",
  description: "AI-powered tool to detect bias in news articles and provide objective analysis",
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.svg",
  },
  openGraph: {
    title: "Bias Lens - Uncover Hidden Bias in Your News",
    description: "AI-powered tool to detect bias in news articles and provide objective analysis",
    type: "website",
    siteName: "Bias Lens",
  },
  twitter: {
    card: "summary",
    title: "Bias Lens - News Article Bias Detection",
    description: "AI-powered tool to detect bias in news articles and provide objective analysis",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            html.dark { color-scheme: dark; }
            html:not(.dark) { color-scheme: light; }
          `
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-canvas text-fg font-sans`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
