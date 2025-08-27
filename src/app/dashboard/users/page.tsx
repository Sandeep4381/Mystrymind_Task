
import { getUsers } from "@/lib/data";
import { UsersDataTable } from "./components/data-table";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || (session.role !== 'Admin' && session.role !== 'Super Admin')) {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Users</h1>
            <p className="text-muted-foreground">
            Manage all users in the system.
            </p>
         </div>
         <Button asChild>
            <Link href="/dashboard/users/new">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add User
            </Link>
         </Button>
       </div>
       <UsersDataTable users={users} session={session} />
    </div>
  );
}
