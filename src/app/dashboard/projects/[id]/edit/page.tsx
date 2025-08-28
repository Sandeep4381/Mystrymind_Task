
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useTransition, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { updateProjectAction } from './actions';
import { useRouter } from 'next/navigation';
import { type Project } from '@/lib/definitions';

const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
});

interface EditProjectPageProps {
  params: { id: string };
  project: Project;
}

export default function EditProjectPage({ params, project }: EditProjectPageProps) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof projectFormSchema>>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
        name: project.name,
        description: project.description || '',
    },
  });

  useEffect(() => {
    form.reset({
        name: project.name,
        description: project.description || '',
    });
  }, [project, form]);


  async function onSubmit(values: z.infer<typeof projectFormSchema>) {
    startTransition(async () => {
      const result = await updateProjectAction(project.id, values);
       if (result?.error) {
        toast({
          variant: 'destructive',
          title: 'Project Update Failed',
          description: result.error,
        });
      } else {
        toast({
          title: 'Project Updated',
          description: 'The project has been successfully updated.',
        });
        router.push('/dashboard/projects');
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Project</CardTitle>
        <CardDescription>Update the details of your project below.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Describe the project" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end pt-2 gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
