
'use client';

import { useState, useTransition } from 'react';
import { type Task, type User, type SessionUser, type Comment } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, Loader2 } from 'lucide-react';
import { getSuggestedAssignees } from '../actions';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TaskDetailsClientProps {
  task: Task;
  users: User[];
  session: SessionUser;
}

const getInitials = (name: string) => {
    const names = name.split(' ');
    return names.map((n) => n[0]).join('');
}

export function TaskDetailsClient({ task, users, session }: TaskDetailsClientProps) {
  const [isPending, startTransition] = useTransition();
  const [suggestions, setSuggestions] = useState<{ suggestedAssignees: string[]; reasoning: string } | null>(null);
  const [showSuggestionsDialog, setShowSuggestionsDialog] = useState(false);
  const { toast } = useToast();
  
  const assignee = users.find((user) => user.id === task.assigneeId);

  const handleSuggestAssignees = () => {
    startTransition(async () => {
      const result = await getSuggestedAssignees({
        taskDescription: task.description,
        pastHistory: 'No past history available for this task.',
        currentWorkload: 'All team members have a balanced workload.',
      });
      
      if (result.suggestedAssignees && result.reasoning) {
        setSuggestions(result);
        setShowSuggestionsDialog(true);
      } else {
        toast({
          variant: 'destructive',
          title: 'AI Suggestion Failed',
          description: 'Could not generate assignee suggestions at this time.',
        });
      }
    });
  };

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
                <div>
                    <Badge variant="outline">{task.id}</Badge>
                    <CardTitle className="mt-2 text-2xl md:text-3xl font-headline">{task.title}</CardTitle>
                </div>
                 <Button onClick={handleSuggestAssignees} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Lightbulb className="mr-2 h-4 w-4" />
                    )}
                    Suggest Assignees
                </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{task.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               {/* This would be populated by real data */}
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage src="https://picsum.photos/seed/user-2/40/40" data-ai-hint="avatar"/>
                        <AvatarFallback>LR</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                        <div className="flex items-center justify-between">
                            <p className="font-semibold">Liam Rodriguez</p>
                            <p className="text-xs text-muted-foreground">2 days ago</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                            This is a critical bug. Let's prioritize it for the next sprint.
                        </p>
                    </div>
                </div>
                 <Separator />
                <div className="flex items-start gap-4">
                    <Avatar>
                        <AvatarImage src={`https://picsum.photos/seed/${session.id}/40/40`} data-ai-hint="avatar"/>
                        <AvatarFallback>{getInitials(session.name)}</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                         <Textarea placeholder="Add a comment..." className="mb-2"/>
                         <Button size="sm">Post Comment</Button>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Assignee</span>
              <Select defaultValue={assignee?.id}>
                  <SelectTrigger className="w-[200px]">
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
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status</span>
              <Badge variant="outline">{task.status}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Priority</span>
              <Badge variant="outline" className="capitalize">{task.priority}</Badge>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Label</span>
              <Badge variant="outline" className="capitalize">{task.label}</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={showSuggestionsDialog} onOpenChange={setShowSuggestionsDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>AI Assignee Suggestions</AlertDialogTitle>
            <AlertDialogDescription>
              Based on the task details, here are some suggested assignees.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-4">
            <h4 className="font-semibold">Suggested Assignees:</h4>
            <ul className="list-disc list-inside space-y-1">
                {suggestions?.suggestedAssignees.map(name => <li key={name}>{name}</li>)}
            </ul>
             <h4 className="font-semibold pt-2">Reasoning:</h4>
             <p className="text-sm text-muted-foreground">{suggestions?.reasoning}</p>
          </div>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuggestionsDialog(false)}>Got it!</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
