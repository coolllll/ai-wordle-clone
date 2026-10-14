import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-page text-ink">
      <header className="flex items-center bg-surface px-3 py-2 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="text-lg font-bold">
            Word Guess
          </Link>
        </div>
        <Link
          href="/history"
          className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-on-primary"
        >
          History
        </Link>
      </header>
      <main className="mx-auto w-full max-w-lg overflow-x-hidden px-3 py-4">
        {children}
      </main>
    </div>
  );
}
