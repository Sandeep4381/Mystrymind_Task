
import { SidebarTrigger } from '@/components/ui/sidebar';
import { UserNav } from './user-nav';
import { type SessionUser } from '@/lib/definitions';

interface HeaderProps {
    session: SessionUser;
}

export function Header({ session }: HeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 lg:h-[60px] lg:px-6">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="flex-1">
        {/* Can add breadcrumbs or page title here */}
      </div>
      <UserNav user={session} />
    </header>
  );
}
