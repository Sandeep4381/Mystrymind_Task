
import { getUsers } from "@/lib/data";
import { NewTaskForm } from "./components/new-task-form";

export default async function NewTaskPage() {
  const users = await getUsers();

  return <NewTaskForm users={users} />;
}
