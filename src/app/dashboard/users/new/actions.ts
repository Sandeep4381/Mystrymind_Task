
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { addUser, getUserByEmail } from '@/lib/data';
import { revalidatePath } from 'next/cache';

export const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  mobile: z.string().optional(),
  position: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['Admin', 'User', 'Super Admin']),
});


export async function createUser(values: z.infer<typeof userFormSchema>) {
  const parsedCredentials = userFormSchema.safeParse(values);

  if (!parsedCredentials.success) {
    return { error: 'Invalid user data provided.' };
  }

  const { email } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'A user with this email already exists.' };
  }

  try {
    await addUser(parsedCredentials.data);
  } catch (error) {
    console.error(error);
    return { error: 'Failed to create user.' };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}
