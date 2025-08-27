
import { getUserById } from "@/lib/data";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, User as UserIcon, Briefcase } from "lucide-react";

const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length === 0) return '';
    return names.map((n) => n[0]).join('').toUpperCase();
}


export default async function UserProfilePage({ params }: { params: { id: string } }) {
  const user = await getUserById(params.id);

  if (!user) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto">
        <Card>
            <CardHeader className="flex flex-col items-center text-center space-y-4">
                <Avatar className="w-24 h-24 border-4 border-primary">
                    <AvatarImage src={`https://picsum.photos/seed/${user.id}/100/100`} alt={user.name} data-ai-hint="avatar" />
                    <AvatarFallback className="text-3xl">{getInitials(user.name)}</AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className="text-2xl font-bold font-headline">{user.name}</CardTitle>
                    <CardDescription>
                        <Badge variant={user.role === 'Super Admin' ? 'default' : 'secondary'} className="mt-2">{user.role}</Badge>
                    </CardDescription>
                </div>
            </CardHeader>
            <CardContent className="mt-4">
                <div className="space-y-4">
                     <div className="flex items-center gap-4">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                        <span className="text-muted-foreground">{user.email}</span>
                    </div>
                     {user.mobile && (
                        <div className="flex items-center gap-4">
                            <Phone className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">{user.mobile}</span>
                        </div>
                    )}
                     {user.position && (
                        <div className="flex items-center gap-4">
                            <Briefcase className="w-5 h-5 text-muted-foreground" />
                            <span className="text-muted-foreground">{user.position}</span>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    </div>
  );
}
