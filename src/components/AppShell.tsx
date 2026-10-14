import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({
  children,
  username,
}: {
  children: ReactNode;
  username: string;
}) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-page text-ink">
      <header className="flex items-center gap-2 bg-surface px-3 py-2 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="text-lg font-bold">
            Word Guess
          </Link>
        </div>
        <span data-testid="current-user">{username}</span>
        <form action="/api/logout" method="post">
          <button
            type="submit"
            className="rounded-md border border-line bg-surface px-3 py-1.5 text-sm font-semibold"
          >
            Log out
          </button>
        </form>
        <Link
          href="/history"
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary"
        >
          History
        </Link>
        <Link
          href="/leaderboard"
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary"
        >
          Leaderboard
        </Link>
      </header>
      <main className="mx-auto w-full max-w-lg overflow-x-hidden px-3 py-4">
        {children}
      </main>
    </div>
  );
}
