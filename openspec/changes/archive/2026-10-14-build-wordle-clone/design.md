# Design

## Context

The repository contains OpenSpec configuration but no application code. The application will run locally for one player in one Node.js process. It needs a browser UI, server-authoritative game rules, a bundled word list, and writable JSON persistence. See `proposal.md` and the capability specs for behavior.

## Goals / Non-Goals

**Goals:**

- Keep the answer and guess validation on the server.
- Support unlimited games and reliable completed-game history across local restarts.
- Use a small architecture that is easy to run and understand.
- Make game rules independently testable, especially repeated-letter evaluation.
- Protect valid persisted data from interrupted writes.

**Non-Goals:**

- User accounts, authentication, multiplayer, or cross-device synchronization.
- Serverless, multi-process, or horizontally scaled deployment.
- A remote database or administration interface for editing words.
- Reproducing Wordle branding or assets.

## Decisions

### Use one Next.js App Router application

Next.js will host both the React interface and Route Handlers under the same project. Interactive game and history views will use client components only where browser state and keyboard events require them; initial layout and static shell can remain server-rendered.

This avoids operating a separate backend while preserving an explicit HTTP boundary between UI and game logic. A separate API server was rejected because it adds setup and deployment complexity with no benefit for a local single-player application.

### Expose a small server-authoritative game API

The server interface will center on:

- `POST /api/games` to create and return a public projection of a game.
- `GET /api/games/:id` to restore an active or completed game.
- `POST /api/games/:id/guesses` to validate and evaluate a guess.
- `GET /api/history` to return completed records newest first.

Responses for active games will omit the answer. The answer is returned only after the game is won or failed. A browser-local active game identifier allows the UI to resume after a page reload, while the server remains authoritative.

Server Actions were considered, but Route Handlers provide clearer request and response contracts and are straightforward to exercise in integration tests.

### Separate pure game rules from transport and storage

Word validation, status transitions, and tile evaluation will live in pure TypeScript modules. Repeated letters will use a two-pass algorithm: mark exact matches first, then consume remaining unmatched answer-letter counts for present matches.

Keeping rule evaluation free of React, HTTP, and filesystem concerns makes edge cases deterministic and suitable for focused unit tests.

### Store words and game data in JSON files

`data/words.json` will contain answer and allowed-guess lists. `data/games.json` will contain active and completed game records. Each record will have an opaque ID, answer, ordered guesses, status, creation time, optional completion time, and a marker indicating whether completion was recorded.

The storage module will serialize writes within the process and replace the data file atomically by writing a temporary file and renaming it. Reads will validate the parsed shape and return explicit errors for malformed data rather than overwriting it.

A relational database was rejected because the local, single-process workload does not require querying or concurrency features. Browser-only storage was rejected because the requested history must use a local JSON file and game answers should remain server-controlled.

### Derive history from completed game records

Completed games in `games.json` are the source of history. A won game's score is `guesses.length`; a failed game has no numeric score. The API maps internal game records to history entries and sorts them by completion time descending.

Using one record per game avoids synchronization errors between separate game and history files and makes duplicate completion records impossible by construction.

### Build the interface with Tailwind CSS and daisyUI

The UI will use daisyUI components and theme tokens for the page shell, controls, alerts, modal or result panel, and history presentation. Custom tile classes will represent correct, present, absent, and unknown states because those states are domain-specific.

The main game surface will fit narrow screens without horizontal scrolling. Physical keyboard handlers will ignore modified shortcuts and input while submission is pending. The on-screen keyboard and physical keyboard will call the same client input actions.

### Test behavior at three levels

- Unit tests will cover word validation, duplicate-letter evaluation, scoring, and game transitions.
- Storage tests will use temporary directories to cover initialization, persistence, atomic replacement, malformed JSON, and duplicate completion handling.
- UI or integration tests will cover starting a game, valid and invalid guesses, win/loss flows, keyboard interaction, and history rendering.

## Risks / Trade-offs

- **Concurrent writes could lose data** -> Serialize writes in the single process and use atomic file replacement.
- **A crash can leave a temporary file** -> Treat the canonical file as authoritative and safely clean or ignore stale temporary files.
- **Malformed hand-edited JSON can block loading** -> Validate data and return a clear error without replacing the original file.
- **The answer could leak through an API response** -> Return explicit public projections that exclude active answers.
- **Random answers can repeat across games** -> Accept repeats as part of unlimited random play; only immediate game creation is guaranteed, not a no-repeat cycle.
- **Local JSON will not work reliably on serverless hosting** -> Document and enforce the local single-process operating assumption.

## Migration Plan

No existing application or data requires migration. Initialize the Next.js project and data files, then verify a clean install, development start, tests, and production build. Rollback consists of reverting the newly introduced application files; existing OpenSpec configuration is unaffected.
