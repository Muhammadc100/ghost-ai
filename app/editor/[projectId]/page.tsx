import { redirect } from "next/navigation"
import { AccessDenied } from "@/components/editor/access-denied"
import { EditorWorkspaceClient } from "@/components/editor/editor-workspace-client"
import { getProjectsForUser } from "@/lib/projects"
import {
  getAccessibleProject,
  getCurrentProjectIdentity,
} from "@/lib/project-access"

export default async function EditorWorkspacePage(
  props: { params: Promise<{ projectId: string }> }
) {
  const identity = await getCurrentProjectIdentity()

  if (!identity.userId) redirect("/sign-in")

  const { projectId } = await props.params
  const project = await getAccessibleProject(projectId, identity)

  if (!project) {
    return <AccessDenied />
  }

  const { owned, shared } = await getProjectsForUser(
    identity.userId,
    identity.primaryEmailAddress ?? ""
  )

  const isCurrentProjectOwned =
    owned.some((item) => item.id === project.id) || project.ownerId === identity.userId

  const formatTimestamp = (value: Date | string | null | undefined) => {
    if (value instanceof Date) {
      return value.toISOString()
    }

    return value ?? ""
  }

  return (
    <EditorWorkspaceClient
      currentProject={{
        id: project.id,
        name: project.name,
        slug: project.name.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, ""),
        isOwned: isCurrentProjectOwned,
        createdAt: formatTimestamp(project.createdAt),
        updatedAt: formatTimestamp(project.updatedAt),
      }}
      ownedProjects={owned.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.name.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, ""),
        isOwned: true,
        createdAt: formatTimestamp(item.createdAt),
        updatedAt: formatTimestamp(item.updatedAt),
      }))}
      sharedProjects={shared.map((item) => ({
        id: item.id,
        name: item.name,
        slug: item.name.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, ""),
        isOwned: false,
        createdAt: formatTimestamp(item.createdAt),
        updatedAt: formatTimestamp(item.updatedAt),
      }))}
    />
  )
}