
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { updateProject } from '@/lib/data';
import { getSession } from '@/lib/auth';

const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
});


export async function updateProjectAction(projectId: string, values: z.infer<typeof projectFormSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to update a project.' };
  }
  
  const parsedProject = projectFormSchema.safeParse(values);

  if (!parsedProject.success) {
    return { error: 'Invalid project data provided.' };
  }

  try {
    await updateProject(projectId, parsedProject.data);

  } catch (error) {
    console.error(error);
    return { error: 'Failed to update project.' };
  }

  revalidatePath('/dashboard/projects');
  revalidatePath(`/dashboard/projects/${projectId}`);
  return { success: true };
}
