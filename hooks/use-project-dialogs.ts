"use client";

import { useState, useCallback } from "react";

export interface Project {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
  createdAt: string;
}

const initialProjects: Project[] = [
  { id: "1", name: "Website Redesign", slug: "website-redesign", isOwned: true, createdAt: "2024-01-15" },
  { id: "2", name: "Mobile App", slug: "mobile-app", isOwned: true, createdAt: "2024-02-20" },
  { id: "3", name: "API Gateway", slug: "api-gateway", isOwned: false, createdAt: "2024-03-10" },
];

export type DialogType = "create" | "rename" | "delete" | null;

export interface DialogState {
  type: DialogType;
  project: Project | null;
}

export interface FormState {
  name: string;
  slug: string;
}

export function useProjectDialogs() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [dialogState, setDialogState] = useState<DialogState>({
    type: null,
    project: null,
  });
  const [formState, setFormState] = useState<FormState>({
    name: "",
    slug: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const generateSlug = useCallback((name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }, []);

  const openCreateDialog = useCallback(() => {
    setDialogState({ type: "create", project: null });
    setFormState({ name: "", slug: "" });
  }, []);

  const openRenameDialog = useCallback((project: Project) => {
    setDialogState({ type: "rename", project });
    setFormState({ name: project.name, slug: project.slug });
  }, []);

  const openDeleteDialog = useCallback((project: Project) => {
    setDialogState({ type: "delete", project });
    setFormState({ name: "", slug: "" });
  }, []);

  const closeDialog = useCallback(() => {
    setDialogState({ type: null, project: null });
    setFormState({ name: "", slug: "" });
  }, []);

  const handleNameChange = useCallback((name: string) => {
    setFormState((prev) => ({
      name,
      slug: generateSlug(name),
    }));
  }, [generateSlug]);

  const handleCreateProject = useCallback(() => {
    if (!formState.name.trim()) return;

    setIsLoading(true);

    // Simulate async operation
    setTimeout(() => {
      const newProject: Project = {
        id: Date.now().toString(),
        name: formState.name.trim(),
        slug: formState.slug,
        isOwned: true,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setProjects((prev) => [newProject, ...prev]);
      setIsLoading(false);
      closeDialog();
    }, 300);
  }, [formState, closeDialog]);

  const handleRenameProject = useCallback(() => {
    if (!formState.name.trim() || !dialogState.project) return;

    setIsLoading(true);

    setTimeout(() => {
      setProjects((prev) =>
        prev.map((p) =>
          p.id === dialogState.project!.id
            ? {
                ...p,
                name: formState.name.trim(),
                slug: formState.slug,
              }
            : p
        )
      );
      setIsLoading(false);
      closeDialog();
    }, 300);
  }, [formState, dialogState, closeDialog]);

  const handleDeleteProject = useCallback(() => {
    if (!dialogState.project) return;

    setIsLoading(true);

    setTimeout(() => {
      setProjects((prev) =>
        prev.filter((p) => p.id !== dialogState.project!.id)
      );
      setIsLoading(false);
      closeDialog();
    }, 300);
  }, [dialogState, closeDialog]);

  return {
    // State
    projects,
    dialogState,
    formState,
    isLoading,

    // Actions
    openCreateDialog,
    openRenameDialog,
    openDeleteDialog,
    closeDialog,
    handleNameChange,
    handleCreateProject,
    handleRenameProject,
    handleDeleteProject,
  };
}