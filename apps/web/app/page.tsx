"use client";

import { LeftSidebar } from "@/components/layout/LeftSidebar";
import { MainArea } from "@/components/layout/MainArea";
import { ChatPanel } from "@/components/layout/ChatPanel";
import { useOfficeConnection } from "@/lib/useOfficeConnection";

export default function Home() {
  useOfficeConnection();

  return (
    <div className="scroll-thin h-screen w-full overflow-x-auto overflow-y-hidden">
      <div className="flex h-full min-w-[1040px]">
        <LeftSidebar />
        <MainArea />
        <ChatPanel />
      </div>
    </div>
  );
}
