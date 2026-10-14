# Spec Delta

## MODIFIED Requirements

### Requirement: Record completed games
The system SHALL append exactly one history record for the signed-in account when a game that account owns becomes won or failed.

#### Scenario: Record a win
- **WHEN** a signed-in player wins a game that account owns
- **THEN** the system records the completion time, answer, ordered guesses, won result, and attempt count as the numeric score for that account

#### Scenario: Record a loss
- **WHEN** a signed-in player exhausts six accepted guesses in a game that account owns
- **THEN** the system records the completion time, answer, ordered guesses, and failed result without a numeric score for that account

#### Scenario: Prevent duplicate records
- **WHEN** a request is repeated for a game that has already been recorded
- **THEN** the system retains one history record for that game

#### Scenario: Keep another account's result separate
- **WHEN** one account completes a game
- **THEN** the system does not add that history record to any other account

### Requirement: Persist history locally
The system SHALL preserve completed-game history in local JSON storage so that each account's records remain available after the application process restarts.

#### Scenario: Reload persisted history
- **WHEN** the application starts after one or more games were previously recorded for an account
- **THEN** the system loads that account's valid history records and exposes them only to that account

#### Scenario: No existing history
- **WHEN** the signed-in account has no history records
- **THEN** the system presents an empty history without preventing gameplay

#### Scenario: Ignore records with no owner
- **WHEN** stored games have no owning account
- **THEN** the system does not present those games in any account's history

### Requirement: View score history
The system SHALL provide the signed-in account a history view of only that account's games, ordered from newest to oldest, and show each game's date, result, score, answer, and guesses.

#### Scenario: View a won game
- **WHEN** the player views a recorded win that account owns
- **THEN** the history displays its attempt count as the score

#### Scenario: View a failed game
- **WHEN** the player views a recorded loss that account owns
- **THEN** the history displays the result as failed rather than showing a numeric score

#### Scenario: View multiple games
- **WHEN** the signed-in account has multiple completed games
- **THEN** the history lists that account's most recently completed game first

#### Scenario: Hide another account's games
- **WHEN** another account has completed games
- **THEN** the signed-in account's history does not list those games
