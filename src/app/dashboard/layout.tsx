
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SidebarProvider, Sidebar, SidebarInset } from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import { Header } from "./header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav session={session} />
      </Sidebar>
      <SidebarInset className="flex flex-col">
        <Header session={session} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
