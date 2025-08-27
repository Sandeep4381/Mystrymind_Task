
'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { getUsers, writeJSONFile, getUserByEmail } from '@/lib/data';
import { getSession } from '@/lib/auth';
import { type User } from '@/lib/definitions';
import path from 'path';

const usersFilePath = path.join(process.cwd(), 'data/users.json');

const profileFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  mobile: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters.').optional().or(z.literal('')),
  confirmPassword: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});


export async function updateProfile(values: z.infer<typeof profileFormSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to update your profile.' };
  }

  const parsedProfile = profileFormSchema.safeParse(values);

  if (!parsedProfile.success) {
    console.log(parsedProfile.error.flatten().fieldErrors)
    return { error: 'Invalid profile data provided.' };
  }

  const { name, email, mobile, password } = parsedProfile.data;

  try {
    const users = await getUsers();
    const userIndex = users.findIndex(u => u.id === session.id);

    if (userIndex === -1) {
        return { error: 'User not found.' };
    }
    
    // Check if email is already taken by another user
    const existingUser = await getUserByEmail(email);
    if (existingUser && existingUser.id !== session.id) {
        return { error: 'This email is already in use by another account.' };
    }

    const updatedUser = { ...users[userIndex] };
    updatedUser.name = name;
    updatedUser.email = email;
    updatedUser.mobile = mobile;

    if (password) {
        updatedUser.password = password;
    }
    
    users[userIndex] = updatedUser;
    
    await writeJSONFile(usersFilePath, users);

  } catch (error) {
    console.error(error);
    return { error: 'Failed to update profile.' };
  }

  revalidatePath('/dashboard/settings');
  revalidatePath('/dashboard/user-nav');
  return { success: true };
}
