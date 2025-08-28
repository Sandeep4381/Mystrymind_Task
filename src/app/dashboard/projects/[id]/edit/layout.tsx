
import { getProjectById } from "@/lib/data";
import { notFound } from "next/navigation";
import EditProjectPage from "./page";


export default async function EditProjectLayout({
  params,
}: {
  params: { id: string };
}) {
  const project = await getProjectById(params.id);
  if (!project) {
    notFound();
  }

  return <EditProjectPage params={params} project={project} />;
}
