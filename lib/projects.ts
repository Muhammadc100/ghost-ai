import { prisma } from "@/lib/prisma"
import { normalizeCollaboratorEmail } from "@/lib/project-collaborators"

export interface ProjectForUser {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ProjectsForUserResult {
  owned: ProjectForUser[]
  shared: ProjectForUser[]
}

export async function getProjectsForUser(
  userId: string,
  email: string
): Promise<ProjectsForUserResult> {
  const normalizedEmail = normalizeCollaboratorEmail(email)

  // Fetch owned projects
  const ownedProjects = await prisma.project.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  // Fetch shared projects where user is a collaborator
  const sharedProjects = await prisma.project.findMany({
    where: {
      collaborators: {
        some: {
          email: {
            equals: normalizedEmail,
            mode: "insensitive",
          },
        },
      },
    },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      name: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return {
    owned: ownedProjects,
    shared: sharedProjects,
  }
}