
import { getUsers, getProjects } from "@/lib/data";
import { NewTaskForm } from "./components/new-task-form";

export default async function NewTaskPage({
  searchParams,
}: {
  searchParams: { projectId?: string };
}) {
  const users = await getUsers();
  const projects = await getProjects();
  const projectId = searchParams.projectId;

  return <NewTaskForm users={users} projects={projects} projectId={projectId} />;
}
