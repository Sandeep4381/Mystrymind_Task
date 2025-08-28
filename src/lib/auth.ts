'use server';

import { cookies } from 'next/headers';
import { type SessionUser, type User } from '@/lib/definitions';

const SESSION_COOKIE_NAME = 'taskzen_session';

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
    return session as SessionUser;
  } catch (error) {
    console.error('Failed to parse session cookie:', error);
    return null;
  }
}

export async function destroySession() {
  cookies().delete(SESSION_COOKIE_NAME);
}
