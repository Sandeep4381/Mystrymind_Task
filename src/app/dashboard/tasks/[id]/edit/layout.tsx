
import { getTaskById, getUsers, getProjects } from "@/lib/data";
import { notFound } from "next/navigation";
import EditTaskPage from "./page";


export default async function EditTaskLayout({
  params,
}: {
  params: { id: string };
}) {
  const task = await getTaskById(params.id);
  if (!task) {
    notFound();
  }

  const users = await getUsers();
  const projects = await getProjects();

  return <EditTaskPage task={task} users={users} projects={projects} />;
}
