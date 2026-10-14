import Link from "next/link";
import type { ReactNode } from "react";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-base-200 text-base-content">
      <header className="navbar bg-base-100 px-3 shadow-sm">
        <div className="flex-1">
          <Link href="/" className="text-lg font-bold">
            Word Guess
          </Link>
        </div>
        <Link href="/history" className="btn btn-primary btn-sm">
          History
        </Link>
      </header>
      <main className="mx-auto w-full max-w-lg overflow-x-hidden px-3 py-4">
        {children}
      </main>
    </div>
  );
}
