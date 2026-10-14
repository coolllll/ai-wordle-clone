import { listPublicAccounts } from "@/lib/accounts";
import { toLeaderboard, type LeaderboardRow } from "@/lib/leaderboard";
import { readStore } from "@/lib/storage";

export const dynamic = "force-dynamic";

export default async function LeaderboardPage() {
  try {
    const [store, accounts] = await Promise.all([
      readStore(),
      listPublicAccounts(),
    ]);
    return <LeaderboardList rows={toLeaderboard(store.games, accounts)} />;
  } catch {
    return (
      <div
        role="alert"
        data-testid="alert"
        className="rounded-md border border-on-error bg-error px-4 py-3 text-on-error"
      >
        <span>The leaderboard could not be loaded.</span>
      </div>
    );
  }
}

export function LeaderboardList({ rows }: { rows: LeaderboardRow[] }) {
  return (
    <section className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Leaderboard</h1>
      {rows.length === 0 ? (
        <p data-testid="leaderboard-empty" className="text-ink/70">
          No wins yet.
        </p>
      ) : (
        <ol
          data-testid="leaderboard-list"
          className="flex w-full flex-col gap-3 overflow-x-hidden"
        >
          {rows.map((row) => (
            <li
              key={row.username}
              data-testid="leaderboard-row"
              className="w-full min-w-0 rounded-md border border-line bg-surface px-4 py-3 shadow-xs"
            >
              <p>
                <span data-testid="leaderboard-rank">{row.rank}</span>
                <span>. </span>
                <span data-testid="leaderboard-username">{row.username}</span>
              </p>
              <p data-testid="leaderboard-score">Score: {row.score}</p>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
