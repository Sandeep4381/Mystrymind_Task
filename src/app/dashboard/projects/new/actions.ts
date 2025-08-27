
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { addProject } from '@/lib/data';
import path from 'path';

const projectFormSchema = z.object({
  name: z.string().min(1, 'Project name is required.'),
  description: z.string().optional(),
});


export async function createProject(values: z.infer<typeof projectFormSchema>) {
  const parsedProject = projectFormSchema.safeParse(values);

  if (!parsedProject.success) {
    return { error: 'Invalid project data provided.' };
  }

  try {
    await addProject(parsedProject.data);

  } catch (error) {
    console.error(error);
    return { error: 'Failed to create project.' };
  }

  revalidatePath('/dashboard/projects');
  redirect('/dashboard/projects');
}
