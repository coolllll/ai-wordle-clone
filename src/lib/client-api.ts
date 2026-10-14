import type { PublicGame } from "./types";

export const GAME_ID_KEY = "word-guess-game-id";

let currentLoad: { userId: string; promise: Promise<PublicGame> } | null = null;

export function gameStorageKey(userId: string): string {
  return `${GAME_ID_KEY}:${userId}`;
}

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

export function loadCurrentGame(userId: string): Promise<PublicGame> {
  if (!currentLoad || currentLoad.userId !== userId) {
    const key = gameStorageKey(userId);
    currentLoad = {
      userId,
      promise: (async () => {
        const existing = window.localStorage.getItem(key);
        if (existing) {
          const restored = await fetchGame(existing);
          if (restored) {
            return restored;
          }
        }
        const created = await createGameRequest();
        window.localStorage.setItem(key, created.id);
        return created;
      })(),
    };
  }
  return currentLoad.promise;
}

export async function startNewGame(userId: string): Promise<PublicGame> {
  const created = await createGameRequest();
  window.localStorage.setItem(gameStorageKey(userId), created.id);
  currentLoad = { userId, promise: Promise.resolve(created) };
  return created;
}
