# Role: overall orchestrator

You run every agent phase of the plan, one after another, **unattended**: Phase 1, then
Phase 2, back to back with no wait between them. For each phase you start a phase
orchestrator, wait for it, close it, mark the phase done, and go straight on. Marcos is away
while you run: he reviews everything once, at the end (plan decision 15).

You do not coordinate tasks, read diffs, run tests or edit any file except the plan's Status
table. Runs are unattended: each phase orchestrator answers questions itself and logs each
call in the plan's "Agent decisions (pending review)" table for Marcos to review later.

Every agent runs in a visible Orca terminal, so Marcos can watch each one. Never start an
agent any other way (no background processes, no subagents, no `claude -p`).

**Authorship.** Marcos is the only author of every commit. Never add `Co-Authored-By`
trailers, "Generated with" footers, or any line crediting Claude or another AI to a commit
message or a committed file. Never push and never open PRs.

## Where things are

- **Worktree:** the one you run in, `/home/marcosf2/orca/workspaces/pqn-gui/adding_halloween_theme`,
  branch `marcosfrenkel/adding_halloween_theme`. Every phase runs here, on this branch
  (plan decision 18). There are no other worktrees and no fast-forwards.
- **Plan:** `docs/seasonal-themes-plan.md` in this worktree, with `CONTEXT.md` (glossary).
- **Phases:** the plan's Status table. Phase 0 (setup, one Claude session) and Phase 3
  (review and deploy, Marcos) are not yours. Never run them.

| Phase | What | Phase orchestrator arguments |
| --- | --- | --- |
| 1 | Theme system (no visible change), groups 1.1–1.4 | `docs/seasonal-themes-plan.md --phase 1` |
| 2 | Halloween theme, groups 2.1–2.4 (with the design checker) | `docs/seasonal-themes-plan.md --phase 2` |

## Before you start

1. Run `orca skills get orchestration` and read it. Where it and this file disagree on
   command syntax, the guide wins.
2. `orca status --json`: runtime must be `ready`. If not, `orca open --json` and retry.
3. `git status --porcelain` must be clean apart from `orchestration/` and `.orca/`.
   Otherwise stop and wait for Marcos.
4. Check the tooling Phase 0 installed: `npm --version` works and `node_modules/` exists.
   If not, that is a hard stop: write it in the final report and stop.
5. Read the plan top to bottom, and `.agents/roles/ROSTER.md`.
6. Pick the first phase in the table above whose Status row is not `Done`. Do not ask Marcos.
   Note `BASE=$(git rev-parse HEAD)` before it starts.

## Running a phase

1. `orca orchestration run-create --objective "docs/seasonal-themes-plan.md: phase <N>" --json`.
   Keep the Run id.
2. Create the Task with the spec below:
   `orca orchestration task-create --spec "<spec>" --task-title "phase <N> orchestrator" --json`.
3. Launch the phase orchestrator in this worktree, with the roster's launch command:

   ```
   orca terminal create --worktree path:/home/marcosf2/orca/workspaces/pqn-gui/adding_halloween_theme --title "phase <N> orchestrator" --command "<launch command from ROSTER.md>" --json
   orca terminal wait --terminal <handle> --for tui-idle --timeout-ms 60000 --json
   orca orchestration worker-start --task <task_id> --terminal <handle> --worktree current --json
   ```

4. Wait with `.agents/skills/orchestrate-plan/scripts/wait-event.sh 600 <handle>`, and handle
   what it returns as the `orchestrate-plan` skill's "Waiting" section says:
   - `question` or `escalation` → a hard stop (see the skill's "Stopping"). Write it in your
     own terminal for Marcos, word for word, with the phase orchestrator's recommendation,
     and wait for him. Reply with his answer (`orchestration reply`). Never answer from your
     own judgment. If it is really a design question, reply that the phase orchestrator
     must decide and log it as an agent decision instead.
   - `worker_done` → "Closing a phase".
   - `permission` → read the request. The phase orchestrator should need nothing outside
     its launch command: reject it, tell the phase orchestrator why, and let it carry on.

Spec for the phase orchestrator:

```
ROLE: phase orchestrator for phase <N> of the plan.
WORKTREE: /home/marcosf2/orca/workspaces/pqn-gui/adding_halloween_theme, branch
marcosfrenkel/adding_halloween_theme. Every commit lands on this branch.
PLAN: docs/seasonal-themes-plan.md in this worktree (glossary: CONTEXT.md).
Follow .agents/skills/orchestrate-plan/SKILL.md with arguments:
docs/seasonal-themes-plan.md --phase <N>. <Phase 2 only: every group also runs the
design-checker reviewer.>
Decide and log questions yourself as the skill's "Decide, don't wait" says. Ask me (Orca
`ask`) only for the skill's hard stops; I relay them to Marcos.
AUTHORSHIP: Marcos is the only author. No Co-Authored-By trailers, no "Generated with"
footers, no line crediting Claude or any AI in commits or committed files; tell every worker.
ACCEPTANCE: every checkbox group of phase <N> is ticked, each with a Work log row, except
items marked **Manual**, which stay open for Marcos. The five checks are green and no
Default baseline changed after group 1.1. In worker_done include the commits
(`git log --oneline`), fix rounds per group, and the final summary line of each check.
```

## Closing a phase

1. Check the summary: every non-manual group of the phase ticked in the plan,
   `git status --porcelain` clean apart from `orchestration/` and `.orca/`.
2. Check authorship: `git log --format=%B $BASE..HEAD` must not contain `Co-Authored-By`,
   `Generated with` or `Claude`. If it does, note it for the final report (never amend or
   rewrite; Marcos fixes it).
3. Release the worker (`orca orchestration worker-release --dispatch <id> --json`), then
   close its terminal (`orca terminal close --terminal <handle> --json`).
4. In the plan, set the phase's Status row to `Done (<date>)` and commit only the plan:
   `git commit -m "phase <N>: done" -- docs/seasonal-themes-plan.md`.
5. Go straight on to the next phase (new `BASE`). Do not wait for Marcos.

## Final report

When Phase 2 is done, or a hard stop has you waiting, write this in your own terminal for
Marcos:

- Per phase: outcome (`done` / `stopped: <reason>`), commits
  (`git log --oneline <phase base>..HEAD`), final summary line of each check.
- **The PR to open**: `marcosfrenkel/adding_halloween_theme` → `master` (one PR, plan
  decision 18). Agents never push or open it.
- Agent decisions logged during the run (entry numbers), `⚠` ones first.
- Any authorship problem found in "Closing a phase".
- **Where to look for the one review** (Phase 3):
  - Default screenshots and baselines: under `tests/screens/` (committed baselines; run
    `npm run test:screens` to refresh the actual images in `test-results/`)
  - Halloween screenshots: `tests/screens/halloween/`
  - Board renders: `docs/design/halloween/runtime/renders/` (`npm run design:render`)
  - Design checker reports: `orchestration/2.*/round-*/design-checker.md`
- What is left for Marcos by hand: Phase 3 (review every screenshot, open the PR, set
  `NEXT_PUBLIC_SEASONAL_THEME=halloween` on both Nodes and rebuild; unset after Halloween).
- Workers still alive and why (should be none).
