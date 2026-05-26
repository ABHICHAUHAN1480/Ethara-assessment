import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ERROR: HUMAN_FOUND",
  description: "A browser based AI operating system hacking simulator."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
