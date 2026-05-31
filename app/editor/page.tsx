"use client";

import { useState } from "react";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";

export default function EditorPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <EditorNavbar
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
      />
      <ProjectSidebar isOpen={isSidebarOpen} onClose={handleCloseSidebar} />

      {/* Canvas area - placeholder for future node editor */}
      <main className="pt-14 min-h-screen flex items-center justify-center">
        <p className="text-[var(--text-muted)]">Canvas area</p>
      </main>
    </div>
  );
}