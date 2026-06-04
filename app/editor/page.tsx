import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjects } from "@/lib/data";
import { EditorHomeClient } from "@/components/editor/editor-home-client";

export default async function EditorPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const projects = await getProjects();

  return <EditorHomeClient initialProjects={projects} />;
}