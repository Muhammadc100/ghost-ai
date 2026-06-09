import { redirect } from "next/navigation"
import { getProjectsForUser } from "@/lib/projects"
import { getCurrentProjectIdentity } from "@/lib/project-access"
import { EditorHomeClient } from "@/components/editor/editor-home-client"

export default async function EditorPage() {
  const identity = await getCurrentProjectIdentity()
  if (!identity.userId) redirect("/sign-in")

  const { owned, shared } = await getProjectsForUser(
    identity.userId,
    identity.primaryEmailAddress ?? ""
  )

  // Combine owned and shared projects, marking owned ones
  const allProjects = [
    ...owned.map((p) => ({ ...p, isOwned: true as const })),
    ...shared.map((p) => ({ ...p, isOwned: false as const })),
  ]

  return (
    <EditorHomeClient
      initialProjects={allProjects.map((p) => {
        const slugBase = p.name
          .toLowerCase()
          .replace(/[\s\W-]+/g, "-")
          .replace(/^-+|-+$/g, "")

        return {
          id: p.id,
          name: p.name,
          slug: slugBase || `default-${p.id}`,
          isOwned: p.isOwned,
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        }
      })}
    />
  )
}