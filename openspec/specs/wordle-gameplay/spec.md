# wordle-gameplay Specification

## Purpose

Provides an unlimited, interactive single-player word guessing game with consistent validation, feedback, and completion behavior.

## Requirements

### Requirement: Start a random game
The system SHALL let the player start a game with a randomly selected five-letter answer and SHALL allow another game to start after the current game ends.

#### Scenario: Start the first game
- **WHEN** the player opens the game with no active game
- **THEN** the system starts a game with an empty six-row board and a concealed five-letter answer

#### Scenario: Start another game
- **WHEN** the player finishes a game and requests another game
- **THEN** the system starts a new game without limiting how many games the player can play

### Requirement: Accept keyboard input
The system SHALL accept letters from both a physical keyboard and an on-screen keyboard, and SHALL support deleting and submitting the current guess.

#### Scenario: Enter and remove letters
- **WHEN** the player enters letters or uses delete before submission
- **THEN** the current row reflects the input and never contains more than five letters

#### Scenario: Submit from either keyboard
- **WHEN** the current row contains five letters and the player submits through either supported keyboard
- **THEN** the system sends that guess for validation

### Requirement: Validate submitted guesses
The system SHALL accept only five-letter alphabetic words contained in the allowed-word list and SHALL reject invalid guesses without consuming an attempt.

#### Scenario: Submit an allowed word
- **WHEN** the player submits a five-letter word in the allowed-word list
- **THEN** the system accepts the guess and consumes one attempt

#### Scenario: Submit an invalid word
- **WHEN** the player submits a guess that is malformed or absent from the allowed-word list
- **THEN** the system displays an error and leaves the remaining attempt count unchanged

#### Scenario: Submit after game completion
- **WHEN** the player submits a guess after the game has been won or lost
- **THEN** the system rejects the guess and preserves the completed result

### Requirement: Evaluate letter positions
The system SHALL evaluate each accepted letter as correct, present, or absent while accounting for repeated letters so that matches never exceed occurrences in the answer.

#### Scenario: Correct letter
- **WHEN** a guessed letter matches the answer at the same position
- **THEN** that tile is marked correct

#### Scenario: Present letter
- **WHEN** a guessed letter is not correct at its position but an unmatched occurrence exists elsewhere in the answer
- **THEN** that tile is marked present

#### Scenario: Excess repeated letter
- **WHEN** the guess contains more instances of a letter than the unmatched answer contains
- **THEN** the excess instances are marked absent

### Requirement: Complete a game
The system SHALL declare a win when the accepted guess equals the answer and SHALL declare a loss after six accepted guesses without a win.

#### Scenario: Win the game
- **WHEN** the player submits the answer within six accepted guesses
- **THEN** the system marks the game won and reports the number of attempts as the score

#### Scenario: Lose the game
- **WHEN** the sixth accepted guess does not equal the answer
- **THEN** the system marks the game failed and reveals the answer without assigning a numeric score

### Requirement: Display game feedback
The system SHALL display a responsive game board, game status, and keyboard states that reflect all accepted guesses and remain usable on mobile and desktop screens.

#### Scenario: Update board and keyboard
- **WHEN** an accepted guess is evaluated
- **THEN** the system displays the evaluation on the submitted row and updates each used key to its strongest known state

#### Scenario: View on a narrow screen
- **WHEN** the player uses the game on a narrow viewport
- **THEN** the board, controls, and status remain visible and operable without horizontal scrolling
