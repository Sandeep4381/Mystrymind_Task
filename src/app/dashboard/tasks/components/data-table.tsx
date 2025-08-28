
"use client";

import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Bug,
  CircleHelp,
  FileText,
  GanttChart,
  Circle,
  CircleCheck,
  CircleX,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Trash2,
  Loader2,
  Eye,
  Pencil
} from "lucide-react";
import { type Task, type User, type SessionUser, type Project } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { deleteTaskAction } from "../actions";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";


interface TasksDataTableProps {
  tasks: (Task & { project?: Project })[];
  users: User[];
  session: SessionUser;
}

const statusIcons = {
  Backlog: <CircleHelp className="h-4 w-4 text-muted-foreground" />,
  Todo: <Circle className="h-4 w-4 text-muted-foreground" />,
  "In Progress": <GanttChart className="h-4 w-4 text-yellow-500" />,
  Done: <CircleCheck className="h-4 w-4 text-green-500" />,
  Canceled: <CircleX className="h-4 w-4 text-red-500" />,
};

const priorityIcons = {
  low: <ArrowDown className="h-4 w-4 text-muted-foreground" />,
  medium: <ArrowRight className="h-4 w-4 text-muted-foreground" />,
  high: <ArrowUp className="h-4 w-4 text-muted-foreground" />,
};

const labelIcons = {
  bug: <Bug className="h-4 w-4" />,
  feature: <FileText className="h-4 w-4" />,
  documentation: <FileText className="h-4 w-4" />,
};

const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
}

export function TasksDataTable({ tasks, users, session }: TasksDataTableProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [taskToDelete, setTaskToDelete] = React.useState<Task | null>(null);

  const isAdmin = session.role === "Admin" || session.role === "Super Admin";

  const handleDelete = () => {
    if (!taskToDelete) return;
    startTransition(async () => {
        const result = await deleteTaskAction(taskToDelete.id);
        if (result.error) {
            toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: result.error,
            });
        } else {
            toast({
                title: 'Task Deleted',
                description: `Task "${taskToDelete.title}" has been deleted.`,
            });
        }
        setShowDeleteDialog(false);
        setTaskToDelete(null);
    });
  };

  return (
    <>
     <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length ? (
              tasks.map((task) => {
                const assignee = users.find((user) => user.id === task.assigneeId);
                return (
                  <TableRow
                    key={task.id}
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{task.title}</span>
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <Badge variant="outline" className="capitalize">{task.label}</Badge>
                           <span className="text-xs">{task.id}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {task.project ? (
                        <Link href={`/dashboard/projects/${task.projectId}`} className="hover:underline">
                          {task.project.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {statusIcons[task.status]}
                        <span>{task.status}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 capitalize">
                        {priorityIcons[task.priority]}
                        <span>{task.priority}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                       <Select defaultValue={assignee?.id} disabled={!isAdmin}>
                        <SelectTrigger className="w-[180px]">
                           <div className="flex items-center gap-2">
                               {assignee ? (
                                    <>
                                        <Avatar className="h-6 w-6">
                                            <AvatarImage src={`https://picsum.photos/seed/${assignee.id}/40/40`} alt={assignee.name} data-ai-hint="avatar" />
                                            <AvatarFallback>{getInitials(assignee.name)}</AvatarFallback>
                                        </Avatar>
                                        <SelectValue placeholder="Select assignee" />
                                    </>
                               ) : (
                                 <SelectValue placeholder="Unassigned" />
                               )}
                           </div>
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((user) => (
                            <SelectItem key={user.id} value={user.id}>
                               <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/40/40`} alt={user.name} data-ai-hint="avatar" />
                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                </Avatar>
                                <span>{user.name}</span>
                               </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-right">
                       <div className="flex justify-end gap-2">
                            <Button variant="outline" size="icon" onClick={() => router.push(`/dashboard/tasks/${task.id}`)}>
                                <Eye className="h-4 w-4"/>
                                <span className="sr-only">View Task</span>
                            </Button>
                            <Button variant="outline" size="icon" disabled={!isAdmin} onClick={() => router.push(`/dashboard/tasks/${task.id}/edit`)}>
                                <Pencil className="h-4 w-4"/>
                                <span className="sr-only">Edit Task</span>
                            </Button>
                            <Button 
                                variant="destructive" 
                                size="icon" 
                                disabled={!isAdmin}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setTaskToDelete(task);
                                    setShowDeleteDialog(true);
                                }}
                            >
                                <Trash2 className="h-4 w-4"/>
                                <span className="sr-only">Delete Task</span>
                            </Button>
                       </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
     </div>
     <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
            <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task
                "{taskToDelete?.title}".
            </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
                onClick={handleDelete}
                disabled={isPending}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Delete
            </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
     </AlertDialog>
    </>
  );
}
