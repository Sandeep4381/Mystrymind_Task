
import { promises as fs } from 'fs';
import path from 'path';
import { type User, type Task, type Project, type Milestone } from '@/lib/definitions';

// For this example, we are reading from static JSON files.
// In a real application, these functions would interact with a database.

const usersFilePath = path.join(process.cwd(), 'data/users.json');
const tasksFilePath = path.join(process.cwd(), 'data/tasks.json');
const projectsFilePath = path.join(process.cwd(), 'data/projects.json');
const milestonesFilePath = path.join(process.cwd(), 'data/milestones.json');


async function readJSONFile(filePath: string) {
    try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(fileContent);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            await writeJSONFile(filePath, []);
            return []; // Return empty array if file doesn't exist
        }
        throw error;
    }
}

export async function writeJSONFile(filePath: string, data: any) {
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

export async function deleteTask(taskId: string): Promise<void> {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await writeJSONFile(tasksFilePath, updatedTasks);
}

export async function getProjects(): Promise<Project[]> {
    const projects = await readJSONFile(projectsFilePath);
    return projects as Project[];
}

export async function getProjectById(projectId: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find(p => p.id === projectId);
}


export async function addProject(project: Omit<Project, 'id'>): Promise<Project> {
    const projects = await getProjects();
    const newProject: Project = {
        id: `project-${Date.now()}`,
        ...project
    };
    projects.push(newProject);
    await writeJSONFile(projectsFilePath, projects);
    return newProject;
}

export async function getMilestones(projectId: string): Promise<Milestone[]> {
    const milestones = await readJSONFile(milestonesFilePath);
    return (milestones as Milestone[]).filter(m => m.projectId === projectId);
}
