# Spec Delta

## Purpose

Requires a local account and an active session before a person can play or view history, and keeps each person's games separate.

## ADDED Requirements

### Requirement: Register a local account
The system SHALL create an account from a unique username and a password, and SHALL store the password only as a hash.

#### Scenario: Create an account
- **WHEN** a person submits a new username and a password
- **THEN** the system creates that account and starts a session for it

#### Scenario: Reject a duplicate username
- **WHEN** a person submits a username that already belongs to an account
- **THEN** the system creates no account and reports that the username is already in use

### Requirement: Log in with username and password
The system SHALL start a session only when the submitted username and password match an existing account.

#### Scenario: Log in successfully
- **WHEN** a person submits the username and password of an existing account
- **THEN** the system starts a session for that account and shows the game page

#### Scenario: Reject unknown credentials
- **WHEN** a person submits a username or password that does not match an account
- **THEN** the system starts no session and reports that the username or password is incorrect

### Requirement: Present the login page
The system SHALL show login as a full-height white page with a centered card, a Word Guess mark, labeled username and password fields, a full-width submit button, and a footer.

#### Scenario: Open login while signed out
- **WHEN** a person with no session opens the login page
- **THEN** the page shows the centered card, both fields, the submit button, and the footer without the game board

#### Scenario: Show a login error
- **WHEN** login fails
- **THEN** the error appears with the form and the entered password is not shown

### Requirement: Require a session for play and history
The system SHALL show the game page and the history page only to a person with a session, and SHALL send a person without a session to the login page.

#### Scenario: Open the game without a session
- **WHEN** a person with no session requests the game page
- **THEN** the system shows the login page and does not reveal a game

#### Scenario: Open history without a session
- **WHEN** a person with no session requests the history page
- **THEN** the system shows the login page and does not reveal any history

#### Scenario: Keep the session across a reload
- **WHEN** a person with a session reloads the game page
- **THEN** the system still shows the game page for that same account

### Requirement: End a session
The system SHALL end the current session when the person logs out and SHALL then require login again.

#### Scenario: Log out
- **WHEN** a signed-in person logs out
- **THEN** the system ends that session and shows the login page

### Requirement: Limit a game to its owner
The system SHALL let a signed-in person start, read, and guess only in games owned by that account.

#### Scenario: Continue an owned game
- **WHEN** a signed-in person opens a game that account owns
- **THEN** the system returns that game's board and status

#### Scenario: Refuse another account's game
- **WHEN** a signed-in person requests a game owned by a different account
- **THEN** the system does not reveal that game's answer, guesses, or status
