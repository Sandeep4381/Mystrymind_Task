
import { getRedisClient } from '@/lib/redis';
import { type User, type Task, type Project, type Milestone } from '@/lib/definitions';

// Redis keys
const USERS_KEY = 'users';
const TASKS_KEY = 'tasks';
const PROJECTS_KEY = 'projects';
const MILESTONES_KEY = 'milestones';


async function readFromRedis(key: string): Promise<any[]> {
    try {
        const redis = await getRedisClient();
        const data = await redis.get(key);
        if (data) {
            return JSON.parse(data);
        }
        // If no data, let's initialize from the JSON files as a one-time migration
        try {
            const fileData = await import(`@/../data/${key}.json`);
            if (fileData.default) {
                await writeToRedis(key, fileData.default);
                console.log(`Migrated ${key}.json to Redis.`);
                return fileData.default;
            }
        } catch (e) {
            // It's okay if the file doesn't exist
        }
        return [];
    } catch (error) {
        console.error(`Failed to read from Redis for key ${key}:`, error);
        return [];
    }
}

async function writeToRedis(key: string, data: any) {
    const redis = await getRedisClient();
    await redis.set(key, JSON.stringify(data, null, 2));
}


export async function getUsers(): Promise<User[]> {
  const users = await readFromRedis(USERS_KEY);
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
    await writeToRedis(USERS_KEY, users);
    return newUser;
}


export async function getTasks(): Promise<Task[]> {
  const tasks = await readFromRedis(TASKS_KEY);
  return tasks as Task[];
}

export async function getTaskById(taskId: string): Promise<Task | undefined> {
  const tasks = await getTasks();
  return tasks.find(task => task.id === taskId);
}

export async function updateTask(taskId: string, taskData: Partial<Omit<Task, 'id'>>): Promise<Task> {
    const tasks = await getTasks();
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) {
        throw new Error("Task not found");
    }
    const updatedTask = { ...tasks[taskIndex], ...taskData };
    tasks[taskIndex] = updatedTask;
    await writeToRedis(TASKS_KEY, tasks);
    return updatedTask;
}

export async function deleteTask(taskId: string): Promise<void> {
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    await writeToRedis(TASKS_KEY, updatedTasks);
}

export async function getProjects(): Promise<Project[]> {
    const projects = await readFromRedis(PROJECTS_KEY);
    return projects as Project[];
}

export async function getProjectById(projectId: string): Promise<Project | undefined> {
    const projects = await getProjects();
    return projects.find(p => p.id === projectId);
}


export async function addProject(project: Omit<Project, 'id' | 'createdAt'>): Promise<Project> {
    const projects = await getProjects();
    const newProject: Project = {
        id: `project-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...project
    };
    projects.push(newProject);
    await writeToRedis(PROJECTS_KEY, projects);
    return newProject;
}

export async function updateProject(projectId: string, projectData: Partial<Omit<Project, 'id'>>): Promise<Project> {
    const projects = await getProjects();
    const projectIndex = projects.findIndex(p => p.id === projectId);
    if (projectIndex === -1) {
        throw new Error("Project not found");
    }
    const updatedProject = { ...projects[projectIndex], ...projectData };
    projects[projectIndex] = updatedProject;
    await writeToRedis(PROJECTS_KEY, projects);
    return updatedProject;
}

export async function deleteProject(projectId: string): Promise<void> {
    const projects = await getProjects();
    const updatedProjects = projects.filter(p => p.id !== projectId);
    await writeToRedis(PROJECTS_KEY, updatedProjects);

    // Also delete associated tasks
    const tasks = await getTasks();
    const updatedTasks = tasks.filter(t => t.projectId !== projectId);
    await writeToRedis(TASKS_KEY, updatedTasks);
}


export async function getMilestones(projectId: string): Promise<Milestone[]> {
    const milestones = await readFromRedis(MILESTONES_KEY);
    return (milestones as Milestone[]).filter(m => m.projectId === projectId);
}

export async function writeJSONFile(filePath: string, data: any) {
    // This function is now a proxy to Redis for any legacy calls.
    const key = filePath.split('/').pop()?.replace('.json', '');
    if (key) {
        await writeToRedis(key, data);
    }
}
