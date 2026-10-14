import type { GameRecord } from "./types";

export interface LeaderboardAccount {
  id: string;
  username: string;
}

export interface LeaderboardRow {
  rank: number;
  username: string;
  score: number;
}

export function toLeaderboard(
  games: GameRecord[],
  accounts: LeaderboardAccount[],
): LeaderboardRow[] {
  const usernames = new Map(
    accounts.map((account) => [account.id, account.username]),
  );
  const best = new Map<string, { score: number; completedAt: string }>();

  for (const game of games) {
    if (game.status !== "won" || !game.userId || game.completedAt === null) {
      continue;
    }
    if (!usernames.has(game.userId)) {
      continue;
    }
    const score = game.guesses.length;
    const current = best.get(game.userId);
    if (
      !current ||
      score < current.score ||
      (score === current.score && game.completedAt < current.completedAt)
    ) {
      best.set(game.userId, { score, completedAt: game.completedAt });
    }
  }

  return [...best.entries()]
    .map(([userId, result]) => ({
      username: usernames.get(userId) ?? "",
      score: result.score,
      completedAt: result.completedAt,
    }))
    .sort(
      (left, right) =>
        left.score - right.score ||
        left.completedAt.localeCompare(right.completedAt) ||
        left.username.localeCompare(right.username),
    )
    .map((row, index) => ({
      rank: index + 1,
      username: row.username,
      score: row.score,
    }));
}
