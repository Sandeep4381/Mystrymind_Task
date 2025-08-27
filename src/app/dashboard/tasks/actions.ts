
'use server';

import { revalidatePath } from 'next/cache';
import { deleteTask } from '@/lib/data';

export async function deleteTaskAction(taskId: string) {
    try {
        await deleteTask(taskId);
        revalidatePath('/dashboard/tasks');
        return { success: 'Task deleted successfully.' };
    } catch (error) {
        console.error('Failed to delete task:', error);
        return { error: 'Failed to delete task.' };
    }
}
