
import { getTaskById, getUsers } from "@/lib/data";
import { notFound } from "next/navigation";
import { TaskDetailsClient } from "./components/task-details-client";
import { getSession } from "@/lib/auth";

export default async function TaskDetailPage({ params }: { params: { id: string } }) {
  const task = await getTaskById(params.id);
  const users = await getUsers();
  const session = await getSession();

  if (!task || !session) {
    notFound();
  }
  
  return <TaskDetailsClient task={task} users={users} session={session} />;
}
