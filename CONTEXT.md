# Context

Shared language for the PQN web frontend. Terms here are the ones we use when
talking about the product with non-programmers — exhibit staff, node operators,
and visitors. Implementation details belong in the code, not here.

## Deployment shape

A **node** is one physical PQN installation: a display, a machine running this
frontend, and the quantum hardware behind it. There are 2 nodes today, 5
planned. Each node runs the Next.js server directly in a tmux session started
on boot; deployment is `ssh` in, `git pull master`, reboot. There is no
container runtime and no shared file store — anything a node needs must arrive
via GitHub.

## Terms

### Visitor

A member of the public standing at a node. Visitors are anonymous, arrive
without instruction, and may walk away mid-experiment. Not the same as a **node
operator**, who is exhibit staff and maintains the machine.

### Game

One of the activities a **visitor** can choose from the home page: Verify
Quantum Link (CHSH), Quantum Fortune, or Share a Secret Message (SSM). The
first two are single-player; SSM needs a second visitor at another **node**.

A game can be unavailable — the backend reports this per game from
`GET /games/availability`, and an unavailable game shows as a greyed-out button.
When every game is unavailable the node shows a maintenance page instead of the
home page.

Note: parts of this document and the code say "experiment" for the same thing.
"Game" is what the visitor reads on the button, so prefer it.

### Game run

One attempt at a **game**, from the moment a visitor picks it off the home page
to the moment it reaches a result, errors out, or is abandoned. The unit we
count when reporting how much a node is used: "300 game runs in October".

A game run is not a person. A family of four crowded round one screen is one
game run, and a visitor who plays all three games is three. We do not report on
whole visits, but runs are timestamped per node, so consecutive runs can be
grouped back into a probable single visit afterwards if the question comes up.

A run ends in one of four ways, and the difference is the interesting part:

- **Completed** — the visitor saw a result.
- **Failed** — the hardware or the backend could not produce a result, and the
  visitor saw an error. Distinct from a _disappointing_ result: a CHSH value
  below 2 is a real measurement, not a failure.
- **Declined** — SSM only, where the other node's visitor said no or never
  answered.
- **Abandoned** — the visitor walked away part-way through.

A two-player SSM produces one game run _per node_, because two visitors each
played. Counting the joint activity once means filtering to the leader's side.

### Attract loop

The promotional video that plays fullscreen on the home page when no visitor is
present, inviting a passerby to engage. Borrowed from arcade/kiosk convention.

Deliberately _not_ called an "intro video": it does not play before or during
first use, and a visitor who is actively using the kiosk never sees it. It is
what the node shows an empty room.

- Arms only on the home page, never during an experiment.
- Cycles rather than looping continuously: **idle delay**, one full pass of the
  video, **idle delay**, one pass, in perpetuity. An unattended node therefore
  alternates between the video and its own home page instead of showing video
  without pause.
- Any visitor interaction dismisses it immediately. The dismissing touch is
  swallowed, so a visitor never lands in an experiment they did not choose.
- An incoming follow request also dismisses it, so the request is never hidden
  behind a video.
- Dismissal is presentational: the only side effect is re-checking game
  availability, since a node may have been idle for hours. Coordination state is
  deliberately left alone — see the decision log for why that is unresolved.
- A node with no video file present simply never shows an attract loop. It is an
  enhancement, not a dependency.
- A **visitor** can also summon it deliberately, from an "Intro Video" button in
  the header — so the video is available on demand to someone who wants to watch
  it, not only to an empty room. The button appears on the home page only, since
  that is the only place the attract loop exists.

### Idle delay

How long a node sits on the home page with no visitor interaction before the
**attract loop** starts. Tunable per node, because a busy exhibit floor and a
quiet lobby want different values.

### Operator peek

A **node operator** asking Whobot, from Slack, to show them what a node is
currently displaying. The capture is a photograph of the node's real screen, so
whatever the **visitor** would see is what the operator gets.

A peek may optionally dismiss the **attract loop** first, because the two things
an operator wants to check are only visible on the home page: whether game
availability took effect, and whether anyone is mid-experiment.

Two consequences follow from a peek not being a visitor:

- A peek re-arms the attract loop after a short grace period rather than the
  full **idle delay** — nobody is standing at the node, so it should go back to
  attracting quickly.
- A peek can never pull a visitor out of a running experiment. The attract loop
  only exists on the home page, so a node mid-experiment simply ignores the
  dismissal and is photographed as it is. That is the desired answer to "is
  someone doing anything", not a limitation.

Note that an attract loop _playing_ already answers "is anyone here?" — no
dismissal needed. Dismissal is for reading game availability off the buttons.

### Touch prompt

The "please touch the screen to begin" message that fades in and out over the
**attract loop**. Its job is to tell a passerby the display is interactive
rather than a TV playing an ad, so it is placed out of the way of the video's
content and never obscures it.

## Seasonal themes

How the Games (Verify Quantum Link, Quantum Fortune, Share a Secret Message) and
Whobit the owl change look for a holiday or season.

**Seasonal Theme**:
A named look for a holiday or season (e.g. Halloween) made of a Palette, Images, a Whobit accessory, Decorations, a Celebration and Flavour copy, layered over the Default Theme.
_Avoid_: skin, mode, holiday mode

**Default Theme**:
Today's Illini look; the Seasonal Theme every other one falls back to for anything it does not set.
_Avoid_: base theme, normal mode

**Whobit accessory**:
Something Whobit wears in a Seasonal Theme (e.g. Halloween's witch hat), drawn over each of Whobit's three poses.
_Avoid_: costume, hat overlay

**Decorations**:
Ornamental art on a page (monsters, bats, mist) that sits above the page and never changes how a Game works.
_Avoid_: overlay, effects

**Celebration**:
The effect that plays when a Game succeeds (today's fireworks; Halloween's burst of bats and pumpkins).
_Avoid_: fireworks, confetti, success animation

**Scene**:
One state of a page that can carry its own Decorations (e.g. CHSH3 when the photons are not shown to be entangled); every Seasonal Theme shares the same list of Scenes.
_Avoid_: board, screen, view

**Measuring popup**:
The dialog shown while a Game's photons are measured, with an illustration, the progress and an explanation.
_Avoid_: modal box, loading modal

**Flavour copy**:
Text a Seasonal Theme may replace or add in named slots: Whobit's greetings and lead-ins, Quantum Fortune's fortunes and quotes.
_Avoid_: themed text

**Fixed copy**:
Text no Seasonal Theme may change: physics explanations, instructions and error messages.
_Avoid_: core copy

### Relationships

- A **Seasonal Theme** sets any part of the **Palette**, **Images**, **Whobit accessory**, **Decorations**, **Celebration** and **Flavour copy**; anything it leaves out comes from the **Default Theme**
- A **Whobit accessory** appears on every page where Whobit does; **Decorations** belong to one **Scene**
- A page has one or more **Scenes**; a **Seasonal Theme** gives each **Scene** at most one set of **Decorations**
- **Fixed copy** is the same in every **Seasonal Theme**

### Example dialogue

> **Dev:** "The Halloween design rewrites the Quantum Fortune error as 'The spirits got their wires crossed.' Can the **Seasonal Theme** carry that?"
> **Domain expert:** "No, error messages are **Fixed copy**. A greeting or a fortune is **Flavour copy**; the error stays as it is."

### Flagged ambiguities

- "Confetti" was used for two things: the theme's **Celebration** and SSM4's burst of the player's own emoji. Resolved: the emoji burst is not part of any theme and is the same everywhere.

- The Halloween design's SSM1 board shows a short Halloween emoji list. Resolved: SSM keeps the full emoji picker in every **Seasonal Theme**; the emoji choice is not **Flavour copy**.
