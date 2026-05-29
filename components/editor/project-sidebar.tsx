"use client";

import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ isOpen, onClose }: ProjectSidebarProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col border-r border-border-default bg-[var(--bg-surface)] transition-transform duration-300 ease-out",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex h-14 items-center justify-between px-4 border-b border-border-default">
          <h2 className="text-base font-semibold text-[var(--text-primary)]">
            Projects
          </h2>
          <Button
            variant="ghost"
            size="icon-xs"
            onClick={onClose}
            className="h-7 w-7"
            aria-label="Close projects"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="my-projects" className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4 mt-3">
            <TabsTrigger value="my-projects" className="flex-1">
              My Projects
            </TabsTrigger>
            <TabsTrigger value="shared" className="flex-1">
              Shared
            </TabsTrigger>
          </TabsList>

          <TabsContent value="my-projects" className="flex-1 m-0 p-4">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-[var(--text-muted)]">
                No projects yet
              </p>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Create your first project to get started
              </p>
            </div>
          </TabsContent>

          <TabsContent value="shared" className="flex-1 m-0 p-4">
            <div className="flex flex-col items-center justify-center h-full text-center">
              <p className="text-sm text-[var(--text-muted)]">
                No shared projects
              </p>
              <p className="text-xs text-[var(--text-faint)] mt-1">
                Projects shared with you will appear here
              </p>
            </div>
          </TabsContent>
        </Tabs>

        {/* New Project Button */}
        <div className="p-4 border-t border-border-default">
          <Button className="w-full" size="sm">
            <Plus className="h-4 w-4 mr-1.5" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}