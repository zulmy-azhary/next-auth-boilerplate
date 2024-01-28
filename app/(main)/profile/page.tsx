import { ProfileForm } from "@/components/form/profile-form";
import { currentUser } from "@/lib/auth";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profile",
};

export default async function ProfilePage() {
  const user = await currentUser();
  if (!user) return;
  
  return (
    <div className="grid grid-cols-7 gap-y-14">
      <h2 className="text-xl col-span-full col-start-4 font-semibold">Profile Settings</h2>
      <ProfileForm user={user} />
    </div>
  );
}
