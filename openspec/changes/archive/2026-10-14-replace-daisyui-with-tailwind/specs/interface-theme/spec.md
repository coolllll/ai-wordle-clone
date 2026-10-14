# Spec Delta

## Purpose

Gives the game shell, controls, alerts, letter tiles, and history cards one consistent theme so each state stays visually distinct.

## ADDED Requirements

### Requirement: Present a consistent shell theme
The system SHALL render the game and history pages with one shared page background, header surface, and readable text color.

#### Scenario: Open the game page
- **WHEN** the player opens the game page
- **THEN** the page background, header, and title text use the shared theme and the History control is visibly actionable

#### Scenario: Open the history page
- **WHEN** the player opens the history page
- **THEN** the page uses the same background, header, and text colors as the game page

### Requirement: Distinguish feedback colors
The system SHALL use separate colors for a correct letter, a present letter, an absent letter, a success notice, and an error notice.

#### Scenario: Show evaluated tiles
- **WHEN** an accepted guess is shown on the board
- **THEN** correct, present, and absent tiles are each a different color from one another and from an empty tile

#### Scenario: Show a success notice
- **WHEN** a completed game reports that its result was saved
- **THEN** the notice is visually distinct from an error notice

#### Scenario: Show an error notice
- **WHEN** the system reports an invalid guess or a failed history save
- **THEN** the notice uses the error color rather than the success color

### Requirement: Group history entries
The system SHALL present each completed game as a separate visual group that remains readable on a narrow screen.

#### Scenario: View several completed games
- **WHEN** more than one completed game is listed
- **THEN** each game appears in its own grouped block without overlapping the next game

#### Scenario: View history on a narrow screen
- **WHEN** the player views history on a narrow viewport
- **THEN** each grouped block fits within the page without horizontal scrolling
