
import { type User, type Task } from '@/lib/definitions';
import users from '../../data/users.json';
import tasks from '../../data/tasks.json';

// For this example, we are reading from static JSON files.
// In a real application, these functions would interact with a database.

export async function getUsers(): Promise<User[]> {
  // In a real app, you'd fetch this from a database.
  // Here, we're just returning the imported JSON data.
  return Promise.resolve(users as User[]);
}

export async function getUserById(userId: string): Promise<User | undefined> {
  return Promise.resolve((users as User[]).find(user => user.id === userId));
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  return Promise.resolve((users as User[]).find(user => user.email === email));
}

export async function getTasks(): Promise<Task[]> {
  return Promise.resolve(tasks as Task[]);
}

export async function getTaskById(taskId: string): Promise<Task | undefined> {
  return Promise.resolve((tasks as Task[]).find(task => task.id === taskId));
}
