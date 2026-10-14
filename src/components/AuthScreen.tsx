"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export function AuthScreen({ mode }: { mode: "login" | "register" }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isLogin = mode === "login";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const username = String(form.get("username") ?? "");
    const password = String(form.get("password") ?? "");
    setPending(true);
    setError(null);
    try {
      const response = await fetch(isLogin ? "/api/login" : "/api/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        const body = (await response.json()) as { error?: string };
        setError(body.error ?? "The username or password is incorrect.");
        setPending(false);
        return;
      }
      window.location.assign("/");
    } catch {
      setError("The username or password is incorrect.");
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-ink">
      <section className="w-full max-w-100 rounded-md border border-line bg-white p-6 shadow-sm">
        <h1 className="mb-6 text-center text-2xl font-bold">Word Guess</h1>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => void onSubmit(event)}
        >
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Username
            <input
              name="username"
              autoComplete="username"
              required
              className="rounded-md border border-line px-3 py-2 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-semibold">
            Password
            <input
              name="password"
              type="password"
              autoComplete={isLogin ? "current-password" : "new-password"}
              required
              className="rounded-md border border-line px-3 py-2 font-normal"
            />
          </label>
          {error ? (
            <p
              role="alert"
              data-testid="auth-error"
              className="text-sm text-on-error"
            >
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-md bg-primary px-4 py-2 font-semibold text-on-primary disabled:opacity-60"
          >
            {isLogin ? "Sign in" : "Create account"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm">
          {isLogin ? (
            <Link href="/register">Create an account</Link>
          ) : (
            <Link href="/login">Sign in</Link>
          )}
        </p>
      </section>
      <footer className="mt-6 text-center text-sm text-ink/70">
        Word Guess on this server
      </footer>
    </div>
  );
}
