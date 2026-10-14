# Proposal

## Why

Create a local single-player Wordle-style game that supports unlimited play and preserves completed-game results. The project is currently empty, so this change establishes the full playable application and its initial architecture.

## What Changes

- Add a Next.js full-stack application using the App Router and TypeScript.
- Add a responsive Wordle-style interface built with Tailwind CSS and daisyUI.
- Add unlimited random five-letter games with six attempts per game.
- Validate guesses and calculate correct, present, and absent letter feedback on the server.
- Add physical and on-screen keyboard input.
- Persist completed-game history in a local JSON file.
- Use the number of attempts as the score for wins and record losses as failed.
- Add a history view showing each game's date, result, score, answer, and guesses.

## Capabilities

### New Capabilities

- `wordle-gameplay`: Covers starting random games, entering and validating guesses, evaluating letters, completing games, and presenting the interactive game interface.
- `score-history`: Covers recording completed games in local JSON storage and viewing persistent results and attempt-based scores.

### Modified Capabilities

None.

## Impact

- Introduces the Next.js application structure, server endpoints or actions, React UI, and automated tests.
- Adds Tailwind CSS and daisyUI as UI dependencies.
- Adds local JSON word-list and history data files with server-side file access.
- The application targets local execution on a single Node.js process; writable JSON persistence is not intended for serverless deployment or concurrent multi-instance use.
