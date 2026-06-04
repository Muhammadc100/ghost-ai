"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Project } from "@/hooks/use-project-actions";

interface ProjectSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onNewProject: () => void;
  onRenameProject: (project: Project) => void;
  onDeleteProject: (project: Project) => void;
}

export function ProjectSidebar({
  isOpen,
  onClose,
  projects,
  onNewProject,
  onRenameProject,
  onDeleteProject,
}: ProjectSidebarProps) {
  const [activeTab, setActiveTab] = useState("my-projects");
  const [hoveredProject, setHoveredProject] = useState<string | null>(null);

  const myProjects = projects.filter((p) => p.isOwned);
  const sharedProjects = projects.filter((p) => !p.isOwned);

  const handleBackdropClick = () => {
    onClose();
  };

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={handleBackdropClick}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 z-50 flex flex-col bg-bg-surface border-r border-border-default transition-transform duration-200 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border-default">
          <span className="text-sm font-medium text-text-primary">Projects</span>
          <Button variant="ghost" size="icon-sm" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden p-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full">
              <TabsTrigger value="my-projects" className="flex-1">
                My Projects
              </TabsTrigger>
              <TabsTrigger value="shared" className="flex-1">
                Shared
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="my-projects"
              className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto -mx-1 px-1"
            >
              {myProjects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-text-muted">No projects yet.</p>
                </div>
              ) : (
                myProjects.map((project) => (
                  <div
                    key={project.id}
                    className="group flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-bg-subtle cursor-pointer"
                  >
                    <span className="text-sm text-text-primary truncate">
                      {project.name}
                    </span>
                    <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onRenameProject(project);
                        }}
                      >
                        <Pencil className="h-3 w-3" />
                        <span className="sr-only">Rename {project.name}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteProject(project);
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="sr-only">Delete {project.name}</span>
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </TabsContent>

            <TabsContent
              value="shared"
              className="flex-1 flex flex-col gap-1 mt-2 overflow-y-auto -mx-1 px-1"
            >
              {sharedProjects.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-sm text-text-muted">No shared projects.</p>
                </div>
              ) : (
                sharedProjects.map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-bg-subtle"
                  >
                    <span className="text-sm text-text-primary truncate">
                      {project.name}
                    </span>
                  </div>
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="shrink-0 p-3 border-t border-border-default">
          <Button
            variant="default"
            size="default"
            className="w-full gap-2"
            onClick={onNewProject}
          >
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </aside>
    </>
  );
}