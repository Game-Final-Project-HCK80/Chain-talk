"use client";

import React, { useEffect, useState } from "react";
import { DailyProvider } from "@daily-co/daily-react";
import DailyIframe, { DailyCall } from "@daily-co/daily-js";

export default function DailyWrapper({ children }: { children: React.ReactNode }) {
  const [callObject, setCallObject] = useState<DailyCall | null>(null);

  useEffect(() => {
    const newCallObject = DailyIframe.createCallObject();
    setCallObject(newCallObject);
  }, []);

  if (!callObject) {
    return <div>Loading...</div>; // Tampilkan loading saat callObject belum siap
  }

  return <DailyProvider callObject={callObject}>{children}</DailyProvider>;
}