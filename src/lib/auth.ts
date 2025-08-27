
'use server';

import { cookies } from 'next/headers';
import { type SessionUser, type User } from '@/lib/definitions';
import { getUserByEmail } from '@/lib/data';

const SESSION_COOKIE_NAME = 'taskzen_session';

// In a real app, use a library like 'jose' or 'next-auth' for robust session management.
// This is a simplified example for demonstration purposes.

export async function createSession(user: User) {
  const sessionData: SessionUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
}

export async function getSession(): Promise<SessionUser | null> {
  const cookie = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!cookie) return null;

  try {
    const session = JSON.parse(cookie);
    // You might want to re-validate the session here against the database
    return session as SessionUser;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

export async function destroySession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
