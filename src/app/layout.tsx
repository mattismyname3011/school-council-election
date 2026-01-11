import type { Metadata } from "next";
import { GeistSans, GeistMono } from "geist/font";

import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import Snow from "@/components/ui/snow";

const geistSans = GeistSans;

const geistMono = GeistMono;

export const metadata: Metadata = {
  title: "School Council Election - Voting Platform",
  description:
    "Modern Next.js platform for school council elections with TypeScript, Tailwind CSS, and shadcn/ui.",
  keywords: [
    "school council",
    "election",
    "voting",
    "Next.js",
    "TypeScript",
    "Tailwind CSS",
    "shadcn/ui",
    "React",
  ],
  authors: [{ name: "School Council Team" }],
  icons: {
    icon: "https://z-cdn.chatglm.cn/z-ai/static/logo.svg",
  },
  openGraph: {
    title: "School Council Election",
    description: "Secure voting platform for school council elections",
    url: "https://chat.z.ai",
    siteName: "School Council Election",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "School Council Election",
    description: "Secure voting platform for school council elections",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <Snow />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
