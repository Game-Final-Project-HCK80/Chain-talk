import React from "react";
import "./globals.css";
import DailyWrapper from "@/components/DailyWrapper";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <DailyWrapper>{children}</DailyWrapper>
      </body>
    </html>
  );
}