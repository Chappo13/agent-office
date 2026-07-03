"use client";

import { useState } from "react";
import { LeftSidebar, type NavKey } from "@/components/layout/LeftSidebar";
import { OfficePanel } from "@/components/layout/OfficePanel";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { useOfficeConnection } from "@/lib/useOfficeConnection";

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavKey>("office");
  useOfficeConnection();

  return (
    <div className="scroll-thin h-screen w-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-[1040px]">
        <LeftSidebar activeNav={activeNav} onNavChange={setActiveNav} />
        <OfficePanel />
        <ChatPanel />
      </div>
    </div>
  );
}
