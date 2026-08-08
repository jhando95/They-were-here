/* THEY WERE HERE — Pinebrook Field Kit
   State lives in localStorage. The GM Screen toggle gates all secrets. */

(() => {
  const SAVE_KEY = "twh-save-v1";
  const $ = (sel) => document.querySelector(sel);
  const SVG_NS = "http://www.w3.org/2000/svg";

  /* ---------------- state ---------------- */

  const defaultState = () => ({
    character: {
      name: "", concept: "", brawn: 0, brains: 0, charm: 0, weird: 0,
      hp: 8, hpMax: 8, wp: 2, luck: 3, glow: 0,
      powersKnown: [],  // {id, sublime}
      items: [],        // {id, qty}
      effects: [],      // temporary conditions & Marks (strings)
      sublimeUsed: {},  // power id -> true (once per session)
      gear: "", notes: ""
    },
    lore: {},           // almanac doc id -> revealed
    token: { x: 95, y: 178 },
    suspicion: 2,
    reputation: 1,   // the Discredit clock — how crazy the town thinks the PC is
    twists: {},      // twist id -> "idle"|"armed"|"fired"
    dm: false,
    quests: {},       // id -> state override
    clues: {},        // id -> revealed
    customClues: [],  // {title, text}
    revealed: {},     // location id -> visibility override
    log: [],          // roll log, latest first
    enemies: [],      // encounter tokens: {uid, type, hp, x, y}
    enemySeq: 1,
    npcStatus: {},    // id -> "human"|"clone"|"unknown" (GM's live truth)
    npcSus: {},       // id -> true (the player's own suspect list)
    revelations: {},  // id -> true when the player has learned it
    round: 1,         // combat round tracker (GM control room)
    buffered: 0,      // GLORP PRIME actions lost this round
    gmPrep: {},       // session-prep checklist
    gmNotes: ""       // the GM's scratchpad
  });

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const base = defaultState();
        const merged = {
          ...base, ...saved,
          character: { ...base.character, ...(saved.character || {}) },
          token: { ...base.token, ...(saved.token || {}) }
        };
        migrateCharacter(merged.character);
        return merged;
      }
    } catch (e) { /* corrupted save — start fresh */ }
    return defaultState();
  }

  /* Upgrade saves from before the power-card / gear-card system: the old
     free-text `powers` string becomes known-power entries where names match,
     and any leftover text lands in notes. */
  function migrateCharacter(c) {
    if (!Array.isArray(c.powersKnown)) c.powersKnown = [];
    if (!Array.isArray(c.items)) c.items = [];
    if (!Array.isArray(c.effects)) c.effects = [];
    if (!c.sublimeUsed || typeof c.sublimeUsed !== "object") c.sublimeUsed = {};
    if (typeof c.powers === "string" && c.powers.trim() && !c.powersKnown.length) {
      const leftovers = [];
      for (const line of c.powers.split("\n")) {
        const match = DATA.powers.find((p) =>
          line.toLowerCase().includes(p.name.toLowerCase()));
        if (match && !c.powersKnown.some((k) => k.id === match.id)) {
          c.powersKnown.push({ id: match.id, sublime: false });
        } else if (line.trim()) {
          leftovers.push(line.trim());
        }
      }
      if (leftovers.length) {
        c.notes = (c.notes ? c.notes + "\n" : "") + leftovers.join("\n");
      }
    }
    delete c.powers;
  }

  let state = load();
  let selectedLoc = null;
  let lastGen = null; // {type: "power"|"item", ref}

  /* -------- remote play (Discord screen-share) -------- */
  const IS_PLAYER_VIEW = Sync.isPlayer;
  let applyingRemote = false;
  const remoteLoops = {}; // GM-side mirror of loops running in the Player View

  if (IS_PLAYER_VIEW) {
    state.dm = false;
    document.body.classList.add("player-view");
  }

  const save = () => {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    if (!applyingRemote) Sync.send({ type: "state", state });
  };

  Sync.on("state", (m) => {
    applyingRemote = true;
    const base = defaultState();
    state = {
      ...base, ...m.state,
      character: { ...base.character, ...(m.state.character || {}) },
      token: { ...base.token, ...(m.state.token || {}) }
    };
    if (IS_PLAYER_VIEW) state.dm = false;
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    renderAll();
    applyingRemote = false;
  });

  Sync.on("hello", () => {
    // a Player View just (re)connected — give it the current world
    Sync.send({ type: "state", state });
  });

  const questState = (q) => state.quests[q.id] || q.state;
  const locVisible = (loc) =>
    state.revealed[loc.id] !== undefined ? state.revealed[loc.id] : !loc.hidden;

  /* ---------------- map ---------------- */

  const svg = $("#map");
  const markerLayer = $("#markers");
  const tokenLayer = $("#tokenLayer");

  function el(tag, attrs = {}) {
    const node = document.createElementNS(SVG_NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
  }

  function renderMap() {
    markerLayer.innerHTML = "";
    for (const loc of DATA.locations) {
      const visible = locVisible(loc);
      if (!visible && !state.dm) continue;

      const g = el("g", { transform: `translate(${loc.x}, ${loc.y})` });
      g.classList.add("marker");
      if (!visible) g.classList.add("ghost");
      if (selectedLoc === loc.id) g.classList.add("selected");

      g.appendChild(el("circle", { class: "pad", r: 15 }));
      const emoji = el("text", { class: "mk-emoji" });
      emoji.textContent = loc.emoji;
      const label = el("text", { class: "mk-label", y: 30 });
      label.textContent = loc.name;
      g.append(emoji, label);

      g.addEventListener("click", () => selectLocation(loc.id));
      markerLayer.appendChild(g);
    }
  }

  function selectLocation(id) {
    selectedLoc = id;
    renderMap();
    renderLocationCard();
  }

  function renderLocationCard() {
    const card = $("#locationCard");
    const loc = DATA.locations.find((l) => l.id === selectedLoc);
    if (!loc || (!locVisible(loc) && !state.dm)) {
      card.innerHTML = `<p class="placeholder">— Click somewhere on the map. Pinebrook has nothing to hide. —</p>`;
      return;
    }
    const visible = locVisible(loc);
    card.innerHTML = `
      <div class="loc-art"></div>
      <div class="loc-head"><span class="loc-emoji">${loc.emoji}</span><h2>${loc.name}</h2></div>
      <p class="loc-player">${loc.player}</p>
      <div class="dm-only"><div class="dm-note">${loc.dm}</div></div>
      <div class="loc-actions">
        <button class="btn small" id="tokenHere">📍 Move token here</button>
        <button class="btn small dm-only" id="toggleReveal">
          ${visible ? "🙈 Hide from player" : "👁 Reveal to player"}
        </button>
      </div>`;
    card.querySelector(".loc-art").appendChild(artNode("loc", loc.id, ART.get(loc.id)));
    $("#tokenHere").addEventListener("click", () => {
      state.token = { x: loc.x, y: loc.y - 34 };
      save();
      positionToken();
    });
    $("#toggleReveal").addEventListener("click", () => {
      state.revealed[loc.id] = !visible;
      save();
      renderMap();
      renderLocationCard();
    });
  }

  /* ---- player token ---- */

  const token = el("g", { id: "playerToken" });
  token.appendChild(el("circle", { class: "ring", r: 13 }));
  const tokenText = el("text", {});
  token.appendChild(tokenText);
  tokenLayer.appendChild(token);

  function tokenInitials() {
    const name = (state.character.name || "").trim();
    if (!name) return "YOU";
    return name.split(/\s+/).map((w) => w[0]).join("").slice(0, 3).toUpperCase();
  }

  function positionToken() {
    token.setAttribute("transform", `translate(${state.token.x}, ${state.token.y})`);
    tokenText.textContent = tokenInitials();
    tokenText.setAttribute("font-size", tokenText.textContent.length > 2 ? 9 : 11);
  }

  function svgPoint(evt) {
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  let dragging = false;
  token.addEventListener("pointerdown", (e) => {
    dragging = true;
    token.classList.add("dragging");
    token.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  token.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const p = svgPoint(e);
    state.token.x = Math.min(Math.max(p.x, 16), 984);
    state.token.y = Math.min(Math.max(p.y, 16), 684);
    positionToken();
  });
  token.addEventListener("pointerup", () => {
    dragging = false;
    token.classList.remove("dragging");
    save();
  });

  /* ---------------- AI art with SVG fallback ----------------
     If the GM drops a real image at art/<prefix>-<id>.jpg (or .png/.webp),
     it's used automatically; otherwise the built-in SVG renders. */

  const artCache = {}; // "prefix-id" -> image url, or null when no image exists

  function artNode(prefix, id, fallbackSvg) {
    const wrap = document.createElement("div");
    wrap.className = "art-slot";
    const key = `${prefix}-${id}`;

    if (artCache[key] !== undefined) {
      if (artCache[key]) {
        const img = document.createElement("img");
        img.alt = "";
        img.src = artCache[key];
        wrap.appendChild(img);
      } else {
        wrap.innerHTML = fallbackSvg;
      }
      return wrap;
    }

    const exts = ["jpg", "png", "webp"];
    let i = 0;
    const img = document.createElement("img");
    img.alt = "";
    img.onload = () => { artCache[key] = img.src; };
    img.onerror = () => {
      i++;
      if (i < exts.length) img.src = `art/${key}.${exts[i]}`;
      else { artCache[key] = null; wrap.innerHTML = fallbackSvg; }
    };
    img.src = `art/${key}.${exts[0]}`;
    wrap.appendChild(img);
    return wrap;
  }

  /* Optional AI-generated town map: art/map.jpg|png replaces the drawn terrain. */
  (function probeCustomMap() {
    const exts = ["jpg", "png", "webp"];
    let i = 0;
    const probe = new Image();
    probe.onload = () => {
      const image = el("image", { x: 0, y: 0, width: 1000, height: 700, preserveAspectRatio: "xMidYMid slice" });
      image.setAttribute("href", probe.src);
      $("#customMap").appendChild(image);
      svg.classList.add("has-custom-map");
    };
    probe.onerror = () => { if (++i < exts.length) probe.src = `art/map.${exts[i]}`; };
    probe.src = `art/map.${exts[0]}`;
  })();

  /* ---------------- transition scenes ---------------- */

  const overlay = $("#sceneOverlay");
  let sceneLoopStarted = null;

  function playScene(scene, fromRemote) {
    $("#sceneKicker").textContent = scene.kicker;
    $("#sceneTitle").textContent = scene.title;
    $("#sceneNarration").textContent = scene.narration;
    const artBox = $("#sceneArt");
    artBox.innerHTML = "";
    artBox.appendChild(artNode("scene", scene.artId || scene.id, SCENE_ART.get(scene.artId || scene.id)));

    overlay.hidden = false;
    requestAnimationFrame(() => overlay.classList.add("open"));

    // Mirror to the shared Player View — and let IT carry the audio, so the
    // sound reaches Discord (and doesn't double up on the GM's machine).
    const routeAudioRemote = !fromRemote && Sync.playerViewActive();
    if (!fromRemote) Sync.send({ type: "scene", scene });

    sceneLoopStarted = null;
    if (scene.sound && !routeAudioRemote) {
      if (scene.sound.shot) Sound.play(scene.sound.shot);
      if (scene.sound.loop && !Sound.isActive(scene.sound.loop)) {
        Sound.toggle(scene.sound.loop);
        sceneLoopStarted = scene.sound.loop;
      }
      syncSoundButtons();
    }
  }

  function closeScene(fromRemote) {
    overlay.classList.remove("open");
    setTimeout(() => { overlay.hidden = true; }, 600);
    if (!fromRemote) Sync.send({ type: "scene-close" });
    if (sceneLoopStarted) {
      if (Sound.isActive(sceneLoopStarted)) Sound.toggle(sceneLoopStarted);
      sceneLoopStarted = null;
      syncSoundButtons();
    }
  }

  Sync.on("scene", (m) => playScene(m.scene, true));
  Sync.on("scene-close", () => closeScene(true));

  overlay.addEventListener("click", () => closeScene());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !overlay.hidden) closeScene();
  });

  function syncSoundButtons() {
    document.querySelectorAll(".sound").forEach((btn) => {
      const name = btn.dataset.sound;
      if (Sound.isLoop(name)) btn.classList.toggle("playing", Sound.isActive(name));
    });
  }

  function renderScenes() {
    const list = $("#sceneList");
    list.innerHTML = "";
    for (const scene of SCENES) {
      const row = document.createElement("button");
      row.className = "scene-row";
      row.innerHTML = `<span class="scene-row-kicker">${scene.kicker}</span>
        <span class="scene-row-title">${scene.title}</span><span class="scene-row-go">▶</span>`;
      row.addEventListener("click", () => playScene(scene));
      list.appendChild(row);
    }
    renderTwists();
  }

  /* ---- the twist deck ---- */

  function renderTwists() {
    const box = $("#twistList");
    box.innerHTML = "";
    for (const t of DATA.twists || []) {
      const st = state.twists[t.id] || "idle";
      const div = document.createElement("div");
      div.className = "twist-card twist-" + st;
      div.innerHTML = `
        <div class="quest-head">
          <span class="quest-title">${t.title}</span>
          <span class="quest-pill ${st === "fired" ? "done" : st === "armed" ? "active" : "hidden-pill"}">
            ${st.toUpperCase()}
          </span>
        </div>
        <p class="twist-line"><b>Plant:</b> ${t.plant}</p>
        <p class="twist-line"><b>Fire:</b> ${t.fire}</p>
        <p class="twist-line"><b>Fallout:</b> ${t.fallout}</p>
        <div class="quest-controls">
          ${["idle", "armed", "fired"].map((s) =>
            `<button class="btn tiny ${s === st ? "active-state" : ""}" data-tw="${t.id}" data-s="${s}">${s}</button>`
          ).join("")}
        </div>`;
      box.appendChild(div);
    }
    box.querySelectorAll("[data-tw]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.twists[btn.dataset.tw] = btn.dataset.s;
        save();
        renderTwists();
      });
    });
  }

  $("#recapBtn").addEventListener("click", () => {
    const done = DATA.quests.filter((q) => questState(q) === "done");
    const clueCount = DATA.clues.filter((c) => state.clues[c.id]).length
      + state.customClues.length;
    let story;
    if (!done.length) {
      story = "Previously, on Pinebrook: nothing. Gloriously, suspiciously, nothing. " +
        "The lawns were mowed. The casseroles were still. " +
        "It was, as far as anyone could prove, a perfectly normal Tuesday. That ends tonight.";
    } else {
      const beats = done.map((q) => q.title.toUpperCase()).join(". Then — ").concat(".");
      story = `Previously, on Pinebrook: ${beats} ` +
        `${clueCount ? `The Truth Board holds ${clueCount} clue${clueCount === 1 ? "" : "s"} nobody else believes. ` : ""}` +
        `The Neighborhood Watch stands at ${state.suspicion} out of 10 — ${DATA.suspicionLabels[state.suspicion].replace(/\.$/, "")}. ` +
        "And somewhere beneath the sound of sprinklers, it is getting very close to 2:47.";
    }
    playScene({
      id: "recap", artId: "cold-open",
      kicker: "PREVIOUSLY", title: "…on Pinebrook",
      narration: story, sound: { loop: "hum" }
    });
  });

  /* ---------------- encounter tokens ---------------- */

  const enemyLayer = $("#enemyLayer");
  const enemyTypeSelect = $("#enemyType");
  DATA.tokenTypes.forEach((t) => {
    const opt = document.createElement("option");
    opt.value = t.id;
    opt.textContent = `${t.emoji} ${t.name} (HP ${t.hp})`;
    enemyTypeSelect.appendChild(opt);
  });

  const tokenType = (e) => DATA.tokenTypes.find((t) => t.id === e.type);

  function renderEnemies() {
    enemyLayer.innerHTML = "";
    for (const e of state.enemies) {
      const type = tokenType(e);
      if (!type) continue;
      const g = el("g", { transform: `translate(${e.x}, ${e.y})` });
      g.classList.add("enemy");
      if (type.ally) g.classList.add("ally");
      if (e.hp <= 0) g.classList.add("down");

      g.appendChild(el("circle", { class: "body", r: 12 }));
      const emoji = el("text", { class: "en-emoji" });
      emoji.textContent = type.emoji;
      g.appendChild(emoji);

      const badge = el("g", { class: "hpbadge", transform: "translate(11, -11)" });
      badge.appendChild(el("circle", { r: 7 }));
      const hpText = el("text", {});
      hpText.textContent = e.hp;
      badge.appendChild(hpText);
      g.appendChild(badge);

      attachEnemyDrag(g, e);
      enemyLayer.appendChild(g);
    }
    renderEnemyTray();
  }

  function attachEnemyDrag(g, e) {
    let moving = false;
    g.addEventListener("pointerdown", (evt) => {
      moving = true;
      g.setPointerCapture(evt.pointerId);
      evt.preventDefault();
    });
    g.addEventListener("pointermove", (evt) => {
      if (!moving) return;
      const p = svgPoint(evt);
      e.x = Math.min(Math.max(p.x, 16), 984);
      e.y = Math.min(Math.max(p.y, 16), 684);
      g.setAttribute("transform", `translate(${e.x}, ${e.y})`);
    });
    g.addEventListener("pointerup", () => {
      moving = false;
      save();
    });
  }

  function renderEnemyTray() {
    const list = $("#enemyList");
    list.innerHTML = "";
    for (const e of state.enemies) {
      const type = tokenType(e);
      if (!type) continue;
      const row = document.createElement("div");
      row.className = "tray-row" + (e.hp <= 0 ? " down" : "");
      row.innerHTML = `
        <span class="tray-name">${type.emoji} ${type.name}</span>
        <span class="tray-hp">
          <button class="btn tiny" data-hp="-1">−</button>
          <b>${e.hp}</b>
          <button class="btn tiny" data-hp="1">+</button>
        </span>
        <button class="btn tiny" data-remove title="Remove">✕</button>`;
      row.querySelectorAll("[data-hp]").forEach((btn) => {
        btn.addEventListener("click", () => {
          e.hp = Math.max(0, e.hp + Number(btn.dataset.hp));
          save();
          renderEnemies();
        });
      });
      row.querySelector("[data-remove]").addEventListener("click", () => {
        state.enemies = state.enemies.filter((x) => x.uid !== e.uid);
        save();
        renderEnemies();
      });
      list.appendChild(row);
    }
  }

  $("#enemyAdd").addEventListener("click", () => {
    const type = DATA.tokenTypes.find((t) => t.id === enemyTypeSelect.value);
    if (!type) return;
    const n = state.enemies.length;
    state.enemies.push({
      uid: state.enemySeq++,
      type: type.id,
      hp: type.hp,
      x: 470 + (n % 5) * 30,
      y: 240 + Math.floor(n / 5) * 30
    });
    save();
    renderEnemies();
  });

  /* ---------------- soundboard ---------------- */

  document.querySelectorAll(".sound").forEach((btn) => {
    btn.addEventListener("click", () => {
      const name = btn.dataset.sound;
      // With a Player View open, audio belongs on the shared window so it
      // reaches Discord; the GM window just mirrors the button state.
      if (Sync.playerViewActive()) {
        Sync.send({ type: "sound", name, loop: Sound.isLoop(name) });
        if (Sound.isLoop(name)) {
          remoteLoops[name] = !remoteLoops[name];
          btn.classList.toggle("playing", remoteLoops[name]);
        } else {
          btn.classList.add("playing");
          setTimeout(() => btn.classList.remove("playing"), 600);
        }
        return;
      }
      if (Sound.isLoop(name)) {
        btn.classList.toggle("playing", Sound.toggle(name));
      } else {
        Sound.play(name);
        btn.classList.add("playing");
        setTimeout(() => btn.classList.remove("playing"), 600);
      }
    });
  });

  Sync.on("sound", (m) => {
    if (m.loop) Sound.toggle(m.name);
    else Sound.play(m.name);
    syncSoundButtons();
  });
  $("#volSlider").addEventListener("input", (e) =>
    Sound.setVolume(Number(e.target.value) / 100));

  /* ---------------- suspicion ---------------- */

  /* Two clocks, one renderer: Neighborhood Watch (aliens noticing you) and
     Reputation (humans doubting you). The vise. */
  function renderClock(trackSel, labelSel, key, labels) {
    const track = $(trackSel);
    track.innerHTML = "";
    const val = state[key];
    for (let i = 0; i <= 10; i++) {
      const seg = document.createElement("button");
      seg.className = "seg";
      seg.title = `Set to ${i}`;
      if (i <= val && val > 0 && i > 0) {
        seg.classList.add(i <= 3 ? "on-low" : i <= 7 ? "on-mid" : "on-high");
      }
      if (i === 0 && val === 0) seg.classList.add("on-low");
      seg.addEventListener("click", () => {
        state[key] = i;
        save();
        renderClocks();
      });
      track.appendChild(seg);
    }
    $(labelSel).textContent = `${val}/10 — ${labels[val]}`;
  }

  function renderClocks() {
    renderClock("#suspicionTrack", "#suspicionLabel", "suspicion", DATA.suspicionLabels);
    renderClock("#repTrack", "#repLabel", "reputation", DATA.reputationLabels);
  }

  function bumpClock(key, delta) {
    state[key] = Math.min(10, Math.max(0, state[key] + delta));
    save(); renderClocks();
  }
  $("#suspMinus").addEventListener("click", () => bumpClock("suspicion", -1));
  $("#suspPlus").addEventListener("click", () => bumpClock("suspicion", 1));
  $("#repMinus").addEventListener("click", () => bumpClock("reputation", -1));
  $("#repPlus").addEventListener("click", () => bumpClock("reputation", 1));

  /* ---------------- tabs ---------------- */

  function switchTab(name) {
    document.querySelectorAll(".tab").forEach((t) =>
      t.classList.toggle("active", t.dataset.tab === name));
    document.querySelectorAll(".tab-page").forEach((p) =>
      p.classList.toggle("active", p.id === "page-" + name));
  }

  document.querySelectorAll(".tab").forEach((tab) =>
    tab.addEventListener("click", () => switchTab(tab.dataset.tab)));

  /* ---------------- character sheet ---------------- */

  const sheetFields = {
    chName: "name", chConcept: "concept",
    chGear: "gear", chNotes: "notes",
    stBrawn: "brawn", stBrains: "brains", stCharm: "charm", stWeird: "weird"
  };

  function renderSheet() {
    const c = state.character;
    for (const [id, key] of Object.entries(sheetFields)) $("#" + id).value = c[key];
    $("#hpCur").textContent = c.hp;
    $("#hpMax").value = c.hpMax;
    $("#glowVal").textContent = c.glow;
    renderDerived();
    renderCheckConsole();
    renderPips("#wpPips", c.wp, "wp");
    renderPips("#luckPips", c.luck, "luck");
    renderPowerCards();
    renderItemCards();
    renderEffects();
    positionToken();
  }

  /* ---- dynamic checks: d20 + live stat, with DC verdicts ---- */

  function renderCheckConsole() {
    const box = $("#checkStats");
    box.innerHTML = "";
    for (const key of ["brawn", "brains", "charm", "weird"]) {
      const mod = Number(state.character[key]) || 0;
      const b = document.createElement("button");
      b.className = "btn check-btn";
      b.innerHTML = `${key.toUpperCase()} <b>${mod >= 0 ? "+" + mod : mod}</b>`;
      b.addEventListener("click", () => statCheck(key));
      box.appendChild(b);
    }
  }

  function statCheck(key) {
    const mod = Number(state.character[key]) || 0;
    const adv = $("#diceAdv").value;
    const dcv = $("#checkDC").value;
    const result = Dice.rollDice(20, 1, mod, adv);
    result.detail = `${key.toUpperCase()} ${mod >= 0 ? "+" + mod : mod} · ${result.detail}`;
    if (dcv) {
      const dc = Number(dcv);
      result.detail += result.total >= dc
        ? ` · vs DC ${dc}: SUCCESS`
        : ` · vs DC ${dc}: MISS — progress + complication`;
    }
    switchTab("dice");
    if (Sync.playerViewActive()) Sync.send({ type: "roll", result });
    Dice.animateRoll($("#diceResult"), result, () => {
      if (result.fumble) {
        state.character.wp = Math.min(3, state.character.wp + 1);
        renderPips("#wpPips", state.character.wp, "wp");
      }
      if (dcv && result.total < Number(dcv)) {
        lastGen = null;
        showGen(`🌀 Suggested complication: ${Dice.pick(DATA.complications)}`, false);
      }
      state.log.unshift({ txt: result.detail, total: result.total });
      state.log = state.log.slice(0, 30);
      save();
      renderLog();
    });
  }

  document.querySelectorAll(".stat-roll").forEach((b) =>
    b.addEventListener("click", (e) => {
      e.preventDefault();
      statCheck(b.dataset.stat);
    }));

  /* ---- custom formula (e.g. 2d6+3 for a salt burst) ---- */

  function rollFormula() {
    const m = $("#formulaInput").value.trim().toLowerCase()
      .match(/^(\d{0,2})d(\d{1,3})\s*([+-]\s*\d{1,2})?$/);
    if (!m) {
      lastGen = null;
      showGen("🎲 Formulas look like: 2d6+3 (up to 6 dice)", false);
      switchTab("dice");
      return;
    }
    const qty = Number(m[1] || 1);
    const sides = Number(m[2]);
    const mod = Number((m[3] || "0").replace(/\s/g, ""));
    const result = Dice.rollDice(sides, qty, mod, "normal");
    if (Sync.playerViewActive()) Sync.send({ type: "roll", result });
    Dice.animateRoll($("#diceResult"), result, () => {
      state.log.unshift({ txt: result.detail, total: result.total });
      state.log = state.log.slice(0, 30);
      save();
      renderLog();
    });
  }
  $("#formulaRoll").addEventListener("click", rollFormula);
  $("#formulaInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") rollFormula();
  });

  /* ---- rest & effects ---- */

  $("#restBtn").addEventListener("click", () => {
    const c = state.character;
    const heal = Math.floor(Math.random() * 6) + 1;
    c.hp = Math.min(c.hpMax, c.hp + heal);
    c.wp = Math.min(3, c.wp + 1);
    state.log.unshift({ txt: `😴 Rest — healed 1d6 = ${heal}, regained 1 WP`, total: `${c.hp} HP` });
    state.log = state.log.slice(0, 30);
    save();
    renderSheet();
    renderLog();
  });

  function renderEffects() {
    const box = $("#effectChips");
    box.innerHTML = "";
    const list = state.character.effects;
    if (!list.length) {
      box.innerHTML = `<p class="empty-note">No lingering weirdness. Yet.</p>`;
      return;
    }
    list.forEach((t, i) => {
      const chip = document.createElement("span");
      chip.className = "fx-chip";
      chip.innerHTML = `${escapeHtml(t)} <button class="fx-x" title="Clear effect">✕</button>`;
      chip.querySelector(".fx-x").addEventListener("click", () => {
        state.character.effects.splice(i, 1);
        save();
        renderEffects();
      });
      box.appendChild(chip);
    });
  }

  $("#effectAdd").addEventListener("click", () => {
    const v = $("#effectInput").value.trim();
    if (!v) return;
    state.character.effects.push(v);
    $("#effectInput").value = "";
    save();
    renderEffects();
  });
  $("#effectInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("#effectAdd").click();
  });

  /* ---- power & item cards ---- */

  function renderPowerCards() {
    const box = $("#powerCards");
    box.innerHTML = "";
    const known = state.character.powersKnown;
    if (!known.length) {
      box.innerHTML = `<p class="empty-note">No powers yet. Roll one on the Dice tab, or hit + add.</p>`;
      return;
    }
    for (const k of known) {
      const p = DATA.powers.find((x) => x.id === k.id);
      if (!p) continue;
      const div = document.createElement("div");
      div.className = "power-card";
      div.innerHTML = `
        <div class="pc-head">
          <span class="pc-name">${p.name}</span>
          <span class="tier-badges">
            <span class="tier on" title="Spark — free flavor use">✨</span>
            <span class="tier on" title="Surge — 1 WP, the scene-changer">⚡</span>
            <span class="tier ${k.sublime ? "on" : "locked"}" title="SUBLIME — 2 WP, once/session">🌟</span>
          </span>
          <button class="btn tiny pc-remove" title="Forget power">✕</button>
        </div>
        <p class="pc-desc">⚡ ${p.desc}</p>
        ${k.sublime
          ? `<p class="pc-sublime">🌟 ${p.sublime}</p>`
          : `<p class="pc-sublime dim">🌟 ${p.sublime}</p>
             <button class="btn tiny pc-unlock">Unlock SUBLIME (1 Glow)</button>`}
        <div class="pc-actions">
          <button class="btn tiny pc-surge" ${state.character.wp < 1 ? "disabled" : ""}>⚡ Use Surge (−1 WP)</button>
          ${k.sublime ? `<button class="btn tiny pc-sub"
              ${state.character.sublimeUsed[k.id] || state.character.wp < 2 ? "disabled" : ""}>
              🌟 SUBLIME (−2 WP)${state.character.sublimeUsed[k.id] ? " — used this session" : ""}</button>` : ""}
        </div>
      `;
      div.querySelector(".pc-surge").addEventListener("click", () => {
        state.character.wp = Math.max(0, state.character.wp - 1);
        state.log.unshift({ txt: `⚡ ${p.name} — Surge`, total: "−1 WP" });
        state.log = state.log.slice(0, 30);
        save(); renderSheet(); renderLog();
      });
      const subBtn = div.querySelector(".pc-sub");
      if (subBtn) subBtn.addEventListener("click", () => {
        state.character.wp = Math.max(0, state.character.wp - 2);
        state.character.sublimeUsed[k.id] = true;
        state.log.unshift({ txt: `🌟 ${p.name} — SUBLIME`, total: "−2 WP" });
        state.log = state.log.slice(0, 30);
        save(); renderSheet(); renderLog();
      });
      div.querySelector(".pc-remove").addEventListener("click", () => {
        state.character.powersKnown = known.filter((x) => x.id !== k.id);
        save(); renderPowerCards();
      });
      const unlock = div.querySelector(".pc-unlock");
      if (unlock) unlock.addEventListener("click", () => {
        if (state.character.glow < 1) {
          unlock.textContent = "Needs 1 Glow — earned at act ends";
          setTimeout(() => { unlock.textContent = "Unlock SUBLIME (1 Glow)"; }, 1600);
          return;
        }
        state.character.glow--;
        k.sublime = true;
        save(); renderSheet();
      });
      box.appendChild(div);
    }
  }

  const RARITY_LABEL = { mundane: "⚪ mundane", modified: "🔧 modified", glorptech: "🟢 glorptech", oddity: "✦ oddity" };

  function renderItemCards() {
    const box = $("#itemCards");
    box.innerHTML = "";
    const items = state.character.items;
    if (!items.length) {
      box.innerHTML = `<p class="empty-note">Pockets empty. Hit + add, or roll 🎁 Loot on the Dice tab.</p>`;
      return;
    }
    for (const entry of items) {
      const it = DATA.items.find((x) => x.id === entry.id);
      if (!it) continue;
      const div = document.createElement("div");
      div.className = `item-card rarity-${it.rarity}`;
      div.innerHTML = `
        <div class="ic-head">
          <span class="ic-name">${it.name}</span>
          <span class="rarity-pill ${it.rarity}">${RARITY_LABEL[it.rarity]}</span>
          ${it.cat === "consumable" ? `
            <span class="ic-qty">
              <button class="btn tiny" data-d="-1">−</button><b>${entry.qty}</b><button class="btn tiny" data-d="1">+</button>
            </span>` : ""}
          <button class="btn tiny ic-remove" title="Drop">✕</button>
        </div>
        <p class="ic-effect">${it.effect}</p>
        ${it.quirk ? `<p class="ic-quirk">Quirk: ${it.quirk}</p>` : ""}
      `;
      div.querySelectorAll("[data-d]").forEach((btn) => {
        btn.addEventListener("click", () => {
          entry.qty = Math.max(0, entry.qty + Number(btn.dataset.d));
          if (entry.qty === 0) state.character.items = items.filter((x) => x !== entry);
          save(); renderItemCards();
        });
      });
      div.querySelector(".ic-remove").addEventListener("click", () => {
        state.character.items = items.filter((x) => x !== entry);
        save(); renderItemCards();
      });
      box.appendChild(div);
    }
  }

  function learnPower(id) {
    if (!state.character.powersKnown.some((k) => k.id === id)) {
      state.character.powersKnown.push({ id, sublime: false });
      save(); renderPowerCards();
    }
  }

  function gainItem(id) {
    const existing = state.character.items.find((x) => x.id === id);
    if (existing) existing.qty++;
    else state.character.items.push({ id, qty: 1 });
    save(); renderItemCards();
  }

  /* ---- compendium picker ---- */

  const pickerOverlay = $("#pickerOverlay");
  let pickerKind = "item";
  let pickerCat = "all";

  function openPicker(kind) {
    pickerKind = kind;
    pickerCat = "all";
    $("#pickerTitle").textContent = kind === "power" ? "LEARN A WACKY POWER" : "ADD GEAR FROM THE COMPENDIUM";
    $("#pickerSearch").value = "";
    renderPickerChips();
    renderPickerList();
    pickerOverlay.hidden = false;
    $("#pickerSearch").focus();
  }

  function closePicker() { pickerOverlay.hidden = true; }
  $("#pickerClose").addEventListener("click", closePicker);
  pickerOverlay.addEventListener("click", (e) => { if (e.target === pickerOverlay) closePicker(); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !pickerOverlay.hidden) closePicker();
  });

  function renderPickerChips() {
    const chips = $("#pickerChips");
    chips.innerHTML = "";
    if (pickerKind === "power") return;
    for (const cat of ["all", "weapon", "gadget", "consumable", "glorptech", "oddity"]) {
      const chip = document.createElement("button");
      chip.className = "chip" + (cat === pickerCat ? " on" : "");
      chip.textContent = cat;
      chip.addEventListener("click", () => { pickerCat = cat; renderPickerChips(); renderPickerList(); });
      chips.appendChild(chip);
    }
  }

  function renderPickerList() {
    const list = $("#pickerList");
    const q = $("#pickerSearch").value.trim().toLowerCase();
    list.innerHTML = "";
    if (pickerKind === "power") {
      for (const p of DATA.powers) {
        if (q && !(p.name + p.desc).toLowerCase().includes(q)) continue;
        const known = state.character.powersKnown.some((k) => k.id === p.id);
        const row = document.createElement("button");
        row.className = "picker-row" + (known ? " known" : "");
        row.innerHTML = `<b>${p.name}</b><span>${p.desc}</span>${known ? "<i>known</i>" : ""}`;
        if (!known) row.addEventListener("click", () => { learnPower(p.id); closePicker(); });
        list.appendChild(row);
      }
    } else {
      for (const it of DATA.items) {
        if (pickerCat !== "all" && it.cat !== pickerCat) continue;
        if (q && !(it.name + it.effect).toLowerCase().includes(q)) continue;
        const row = document.createElement("button");
        row.className = "picker-row";
        row.innerHTML = `<b>${it.name} <em class="rarity-pill ${it.rarity}">${RARITY_LABEL[it.rarity]}</em></b>
          <span>${it.effect}</span>`;
        row.addEventListener("click", () => { gainItem(it.id); closePicker(); });
        list.appendChild(row);
      }
    }
    if (!list.children.length) list.innerHTML = `<p class="empty-note">Nothing matches. Suspicious.</p>`;
  }

  $("#pickerSearch").addEventListener("input", renderPickerList);
  $("#addPowerBtn").addEventListener("click", () => openPicker("power"));
  $("#addItemBtn").addEventListener("click", () => openPicker("item"));

  $("#glowMinus").addEventListener("click", () => {
    state.character.glow = Math.max(0, state.character.glow - 1);
    save(); $("#glowVal").textContent = state.character.glow;
  });
  $("#glowPlus").addEventListener("click", () => {
    state.character.glow = Math.min(9, state.character.glow + 1);
    save(); $("#glowVal").textContent = state.character.glow;
  });

  function renderDerived() {
    const brawn = Number(state.character.brawn) || 0;
    $("#dvDodge").textContent = 10 + brawn;
    $("#dvHp").textContent = 8 + brawn;
  }

  for (const [id, key] of Object.entries(sheetFields)) {
    $("#" + id).addEventListener("input", (e) => {
      const isStat = id.startsWith("st");
      state.character[key] = isStat ? Number(e.target.value) : e.target.value;
      if (isStat) { renderDerived(); renderCheckConsole(); }
      if (id === "chName") positionToken();
      save();
    });
  }

  $("#hpMinus").addEventListener("click", () => {
    state.character.hp = Math.max(0, state.character.hp - 1);
    save(); $("#hpCur").textContent = state.character.hp;
  });
  $("#hpPlus").addEventListener("click", () => {
    state.character.hp = Math.min(state.character.hpMax, state.character.hp + 1);
    save(); $("#hpCur").textContent = state.character.hp;
  });
  $("#hpMax").addEventListener("input", (e) => {
    state.character.hpMax = Math.max(1, Number(e.target.value) || 1);
    state.character.hp = Math.min(state.character.hp, state.character.hpMax);
    save(); $("#hpCur").textContent = state.character.hp;
  });

  function renderPips(sel, value, key) {
    const box = $(sel);
    const max = Number(box.dataset.max);
    box.innerHTML = "";
    for (let i = 1; i <= max; i++) {
      const pip = document.createElement("button");
      pip.className = "pip" + (i <= value ? " on" : "");
      pip.title = `${key.toUpperCase()} ${i}`;
      pip.addEventListener("click", () => {
        state.character[key] = i === state.character[key] ? i - 1 : i;
        save();
        renderPips(sel, state.character[key], key);
      });
      box.appendChild(pip);
    }
  }

  /* ---- pregens ---- */

  const pregenSelect = $("#pregenSelect");
  DATA.pregens.forEach((p, i) => {
    const opt = document.createElement("option");
    opt.value = i;
    opt.textContent = `${p.name} — ${p.concept}`;
    pregenSelect.appendChild(opt);
  });

  $("#pregenLoad").addEventListener("click", () => {
    const i = pregenSelect.value;
    if (i === "") return;
    const p = DATA.pregens[i];
    state.character = {
      ...state.character,
      name: p.name, concept: p.concept,
      brawn: p.brawn, brains: p.brains, charm: p.charm, weird: p.weird,
      hp: 8 + p.brawn, hpMax: 8 + p.brawn, wp: 2, luck: 3, glow: 0,
      powersKnown: [{ id: p.powerId, sublime: false }],
      items: p.itemIds.map((id) => ({ id, qty: 1 })),
      gear: p.gear
    };
    save();
    renderSheet();
  });

  /* ---------------- dice ---------------- */

  function renderLog() {
    const list = $("#diceLog");
    list.innerHTML = "";
    for (const entry of state.log) {
      const li = document.createElement("li");
      li.innerHTML = `<span>${entry.txt}</span><b>${entry.total}</b>`;
      list.appendChild(li);
    }
  }

  document.querySelectorAll(".die").forEach((btn) => {
    btn.addEventListener("click", () => {
      const sides = Number(btn.dataset.sides);
      const qty = Number($("#diceQty").value) || 1;
      const mod = Number($("#diceMod").value) || 0;
      const adv = $("#diceAdv").value;
      const result = Dice.rollDice(sides, qty, mod, adv);
      if (Sync.playerViewActive()) Sync.send({ type: "roll", result });
      Dice.animateRoll($("#diceResult"), result, () => {
        state.log.unshift({ txt: result.detail, total: result.total });
        state.log = state.log.slice(0, 30);
        save();
        renderLog();
      });
    });
  });

  /* rolls made in the GM window replay, animated, on the shared window */
  Sync.on("roll", (m) => Dice.animateRoll($("#diceResult"), m.result, null));

  /* ---- generators ---- */

  function showGen(text, addable) {
    const box = $("#genResult");
    box.hidden = false;
    [...box.children].forEach((ch) => {
      if (ch.id !== "genText" && ch.id !== "genAdd") ch.remove();
    });
    $("#genText").textContent = text;
    const addBtn = $("#genAdd");
    addBtn.hidden = !addable;
    if (addable) {
      addBtn.textContent = lastGen.type === "power" ? "+ Learn this power"
        : lastGen.type === "mark" ? "+ Add Mark to sheet" : "+ Add to gear";
    }
  }

  $("#genPower").addEventListener("click", () => {
    const p = Dice.pick(DATA.powers);
    lastGen = { type: "power", ref: p };
    showGen(`🛸 ${p.name} — ${p.desc}`, true);
  });
  $("#genLoot").addEventListener("click", () => {
    const lootable = DATA.items.filter((it) =>
      !["glove", "form77b", "sentimental", "gnorman"].includes(it.id));
    const it = Dice.pick(lootable);
    lastGen = { type: "item", ref: it };
    showGen(`🎁 ${it.name} — ${it.effect}${it.quirk ? ` (Quirk: ${it.quirk})` : ""}`, true);
  });
  $("#genTell").addEventListener("click", () => {
    lastGen = null;
    showGen(`👁 Clone tell: ${Dice.pick(DATA.cloneTells)}`, false);
  });
  $("#genComp").addEventListener("click", () => {
    lastGen = null;
    showGen(`🌀 Complication: ${Dice.pick(DATA.complications)}`, false);
  });
  $("#genMark").addEventListener("click", () => {
    const mark = Dice.pick(DATA.marks);
    lastGen = { type: "mark", ref: mark };
    showGen(`🩹 Mark: ${mark}`, true);
  });
  $("#genNowWhat").addEventListener("click", () => {
    lastGen = null;
    showGen(`🧭 ${Dice.pick(DATA.nowWhat)}`, false);
  });
  $("#genConsp").addEventListener("click", () => {
    lastGen = null;
    const c = Dice.pick(DATA.conspiracies || [{ claim: "The Truthers are between theories right now.", rating: "false", gmNote: "" }]);
    showGen(`🛰 Heard around town: “${c.claim}”`, false);
    if (c.gmNote) {
      const note = document.createElement("div");
      note.className = "dm-only";
      note.innerHTML = `<div class="dm-note"><b>${(c.rating || "").replace(/-/g, " ").toUpperCase()}</b> — ${c.gmNote}</div>`;
      $("#genResult").appendChild(note);
    }
  });

  $("#genAdd").addEventListener("click", () => {
    if (!lastGen) return;
    if (lastGen.type === "power") learnPower(lastGen.ref.id);
    else if (lastGen.type === "mark") {
      state.character.effects.push("🩹 " + lastGen.ref);
      save(); renderEffects();
    } else gainItem(lastGen.ref.id);
    $("#genAdd").textContent = "✓ added";
    setTimeout(() => { $("#genAdd").hidden = true; }, 900);
  });

  /* ---------------- quests ---------------- */

  function renderTrail() {
    const box = $("#trailList");
    box.innerHTML = "";
    let known = 0;
    for (const r of DATA.revelations || []) {
      const got = !!state.revelations[r.id];
      if (got) known++;
      const div = document.createElement("div");
      div.className = "trail-row" + (got ? " got" : "");
      div.innerHTML = `
        <button class="trail-check ${got ? "on" : ""}" title="Toggle: the player has learned this">${got ? "✔" : ""}</button>
        <div class="trail-body">
          <span class="trail-title">${r.title}</span>
          <span class="trail-paths">${r.paths}</span>
        </div>`;
      div.querySelector(".trail-check").addEventListener("click", () => {
        if (state.revelations[r.id]) delete state.revelations[r.id];
        else state.revelations[r.id] = true;
        save(); renderTrail();
      });
      box.appendChild(div);
    }
    const head = document.createElement("p");
    head.className = "trail-score";
    head.textContent = `${known}/${(DATA.revelations || []).length} revelations landed`;
    box.prepend(head);
  }

  function renderQuests() {
    renderTrail();
    const box = $("#questList");
    box.innerHTML = "";
    const groups = [...new Set(DATA.quests.map((q) => q.group))];

    for (const group of groups) {
      const quests = DATA.quests.filter((q) => q.group === group)
        .filter((q) => state.dm || questState(q) !== "hidden");
      if (!quests.length) continue;

      const title = document.createElement("h3");
      title.className = "quest-group-title";
      title.textContent = group.toUpperCase();
      box.appendChild(title);

      for (const q of quests) {
        const st = questState(q);
        const div = document.createElement("div");
        div.className = "quest" + (st === "done" ? " done" : "");
        div.innerHTML = `
          <div class="quest-head">
            <span class="quest-title">${q.title}</span>
            <span class="quest-pill ${st === "active" ? "active" : st === "done" ? "done" : "hidden-pill"}">
              ${st.toUpperCase()}
            </span>
          </div>
          <p class="quest-player">${q.player}</p>
          <div class="dm-only">
            <div class="dm-note">${q.dm}</div>
            <div class="quest-controls">
              ${["hidden", "active", "done"].map((s) =>
                `<button class="btn tiny ${s === st ? "active-state" : ""}" data-q="${q.id}" data-s="${s}">${s}</button>`
              ).join("")}
            </div>
          </div>`;
        box.appendChild(div);
      }
    }

    box.querySelectorAll("[data-q]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.quests[btn.dataset.q] = btn.dataset.s;
        save();
        renderQuests();
      });
    });
  }

  /* ---------------- clues ---------------- */

  function renderClues() {
    const list = $("#clueList");
    list.innerHTML = "";
    const found = DATA.clues.filter((c) => state.clues[c.id]);

    if (!found.length && !state.customClues.length) {
      list.innerHTML = `<p class="empty-note">Nothing pinned yet. But you know what you saw.</p>`;
    }

    for (const c of found) {
      const div = document.createElement("div");
      div.className = "clue";
      div.innerHTML = `<h4>${c.title}</h4><p>${c.text}</p>
        <div class="dm-only"><div class="dm-note">${c.dm}</div></div>`;
      list.appendChild(div);
    }

    state.customClues.forEach((c, i) => {
      const div = document.createElement("div");
      div.className = "clue custom";
      div.innerHTML = `<h4>${escapeHtml(c.title)}
          <button class="btn tiny" data-del="${i}" title="Unpin" style="float:right">✕</button></h4>
        <p>${escapeHtml(c.text)}</p>`;
      list.appendChild(div);
    });

    list.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.customClues.splice(Number(btn.dataset.del), 1);
        save();
        renderClues();
      });
    });

    /* GM vault */
    const vault = $("#clueVault");
    vault.innerHTML = "";
    for (const c of DATA.clues) {
      const row = document.createElement("div");
      row.className = "clue-vault-item";
      const revealed = !!state.clues[c.id];
      row.innerHTML = `<span>${c.title}</span>
        <button class="btn tiny" data-clue="${c.id}">${revealed ? "Hide" : "Reveal"}</button>`;
      vault.appendChild(row);
    }
    vault.querySelectorAll("[data-clue]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.clues[btn.dataset.clue] = !state.clues[btn.dataset.clue];
        save();
        renderClues();
      });
    });

    renderLore();
  }

  /* ---- the Pinebrook Almanac (unlockable in-world documents) ---- */

  function renderLore() {
    const list = $("#loreList");
    list.innerHTML = "";
    const visible = (DATA.lore || []).filter((l) => l.open || state.lore[l.id]);
    if (!visible.length) {
      list.innerHTML = `<p class="empty-note">No documents collected yet.</p>`;
    }
    for (const l of visible) {
      const div = document.createElement("div");
      div.className = "clue lore-card";
      div.innerHTML = `<h4>📄 ${l.title}</h4><p>${l.text}</p>
        <div class="dm-only"><div class="dm-note">${l.dm}</div></div>`;
      list.appendChild(div);
    }

    const vault = $("#loreVault");
    vault.innerHTML = "";
    for (const l of DATA.lore || []) {
      const row = document.createElement("div");
      row.className = "clue-vault-item";
      if (l.open) {
        row.innerHTML = `<span>${l.title}</span><em class="lore-public">always public</em>`;
      } else {
        const revealed = !!state.lore[l.id];
        row.innerHTML = `<span>${l.title}</span>
          <button class="btn tiny" data-lore="${l.id}">${revealed ? "Withdraw" : "Hand over"}</button>`;
      }
      vault.appendChild(row);
    }
    vault.querySelectorAll("[data-lore]").forEach((btn) => {
      btn.addEventListener("click", () => {
        state.lore[btn.dataset.lore] = !state.lore[btn.dataset.lore];
        save();
        renderClues();
      });
    });
  }

  $("#customClueAdd").addEventListener("click", () => {
    const title = $("#customClueTitle").value.trim();
    const text = $("#customClueText").value.trim();
    if (!title && !text) return;
    state.customClues.push({ title: title || "Untitled hunch", text });
    $("#customClueTitle").value = "";
    $("#customClueText").value = "";
    save();
    renderClues();
  });

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, (ch) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  }

  /* ---------------- folks (town census) ---------------- */

  let folksFilter = "all";

  const npcStatus = (n) => state.npcStatus[n.id] || n.status;
  const STATUS_LABEL = { human: "🙂 human", clone: "😐 replaced", unknown: "❓ ???" };

  function renderFolks() {
    const npcs = DATA.npcs || [];
    const list = $("#folksList");
    const q = $("#folksSearch").value.trim().toLowerCase();
    list.innerHTML = "";

    const chips = $("#folksChips");
    chips.innerHTML = "";
    const filters = [["all", "everyone"], ["sus", "🤨 my suspects"]];
    if (state.dm) filters.push(["clone", "😐 replaced (GM)"], ["unknown", "❓ ??? (GM)"]);
    if (!filters.some(([id]) => id === folksFilter)) folksFilter = "all";
    for (const [id, label] of filters) {
      const chip = document.createElement("button");
      chip.className = "chip" + (id === folksFilter ? " on" : "");
      chip.textContent = label;
      chip.addEventListener("click", () => { folksFilter = id; renderFolks(); });
      chips.appendChild(chip);
    }

    let shown = 0;
    const replaced = npcs.filter((n) => npcStatus(n) === "clone").length;
    const suspected = npcs.filter((n) => state.npcSus[n.id]).length;

    for (const n of npcs) {
      const st = npcStatus(n);
      if (folksFilter === "sus" && !state.npcSus[n.id]) continue;
      if (folksFilter === "clone" && st !== "clone") continue;
      if (folksFilter === "unknown" && st !== "unknown") continue;
      if (q && !(n.name + n.role + n.where + n.bit).toLowerCase().includes(q)) continue;
      shown++;

      const sus = !!state.npcSus[n.id];
      const div = document.createElement("div");
      div.className = "npc-card" + (state.dm && st === "clone" ? " is-clone" : "");
      div.innerHTML = `
        <div class="npc-head">
          <span class="npc-name">${n.name}</span>
          <button class="btn tiny sus-btn ${sus ? "on" : ""}" title="Mark as suspicious (player's own paranoia board)">🤨</button>
        </div>
        <p class="npc-role">${n.role} · <em>${n.where}</em></p>
        <p class="npc-bit">${n.bit}</p>
        <div class="dm-only">
          <div class="npc-status-row">
            ${["human", "clone", "unknown"].map((s) =>
              `<button class="btn tiny ${s === st ? "active-state" : ""}" data-st="${s}">${STATUS_LABEL[s]}</button>`).join("")}
          </div>
          <div class="dm-note">
            ${st === "clone" && n.tell ? `<b>Tell:</b> ${n.tell}<br>` : ""}
            <b>Secret:</b> ${n.secret}<br><b>Hook:</b> ${n.hook}
          </div>
        </div>`;
      div.querySelector(".sus-btn").addEventListener("click", () => {
        if (state.npcSus[n.id]) delete state.npcSus[n.id];
        else state.npcSus[n.id] = true;
        save(); renderFolks();
      });
      div.querySelectorAll("[data-st]").forEach((btn) => {
        btn.addEventListener("click", () => {
          state.npcStatus[n.id] = btn.dataset.st;
          save(); renderFolks();
        });
      });
      list.appendChild(div);
    }

    if (!shown) list.innerHTML = `<p class="empty-note">Nobody matches. Which is exactly what they'd want.</p>`;
    $("#folksCount").textContent = state.dm
      ? `${npcs.length} residents on file · ${replaced} replaced · player suspects ${suspected}`
      : `${npcs.length} residents on file · you suspect ${suspected}. Trust no lawn.`;
  }

  $("#folksSearch").addEventListener("input", renderFolks);

  /* ---------------- GM control room ---------------- */

  const PREP_ITEMS = [
    "Where did we leave them — and is a cold open ready for the obvious next thing?",
    "Two nearest unchecked revelations (THE TRAIL) + one path to each from where they are.",
    "This session's ONE Opposition move (MARSH-2 rung or Crisp countermeasure).",
    "Which clocks move if the player does nothing? (Usually Reputation +1.)",
    "Which twist am I planting tonight? (Arm it in Scenes.)",
    "Two townsfolk I want to say out loud, chosen for joy."
  ];

  function renderGm() {
    $("#roundVal").textContent = state.round;
    document.querySelectorAll(".buf").forEach((b) =>
      b.classList.toggle("active-state", Number(b.dataset.buf) === state.buffered));
    $("#gmNotes").value = state.gmNotes;

    const list = $("#prepList");
    list.innerHTML = "";
    PREP_ITEMS.forEach((text, i) => {
      const row = document.createElement("div");
      const done = !!state.gmPrep[i];
      row.className = "trail-row" + (done ? " got" : "");
      row.innerHTML = `<button class="trail-check ${done ? "on" : ""}">${done ? "✔" : ""}</button>
        <div class="trail-body"><span class="trail-title" style="text-decoration:none">${text}</span></div>`;
      row.querySelector(".trail-check").addEventListener("click", () => {
        if (state.gmPrep[i]) delete state.gmPrep[i];
        else state.gmPrep[i] = true;
        save(); renderGm();
      });
      list.appendChild(row);
    });
  }

  $("#roundPlus").addEventListener("click", () => {
    state.round++; state.buffered = 0; save(); renderGm();
  });
  $("#roundMinus").addEventListener("click", () => {
    state.round = Math.max(1, state.round - 1); state.buffered = 0; save(); renderGm();
  });
  $("#roundReset").addEventListener("click", () => {
    state.round = 1; state.buffered = 0; save(); renderGm();
  });
  document.querySelectorAll(".buf").forEach((b) =>
    b.addEventListener("click", () => {
      state.buffered = Number(b.dataset.buf); save(); renderGm();
    }));
  $("#prepReset").addEventListener("click", () => {
    // new session: fresh checklist, Luck back to 3, SUBLIME uses restored
    state.gmPrep = {};
    state.character.luck = 3;
    state.character.sublimeUsed = {};
    save(); renderGm(); renderSheet();
  });
  $("#gmNotes").addEventListener("input", (e) => {
    state.gmNotes = e.target.value; save();
  });
  $("#gmRandomNpc").addEventListener("click", () => {
    const n = Dice.pick(DATA.npcs || []);
    $("#gmNpcResult").hidden = false;
    $("#gmNpcText").textContent =
      `${n.name} — ${n.role} (${npcStatus(n)}). ${n.bit}`;
  });

  /* ---------------- player view window ---------------- */

  $("#playerViewBtn").addEventListener("click", () => {
    const url = location.href.split(/[?#]/)[0] + "?view=player";
    const w = window.open(url, "twhPlayerView", "width=1280,height=820");
    if (w) Sync.setPeer(w);
  });

  if (IS_PLAYER_VIEW) {
    const badge = document.createElement("div");
    badge.className = "pv-badge";
    badge.textContent = "PLAYER VIEW · SHARE THIS WINDOW IN DISCORD (WITH AUDIO)";
    document.querySelector(".topbar").appendChild(badge);
  }

  /* ---------------- GM toggle ---------------- */

  $("#dmToggle").addEventListener("change", (e) => {
    if (IS_PLAYER_VIEW) { e.target.checked = false; return; }
    state.dm = e.target.checked;
    save();
    document.body.classList.toggle("dm", state.dm);
    renderMap();
    renderLocationCard();
    renderQuests();
    renderClues();
    renderFolks();
  });

  /* ---------------- save management ---------------- */

  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "they-were-here-save.json";
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $("#importBtn").addEventListener("click", () => $("#importFile").click());
  $("#importFile").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const base = defaultState();
        const data = JSON.parse(reader.result);
        state = {
          ...base, ...data,
          character: { ...base.character, ...(data.character || {}) },
          token: { ...base.token, ...(data.token || {}) }
        };
        migrateCharacter(state.character);
        save();
        renderAll();
      } catch (err) {
        alert("That save file appears to be 4,000 photos of a lawn. (Invalid JSON.)");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  });

  $("#resetBtn").addEventListener("click", () => {
    if (!confirm("Erase everything and return Pinebrook to a perfectly normal Tuesday?")) return;
    localStorage.removeItem(SAVE_KEY);
    state = defaultState();
    selectedLoc = null;
    renderAll();
  });

  /* ---------------- boot ---------------- */

  function renderAll() {
    document.body.classList.toggle("dm", state.dm);
    $("#dmToggle").checked = state.dm;
    renderMap();
    renderLocationCard();
    positionToken();
    renderEnemies();
    renderClocks();
    renderSheet();
    renderLog();
    renderQuests();
    renderClues();
    renderScenes();
    renderFolks();
    renderGm();
  }

  renderAll();

  /* Installable app: register the service worker when served over http(s).
     (Skipped on file:// — the app still runs fine straight off the disk.) */
  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  }
})();
