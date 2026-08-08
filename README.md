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
| `campaign/story-bible.md` | The editor's cut: theme, the double mystery, motif table, running gags, Lawrence's arc, final images | **GM ONLY** ⚠️ |
| `campaign/act1-guide.md` | Act One, scene by scene: read-alouds, DCs, branches | **GM ONLY** ⚠️ |
| `campaign/act2-guide.md` | Act Two: allies, block party, the Undermart | **GM ONLY** ⚠️ |
| `campaign/act3-guide.md` | Act Three: the heist, GLORP PRIME, endings | **GM ONLY** ⚠️ |
| `campaign/npcs-and-monsters.md` | Core NPC roster + stat blocks | **GM ONLY** ⚠️ |
| `campaign/villains-and-twists.md` | Active villains (MARSH-2's gaslight campaign), the Reputation clock, evidence rules, the Twist Deck | **GM ONLY** ⚠️ |
| `campaign/town-census.md` | 47 goofy residents, who's replaced, the Tuesday Truthers, the conspiracy corkboard | **GM ONLY** ⚠️ |
| `campaign/tables.md` | Random tables: powers, clone tells, complications, loot | **GM ONLY** (mostly) |
| `campaign/running-it-loose.md` | Sandbox toolkit: the Revelation Web, improv formulas, the NOW WHAT? oracle, 5-minute prep sheet | **GM ONLY** |
| `campaign/gm-screen.md` | Every rule, DC, and stat block on one page | **GM ONLY** |
| `campaign/art-prompts.md` | AI image prompt pack for every art slot in the app | GM |

**Players:** read `rules.md`, open the app, and stop there. The mystery is the game.

## 🚀 Play it as a real web app

This repo auto-deploys the game to **GitHub Pages** on every push (via
`.github/workflows/deploy.yml`). Your live URL:

> **https://jhando95.github.io/They-were-here/**

- The workflow publishes to a `gh-pages` branch, which GitHub picks up
  automatically. First time only: if the URL 404s after the workflow has run,
  go to repo **Settings → Pages** and set **Source: Deploy from a branch →
  `gh-pages` / (root)** — one click, once, and every future push deploys
  itself.
- **Only the app is published.** The `campaign/` folder — every spoiler, the
  GM guides, the census — stays in the repo, never on the public site. Your
  player can open the URL freely.
- **Install it as an app:** on the live site, Chrome/Edge shows an *Install*
  icon in the address bar (or menu → "Install Pinebrook…"). That gives you a
  standalone desktop app window, and the service worker keeps it working
  even if the Wi-Fi dies mid-session.
- Prefer another host? The app is plain static files — drag the folder into
  Netlify/Vercel/Cloudflare Pages and it just works.

## 💻 Take it with you (no GitHub required)

The whole game is plain files — GitHub is just where it lives today. To make
it fully independent on your MacBook or Windows PC:

1. **Get the folder**: on the repo page, **Code → Download ZIP**, unzip
   anywhere (or `git clone` once; after that, the folder is self-sufficient).
2. **Run it**, three ways — all fully offline:
   - **Simplest:** double-click `index.html`. Everything works: map, GM
     screen, scenes, sound, dice, the Player View window for Discord.
   - **Nicest:** double-click **`run-mac.command`** (Mac — first time:
     right-click → Open) or **`run-windows.bat`** (PC). It hosts the app at
     `http://localhost:8247` and opens your browser — which also unlocks the
     browser's **Install app** button, giving you a standalone desktop app.
   - **Any static host** works too (Netlify/Vercel drag-and-drop, a home
     server, a USB stick) — there's no build step and no dependencies.
3. **Your campaign travels with you**: saves live in the browser, so when you
   switch machines, hit **Export** on the old one and **Import** on the new
   one — that JSON file is your whole campaign (character, clocks, quests,
   clues, twist states, everyone's clone status).

## The companion app

No install, no build, no internet required even without the deploy — open
`index.html` in any modern browser and everything works straight off the disk.

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
- 🎛 **GM control room** (GM-only tab) — combat round tracker with the
  GLORP-PRIME buffer counter, the five-minute session-prep checklist, a
  random-townsperson button, the quick-rules card, and persistent session
  notes. Everything you need at the table without opening a single file.
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
- 👁🫥 **The two clocks** — **Neighborhood Watch** (how much the *aliens* have
  noticed you, up to *"THE NEIGHBORHOOD IS WATCHING"*) and **Reputation**
  (how crazy the *humans* think you are, down to *"THE VAN IS HERE. IT'S VERY
  COMFORTABLE."*). Investigate loudly and the aliens notice; stay quiet and
  the cloned Sheriff's gaslight campaign buries you. There is no safe lane.
- 🎭 **The Twist Deck** — ten plant/fire/fallout twists tracked in the Scenes
  tab (GM): replaced allies, the player's own alien file, the defector clone,
  and what Deputy Hodge has been hiding in the crayon box.
- 🏘 **The town census (Folks tab)** — all 47 residents of Pinebrook as
  searchable cards. The GM flips each person's status live as the invasion
  spreads (🙂 human / 😐 replaced / ❓ ???) with tells, secrets, and scene
  hooks behind the GM screen — while the player runs their own 🤨 suspect
  list. Compare the two lists at the end of the campaign. Always funny.
- 🛰 **Conspiracy generator** — one click deals out a Tuesday Truthers theory
  ("The moon is a billboard"); the GM screen shows whether it's FALSE,
  TRUEISH, or — twice — EXACTLY RIGHT.

Everything auto-saves to the browser (localStorage). Use **Export / Import** to
back up a campaign or move it between devices.

## 🎙 Playing over Discord (PC + voice)

Built for exactly this setup — two PCs, voice chat, GM screen-sharing:

1. **GM:** open `index.html`, flip **GM SCREEN on**. This window is yours;
   it never gets shared.
2. Click **🖥 Player view** in the header — a second, spoiler-free window
   opens and mirrors the first, live.
3. In Discord: **Share Screen → pick the Player View *window*** (not the
   whole screen), and enable **"Share audio."**
4. Play. Everything routes automatically:
   - Move the token, reveal locations, flip quests, pin clues, nudge the
     clocks in your GM window → the shared window updates instantly.
   - Play a **scene card** → the cinematic (and its sound cue) plays on the
     shared window, so your player gets the full letterboxed moment while
     your window stays on the controls.
   - **Soundboard and dice** route to the shared window too — the 2:47 Hum
     reaches Discord, and your rolls animate on stream.
   - GM notes, hidden locations, the Twist Deck, THE TRAIL, and everyone's
     clone status stay in your private window only.
5. **The player** just talks: "I knock on the Hendersons' door." You drive.
   For dice, either roll on stream when they act, or let them roll physical
   dice on camera and honor the result — both feel great.

**Tips:** have the player open their own copy of the app (or a printout of
`rules.md`) as a personal character-sheet reference — the shared window
already shows the live sheet, but it's nice in their hands. Turn off Discord
message notifications on the GM machine before sharing. If the Player View
ever gets closed, just click 🖥 again — it reconnects and re-syncs itself.

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
