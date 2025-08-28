
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { getTasks, writeJSONFile, getUserById, getProjectById } from '@/lib/data';
import { type Task } from '@/lib/definitions';
import path from 'path';
import { sendTaskAssignmentEmail } from '@/lib/email';
import { getSession } from '@/lib/auth';

const tasksFilePath = path.join(process.cwd(), 'data/tasks.json');

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  status: z.enum(['Backlog', 'Todo', 'In Progress', 'Done', 'Canceled']),
  label: z.enum(['bug', 'feature', 'documentation']),
  priority: z.enum(['low', 'medium', 'high']),
  assigneeId: z.string().nullable(),
  projectId: z.string({ required_error: 'Project is required.' }).min(1, 'Project is required.'),
});

export async function createTask(values: z.infer<typeof taskFormSchema>) {
  const session = await getSession();

  if (!session) {
    return { error: 'You must be logged in to create a task.' };
  }

  const parsedTask = taskFormSchema.safeParse(values);
  if (!parsedTask.success) {
    return { error: 'Invalid task data provided.' };
  }

  const projectId = parsedTask.data.projectId;

  try {
    const tasks = await getTasks();

    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...parsedTask.data,
    };

    tasks.push(newTask);
    await writeJSONFile(tasksFilePath, tasks);

    if (newTask.assigneeId) {
      const assignedUser = await getUserById(newTask.assigneeId);
      const project = await getProjectById(projectId);

      if (assignedUser && assignedUser.email) {
        await sendTaskAssignmentEmail({
          to: assignedUser.email,
          assigneeName: assignedUser.name,
          taskTitle: newTask.title,
          projectName: project?.name || 'No Project',
          assignedByName: session.name,
          taskId: newTask.id,
        });
      }
    }
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('SMTP')) {
      return { error: `Failed to send notification email. Please check your SMTP settings in the .env file. [${error.message}]` };
    }
    return { error: 'Failed to create task.' };
  }

  revalidatePath('/dashboard/tasks');
  revalidatePath(`/dashboard/projects/${projectId}`);
  redirect(`/dashboard/projects/${projectId}`);
}
