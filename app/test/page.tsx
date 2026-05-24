import { supabase } from "@/lib/supabase";

export default async function TestPage() {
  const { data, error } =
    await supabase
      .from("profiles")
      .select("*");

  return (
    <div className="p-8 text-white">
      <pre>
        {JSON.stringify(
          {
            data,
            error,
          },
          null,
          2
        )}
      </pre>
    </div>
  );
}