
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateTask, getTaskById } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { type Task } from '@/lib/definitions';
import { redirect } from 'next/navigation';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']),
  label: z.enum(['bug', 'feature', 'documentation']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string().nullable(),
  projectId: z.string().min(1, 'Project is required.'),
});


export async function updateTaskAction(taskId: string, values: z.infer<typeof taskFormSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to update a task.' };
  }
  
  const parsedTask = taskFormSchema.safeParse(values);

  if (!parsedTask.success) {
    return { error: 'Invalid task data provided.' };
  }

  try {
    const existingTask = await getTaskById(taskId);
    if (!existingTask) {
        return { error: 'Task not found.' };
    }

    const updatedTaskData: Task = {
        ...existingTask,
        ...parsedTask.data,
    };

    await updateTask(taskId, updatedTaskData);

  } catch (error) {
    console.error(error);
    return { error: 'Failed to update task.' };
  }

  revalidatePath('/dashboard/tasks');
  revalidatePath(`/dashboard/tasks/${taskId}`);
  revalidatePath(`/dashboard/projects/${parsedTask.data.projectId}`);
  redirect(`/dashboard/tasks/${taskId}`);
}
