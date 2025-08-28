
'use server';

import { revalidatePath } from 'next/cache';
import { deleteProject } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function deleteProjectAction(projectId: string) {
    const session = await getSession();
    if (!session) {
        return { error: 'Authentication required.' };
    }

    try {
        await deleteProject(projectId);
    } catch (error) {
        console.error('Failed to delete project:', error);
        return { error: 'Failed to delete project.' };
    }

    revalidatePath('/dashboard/projects');
    redirect('/dashboard/projects');
}
