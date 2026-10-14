import { HistoryList } from "@/components/HistoryList";
import { getHistory } from "@/lib/game-service";

export const dynamic = "force-dynamic";

export default async function HistoryPage() {
  try {
    const entries = await getHistory();
    return (
      <section className="flex flex-col gap-3">
        <h1 className="text-2xl font-bold">Score history</h1>
        <HistoryList entries={entries} />
      </section>
    );
  } catch {
    return (
      <div
        role="alert"
        data-testid="alert"
        className="rounded-md border border-on-error bg-error px-4 py-3 text-on-error"
      >
        <span>The latest result was not saved.</span>
      </div>
    );
  }
}
