---
name: "/review"
id: "review"
category: "Workflow"
description: "Manually review unarchived work. Does not run automatically."
---

Manual review only. Do not run this command unless the user invokes `/review` or explicitly asks for a review.

Read and follow `.agents/skills/requesting-code-review/SKILL.md`.

Review only unarchived work:

- Active OpenSpec changes under `openspec/changes/`, excluding `openspec/changes/archive/`
- Code, specs, and tests that those active changes cover

Do not review anything under `openspec/changes/archive/`. If there is no unarchived work in scope, say so and stop.
