
import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import DeleteProjectPage from "./page";

export default async function DeleteProjectLayout({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);

  if (!project) {
    notFound();
  }

  return <DeleteProjectPage project={project} />;
}
