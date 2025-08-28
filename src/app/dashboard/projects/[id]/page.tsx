
import { getProjectById, getTasks, getUsers } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { TasksDataTable } from "../../tasks/components/data-table";
import { getSession } from "@/lib/auth";
import { type Project } from "@/lib/definitions";

export default async function ProjectDetailPage({ params }: { params: { id: string } }) {
  const project = await getProjectById(params.id);
  const session = await getSession();

  if (!project || !session) {
    notFound();
  }

  const allTasks = await getTasks();
  const allUsers = await getUsers();

  const projectTasks = allTasks.filter(task => task.projectId === project.id);
  const tasksWithProjectData = projectTasks.map(task => ({...task, project}));
  
  const isAdmin = session.role === "Admin" || session.role === "Super Admin";
  const userTasks = isAdmin ? tasksWithProjectData : tasksWithProjectData.filter(task => task.assigneeId === session.id);


  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-start justify-between">
            <div>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">{project.name}</h1>
                <p className="text-muted-foreground mt-1">{project.description}</p>
            </div>
             <Button asChild>
                <Link href={`/dashboard/tasks/new?projectId=${project.id}`}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Task to Project
                </Link>
            </Button>
        </CardHeader>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Tasks</CardTitle>
            <CardDescription>All tasks associated with the "{project.name}" project.</CardDescription>
        </CardHeader>
        <CardContent>
            <TasksDataTable tasks={userTasks} users={allUsers} session={session} />
        </CardContent>
      </Card>
    </div>
  );
}
