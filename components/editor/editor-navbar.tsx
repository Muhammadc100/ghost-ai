"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EditorNavbarProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function EditorNavbar({ isSidebarOpen, onToggleSidebar }: EditorNavbarProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 flex items-center justify-between border-b border-border-default bg-[var(--bg-surface)] px-4">
      {/* Left section */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="h-9 w-9"
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Center section */}
      <div className="flex-1 flex justify-center">
        <span className="text-sm font-medium text-[var(--text-secondary)]">
          Untitled Project
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 min-w-[100px] justify-end">
        {/* Reserved for future elements like user menu, share button, etc. */}
      </div>
    </header>
  );
}