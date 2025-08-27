
import { getProjects } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { type Project } from "@/lib/definitions";

export default async function ProjectsPage() {
    const projects = await getProjects();

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
                        <Card key={project.id}>
                            <CardHeader>
                                <CardTitle>{project.name}</CardTitle>
                                <CardDescription>{project.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Button asChild variant="secondary" className="w-full">
                                    <Link href={`/dashboard/projects/${project.id}`}>
                                        View Project
                                    </Link>
                                </Button>
                            </CardContent>
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
