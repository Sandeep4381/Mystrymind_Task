
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getTasks, writeJSONFile } from '@/lib/data';
import { type Task } from '@/lib/definitions';
import path from 'path';

const tasksFilePath = path.join(process.cwd(), 'data/tasks.json');

export const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']),
  label: z.enum(['bug', 'feature', 'documentation']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string().nullable(),
});


export async function createTask(values: z.infer<typeof taskFormSchema>) {
  const parsedTask = taskFormSchema.safeParse(values);

  if (!parsedTask.success) {
    return { error: 'Invalid task data provided.' };
  }

  try {
    const tasks = await getTasks();
    const newTask: Task = {
        id: `task-${Date.now()}`,
        ...parsedTask.data,
    };
    tasks.push(newTask);
    await writeJSONFile(tasksFilePath, tasks);

  } catch (error) {
    console.error(error);
    return { error: 'Failed to create task.' };
  }

  revalidatePath('/dashboard/tasks');
  redirect('/dashboard/tasks');
}
