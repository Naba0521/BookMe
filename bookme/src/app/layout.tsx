import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { UserAuthProvider } from "./_providers/UserAuthProvider";
import { Suspense } from "react";
import { Toaster } from "sonner";
import { CompanyAuthProvider } from "./_providers/CompanyAuthProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Bookme",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Suspense>
          <CompanyAuthProvider>
            <UserAuthProvider> {children}</UserAuthProvider>
          </CompanyAuthProvider>
        </Suspense>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
