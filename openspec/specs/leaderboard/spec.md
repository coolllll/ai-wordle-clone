# leaderboard Specification

## Purpose

Shows every signed-in person a ranking of each account's best win, without revealing another account's answers or guesses.

## Requirements

### Requirement: Open the leaderboard after login
The system SHALL show the leaderboard page only to a person with a session, and SHALL send a person without a session to the login page.

#### Scenario: Open the leaderboard while signed in
- **WHEN** a person with a session opens `/leaderboard`
- **THEN** the page shows the heading Leaderboard

#### Scenario: Open the leaderboard while signed out
- **WHEN** a person with no session requests `/leaderboard`
- **THEN** the system shows the login page and does not reveal any ranking

### Requirement: Link to the leaderboard
The signed-in shell SHALL show a Leaderboard link to `/leaderboard` beside the History link.

#### Scenario: See the link while signed in
- **WHEN** a signed-in person views the shell
- **THEN** the shell shows a Leaderboard link to `/leaderboard` next to History

### Requirement: Rank accounts by their best win
The system SHALL give each account one score equal to the fewest guesses in that account's won games, SHALL omit accounts with no win, and SHALL rank a lower score higher.

#### Scenario: Rank a better win first
- **WHEN** one account's best win took two guesses and another's took four
- **THEN** the account with two guesses is ranked above the account with four

#### Scenario: Omit an account with only losses
- **WHEN** an account has completed only failed games
- **THEN** that account does not appear on the leaderboard

#### Scenario: Use the best of several wins
- **WHEN** one account has wins in two guesses and in five guesses
- **THEN** that account's score is two

### Requirement: Break equal scores by time and name
When accounts share a best score, the system SHALL rank the account that completed a win at that score earlier higher. When those completion times are equal, the system SHALL rank the earlier stored username higher. Ranks SHALL be unique and consecutive from 1.

#### Scenario: Earlier best win ranks higher
- **WHEN** two accounts both have a best score of three and one completed that win first
- **THEN** the account that completed it first receives the better rank

#### Scenario: Username breaks a remaining tie
- **WHEN** two accounts have the same best score and the same completion time for that score
- **THEN** the account whose stored username sorts earlier receives the better rank, and the ranks are consecutive

### Requirement: Show rank, username, and score
Each leaderboard row SHALL show that account's rank, username, and score, and SHALL NOT show an answer or a guess list.

#### Scenario: Read one row
- **WHEN** a signed-in person views an account on the leaderboard
- **THEN** the row shows its rank, username, and score, and does not show an answer or guesses

### Requirement: Show an empty leaderboard
When no account has a win, the leaderboard page SHALL open and SHALL show no ranking rows.

#### Scenario: Nobody has won
- **WHEN** a signed-in person opens the leaderboard and no won games are recorded
- **THEN** the page shows the Leaderboard heading and no ranking rows

### Requirement: Report a failed leaderboard load
When the leaderboard cannot be loaded, the page SHALL show that the load failed and SHALL NOT show ranking rows.

#### Scenario: Storage cannot be read
- **WHEN** a signed-in person opens the leaderboard and the ranking cannot be loaded
- **THEN** the page shows that the leaderboard could not be loaded and shows no ranking rows

### Requirement: Load the ranking when the page opens
The system SHALL build the ranking when the leaderboard page is opened, and SHALL NOT refresh that ranking while the person remains on the page.

#### Scenario: Open the leaderboard
- **WHEN** a signed-in person opens `/leaderboard`
- **THEN** the system builds the ranking for that page open

#### Scenario: Stay on the page
- **WHEN** a signed-in person remains on the leaderboard page
- **THEN** the system does not refresh the ranking on its own

### Requirement: Keep the leaderboard off the game page
The game page SHALL NOT show the leaderboard.

#### Scenario: Open the game page
- **WHEN** a signed-in person opens the game page
- **THEN** the game page does not show leaderboard rows
