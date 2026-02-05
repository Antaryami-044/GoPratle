import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Designer",
  description: "Assignment Flow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="bg-white border-b p-4">
          <div className="max-w-7xl mx-auto font-bold text-blue-600 text-xl">
            Designer Page
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}