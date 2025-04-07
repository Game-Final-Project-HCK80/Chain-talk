import type { Metadata } from "next";
import "../globals.css";
import Navbar from "@/components/navbar";

export const metadata: Metadata = {
  title: "Chain-Talk",
  description: "made in by heart",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
}

