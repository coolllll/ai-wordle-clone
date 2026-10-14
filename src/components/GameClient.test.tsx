// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { gameStorageKey, resetClientCache } from "@/lib/client-api";
import type { PublicGame, TileState } from "@/lib/types";
import { GameClient } from "./GameClient";

const absent = [
  "absent",
  "absent",
  "absent",
  "absent",
  "absent",
] as TileState[];

function playing(
  id = "game-1",
  guesses: PublicGame["guesses"] = [],
): PublicGame {
  return {
    id,
    status: "playing",
    guesses,
    attemptsRemaining: 6 - guesses.length,
    createdAt: "2026-01-01T00:00:00.000Z",
    completedAt: null,
  };
}

function expectNoHistoryRequest(): void {
  const fetchMock = vi.mocked(globalThis.fetch);
  const historyUrls = fetchMock.mock.calls
    .map((call) => String(call[0]))
    .filter((url) => url.endsWith("/api/history"));
  expect(historyUrls).toEqual([]);
  expect(screen.queryByTestId("history-panel")).not.toBeInTheDocument();
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

afterEach(() => {
  cleanup();
  resetClientCache();
  window.localStorage.clear();
  vi.unstubAllGlobals();
});

beforeEach(() => {
  resetClientCache();
  window.localStorage.clear();
});

describe("GameClient input", () => {
  it("accepts physical and on-screen keys, delete, a five-letter limit, and blocks input while pending", async () => {
    const user = userEvent.setup();
    let releaseGuess: ((response: Response) => void) | undefined;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/guesses")) {
          return new Promise<Response>((resolve) => {
            releaseGuess = resolve;
          });
        }
        if (init?.method === "POST") {
          return jsonResponse(playing());
        }
        return jsonResponse(playing());
      }),
    );

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 6");
    expectNoHistoryRequest();

    await user.click(screen.getByTestId("key-c"));
    await user.keyboard("r");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("c");
    expect(screen.getByTestId("tile-0-1")).toHaveTextContent("r");

    await user.click(screen.getByTestId("key-delete"));
    expect(screen.getByTestId("tile-0-1")).toHaveTextContent("");
    await user.keyboard("{Backspace}");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("");

    await user.keyboard("{Control>}a{/Control}");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("");

    await user.keyboard("cranez");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("c");
    expect(screen.getByTestId("tile-0-4")).toHaveTextContent("e");
    expect(screen.getByTestId("tile-0-4").textContent).toBe("e");

    await user.click(screen.getByTestId("key-enter"));
    await waitFor(() => expect(screen.getByTestId("key-z")).toBeDisabled());
    await user.keyboard("z");
    await user.click(screen.getByTestId("key-z"));
    expect(screen.getByTestId("tile-0-4")).toHaveTextContent("e");

    releaseGuess?.(
      jsonResponse({
        ...playing(),
        guesses: [{ word: "crane", tiles: absent }],
        attemptsRemaining: 5,
      }),
    );
    await screen.findByText("Attempts remaining: 5");
    expect(screen.getByTestId("tile-0-0")).toHaveAttribute(
      "data-state",
      "absent",
    );
  });
});

describe("GameClient play", () => {
  it("keeps a separate saved game for each account", async () => {
    let created = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
        if (init?.method === "POST") {
          created += 1;
          return jsonResponse(playing(created === 1 ? "game-a" : "game-b"));
        }
        return jsonResponse({ error: "Game not found." }, 404);
      }),
    );

    const first = render(<GameClient userId="ada" />);
    await screen.findByText("Attempts remaining: 6");
    first.unmount();
    resetClientCache();

    render(<GameClient userId="bea" />);
    await screen.findByText("Attempts remaining: 6");
    expect(window.localStorage.getItem(gameStorageKey("ada"))).toBe("game-a");
    expect(window.localStorage.getItem(gameStorageKey("bea"))).toBe("game-b");
  });

  it("starts a game, restores it after reload, and continues", async () => {
    const user = userEvent.setup();
    const restored = playing("game-1", [{ word: "slate", tiles: absent }]);
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url === "/api/games" && init?.method === "POST") {
          return jsonResponse(playing("game-1"));
        }
        if (url.endsWith("/guesses")) {
          return jsonResponse({
            ...restored,
            guesses: [
              { word: "slate", tiles: absent },
              {
                word: "crane",
                tiles: ["correct", "present", "absent", "absent", "absent"],
              },
            ],
            attemptsRemaining: 4,
          });
        }
        return jsonResponse(restored);
      }),
    );

    const first = render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 6");
    expectNoHistoryRequest();
    expect(window.localStorage.getItem(gameStorageKey("player"))).toBe("game-1");
    first.unmount();
    resetClientCache();

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 5");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("s");

    await user.keyboard("crane{Enter}");
    await screen.findByText("Attempts remaining: 4");
    expect(screen.getByTestId("tile-1-0")).toHaveAttribute(
      "data-state",
      "correct",
    );
    expect(screen.getByTestId("key-c")).toHaveAttribute(
      "data-state",
      "correct",
    );
  });

  it("shows an error for an invalid word and leaves the attempt unused", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/guesses")) {
          return jsonResponse(
            { error: "Guess must be an allowed five-letter word." },
            400,
          );
        }
        if (init?.method === "POST") {
          return jsonResponse(playing());
        }
        return jsonResponse(playing());
      }),
    );

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 6");
    await user.keyboard("zzzzz{Enter}");
    expect(await screen.findByTestId("alert")).toHaveTextContent(
      "Guess must be an allowed five-letter word.",
    );
    expect(screen.getByText("Attempts remaining: 6")).toBeInTheDocument();
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("z");
    expectNoHistoryRequest();
  });

  it("shows a win and starts another game without reloading the page", async () => {
    const user = userEvent.setup();
    const reload = vi.fn();
    vi.stubGlobal("location", { ...window.location, reload });
    let created = 0;
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/guesses")) {
          return jsonResponse({
            id: "game-1",
            status: "won",
            guesses: [
              {
                word: "crane",
                tiles: ["correct", "correct", "correct", "correct", "correct"],
              },
            ],
            attemptsRemaining: 0,
            createdAt: "2026-01-01T00:00:00.000Z",
            completedAt: "2026-04-01T00:00:00.000Z",
            score: 1,
            answer: "crane",
          } satisfies PublicGame);
        }
        if (init?.method === "POST") {
          created += 1;
          const id = created === 1 ? "game-1" : "game-2";
          return jsonResponse(playing(id));
        }
        return jsonResponse(playing("game-1"));
      }),
    );

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 6");
    expectNoHistoryRequest();
    await user.keyboard("crane{Enter}");
    expect(await screen.findByTestId("alert")).toHaveTextContent(
      "Result saved",
    );
    expect(screen.getByTestId("status")).toHaveTextContent("You won. Score: 1");
    expectNoHistoryRequest();
    expect(reload).not.toHaveBeenCalled();

    await user.click(screen.getByTestId("new-game"));
    await screen.findByText("Attempts remaining: 6");
    expect(window.localStorage.getItem(gameStorageKey("player"))).toBe("game-2");
    expect(screen.getByTestId("tile-0-0")).toHaveTextContent("");
    expect(reload).not.toHaveBeenCalled();
  });

  it("shows a loss on the sixth guess", async () => {
    const user = userEvent.setup();
    const guesses = ["grape", "lemon", "mango", "melon", "berry"].map(
      (word) => ({
        word,
        tiles: absent,
      }),
    );
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/guesses")) {
          return jsonResponse({
            id: "game-1",
            status: "failed",
            guesses: [...guesses, { word: "peach", tiles: absent }],
            attemptsRemaining: 0,
            createdAt: "2026-01-01T00:00:00.000Z",
            completedAt: "2026-04-01T00:00:00.000Z",
            answer: "apple",
          } satisfies PublicGame);
        }
        if (url === "/api/games" && init?.method === "POST") {
          return jsonResponse({ ...playing(), guesses, attemptsRemaining: 1 });
        }
        return jsonResponse({ ...playing(), guesses, attemptsRemaining: 1 });
      }),
    );

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 1");
    await user.keyboard("peach{Enter}");
    expect(await screen.findByTestId("status")).toHaveTextContent(
      "You lost. Answer: apple",
    );
    expect(screen.getByTestId("status").textContent).not.toMatch(/Score: \d/);
    expect(screen.getByTestId("tile-5-0")).toHaveTextContent("p");
    expect(await screen.findByTestId("alert")).toHaveTextContent(
      "Result saved",
    );
    expectNoHistoryRequest();
  });

  it("shows a persistence error and does not claim the result was saved", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input);
        if (url.endsWith("/guesses")) {
          return jsonResponse(
            { error: "The latest result was not saved." },
            500,
          );
        }
        if (init?.method === "POST") {
          return jsonResponse(playing());
        }
        return jsonResponse(playing());
      }),
    );

    render(<GameClient userId="player" />);
    await screen.findByText("Attempts remaining: 6");
    expectNoHistoryRequest();
    await user.keyboard("crane{Enter}");
    expect(await screen.findByTestId("alert")).toHaveTextContent(
      "The latest result was not saved.",
    );
    expect(screen.queryByText("Result saved")).not.toBeInTheDocument();
    expectNoHistoryRequest();
    expect(screen.getByText("Attempts remaining: 6")).toBeInTheDocument();
  });
});
