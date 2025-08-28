
import { getTasks, getUsers, getProjects } from "@/lib/data";
import { TasksDataTable } from "./components/data-table";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { type Task, type Project } from "@/lib/definitions";

export default async function TasksPage() {
  const allTasks = await getTasks();
  const allUsers = await getUsers();
  const allProjects = await getProjects();
  const session = await getSession();

  if (!session) return null;

  const projectMap = new Map(allProjects.map(p => [p.id, p]));

  const tasksWithProjects = allTasks.map(task => ({
    ...task,
    project: projectMap.get(task.projectId),
  }));

  const isAdmin = session.role === "Admin" || session.role === "Super Admin";
  const userTasks = isAdmin ? tasksWithProjects : tasksWithProjects.filter(task => task.assigneeId === session.id);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Tasks</h1>
           <p className="text-muted-foreground">
             {isAdmin ? "Here's a list of all tasks in the system." : "Here are the tasks assigned to you."}
           </p>
         </div>
       </div>
       <TasksDataTable tasks={userTasks} users={allUsers} session={session}/>
    </div>
  );
}
