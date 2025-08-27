
import { getSession } from "@/lib/auth";
import { getUserById } from "@/lib/data";
import { notFound } from "next/navigation";
import { EditProfileForm } from "./edit-profile-form";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) {
    notFound();
  }

  const user = await getUserById(session.id);
  if (!user) {
    notFound();
  }

  return <EditProfileForm user={user} />;
}
