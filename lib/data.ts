import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export interface ProjectData {
  id: string;
  name: string;
  slug: string;
  isOwned: boolean;
  createdAt: string;
  updatedAt: string;
}

export async function getProjects(): Promise<ProjectData[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

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
  });

  // Map to ProjectData with isOwned: true
  const owned: ProjectData[] = ownedProjects.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.name.toLowerCase().replace(/[\s\W-]+/g, "-").replace(/^-+|-+$/g, ""),
    isOwned: true,
    createdAt: p.createdAt.toISOString(),
    updatedAt: p.updatedAt.toISOString(),
  }));

  // TODO: Fetch shared projects when we have user email mapping
  // For now, return only owned projects
  return owned;
}