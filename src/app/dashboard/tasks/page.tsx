
import { getTasks, getUsers } from "@/lib/data";
import { TasksDataTable } from "./components/data-table";
import { getSession } from "@/lib/auth";

export default async function TasksPage() {
  const tasks = await getTasks();
  const users = await getUsers();
  const session = await getSession();

  const userTasks = session?.role === 'User' ? tasks.filter(task => task.assigneeId === session.id) : tasks;

  return (
    <div className="space-y-6">
       <div>
         <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Tasks</h1>
         <p className="text-muted-foreground">
           Here's a list of all tasks in the system.
         </p>
       </div>
       <TasksDataTable tasks={userTasks} users={users} />
    </div>
  );
}
