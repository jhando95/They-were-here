# 🛸 THEY WERE HERE

*A single-player tabletop mystery campaign + digital companion app.*

> Pinebrook. Population 8,213. Nothing happens here. Nothing has ever happened here.
>
> Last night at exactly **2:47 AM**, you watched your neighbor float out of his
> bedroom window in a cone of humming cyan light. This morning he's mowing his
> lawn. He's been mowing the same strip for three hours. He's wearing a suit.
> He just called you "FELLOW HUMAN NEIGHBOR."
>
> Nobody believes you. But you know what you saw.

**They Were Here** is a short (3-act, ~3-session) tabletop campaign for exactly
two people: one **Game Master** and one **player**. It's a suburban sci-fi
mystery with light combat, wacky alien-exposure superpowers, talking dogs,
sinister HOAs, and a finale where being aggressively, weirdly human is the most
powerful stat in the game.

## What's in the box

| Path | What it is | Who reads it |
|---|---|---|
| `index.html` | **The Pinebrook Field Kit** — companion web app | Both, at the table |
| `campaign/rules.md` | The PORCHLIGHT rules-lite system + pregen characters | Both |
| `campaign/gear-and-glow.md` | Gear compendium, Glorptech artifacts, power tiers, advancement, Marks | Both |
| `campaign/campaign-guide.md` | Campaign overview: the secret, the acts, the endings | **GM ONLY** ⚠️ |
| `campaign/act1-guide.md` | Act One, scene by scene: read-alouds, DCs, branches | **GM ONLY** ⚠️ |
| `campaign/act2-guide.md` | Act Two: allies, block party, the Undermart | **GM ONLY** ⚠️ |
| `campaign/act3-guide.md` | Act Three: the heist, GLORP PRIME, endings | **GM ONLY** ⚠️ |
| `campaign/npcs-and-monsters.md` | NPC roster + stat blocks | **GM ONLY** ⚠️ |
| `campaign/tables.md` | Random tables: powers, clone tells, complications, loot | **GM ONLY** (mostly) |
| `campaign/gm-screen.md` | Every rule, DC, and stat block on one page | **GM ONLY** |
| `campaign/art-prompts.md` | AI image prompt pack for every art slot in the app | GM |

**Players:** read `rules.md`, open the app, and stop there. The mystery is the game.

## The companion app

No install, no build, no internet required — open `index.html` in any modern
browser (double-click it, or serve it with `python3 -m http.server` if you
prefer). It also works great hosted on GitHub Pages.

- 🗺 **Interactive map of Pinebrook** — click locations for descriptions and a
  hand-drawn night vignette of each spot, drag the glowing player token around town.
- ⚔️ **Encounter tokens** (GM Screen) — drop clones, Gnome Drones, Flamingo
  Sentinels, THE MAILMAN, or GLORP PRIME onto the map, drag them into position,
  and track their HP from the tray under the map.
- 🔊 **Soundboard** — loopable ambience (the 2:47 Hum, suburban crickets,
  Gary's mower) and one-shot stings (abduction beam, doorbell, clone buffering,
  dread sting), all synthesized live in the browser. No audio files needed.
- 🎬 **Transition scenes** — full-screen, letterboxed cinematic cards for every
  major beat (act titles, the abduction, the pod vault, the finale, three
  endings), each with Adventure-Zone-style read-aloud narration and an
  automatic sound cue. Plus a **"Previously, on Pinebrook…"** button that
  auto-narrates a recap from your completed quests — play it at the top of
  every session.
- 🖼 **Bring-your-own AI art** — drop images into an `art/` folder
  (`art/map.jpg`, `art/loc-diner.jpg`, `art/scene-abduction.jpg`, …) and the
  app uses them automatically, falling back to the built-in SVG art otherwise.
  `campaign/art-prompts.md` is a ready-to-paste prompt pack with a consistent
  style bible for every slot.
- 🕵️ **GM Screen toggle** — flips the whole app: secret GM notes on every
  location/quest/clue, hidden locations (the crash site, the pod vault), quest
  state controls, and clue reveals. Leave it off when the player is looking.
- 🧑‍🚀 **Character sheet** — four stats, HP / Weird Points / Luck / **Glow**
  trackers, one-click pregen loading, and full card-based gear & powers: a
  searchable 36-item compendium (garage weapons → Glorptech artifacts with
  Quirks) and 20 powers with three unlockable tiers (✨ Spark / ⚡ Surge /
  🌟 SUBLIME).
- 🎲 **Dice roller** — d4–d100, advantage/disadvantage, crit/fumble callouts,
  roll log, plus one-click generators for Wacky Powers, Clone Tells, and
  Complications.
- 📋 **Quest tracker** — main quest by act + side quests; the GM reveals and
  completes them as the story unfolds.
- 📌 **The Truth Board** — clues pin here as the player finds them (plus room
  for the player's own theories).
- 👁 **Neighborhood Watch meter** — the town-wide Suspicion clock, 0 to 10,
  from *"a perfectly normal Tuesday"* to *"THE NEIGHBORHOOD IS WATCHING."*

Everything auto-saves to the browser (localStorage). Use **Export / Import** to
back up a campaign or move it between devices.

## Running the game in 5 steps

1. **GM:** read `campaign-guide.md`, `npcs-and-monsters.md`, and skim `tables.md`.
2. **Player:** make a character with `rules.md` (5 minutes) or load a pregen in
   the app — then roll a Wacky Power on the Dice tab.
3. Open the app, keep **GM Screen off** while the player can see.
4. GM sets quest **"2:47 AM"** to active (it already is) and reads the opening.
5. Play! Reveal locations, clues, and quests from the GM Screen as the player
   uncovers them. Nudge the Suspicion meter with a smile.

## License / vibe

Homebrew for your own table. Salt not included.
