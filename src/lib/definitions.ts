
export type User = {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'Super Admin' | 'Admin' | 'User';
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'Backlog' | 'Todo' | 'In Progress' | 'Done' | 'Canceled';
  label: 'bug' | 'feature' | 'documentation';
  priority: 'low' | 'medium' | 'high';
  assigneeId: string | null;
};

export type Comment = {
  id: string;
  taskId: string;
  userId: string;
  text: string;
  timestamp: string;
};

export type SessionUser = Omit<User, 'password'>;
