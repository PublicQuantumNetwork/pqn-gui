# PQN GUI

The touchscreen front end of a PQN Node, where the public plays the Games (Verify Quantum Link, Quantum Fortune, Share a Secret Message) at an exhibit, guided by Whobit the owl.

## Language

### Themes

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

## Relationships

- A **Seasonal Theme** sets any part of the **Palette**, **Images**, **Whobit accessory**, **Decorations**, **Celebration** and **Flavour copy**; anything it leaves out comes from the **Default Theme**
- A **Whobit accessory** appears on every page where Whobit does; **Decorations** belong to one **Scene**
- A page has one or more **Scenes**; a **Seasonal Theme** gives each **Scene** at most one set of **Decorations**
- **Fixed copy** is the same in every **Seasonal Theme**

## Example dialogue

> **Dev:** "The Halloween design rewrites the Quantum Fortune error as 'The spirits got their wires crossed.' Can the **Seasonal Theme** carry that?"
> **Domain expert:** "No, error messages are **Fixed copy**. A greeting or a fortune is **Flavour copy**; the error stays as it is."

## Flagged ambiguities

- "Confetti" was used for two things: the theme's **Celebration** and SSM4's burst of the player's own emoji. Resolved: the emoji burst is not part of any theme and is the same everywhere.

- The Halloween design's SSM1 board shows a short Halloween emoji list. Resolved: SSM keeps the full emoji picker in every **Seasonal Theme**; the emoji choice is not **Flavour copy**.
