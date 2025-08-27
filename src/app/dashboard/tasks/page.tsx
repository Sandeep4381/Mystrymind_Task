
import { getTasks, getUsers } from "@/lib/data";
import { TasksDataTable } from "./components/data-table";
import { getSession } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default async function TasksPage() {
  const tasks = await getTasks();
  const users = await getUsers();
  const session = await getSession();

  if (!session) return null;

  const isAdmin = session.role === "Admin" || session.role === "Super Admin";
  const userTasks = isAdmin ? tasks : tasks.filter(task => task.assigneeId === session.id);

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Tasks</h1>
           <p className="text-muted-foreground">
             {isAdmin ? "Here's a list of all tasks in the system." : "Here are the tasks assigned to you."}
           </p>
         </div>
         {isAdmin && (
            <Button asChild>
                <Link href="/dashboard/tasks/new">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task
                </Link>
            </Button>
         )}
       </div>
       <TasksDataTable tasks={userTasks} users={users} session={session}/>
    </div>
  );
}
