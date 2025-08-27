
import { getUsers, getProjects } from "@/lib/data";
import { NewTaskForm } from "./components/new-task-form";

export default async function NewTaskPage() {
  const users = await getUsers();
  const projects = await getProjects();

  return <NewTaskForm users={users} projects={projects} />;
}
