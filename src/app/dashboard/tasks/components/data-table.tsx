
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  MoreHorizontal,
} from "lucide-react";
import { type Task, type User, type SessionUser } from "@/lib/definitions";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface TasksDataTableProps {
  tasks: Task[];
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
  const isAdmin = session.role === "Admin" || session.role === "Super Admin";

  return (
     <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              {isAdmin && <TableHead className="text-right">Actions</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.length ? (
              tasks.map((task) => {
                const assignee = users.find((user) => user.id === task.assigneeId);
                return (
                  <TableRow
                    key={task.id}
                    className="cursor-pointer"
                    onClick={() => router.push(`/dashboard/tasks/${task.id}`)}
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
                    <TableCell onClick={(e) => e.stopPropagation()}>
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
                    {isAdmin && (
                        <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                           <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                        <MoreHorizontal className="h-4 w-4" />
                                        <span className="sr-only">Task Actions</span>
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuItem>Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                           </DropdownMenu>
                        </TableCell>
                    )}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={isAdmin ? 5: 4} className="h-24 text-center">
                  No tasks found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
     </div>
  );
}
