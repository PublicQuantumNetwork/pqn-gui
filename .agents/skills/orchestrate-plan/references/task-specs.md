# Task specs and report format

Fill these in for every Dispatch. Orca adds its own worker preamble (IDs, how to `ask`,
how to send `worker_done`) above your spec; do not repeat it. Replace every `<...>`.
Specs must stand alone: a worker has not seen this conversation, the other workers, or
earlier tasks. The role's standing instructions live in its role file (`.agents/roles/`);
if `ROSTER.md` says the runner does not load it, paste it above the spec.

Orca's spec contract asks for Target, Change, Constraints, Ownership and Observable
acceptance. The templates below cover all five.

---

## Coder: implement

```
ROLE: coder for plan task <T>.

TARGET: repository at <worktree path>, branch <branch>. Plan file: <plan-file>.

READ FIRST, in this order: <plan-file> (whole file, especially "Design decisions",
"Testing rule" and "Workflow"), then CONTEXT.md (the glossary). Follow the plan's rules
exactly, except where this spec overrides them.

THE TASK, copied from the plan:
<task text, verbatim, including its Acceptance and Tests lines>

ALREADY DONE: <what earlier groups and agent decisions already did toward these boxes,
from the plan's "Checkbox groups" notes and "Agent decisions" entries, with entry numbers
and commit hashes; "nothing" if none>. Build on that code; do not redo or undo it.

CHANGE: implement exactly this task. Nothing from other tasks, no drive-by fixes.

CONSTRAINTS:
- Before editing any function or class, do the caller check the plan describes and
  report what you found in your worker_done summary.
- Use only terms from the glossary. If you need a word it lacks, use Orca `ask` and wait.
- If the plan does not answer a question, use Orca `ask` and wait. Do not guess.
- If you cannot finish without going outside the task, send an Orca escalation.

OWNERSHIP: you may edit files under src/, public/ and tests/, and <any other paths the task
names>. Default baselines under tests/screens/: <group 1.1: "you create them with
`npm run test:screens -- --update-snapshots` from src/ exactly as at the Phase 0 commit" |
any other group: "never update them; a changed Default screen is a defect">.
Do not edit <plan-file>, orchestration/, or any other plan or doc file unless the task
says so. You are the only agent editing files.

CHECKS: run all five from the repo root; all must pass (plan decision 19):
  npm run lint
  npm run format:check
  npm test
  npm run test:screens
  npm run build
Format only your own files: npm run format:files -- <paths>. Never `npm run format`, never
`npx`, never install anything.
Already failing before this task (leave alone): <from D/decisions.md, or "none">.

COMMIT: when the named tests and the full checks pass, make exactly ONE commit:
  git add <only the files you changed>      (never `git add -A` or `git add .`)
  git commit -m "<T>: <short summary of what this commit does>"
No Co-Authored-By trailer, no "Generated with" footer, no line crediting Claude or any AI:
Marcos is the only author.
Never add anything under orchestration/. Never push, amend, rebase, reset, stash,
checkout or switch branches.

ACCEPTANCE: the task's tests are in the same commit, and the five checks pass. In worker_done include: the commit hash, the summary line of each check, the caller
check results, and anything you were unsure about.
```

## Coder: fix round

```
ROLE: coder for plan task <T>, fix round <k> of at most 5.

You implemented this task earlier in this session. The reviewers found the problems
below. The orchestrator has already filtered them: fix every item. If you believe an
item is wrong, do not skip it silently: use Orca `ask` and explain why.

FIX LIST (also in <D>/round-<k-1>/fix-list.md):
<numbered items: what, where (file:line), why, which reviewers raised it>

<If any check was red: FAILING CHECK OUTPUT: <command and output>>

Same constraints, ownership and commit rules as before. Make exactly ONE commit:
  git commit -m "<T>: fix from review round <k>: <short summary>"

ACCEPTANCE: every item addressed, named tests and the full checks pass. In worker_done list
each item number with what you did, plus the commit hash and each check's summary line.
```

## Reviewer: first review

```
ROLE: <agent-id> (<role>) for plan task <T>. You are one of <six | seven (Phase 2, with the
design checker)> reviewers. You only read.

TARGET: the commits `git log <BASE>..<HEAD>` on branch <branch> in <worktree path>.
Look at them with `git show` and `git diff <BASE>..<HEAD>`. Read surrounding code as needed.

READ FIRST: <plan-file> (whole file) and CONTEXT.md (the glossary). The task, copied from
the plan:
<task text, verbatim>

YOUR FOCUS: as your role file says (.agents/roles/<role>.md). Stay in that lane.

OWNERSHIP: you may create exactly one file: <report path>. Do not edit any other file.
Do not run git commands that change anything. You may run the five checks (never with
`--update-snapshots`) and `npm run design:render`.
AUTHORSHIP: Marcos is the only author. A Co-Authored-By trailer, "Generated with" footer or
any line crediting Claude or an AI in the commits is a must-fix.

OUTPUT: write the report in the format below to <report path>. In worker_done give the
verdict and the count of findings per severity, and pass --report-path <report path>.
```

## Design checker (Phase 2 groups only)

Use "Reviewer: first review" and "Reviewer: re-review" above with role `design-checker`,
and add:

```
SCREENS: the Halloween screens this group touches: <list, e.g. Home, QF1, QF2, Measuring
popup>. Run `npm run test:screens` and `npm run design:render` yourself, then compare each
screenshot under tests/screens/halloween/ with its board render under
docs/design/halloween/runtime/renders/ (pairs: the plan's "Scenes" table), and read the
board source (docs/design/halloween/<Board>.dc.html) for exact values. The plan's
"Intended differences from the design" are not defects.
```

## Reviewer: re-review

```
ROLE: same as before, plan task <T>, re-review after fix round <k>.

The coder made a fix commit: <hash>. See it with `git show <hash>`.
Your previous report: <previous report path>. The fix list the coder worked from:
<D>/round-<k-1>/fix-list.md (some of your findings may have been dropped on purpose;
the reasons are in <D>/decisions.md).

Do three things:
1. For each of your previous findings: fixed / not fixed / dropped by orchestrator.
2. Did the fix commit break or weaken anything in your focus area?
3. New findings in your focus area caused by the fix commit.

OWNERSHIP and OUTPUT: same as before, but write to <new report path>.
```

---

## Report format (all reviewers)

```markdown
# <T> — <agent-id> — round <n>

Verdict: approve | changes-needed

## Findings

### F1 — must-fix | should-fix | nit
- Where: path/to/file.tsx:123
- What: one sentence.
- Why: one or two sentences; quote the plan line if it is a plan rule.
- Suggested fix: one or two sentences.

### F2 — ...

## Previous findings (re-review only)
- F1: fixed | not fixed (why) | dropped by orchestrator

## Notes
Anything else, e.g. tests run and their summary line.
```

Severity meaning:
- **must-fix**: wrong behaviour, a broken rule from the plan, a missing named test, a test
  that cannot fail.
- **should-fix**: real weakness that is cheap to fix now (missing edge-case test, unclear
  error message, duplicated logic).
- **nit**: preference only. The orchestrator will not send these to the coder.

Verdict is `approve` only when there are no must-fix or should-fix findings.
