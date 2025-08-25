
import { promises as fs } from 'fs';
import path from 'path';
import { type User, type Task } from '@/lib/definitions';

// For this example, we are reading from static JSON files.
// In a real application, these functions would interact with a database.

const usersFilePath = path.join(process.cwd(), 'data/users.json');
const tasksFilePath = path.join(process.cwd(), 'data/tasks.json');

async function readJSONFile(filePath: string) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

async function writeJSONFile(filePath: string, data: any) {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}


export async function getUsers(): Promise<User[]> {
  const users = await readJSONFile(usersFilePath);
  return users as User[];
}

export async function getUserById(userId: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(user => user.id === userId);
}

export async function getUserByEmail(email: string): Promise<User | undefined> {
  const users = await getUsers();
  return users.find(user => user.email === email);
}

export async function addUser(user: Omit<User, 'id'>): Promise<User> {
    const users = await getUsers();
    const newUser: User = {
        id: `user-${Date.now()}`,
        ...user
    };
    users.push(newUser);
    await writeJSONFile(usersFilePath, users);
    return newUser;
}


export async function getTasks(): Promise<Task[]> {
  const tasks = await readJSONFile(tasksFilePath);
  return tasks as Task[];
}

export async function getTaskById(taskId: string): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find(task => task.id === taskId);
}
