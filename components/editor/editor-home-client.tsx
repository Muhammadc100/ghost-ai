"use client";

import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { EditorNavbar } from "@/components/editor/editor-navbar";
import { ProjectSidebar } from "@/components/editor/project-sidebar";
import { ProjectDialogs } from "@/components/editor/project-dialogs";
import { Button } from "@/components/ui/button";
import { useProjectActions, ProjectData } from "@/hooks/use-project-actions";

interface EditorHomeClientProps {
  initialProjects: ProjectData[];
}

function EditorHome({ onNewProject, isLoading }: { onNewProject: () => void; isLoading: boolean }) {
  return (
    <main className="pt-14 min-h-screen flex flex-col items-center justify-center p-8">
      <div className="text-center space-y-4 max-w-full">
        <h1 className="text-2xl font-heading font-semibold text-text-primary">
          Create a project or open an existing one
        </h1>
        <p className="text-text-secondary">
          Start a new architecture workspace, or choose a project from the sidebar.
        </p>
        <Button
          variant="default"
          size="default"
          onClick={onNewProject}
          className="gap-2"
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          New Project
        </Button>
      </div>
    </main>
  );
}

export function EditorHomeClient({ initialProjects }: EditorHomeClientProps) {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const {
    projects,
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    dialogState,
    formState,
    isLoading,
    closeDialog,
    handleNameChange,
    handleCreateProject,
    handleRenameProject,
    handleDeleteProject,
  } = useProjectActions(initialProjects);

  // Split projects into owned and shared
  const ownedProjects = projects.filter((p) => p.isOwned);
  const sharedProjects = projects.filter((p) => !p.isOwned);

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen">
      <EditorNavbar
        isOpen={isSidebarOpen}
        onToggle={handleToggleSidebar}
      />

      <ProjectDialogs
        dialogState={dialogState}
        formState={formState}
        isLoading={isLoading}
        onCloseDialog={closeDialog}
        onNameChange={handleNameChange}
        onCreateProject={handleCreateProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
      >
        <ProjectSidebar
          isOpen={isSidebarOpen}
          onClose={handleCloseSidebar}
          ownedProjects={ownedProjects}
          sharedProjects={sharedProjects}
          onNewProject={openCreateDialog}
          onRename={openRenameDialog}
          onDelete={openDeleteDialog}
        />

        <EditorHome onNewProject={openCreateDialog} isLoading={isLoading} />
      </ProjectDialogs>
    </div>
  );
}