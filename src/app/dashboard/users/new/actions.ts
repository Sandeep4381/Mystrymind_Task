
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { addUser, getUserByEmail } from '@/lib/data';
import { revalidatePath } from 'next/cache';
import { sendWelcomeEmail } from '@/lib/email';
import { getSession } from '@/lib/auth';

const userFormSchema = z.object({
  name: z.string().min(1, 'Name is required.'),
  email: z.string().email('Invalid email address.'),
  mobile: z.string().optional(),
  position: z.string().optional(),
  password: z.string().min(6, 'Password must be at least 6 characters.'),
  role: z.enum(['Admin', 'User', 'Super Admin']),
});


export async function createUser(values: z.infer<typeof userFormSchema>) {
  const session = await getSession();
  if (!session) {
    return { error: 'You must be logged in to create a user.' };
  }
  
  const parsedCredentials = userFormSchema.safeParse(values);

  if (!parsedCredentials.success) {
    return { error: 'Invalid user data provided.' };
  }

  const { email, name, password } = parsedCredentials.data;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    return { error: 'A user with this email already exists.' };
  }

  try {
    const newUser = await addUser(parsedCredentials.data);

    await sendWelcomeEmail({
        to: newUser.email,
        newUserName: newUser.name,
        createdByName: session.name,
        password: password,
    });

  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('SMTP')) {
         return { error: `Failed to send notification email. Please check your SMTP settings in the .env file. [${error.message}]` };
    }
    return { error: 'Failed to create user.' };
  }

  revalidatePath('/dashboard/users');
  redirect('/dashboard/users');
}
