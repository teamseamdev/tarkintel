import {
  getTasks,
} from "@/lib/task-provider";

import {
  ProfilePageClient,
} from "@/components/profile/ProfilePageClient";

export default async function ProfilePage() {
  const tasks =
    await getTasks();

  return (
    <ProfilePageClient
      tasks={tasks}
    />
  );
}