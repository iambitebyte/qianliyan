import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Qianliyan - Log Watcher",
  description: "Monitor and view log files",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
