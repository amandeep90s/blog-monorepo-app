import type { Metadata } from "next";

import { getCurrentUser } from "@/lib/actions/user";
import { getSession } from "@/lib/session";

import ProfileForm from "./_components/profile-form";

export const metadata: Metadata = {
  title: "Profile Settings",
  description: "Update your profile information and settings.",
};

export default async function ProfilePage() {
  const session = await getSession();

  if (!session?.user) {
    return <div>Please log in to view this page.</div>;
  }

  // Fetch fresh user data from API to ensure we have the latest bio
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    return <div>Failed to load user profile. Please try again.</div>;
  }

  return <ProfileForm user={currentUser} />;
}
