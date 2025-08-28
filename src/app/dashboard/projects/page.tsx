
import { getProjects, getUsers } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle, Eye, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { type Project } from "@/lib/definitions";
import { format } from "date-fns";
import { getSession } from "@/lib/auth";
import { notFound } from "next/navigation";

export default async function ProjectsPage() {
    const projects = await getProjects();
    const users = await getUsers();
    const session = await getSession();

    if (!session) {
        notFound();
    }

    const userMap = new Map(users.map(u => [u.id, u.name]));

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Projects</h1>
                    <p className="text-muted-foreground">
                        Manage all your projects in one place.
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/projects/new">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Project
                    </Link>
                </Button>
            </div>
            
            {projects.length > 0 ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project: Project) => (
                        <Card key={project.id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-2">
                               <p className="text-sm text-muted-foreground">
                                 Created by: {userMap.get(project.createdById) ?? 'Unknown User'}
                               </p>
                               <p className="text-sm text-muted-foreground">
                                 Created on: {format(new Date(project.createdAt), 'PPP')}
                               </p>
                               {project.completedAt && (
                                <p className="text-sm text-muted-foreground">
                                    Completed on: {format(new Date(project.completedAt), 'PPP')}
                                 </p>
                               )}
                            </CardContent>
                             <CardFooter className="flex justify-end gap-2">
                                <Button asChild variant="outline" size="icon">
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        <Eye className="h-4 w-4" />
                                        <span className="sr-only">View Project</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="outline" size="icon">
                                    <Link href={`/dashboard/projects/${project.id}/edit`}>
                                        <Pencil className="h-4 w-4" />
                                        <span className="sr-only">Edit Project</span>
                                    </Link>
                                </Button>
                                <Button asChild variant="destructive" size="icon">
                                    <Link href={`/dashboard/projects/${project.id}/delete`}>
                                        <Trash2 className="h-4 w-4" />
                                         <span className="sr-only">Delete Project</span>
                                    </Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-12 text-center">
                    <h3 className="text-lg font-semibold">No projects yet</h3>
                    <p className="text-sm text-muted-foreground mt-2 mb-4">
                        Get started by creating a new project.
                    </p>
                    <Button asChild>
                         <Link href="/dashboard/projects/new">
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Project
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    );
}
