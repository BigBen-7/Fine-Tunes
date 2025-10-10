import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Fine-Tunes",
  description: "Your AI-Powered Music Discovery Dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* The main container for our app content */}
        <div className="relative min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}