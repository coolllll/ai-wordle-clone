# score-history Specification

## Purpose

Preserves completed game results locally and lets the player review wins, failures, guesses, and attempt-based scores across sessions.

## Requirements

### Requirement: Record completed games
The system SHALL append exactly one history record when a game becomes won or failed.

#### Scenario: Record a win
- **WHEN** a player wins a game
- **THEN** the system records the completion time, answer, ordered guesses, won result, and attempt count as the numeric score

#### Scenario: Record a loss
- **WHEN** a player exhausts six accepted guesses
- **THEN** the system records the completion time, answer, ordered guesses, and failed result without a numeric score

#### Scenario: Prevent duplicate records
- **WHEN** a request is repeated for a game that has already been recorded
- **THEN** the system retains one history record for that game

### Requirement: Persist history locally
The system SHALL preserve completed-game history in local JSON storage so that records remain available after the application process restarts.

#### Scenario: Reload persisted history
- **WHEN** the application starts after one or more games were previously recorded
- **THEN** the system loads and exposes all valid existing history records

#### Scenario: No existing history
- **WHEN** no history file or records exist
- **THEN** the system presents an empty history without preventing gameplay

### Requirement: View score history
The system SHALL provide a history view ordered from newest to oldest and show each game's date, result, score, answer, and guesses.

#### Scenario: View a won game
- **WHEN** the player views a recorded win
- **THEN** the history displays its attempt count as the score

#### Scenario: View a failed game
- **WHEN** the player views a recorded loss
- **THEN** the history displays the result as failed rather than showing a numeric score

#### Scenario: View multiple games
- **WHEN** multiple completed games exist
- **THEN** the history lists the most recently completed game first

### Requirement: Handle storage failure safely
The system SHALL report a history persistence failure without incorrectly claiming that the result was saved or corrupting previously valid history.

#### Scenario: History write fails
- **WHEN** the local history file cannot be updated
- **THEN** the system preserves the prior valid data where possible and informs the player that the latest result was not saved

### Requirement: Keep completed games off the game page
The system SHALL show the completed-game list only on the history view, and SHALL NOT show that list on the game page. The game page SHALL still show the current game's own status.

#### Scenario: Open the game page when completed games exist
- **WHEN** completed games exist and the player opens the game page
- **THEN** the game page does not list those games and still lets the player play

#### Scenario: Finish the current game
- **WHEN** the current game becomes won or failed
- **THEN** the game page shows that game's own status, a win with its score or a loss with its answer, and does not show a completed-game list or a row for the game that just finished

#### Scenario: Open the history view
- **WHEN** the player opens the history view
- **THEN** the system lists completed games there from newest to oldest

### Requirement: Load history only for the history page
The system SHALL request the completed-game list only when the player opens the history page. The game page SHALL NOT call `GET /api/history` when it opens or when the current game ends.

#### Scenario: Open the game page
- **WHEN** the player opens the game page
- **THEN** the game page does not call `GET /api/history`

#### Scenario: Finish the current game on the game page
- **WHEN** the current game becomes won or failed while the player remains on the game page
- **THEN** the game page does not call `GET /api/history`

#### Scenario: Open the history page
- **WHEN** the player opens the history page
- **THEN** the system requests that page's completed-game list and does not require the game page to have requested it first
