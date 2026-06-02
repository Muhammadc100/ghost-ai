"use client";

import { useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Project, DialogState, FormState } from "@/hooks/use-project-dialogs";

interface ProjectDialogsProps {
  children: React.ReactNode;
  dialogState: DialogState;
  formState: FormState;
  isLoading: boolean;
  onCloseDialog: () => void;
  onNameChange: (name: string) => void;
  onCreateProject: () => void;
  onRenameProject: () => void;
  onDeleteProject: () => void;
}

export function ProjectDialogs({
  children,
  dialogState,
  formState,
  isLoading,
  onCloseDialog,
  onNameChange,
  onCreateProject,
  onRenameProject,
  onDeleteProject,
}: ProjectDialogsProps) {
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dialogState.type === "rename" && nameInputRef.current) {
      nameInputRef.current.focus();
      nameInputRef.current.select();
    }
  }, [dialogState.type]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      dialogState.type === "rename" &&
      !isLoading &&
      formState.name.trim() &&
      formState.name.trim() !== dialogState.project?.name?.trim()
    ) {
      onRenameProject();
    }
  };

  return (
    <>
      {/* Create Project Dialog */}
      <Dialog open={dialogState.type === "create"} onOpenChange={(open) => !open && onCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Enter a name for your new project.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="project-name" className="text-sm font-medium text-text-primary">
                Project Name
              </label>
              <Input
                id="project-name"
                placeholder="My New Project"
                value={formState.name}
                onChange={(e) => onNameChange(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text-muted">Slug Preview</div>
              <div className="text-sm text-text-secondary font-mono bg-bg-subtle px-3 py-2 rounded-md">
                {formState.slug || "project-slug"}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onCreateProject}
              disabled={!formState.name.trim() || isLoading}
            >
              {isLoading ? "Creating..." : "Create Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Project Dialog */}
      <Dialog open={dialogState.type === "rename"} onOpenChange={(open) => !open && onCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Project</DialogTitle>
            <DialogDescription>
              Current name: {dialogState.project?.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="rename-name" className="text-sm font-medium text-text-primary">
                New Name
              </label>
              <Input
                id="rename-name"
                ref={nameInputRef}
                placeholder="Project Name"
                value={formState.name}
                onChange={(e) => onNameChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium text-text-muted">Slug Preview</div>
              <div className="text-sm text-text-secondary font-mono bg-bg-subtle px-3 py-2 rounded-md">
                {formState.slug || "project-slug"}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={onRenameProject}
              disabled={!formState.name.trim() || isLoading}
            >
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Project Dialog */}
      <Dialog open={dialogState.type === "delete"} onOpenChange={(open) => !open && onCloseDialog()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Project</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &quot;{dialogState.project?.name}&quot;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter>
            <Button variant="outline" onClick={onCloseDialog}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={onDeleteProject}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Delete Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {children}
    </>
  );
}