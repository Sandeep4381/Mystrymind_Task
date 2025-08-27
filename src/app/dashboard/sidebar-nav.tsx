
'use client';

import {
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Rocket, LayoutDashboard, Users, ListTodo, LogOut, Briefcase } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { type SessionUser } from '@/lib/definitions';
import { logout } from '@/app/login/actions';

interface SidebarNavProps {
  session: SessionUser;
}

export function SidebarNav({ session }: SidebarNavProps) {
  const pathname = usePathname();
  const isAdmin = session.role === 'Admin' || session.role === 'Super Admin';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, visible: isAdmin },
    { href: '/dashboard/projects', label: 'Projects', icon: Briefcase, visible: true },
    { href: '/dashboard/tasks', label: 'Tasks', icon: ListTodo, visible: true },
    { href: '/dashboard/users', label: 'Users', icon: Users, visible: isAdmin },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="shrink-0">
            <Rocket />
          </Button>
          <span className="text-lg font-semibold">TaskZen</span>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarMenu>
          {navItems.map(
            (item) =>
              item.visible && (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname.startsWith(item.href)}
                    tooltip={item.label}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <form action={logout}>
          <Button variant="ghost" className="w-full justify-start gap-2">
            <LogOut className="h-4 w-4" />
            <span>Log Out</span>
          </Button>
        </form>
      </SidebarFooter>
    </>
  );
}
