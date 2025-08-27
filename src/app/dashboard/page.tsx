
import { getSession } from '@/lib/auth';
import { getTasks } from '@/lib/data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ListTodo, GanttChart, CheckCircle, Ban } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await getSession();
  const tasks = await getTasks();
  
  const isAdmin = session?.role === 'Admin' || session?.role === 'Super Admin';

  const stats = {
    total: tasks.length,
    inProgress: tasks.filter(t => t.status === 'In Progress').length,
    done: tasks.filter(t => t.status === 'Done').length,
    canceled: tasks.filter(t => t.status === 'Canceled').length,
  };

  if (!isAdmin) {
    return (
        <div className="flex flex-col items-center justify-center h-full text-center">
            <h1 className="text-3xl font-bold tracking-tight mb-2 font-headline">Welcome, {session?.name}!</h1>
            <p className="text-muted-foreground mb-6">Here are your assigned tasks.</p>
            <Button asChild>
                <Link href="/dashboard/tasks">View My Tasks</Link>
            </Button>
        </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Dashboard</h1>
         <Button asChild>
            <Link href="/dashboard/tasks">View All Tasks</Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All tasks in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <GanttChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.inProgress}</div>
             <p className="text-xs text-muted-foreground">Tasks currently being worked on</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.done}</div>
            <p className="text-xs text-muted-foreground">Tasks that have been completed</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Canceled</CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.canceled}</div>
             <p className="text-xs text-muted-foreground">Tasks that were canceled</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Recent activity feed coming soon.</p>
        </CardContent>
      </Card>
    </div>
  );
}
