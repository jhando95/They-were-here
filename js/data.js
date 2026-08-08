/* THEY WERE HERE — campaign data for the Pinebrook Field Kit.
   Player-facing text lives in `player`; GM secrets live in `dm` and only render
   when the GM Screen toggle is on. */

const DATA = {

  locations: [
    {
      id: "home", name: "Your House", emoji: "🏡", x: 95, y: 130, hidden: false,
      player: "Marigold Lane, the cul-de-sac. Your kingdom of unwatered plants and a porch light that flickers at 2:47 AM. It started here.",
      dm: "Safe zone (for now). At Suspicion 4+ a gnome appears on the lawn. At 10, the abduction attempt happens here."
    },
    {
      id: "henderson", name: "The Hendersons'", emoji: "🏠", x: 235, y: 130, hidden: false,
      player: "Gary and Diane's place. Gary's out front, mowing the same strip of lawn. He's been at it for three hours. He's wearing a suit.",
      dm: "Break-in clues: HUMAN FOOD jars (mayo), soil in sock drawer, scorch ring on roof, brine receipts, Biscuit hiding in the tub. GARY-2 never attacks — he offers warm pickle-brine lemonade (Suspicion +2 if the PC is caught)."
    },
    {
      id: "pemberton", name: "Mrs. Pemberton's Garden", emoji: "🌸", x: 200, y: 262, hidden: false,
      player: "Begonias in weirdly perfect rows, a bird bath, and the lingering smell of a casserole that... just moved. Probably the wind.",
      dm: "Side quest: The Casserole Is Moving. Gerald the larva is inside it. The begonias grew back overnight in antenna-segment rows — a free clue if the player thinks to look from above."
    },
    {
      id: "school", name: "Pinebrook Middle School", emoji: "🏫", x: 280, y: 312, hidden: false,
      player: "Home of the Fighting Beavers. Priya Chandrasekhar runs a drone empire out of the AV room at lunch.",
      dm: "Recruit Priya here (payment: snacks + being taken seriously). Her aerial photos reveal the lawn antenna pattern. The marching band becomes finale weirdness ammo."
    },
    {
      id: "diner", name: "Duke's Diner", emoji: "🥞", x: 450, y: 312, hidden: false,
      player: "Bottomless coffee, sticky booths, and Marla, who's worked here since '99 and has opinions about the lights people see over the reservoir.",
      dm: "Intel hub. Roll the d6 Rumor Mill freely. Marla has Magnet Touch (side quest: Magnet Fingers). Eating something questionable here restores 1 WP."
    },
    {
      id: "wendell", name: "Wendell's Wires", emoji: "📻", x: 350, y: 408, hidden: false,
      player: "Electronics repair. The sign has been 'BACK IN 5 MIN' since 2019, but Wendell's always there, listening to something on a big scanner.",
      dm: "Wendell has tracked the Lawn Frequency for years — it spikes nightly at 2:47, bearing: water tower. Source of jammers, blacklights, and the TOTALLY FLORAL DELIVERY van."
    },
    {
      id: "gazette", name: "The Pinebrook Gazette", emoji: "📰", x: 630, y: 312, hidden: false,
      player: "Weekly paper. Headlines this month: 'LAWN OF THE MONTH: A RETROSPECTIVE.' The archives are in the basement, guarded by a very old filing system.",
      dm: "1987 archive: 'LIGHTS OVER RESERVOIR; THREE MISSING, RETURNED POLITE.' One of the three was young Mr. Crisp. The microfiche machine counts as a gadget for Brains rolls."
    },
    {
      id: "sheriff", name: "Sheriff's Office", emoji: "🚓", x: 620, y: 408, hidden: false,
      player: "Two cells, one coffee maker, Deputy Hodge's crayon drawings on the fridge. Sheriff Marsh listens more than she talks.",
      dm: "Marsh slowly starts believing the PC — then gets replaced mid-Act 2 ('THERE IS NO CRIME IN PINEBROOK'). Hodge is nearly un-clonable: 'template incoherent.'"
    },
    {
      id: "community", name: "Community Center", emoji: "🏛️", x: 780, y: 428, hidden: false,
      player: "Bulletin boards, folding chairs, and the office of HOA President Crisp. The BLOCK PARTY — MANDATORY FUN banner is already up.",
      dm: "Block party set piece: humanity-test games, spore Jell-O, keycard lift. Founders' Day fireworks cache at the loading dock. Deborah Vance can requisition it with Form 77-B."
    },
    {
      id: "freshmart", name: "FreshMart", emoji: "🛒", x: 565, y: 552, hidden: false,
      player: "The new grocery store. Opened overnight, fully stocked. The yogurt aisle hums — hums a chord. Aisle 7 has a truly excessive amount of salt.",
      dm: "Front for the Undermart. Freight elevator behind the yogurt, opened by Crisp's laminated keycard. Aisle 7's salt stock is the Collective's blind spot — they think the urns are decorative."
    },
    {
      id: "watertower", name: "The Water Tower", emoji: "🗼", x: 850, y: 108, hidden: false,
      player: "PINEBROOK painted proud on the tank. The ground around the legs is a little too green. At night, if you're very quiet, it hums back.",
      dm: "The landing beacon. Ladder scuffs, spore-grass footing, dish on top fires the ALL IS READY signal on Founders' Day. Tunnel connects to the Undermart. Priya's salt drop or Wendell's jammer can kill it."
    },
    {
      id: "woods", name: "Whisper Woods", emoji: "🌲", x: 900, y: 318, hidden: false,
      player: "The trees out past the tower. Kids say the birds in there repeat what you say, a beat too late.",
      dm: "Buffer zone hiding the crash clearing. The birds ARE repeating people — some are drone-pigeons (side quest: Birds Aren't Real). Blacklight reveals glorp trails."
    },
    {
      id: "crash", name: "The Crash Site", emoji: "🛸", x: 915, y: 212, hidden: true,
      player: "A perfect circle of flattened, glowing grass deep in Whisper Woods. Something landed here. Something tidied up afterward.",
      dm: "REVEAL when the players follow the drone-pigeon or Biscuit's nose. The Vanguard's original 1987 landing spot. Buried: a hatch to the tunnel network and Gerald's original pod-crate."
    },
    {
      id: "undermart", name: "The Undermart (Pod Vault)", emoji: "🕳️", x: 505, y: 612, hidden: true,
      player: "Below FreshMart: rows of soft-lit pods, each with a sleeping neighbor inside. A sign reads GUESTS: 47 · COMFORT: MAXIMUM · RETURN DATE: N/A.",
      dm: "Act 2 climax. Pods need the Overseer's handshake (Crisp's hand or gloves). Wall schematic reveals THE BLOOM / Founders' Day plan. Escape chase: Gnome Drones + THE MAILMAN."
    },
    {
      id: "reservoir", name: "Pinebrook Reservoir", emoji: "💧", x: 830, y: 585, hidden: false,
      player: "Where the lights were seen in '87 and '99. Decent fishing. The water is fine. The water is completely fine.",
      dm: "Historic abduction site. In the Big Boom ending, GLORP PRIME dissolves in here — do not drink the water for a while. Nice quiet spot for 2:47 AM dread scenes."
    }
  ],

  quests: [
    // ----- ACT I -----
    { id: "a1q1", group: "Act I — The Night It Happened", title: "2:47 AM", state: "active",
      player: "You saw SOMETHING take Gary Henderson. Nobody believes you. Find proof.",
      dm: "Open with the abduction scene. Phone glitch = 4,000 lawn photos clue. The hum recedes toward the water tower." },
    { id: "a1q2", group: "Act I — The Night It Happened", title: "Something's Off About Gary", state: "hidden",
      player: "Watch the 'new' Gary. Collect three things that prove he isn't Gary.",
      dm: "Any 3 clone tells (d12 table) count. Break-in at the Henderson house pays out clues fast — and Biscuit." },
    { id: "a1q3", group: "Act I — The Night It Happened", title: "Paper Trail", state: "hidden",
      player: "This has happened before. Someone, somewhere in Pinebrook, wrote it down.",
      dm: "Gazette 1987 archive: three taken, returned 'polite.' One was young Mr. Crisp. Marla's '99 sighting corroborates." },
    { id: "a1q4", group: "Act I — The Night It Happened", title: "The Lawn Frequency", state: "hidden",
      player: "Wendell says the static isn't static. Every night at 2:47 it... sings.",
      dm: "Wendell's scanner triangulates to the water tower. FM Mouth can taste it. This is the thread that pulls the whole sweater." },
    { id: "a1q5", group: "Act I — The Night It Happened", title: "MANDATORY FUN", state: "hidden",
      player: "An invitation under every door: BLOCK PARTY — SATURDAY — ATTENDANCE WILL BE TAKEN.",
      dm: "Act break. Everyone gets one. The phrase 'please verify you are having fun' should feel like a threat." },
    // ----- ACT II -----
    { id: "a2q1", group: "Act II — Welcome to the Neighborhood", title: "Block Party Infiltration", state: "hidden",
      player: "Attend the party. Pass for normal. Do not eat the Jell-O.",
      dm: "Humanity-test games, spore Jell-O, the three-legged race. Objective: Crisp's laminated keycard (Marla's Magnet Touch or a pickpocket roll)." },
    { id: "a2q2", group: "Act II — Welcome to the Neighborhood", title: "Friends in Weird Places", state: "hidden",
      player: "You can't do this alone. Recruit the town's weirdos — they were right all along.",
      dm: "Wendell, Priya, Marla, Deborah, Biscuit. Each recruited ally = +1d6 help and a finale Weirdness charge." },
    { id: "a2q3", group: "Act II — Welcome to the Neighborhood", title: "The FreshMart Basement", state: "hidden",
      player: "The yogurt aisle hums. The freight elevator behind it wants a keycard.",
      dm: "The Undermart: 47 pods, the manifest, the Founders' Day schematic. Let them ALMOST free Gary — pods need the Overseer's handshake. Escape chase on the way out." },
    { id: "a2q4", group: "Act II — Welcome to the Neighborhood", title: "The Beacon", state: "hidden",
      player: "Founders' Day. Fireworks. The water tower. Put it together before Saturday.",
      dm: "Fireworks invoice (FRSHMRT LOGISTICS), sky-seeding chart, THE BLOOM. Establishes the finale's three sabotage targets." },
    // ----- ACT III -----
    { id: "a3q1", group: "Act III — Founders' Day", title: "The Plan", state: "hidden",
      player: "Three targets: the fireworks, the beacon, the pods. Pick yours. Trust your weirdos with the rest.",
      dm: "Let the player drive. Salt logistics scene (pool store / margarita stand / aisle 7). Deborah's Form 77-B secures the loading dock." },
    { id: "a3q2", group: "Act III — Founders' Day", title: "Sabotage at Sundown", state: "hidden",
      player: "Founders' Day is here. Smile. Wave. Ruin everything.",
      dm: "Run the three targets as intercut scenes. Ally rolls for the targets the PC delegated. Failures = complications, not dead ends." },
    { id: "a3q3", group: "Act III — Founders' Day", title: "GLORP PRIME", state: "hidden",
      player: "Mr. Crisp would like a word. Mr. Crisp is unzipping.",
      dm: "Boss fight. Two actions/round, Absorb comedy, salt = double damage, Weirdness Gambit removes actions. Callbacks to Scene 0 answers earn Luck." },
    { id: "a3q4", group: "Act III — Founders' Day", title: "Wake the Neighbors", state: "hidden",
      player: "47 pods. 47 neighbors. Bring them home.",
      dm: "The handshake opens the vault. Roll d8 'What's in This Pod' for flavor. Then pick the ending: Treaty, Big Boom, or (if lost) Pinebrook Perfected. Epilogues for every ally." },
    // ----- SIDE QUESTS -----
    { id: "s1", group: "Side Quests", title: "Good Boy, Best Intel", state: "hidden",
      player: "The Hendersons' dog can TALK now. He knows things. His rate is steak.",
      dm: "Biscuit knows every backyard and smelled the tunnel under FreshMart. Says important things at the worst times. Non-negotiable: he survives the campaign." },
    { id: "s2", group: "Side Quests", title: "The Casserole Is Moving", state: "hidden",
      player: "Mrs. Pemberton's potluck casserole is moving. Return it to wherever it came from. Or name it.",
      dm: "Gerald, a glorp larva. Raise him or return him to the crash-site crate. A befriended Gerald absorbs one Spore Burst in the finale, heroically." },
    { id: "s3", group: "Side Quests", title: "Magnet Fingers", state: "hidden",
      player: "Marla's health inspection is Friday and every fork in Duke's is stuck to her. Help.",
      dm: "Grounding-wire gauntlet from Wendell's scrap bin. Completing it = Marla joins fully, and her handshake lifts Crisp's keycard clean." },
    { id: "s4", group: "Side Quests", title: "Lawn Graffiti", state: "hidden",
      player: "The lawns form a pattern. Patterns can be... edited. You'll need a riding mower and no shame.",
      dm: "A rude enough word mowed into the antenna breaks the array: -5 GLORP PRIME HP before the fight. Suspicion +2, worth every point." },
    { id: "s5", group: "Side Quests", title: "Birds Aren't Real (But This One Isn't)", state: "hidden",
      player: "Wendell's rival Terrence says birds are fake. He's wrong. Except about one very specific pigeon.",
      dm: "The drone-pigeon has filmed EVERYTHING since '87, including abductions. Its footage = undeniable proof, and it leads to the crash clearing. Terrence is insufferable about being right." },
    { id: "s6", group: "Side Quests", title: "Release the Deborah", state: "hidden",
      player: "HOA Vice-President Deborah Vance is the scariest thing in Pinebrook, and she is HUMAN. Point her at the truth.",
      dm: "Convince her Crisp violated the bylaws (he has — Section 4: unapproved structures, i.e., a landing beacon). She can filibuster GLORP PRIME for one full round with a procedural objection." }
  ],

  clues: [
    { id: "c1", title: "4,000 Lawn Photos", text: "Your phone tried to film the abduction. It saved 4,000 photos of a smiling lawn instead.",
      dm: "The lawn in the photos is the Hendersons' — AFTER the spore re-sod that hadn't happened yet. Time-stamped 2:47 AM." },
    { id: "c2", title: "The Scorch Ring", text: "A perfect circle burned around the Hendersons' chimney. Smells like a new shower curtain.",
      dm: "Standard tractor-beam residue. Matches the 1987 Gazette photo if compared." },
    { id: "c3", title: "HUMAN FOOD Jars", text: "The Henderson fridge: dozens of jars, all labeled HUMAN FOOD. All mayonnaise.",
      dm: "Glorp needs emulsified lipids. This is also why Crisp drinks mayo. They think this is discreet." },
    { id: "c4", title: "Brine Receipts", text: "Receipts for 14 gallons of pickle brine from FreshMart, purchased at exactly 2:47 PM.",
      dm: "Clones run on brine like coffee. FreshMart logs all clone purchases under account 000-ALL-IS-WELL." },
    { id: "c5", title: "The New Gnomes", text: "Every 'off' household has a brand-new garden gnome. Same gnome. Same smile. Facing the street.",
      dm: "Gnome Drones: cameras + zappers. Destroying one is cathartic and raises Suspicion +1 (they file a report AS they explode)." },
    { id: "c6", title: "The 2:47 Hum", text: "Wendell's scanner: a signal spike every night at 2:47 AM. Strongest bearing — the water tower.",
      dm: "The Lawn Frequency. It's a lullaby broadcast keeping pod guests asleep and clones synced." },
    { id: "c7", title: "Gazette, 1987", text: "'LIGHTS OVER RESERVOIR; THREE MISSING, RETURNED POLITE.' One of the three: a young Mr. Crisp.",
      dm: "Crisp was the original template — the Vanguard's first and favorite suit. 'Returned' is generous." },
    { id: "c8", title: "Spore-Grass Sample", text: "Too green, no smell, leans toward you. Under blacklight it glows. Salt makes it hiss.",
      dm: "Confirms the salt weakness ahead of the finale. Lawn Whisperer PCs get advantage vs anything sod-based." },
    { id: "c9", title: "The Antenna Pattern", text: "Priya's drone photos: seen from above, the replaced lawns form one enormous geometric array.",
      dm: "The array amplifies the tower beacon. Side quest Lawn Graffiti can deface it for a boss debuff." },
    { id: "c10", title: "The Mayo Thing", text: "Mr. Crisp does not sweat. Ever. And at the party he drank mayonnaise from the jar. Nobody else blinked.",
      dm: "Nobody blinked because half the crowd was clones and the other half was being polite. Pinebrook's fatal flaw." },
    { id: "c11", title: "The Pod Manifest", text: "GUESTS: 47 · COMFORT: MAXIMUM · RETURN DATE: N/A.",
      dm: "47 = every replacement so far. The N/A is the horror beat. Play it straight for one beat, then let Biscuit break the tension." },
    { id: "c12", title: "The Fireworks Invoice", text: "Founders' Day fireworks: 'extra sparkle compound' — supplier: FRSHMRT LOGISTICS.",
      dm: "The Bloom delivery system. Swap-or-salt at the loading dock is sabotage target #1." }
  ],

  powers: [
    { name: "Static Cling", desc: "Spark-fingers: 1d4 zap (Weird), stick socks to walls, ruin laser printers." },
    { name: "Raccoon Diplomacy", desc: "Speak with raccoons. They respect you. They have seen everything." },
    { name: "Three-Inch Hover", desc: "Levitate exactly 3 inches. Silent movement; immune to LEGO." },
    { name: "FM Mouth", desc: "Taste radio stations; retune by chewing. Can find the Lawn Frequency." },
    { name: "Perfect Parallel Park", desc: "Slot any object perfectly into any space. Includes people, through windows." },
    { name: "Glow Sneeze", desc: "Once per scene: flashbang sneeze. Bless you." },
    { name: "Casserole Sense", desc: "Know who cooked anything and whether it's safe. Detects spore Jell-O." },
    { name: "Magnet Touch", desc: "Cutlery adheres. Pick locks and pockets; ruin MRI appointments." },
    { name: "Photographic Nose", desc: "Remember any smell forever; track like a bloodhound." },
    { name: "Minor Time Hiccup", desc: "Once/day rewind your last 6 seconds. Costs a nosebleed and the hiccups." },
    { name: "Lawn Whisperer", desc: "Grass leans toward you. Spore-grass HATES you: advantage vs anything sod-based." },
    { name: "Dead Channel Eyes", desc: "See invisible things: drones, static beings, who tracked mud in." },
    { name: "Pocket of Holding", desc: "Your fanny pack holds one absurd item too big for it. One." },
    { name: "Bug Zapper Aura", desc: "Mosquitos and Gnome Drones spark and pop near you." },
    { name: "Uncanny Small Talk", desc: "Clones MUST respond to small talk and buffer while doing so." },
    { name: "Sprinkler Command", desc: "Activate/aim any sprinkler within a block. Load-bearing in the brine gambit." },
    { name: "Chalk Prophecy", desc: "Sidewalk chalk drawings come true-ish within 24h. Always literally." },
    { name: "Double Yolk", desc: "Once/day split into two confused yous for one minute. Argue efficiently." },
    { name: "Night Owl Clock", desc: "Always wake at 2:47 AM, and KNOW if something alien is happening tonight." },
    { name: "The Shrug", desc: "Once per scene, ignore one hit entirely. 'I'm fine.'" }
  ],

  cloneTells: [
    "Never blinks. Ever. Not once.",
    "Laughs exactly two seconds too late.",
    "Drinks pickle brine like Gatorade.",
    "Calls everyone 'FELLOW HUMAN.'",
    "Mows the same strip of lawn for hours.",
    "Uses windows instead of doors. Politely.",
    "Waters the plastic flowers.",
    "Smiles warmly while delivering terrible news.",
    "Counts stairs out loud, in a whisper.",
    "Bleeds green glitter from paper cuts.",
    "Dogs won't come within thirty feet.",
    "Uses your full legal name every single time."
  ],

  complications: [
    "A gnome saw everything. Suspicion +1.",
    "Your phone autoplays the 4,000 lawn photos at max brightness.",
    "Biscuit announces your location. Lovingly. Loudly.",
    "You step on spore-grass; your shoe starts photosynthesizing.",
    "A clone appears to offer help. Genuinely. It's worse.",
    "Deborah Vance issues YOU a violation notice.",
    "Your power misfires adorably (GM's choice).",
    "Mrs. Pemberton arrives with a casserole. It is moving.",
    "Car alarm. Every car. Except yours, which unlocks itself.",
    "It is suddenly 2:47 AM. How is it 2:47 AM?"
  ],

  pregens: [
    { name: "Riley Park", concept: "Night-shift nurse (34) — awake at 2:47 by profession",
      brawn: 1, brains: 3, charm: 0, weird: 2, power: "Photographic Nose",
      gear: "Trauma kit\nThermos (questionable coffee)\nKeychain flashlight\nFanny pack" },
    { name: "Dee Ramirez", concept: "Bike courier (17) — knows every shortcut and every dog",
      brawn: 3, brains: 0, charm: 2, weird: 1, power: "Three-Inch Hover",
      gear: "BMX 'The Comet'\nWalkie-talkie (one battery)\nJerky (dog bribes)\nFanny pack" },
    { name: "Chuck 'Boomer' Boone", concept: "Mall cop (58) — peaked in 1987, ready to re-peak",
      brawn: 3, brains: 2, charm: 1, weird: 0, power: "The Shrug",
      gear: "Maglite (the big one)\nSegway (no charger)\nLaminated citizen's-arrest card\nFanny pack" },
    { name: "Gwen Okafor", concept: "Substitute teacher (41) — feared in four school districts",
      brawn: 0, brains: 2, charm: 3, weird: 1, power: "Uncanny Small Talk",
      gear: "The Look (patented)\nRed pens\nEmergency snacks\nFanny pack" }
  ],

  suspicionLabels: [
    "A perfectly normal Tuesday.",
    "Someone waved a little too long.",
    "Sideways glances at the mailbox.",
    "Your name came up at the HOA meeting.",
    "You're on a list.",
    "A gnome has appeared on your lawn.",
    "The gnomes rotate to face you.",
    "GARY-2 waves at your window. At night.",
    "A 'wellness check' has been scheduled.",
    "The mailman delivers only to you now.",
    "THE NEIGHBORHOOD IS WATCHING."
  ]
};
