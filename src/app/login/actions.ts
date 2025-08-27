
'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { getUserByEmail } from '@/lib/data';
import { createSession, destroySession } from '@/lib/auth';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function authenticate(values: z.infer<typeof loginSchema>) {
  const parsedCredentials = loginSchema.safeParse(values);

  if (parsedCredentials.success) {
    const { email, password } = parsedCredentials.data;
    const user = await getUserByEmail(email);

    if (!user || user.password !== password) {
      return { error: 'Invalid email or password.' };
    }
    
    await createSession(user);
    
  } else {
    return { error: 'Invalid input.' };
  }
  redirect('/dashboard');
}

export async function logout() {
  await destroySession();
  redirect('/login');
}
