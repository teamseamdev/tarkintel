import { getTasks } from "@/lib/task-provider";

export async function getTaskById(
  id: string
) {
  const tasks =
    await getTasks();

  return tasks.find(
    (task) =>
      task.id === id
  );
}