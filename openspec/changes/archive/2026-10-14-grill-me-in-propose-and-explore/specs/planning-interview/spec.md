# Spec Delta

## Purpose

Requires a planning interview through `grill-me` before `/opsx-propose` writes a change, and when `/opsx-explore` is shaping a plan or design.

## ADDED Requirements

### Requirement: Interview before creating a change
The `/opsx-propose` workflow SHALL run `grill-me` before creating a change, and SHALL NOT create that change or its planning artifacts until the person confirms shared understanding.

#### Scenario: A described request still waits
- **WHEN** a person starts `/opsx-propose` with a description of what to build or fix
- **THEN** the workflow runs `grill-me` and creates no change and no planning artifacts until that person confirms shared understanding

#### Scenario: Confirmed understanding writes the plan
- **WHEN** a person confirms shared understanding during a `/opsx-propose` interview
- **THEN** the workflow creates the change and its planning artifacts without a separate permission to write

### Requirement: Ask for a subject before the interview
The `/opsx-propose` workflow SHALL ask what to build or fix when the request has no description, and SHALL start `grill-me` only after a description exists.

#### Scenario: Change name only
- **WHEN** a person starts `/opsx-propose` with only a change name
- **THEN** the workflow asks what to build or fix and does not start `grill-me` until a description is given

#### Scenario: No input
- **WHEN** a person starts `/opsx-propose` with no input
- **THEN** the workflow asks what to build or fix and does not start `grill-me` until a description is given

### Requirement: Interview while planning in explore
The `/opsx-explore` workflow SHALL run `grill-me` when a person is planning a change or sharpening a plan or design, and SHALL continue until the decision tree is empty.

#### Scenario: Planning a change
- **WHEN** a person uses `/opsx-explore` to plan a change
- **THEN** the workflow runs `grill-me` and asks every ready decision in the current round, each with a recommended answer

#### Scenario: Sharpening a design
- **WHEN** a person uses `/opsx-explore` to sharpen a plan or design
- **THEN** the workflow runs `grill-me` until no decision remains unsettled

### Requirement: Keep investigation outside the interview
The `/opsx-explore` workflow SHALL keep its existing explore stance for code investigation, open questions, and fact-finding, and SHALL NOT run `grill-me` for those.

#### Scenario: Inspect existing code
- **WHEN** a person uses `/opsx-explore` to inspect how the code works
- **THEN** the workflow does not run `grill-me`

#### Scenario: Open question
- **WHEN** a person uses `/opsx-explore` for an open question that is not a plan or design decision
- **THEN** the workflow does not run `grill-me`

### Requirement: Wait for write permission in explore
After shared understanding in `/opsx-explore`, the workflow SHALL NOT write planning artifacts until the person requests that capture or answers yes to writing them.

#### Scenario: Understanding alone does not write
- **WHEN** a person confirms shared understanding during an explore interview
- **THEN** the workflow writes no planning artifacts

#### Scenario: Explicit permission writes
- **WHEN** a person confirms shared understanding and then requests or answers yes to writing a named set of artifacts
- **THEN** the workflow writes only that set

### Requirement: Conduct the interview in Thai
A planning interview SHALL ask the person in Thai.

#### Scenario: Propose interview
- **WHEN** `/opsx-propose` runs `grill-me`
- **THEN** the questions to the person are in Thai

#### Scenario: Explore interview
- **WHEN** `/opsx-explore` runs `grill-me`
- **THEN** the questions to the person are in Thai

### Requirement: Delegate the interview to grill-me
`/opsx-propose` and `/opsx-explore` SHALL start a planning interview by invoking `grill-me`, and SHALL NOT embed the `grilling` interview procedure in the workflow text.

#### Scenario: Propose delegates
- **WHEN** `/opsx-propose` starts a planning interview
- **THEN** it invokes `grill-me` and the interview procedure comes from `grilling`

#### Scenario: Explore delegates
- **WHEN** `/opsx-explore` starts a planning interview
- **THEN** it invokes `grill-me` and the interview procedure comes from `grilling`

### Requirement: Use the same gate on command and skill
The slash command and the skill for propose SHALL apply the same interview gate, and the slash command and the skill for explore SHALL apply the same interview gate.

#### Scenario: Propose from either entry
- **WHEN** a person starts propose from the slash command or from the skill with a description
- **THEN** both wait for shared understanding before creating a change

#### Scenario: Explore from either entry
- **WHEN** a person starts explore from the slash command or from the skill to plan a change
- **THEN** both run `grill-me`

### Requirement: Leave other workflows unchanged
The apply, archive, update, and sync workflows SHALL NOT run `grill-me`.

#### Scenario: Apply stays unchanged
- **WHEN** a person starts the apply workflow
- **THEN** that workflow does not run `grill-me`

#### Scenario: Archive stays unchanged
- **WHEN** a person starts the archive workflow
- **THEN** that workflow does not run `grill-me`

### Requirement: Provide the grilling interview
The project SHALL provide the `grilling` interview that `grill-me` invokes.

#### Scenario: grill-me can resolve grilling
- **WHEN** a workflow invokes `grill-me`
- **THEN** the `grilling` interview is available in the project
