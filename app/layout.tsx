// app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Suspense } from "react";
import { MainNav } from "@/components/main-nav";


const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "CV Builder - Create Professional Resumes",
  description: "Build stunning resumes, track job applications, and get AI-powered cover letters - all in one place.",
  keywords: "cv builder, resume maker, job applications, AI cover letter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    
    <html lang="en">
      <head>
          {/* Favicon Link */}
          <link rel="icon" href="/favicon.ico" sizes="32x32" />
        </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        <MainNav />
        <main className="flex-grow">
          <Suspense>
            {children}
          </Suspense>
        </main>
      </body>
    </html>
  );
}