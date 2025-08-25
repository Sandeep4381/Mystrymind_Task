
import { getUsers } from "@/lib/data";
import { UsersDataTable } from "./components/data-table";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
  const session = await getSession();

  if (!session || (session.role !== 'Admin' && session.role !== 'Super Admin')) {
    redirect('/dashboard');
  }

  const users = await getUsers();

  return (
    <div className="space-y-6">
       <div>
         <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-headline">Users</h1>
         <p className="text-muted-foreground">
           Manage all users in the system.
         </p>
       </div>
       <UsersDataTable users={users} />
    </div>
  );
}
