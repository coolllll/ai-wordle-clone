# Tasks

## 1. Application Setup

- [ ] 1.1 Scaffold a Next.js App Router project with TypeScript, linting, and the source-directory layout, and verify the development server renders the initial page
- [ ] 1.2 Install and configure Tailwind CSS and daisyUI with an application theme, and verify a daisyUI component renders with the selected theme
- [ ] 1.3 Configure unit and component test tooling with a smoke test, and verify the test command exits successfully

## 2. Game Rules and Word Data

- [ ] 2.1 Add JSON answer and allowed-guess word lists plus typed loading and normalization, and verify tests reject malformed, duplicate, and non-five-letter entries
- [ ] 2.2 Implement pure repeated-letter evaluation using exact matches before present matches, and verify unit tests cover correct, present, absent, and excess duplicate letters
- [ ] 2.3 Implement game creation, guess validation, attempt tracking, scoring, and win/loss transitions, and verify unit tests cover invalid guesses, wins on attempts 1 through 6, and sixth-attempt failure
- [ ] 2.4 Implement public game projections that conceal active answers and reveal completed answers, and verify serialization tests never expose an active answer

## 3. Local JSON Persistence

- [ ] 3.1 Define and validate the persisted game-data schema with safe empty-file initialization, and verify storage tests load empty and valid data
- [ ] 3.2 Implement serialized atomic JSON writes through temporary-file replacement, and verify temporary-directory tests preserve prior data when a write fails
- [ ] 3.3 Persist active and completed game records with idempotent completion, and verify restart and repeated-completion tests produce one durable record per game
- [ ] 3.4 Implement newest-first history projection with attempt-count scores for wins and no score for failures, and verify storage tests cover ordering and both result types

## 4. Server API

- [ ] 4.1 Add the game-creation Route Handler with random answer selection, and verify API tests return a new public game without its answer
- [ ] 4.2 Add game retrieval and guess-submission Route Handlers with input validation and explicit error responses, and verify API tests cover restore, valid guesses, invalid guesses, missing games, and completed games
- [ ] 4.3 Add the history Route Handler, and verify API tests return completed records newest first with the required fields
- [ ] 4.4 Map storage failures to safe API errors without overwriting valid data, and verify API tests do not claim success when persistence fails

## 5. Gameplay Interface

- [ ] 5.1 Build the responsive daisyUI page shell, game board, and tile states, and verify component tests render six five-cell rows without horizontal overflow at a narrow viewport
- [ ] 5.2 Implement shared input state for physical and on-screen keyboards, including delete, submit, length limits, and pending-state protection, and verify component tests exercise both input methods
- [ ] 5.3 Connect game creation, restoration, and guess submission to the API, and verify a component integration test covers starting, reloading, and continuing a game
- [ ] 5.4 Display validation errors, tile feedback, keyboard knowledge, and win/loss results, and verify component tests cover an invalid word, a winning guess, and a failed sixth guess
- [ ] 5.5 Add the unlimited “new game” flow after completion, and verify consecutive games can start without refreshing the page

## 6. Score History Interface

- [ ] 6.1 Build a responsive history view showing date, result, score, answer, and ordered guesses, and verify component tests cover empty, won, and failed histories
- [ ] 6.2 Refresh history after a game completes and display persistence errors clearly, and verify component tests cover successful save feedback and a failed-save message

## 7. Integration Verification

- [ ] 7.1 Add an end-to-end local gameplay test covering a valid win, history persistence, page reload, and starting another game, and verify it passes against the production-style server
- [ ] 7.2 Document local installation, development, testing, production start, JSON data locations, and the single-process limitation in README.md, and verify every documented command runs as written
- [ ] 7.3 Run formatting, linting, type checking, all tests, and the production build, and resolve any failures until every command exits successfully
