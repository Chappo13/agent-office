"use client";

import { useState } from "react";
import { LeftSidebar, type NavKey } from "@/components/layout/LeftSidebar";
import { OfficePanel } from "@/components/layout/OfficePanel";
import { ChatPanel } from "@/components/layout/ChatPanel";

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("office");

  return (
    <div className="flex h-screen min-w-[1040px] overflow-hidden">
      <LeftSidebar activeNav={activeNav} onNavChange={setActiveNav} />
      <OfficePanel />
      <ChatPanel />
    </div>
  );
}
