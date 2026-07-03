import { ProgressCatchUpClient } from "@/components/profile/ProgressCatchUpClient";
import { getTasks } from "@/lib/task-provider";

export default async function CatchUpPage() {
  let tasks;

  try {
    tasks = await getTasks();
  } catch (error) {
    console.error("CATCH-UP TASK LOAD ERROR:", error);

    return (
      <main className="min-h-screen p-4 pb-8 text-white">
        <section className="glass-card rounded-[2rem] p-6">
          <p className="text-sm font-semibold uppercase text-primary">
            Catch-Up Setup
          </p>
          <h1 className="mt-3 text-3xl font-black">
            Tasks are temporarily unavailable
          </h1>
          <p className="mt-3 max-w-xl text-sm text-zinc-400">
            TarkIntel could not load the latest task data. Your progress was
            not changed. Please try again shortly.
          </p>
        </section>
      </main>
    );
  }

  return <ProgressCatchUpClient tasks={tasks} />;
}
