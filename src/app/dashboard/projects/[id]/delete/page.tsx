
'use client';

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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { type Project } from '@/lib/definitions';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { deleteProjectAction } from './actions';
import { Loader2 } from 'lucide-react';

interface DeleteProjectPageProps {
    project: Project;
}

export default function DeleteProjectPage({ project }: DeleteProjectPageProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setIsOpen(false);
      // Delay to allow the dialog to close before navigating
      setTimeout(() => router.back(), 150);
    } else {
        setIsOpen(true);
    }
  };

  const handleDelete = () => {
    startTransition(async () => {
        const result = await deleteProjectAction(project.id);
        if (result.error) {
             toast({
                variant: 'destructive',
                title: 'Deletion Failed',
                description: result.error,
            });
            handleOpenChange(false);
        } else {
             toast({
                title: 'Project Deleted',
                description: `Project "${project.name}" and all its tasks have been deleted.`,
            });
            // The action will redirect
        }
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the project
            <span className="font-semibold"> {project.name}</span> and all of its associated tasks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isPending}
            asChild
          >
            <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
             {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete Project
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
