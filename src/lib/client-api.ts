import type { HistoryEntry, PublicGame } from "./types";

export const GAME_ID_KEY = "word-guess-game-id";

let currentLoad: Promise<PublicGame> | null = null;

export function resetClientCache(): void {
  currentLoad = null;
}

async function errorMessage(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as { error?: string };
    return body.error ?? "The latest result was not saved.";
  } catch {
    return "The latest result was not saved.";
  }
}

export async function createGameRequest(): Promise<PublicGame> {
  const response = await fetch("/api/games", {
    method: "POST",
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as PublicGame;
}

export async function fetchGame(id: string): Promise<PublicGame | null> {
  const response = await fetch(`/api/games/${id}`, { cache: "no-store" });
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as PublicGame;
}

export async function submitGuessRequest(
  id: string,
  guess: string,
): Promise<PublicGame> {
  const response = await fetch(`/api/games/${id}/guesses`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    cache: "no-store",
    body: JSON.stringify({ guess }),
  });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as PublicGame;
}

export async function fetchHistory(): Promise<HistoryEntry[]> {
  const response = await fetch("/api/history", { cache: "no-store" });
  if (!response.ok) {
    throw new Error(await errorMessage(response));
  }
  return (await response.json()) as HistoryEntry[];
}

export function loadCurrentGame(): Promise<PublicGame> {
  if (!currentLoad) {
    currentLoad = (async () => {
      const existing = window.localStorage.getItem(GAME_ID_KEY);
      if (existing) {
        const restored = await fetchGame(existing);
        if (restored) {
          return restored;
        }
      }
      const created = await createGameRequest();
      window.localStorage.setItem(GAME_ID_KEY, created.id);
      return created;
    })();
  }
  return currentLoad;
}

export async function startNewGame(): Promise<PublicGame> {
  const created = await createGameRequest();
  window.localStorage.setItem(GAME_ID_KEY, created.id);
  currentLoad = Promise.resolve(created);
  return created;
}
