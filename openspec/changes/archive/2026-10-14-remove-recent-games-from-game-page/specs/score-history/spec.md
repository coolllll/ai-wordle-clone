# Spec Delta

## ADDED Requirements

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
