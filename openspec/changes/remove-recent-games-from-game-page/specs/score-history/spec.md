# Spec Delta

## ADDED Requirements

### Requirement: Keep completed games off the game page
The system SHALL show the completed-game list only on the history view, and SHALL NOT show that list on the game page. The game page SHALL still show the current game's own status.

#### Scenario: Open the game page when completed games exist
- **WHEN** completed games exist and the player opens the game page
- **THEN** the game page does not list those games and still lets the player play

#### Scenario: Finish the current game
- **WHEN** the current game becomes won or failed
- **THEN** the game page shows that game's own result and does not list other completed games

#### Scenario: Open the history view
- **WHEN** the player opens the history view
- **THEN** the system lists completed games there from newest to oldest
