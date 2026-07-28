---
description: Analyze git changes and commit with AI-generated message.
agent: build
---

Follow these steps in order. Do NOT skip ahead or run `git commit` before completing all verification steps.

## Step 1 — Collect context

Branch name:
!`git branch --show-current`

Repository status:
!`git status -s`

## Step 2 — Inspect staged changes

!`git diff --staged`

## Step 3 — Verify before proceeding

Read the output of `git diff --staged` above.

- If the output is **empty** (no staged changes): stop here, DO NOT commit, and tell the user there is nothing staged. Suggest running `git add <files>` first.
- Only if the output is **non-empty**: continue to Step 4.

## Step 4 — Generate commit message

Based only on the staged changes from Step 2:
1. Determine the type of changes (new feature, enhancement, bug fix, refactoring, test, docs, etc.)
2. Draft a concise commit message (1-2 sentences) that focuses on the "why" rather than the "what"
3. Write the final message explicitly here before moving to Step 5.
4. Follow the convention: `<type>(<branch-name>): <generated message>`

## Step 5 — Commit

Take the exact message you wrote in Step 4 and run:

```
git commit -m "<your message here>"
```

DO NOT push to remote. Just commit locally.
