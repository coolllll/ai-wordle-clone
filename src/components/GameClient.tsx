"use client";

import { useEffect, useState } from "react";
import { buildBoard } from "@/lib/board";
import {
  loadCurrentGame,
  startNewGame,
  submitGuessRequest,
} from "@/lib/client-api";
import { keyboardStates } from "@/lib/feedback";
import { applyDraftInput } from "@/lib/input";
import type { PublicGame } from "@/lib/types";
import { GameBoard } from "./GameBoard";
import { Keyboard } from "./Keyboard";

interface AlertMessage {
  kind: "success" | "error";
  text: string;
}

export function GameClient({ userId }: { userId: string }) {
  const [game, setGame] = useState<PublicGame | null>(null);
  const [draft, setDraft] = useState("");
  const [pending, setPending] = useState(false);
  const [alert, setAlert] = useState<AlertMessage | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCurrentGame(userId)
      .then((loaded) => {
        if (!cancelled) {
          setGame(loaded);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setAlert({
            kind: "error",
            text:
              error instanceof Error
                ? error.message
                : "The latest result was not saved.",
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.metaKey || event.ctrlKey || event.altKey) {
        return;
      }
      const key = event.key.toLowerCase();
      if (key === "enter" || key === "backspace" || /^[a-z]$/.test(key)) {
        event.preventDefault();
        handleKey(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  function handleKey(key: string) {
    if (!game || game.status !== "playing" || pending) {
      return;
    }
    const next = applyDraftInput(draft, key, true);
    if (next.submit) {
      void sendGuess(draft);
      return;
    }
    setDraft(next.draft);
  }

  async function sendGuess(guess: string) {
    if (!game) {
      return;
    }
    setPending(true);
    setAlert(null);
    try {
      const updated = await submitGuessRequest(game.id, guess);
      setGame(updated);
      setDraft("");
      if (updated.status !== "playing") {
        setAlert({ kind: "success", text: "Result saved" });
      }
    } catch (error) {
      setAlert({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The latest result was not saved.",
      });
    } finally {
      setPending(false);
    }
  }

  async function onNewGame() {
    setPending(true);
    setAlert(null);
    setDraft("");
    try {
      setGame(await startNewGame(userId));
    } catch (error) {
      setAlert({
        kind: "error",
        text:
          error instanceof Error
            ? error.message
            : "The latest result was not saved.",
      });
    } finally {
      setPending(false);
    }
  }

  if (!game) {
    return (
      <p data-testid="status" className="text-center">
        Loading game
      </p>
    );
  }

  const rows = buildBoard(game.guesses, draft, game.status);
  const canType = game.status === "playing" && !pending;

  return (
    <div className="flex w-full flex-col gap-4 overflow-x-hidden">
      <p data-testid="status" className="text-center text-lg font-semibold">
        {game.status === "playing" &&
          `Attempts remaining: ${game.attemptsRemaining}`}
        {game.status === "won" && `You won. Score: ${game.score}`}
        {game.status === "failed" && `You lost. Answer: ${game.answer}`}
      </p>
      {alert ? (
        <div
          role="alert"
          data-testid="alert"
          className={`rounded-md border px-4 py-3 ${
            alert.kind === "error"
              ? "border-on-error bg-error text-on-error"
              : "border-on-success bg-success text-on-success"
          }`}
        >
          <span>{alert.text}</span>
        </div>
      ) : null}
      <GameBoard rows={rows} />
      <Keyboard
        letterStates={keyboardStates(game.guesses)}
        disabled={!canType}
        onKey={handleKey}
      />
      {game.status !== "playing" ? (
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 font-semibold text-on-primary"
          data-testid="new-game"
          onClick={() => void onNewGame()}
        >
          New game
        </button>
      ) : null}
    </div>
  );
}
