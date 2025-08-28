
'use server';

import { revalidatePath } from 'next/cache';
import { getUsers, getTasks } from '@/lib/data';
import { getSession } from '@/lib/auth';

export async function deleteUserAction(userId: string) {
    const session = await getSession();
    if (!session) {
        return { error: 'Authentication required.' };
    }

    if (session.id === userId) {
        return { error: 'You cannot delete your own account.' };
    }

    try {
        const users = await getUsers();
        const userToDelete = users.find(u => u.id === userId);

        if (!userToDelete) {
            return { error: 'User not found.' };
        }
        
        // Authorization check
        if (session.role === 'Admin' && userToDelete.role !== 'User') {
            return { error: 'Admins can only delete users with the "User" role.' };
        }
         if (session.role !== 'Super Admin' && session.role !== 'Admin') {
            return { error: 'You do not have permission to delete users.' };
        }

        const updatedUsers = users.filter(user => user.id !== userId);
        
        // This will now write to Redis via the data library
        const { writeJSONFile } = await import('@/lib/data');
        await writeJSONFile('users.json', updatedUsers);


        // Unassign tasks from the deleted user
        const tasks = await getTasks();
        const updatedTasks = tasks.map(task => {
            if (task.assigneeId === userId) {
                return { ...task, assigneeId: null };
            }
            return task;
        });
        await writeJSONFile('tasks.json', updatedTasks);

    } catch (error) {
        console.error('Failed to delete user:', error);
        return { error: 'Failed to delete user.' };
    }

    revalidatePath('/dashboard/users');
    revalidatePath('/dashboard/tasks');
    return { success: 'User deleted successfully.' };
}
