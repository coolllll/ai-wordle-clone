import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Word Guess",
  description: "A local five-letter word guessing game",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
