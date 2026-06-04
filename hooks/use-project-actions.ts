"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Project extends ProjectData {
  isOwned: boolean;
}

const initialProjects: Project[] = [
  { id: "1", name: "Website Redesign", slug: "website-redesign", isOwned: true, createdAt: "2024-01-15", updatedAt: "2024-01-15" },
  { id: "2", name: "Mobile App", slug: "mobile-app", isOwned: true, createdAt: "2024-02-20", updatedAt: "2024-02-20" },
  { id: "3", name: "API Gateway", slug: "api-gateway", isOwned: false, createdAt: "2024-03-10", updatedAt: "2024-03-10" },
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

export function useProjectActions(initialProjects: ProjectData[] = []) {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>(
    initialProjects.length > 0
      ? initialProjects.map((p) => ({ ...p, isOwned: p.isOwned }))
      : initialProjects
  );
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
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, "-")
      .replace(/^-+|-+$/g, "");
    // Add short unique suffix
    const suffix = Math.random().toString(36).substring(2, 6);
    return slug ? `${slug}-${suffix}` : suffix;
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

  const refreshProjects = useCallback(async () => {
    try {
      const response = await fetch("/api/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(
          data.map((p: ProjectData) => ({
            ...p,
            isOwned: true,
          }))
        );
      }
    } catch (error) {
      console.error("Failed to refresh projects:", error);
    }
  }, []);

  const handleCreateProject = useCallback(async () => {
    if (!formState.name.trim()) return;

    setIsLoading(true);

    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to create project:", error);
        setIsLoading(false);
        return;
      }

      const newProject = await response.json();

      // Add to local state
      const projectWithMeta: Project = {
        id: newProject.id,
        name: newProject.name,
        slug: generateSlug(newProject.name),
        isOwned: true,
        createdAt: newProject.createdAt,
        updatedAt: newProject.updatedAt,
      };

      setProjects((prev) => [projectWithMeta, ...prev]);
      closeDialog();

      // Navigate to the new workspace
      router.push(`/editor/${newProject.id}`);
    } catch (error) {
      console.error("Failed to create project:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, generateSlug, closeDialog, router]);

  const handleRenameProject = useCallback(async () => {
    if (!formState.name.trim() || !dialogState.project) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${dialogState.project.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: formState.name.trim() }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to rename project:", error);
        setIsLoading(false);
        return;
      }

      const updated = await response.json();

      setProjects((prev) =>
        prev.map((p) =>
          p.id === dialogState.project!.id
            ? {
                ...p,
                name: updated.name,
                slug: generateSlug(updated.name),
              }
            : p
        )
      );
      closeDialog();
    } catch (error) {
      console.error("Failed to rename project:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dialogState, generateSlug, closeDialog]);

  const handleDeleteProject = useCallback(async () => {
    if (!dialogState.project) return;

    setIsLoading(true);

    try {
      const response = await fetch(`/api/projects/${dialogState.project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to delete project:", error);
        setIsLoading(false);
        return;
      }

      const wasDeleted = dialogState.project.id;

      setProjects((prev) =>
        prev.filter((p) => p.id !== wasDeleted)
      );
      closeDialog();

      // Redirect to /editor if we deleted the active workspace
      // Check if current path matches the deleted project
      const currentPath = window.location.pathname;
      if (currentPath === `/editor/${wasDeleted}`) {
        router.push("/editor");
      }
    } catch (error) {
      console.error("Failed to delete project:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dialogState, closeDialog, router]);

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
    refreshProjects,
  };
}