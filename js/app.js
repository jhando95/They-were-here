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
      hp: 8, hpMax: 8, wp: 2, luck: 3, powers: "", gear: "", notes: ""
    },
    token: { x: 95, y: 178 },
    suspicion: 2,
    dm: false,
    quests: {},       // id -> state override
    clues: {},        // id -> revealed
    customClues: [],  // {title, text}
    revealed: {},     // location id -> visibility override
    log: [],          // roll log, latest first
    enemies: [],      // encounter tokens: {uid, type, hp, x, y}
    enemySeq: 1
  });

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        const base = defaultState();
        return {
          ...base, ...saved,
          character: { ...base.character, ...(saved.character || {}) },
          token: { ...base.token, ...(saved.token || {}) }
        };
      }
    } catch (e) { /* corrupted save — start fresh */ }
    return defaultState();
  }

  let state = load();
  let selectedLoc = null;
  let lastGenPower = null;

  const save = () => localStorage.setItem(SAVE_KEY, JSON.stringify(state));

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
      <div class="loc-art">${ART.get(loc.id)}</div>
      <div class="loc-head"><span class="loc-emoji">${loc.emoji}</span><h2>${loc.name}</h2></div>
      <p class="loc-player">${loc.player}</p>
      <div class="dm-only"><div class="dm-note">${loc.dm}</div></div>
      <div class="loc-actions">
        <button class="btn small" id="tokenHere">📍 Move token here</button>
        <button class="btn small dm-only" id="toggleReveal">
          ${visible ? "🙈 Hide from player" : "👁 Reveal to player"}
        </button>
      </div>`;
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
      if (Sound.isLoop(name)) {
        btn.classList.toggle("playing", Sound.toggle(name));
      } else {
        Sound.play(name);
        btn.classList.add("playing");
        setTimeout(() => btn.classList.remove("playing"), 600);
      }
    });
  });
  $("#volSlider").addEventListener("input", (e) =>
    Sound.setVolume(Number(e.target.value) / 100));

  /* ---------------- suspicion ---------------- */

  function renderSuspicion() {
    const track = $("#suspicionTrack");
    track.innerHTML = "";
    for (let i = 0; i <= 10; i++) {
      const seg = document.createElement("button");
      seg.className = "seg";
      seg.title = `Set to ${i}`;
      if (i <= state.suspicion && state.suspicion > 0 && i > 0) {
        seg.classList.add(i <= 3 ? "on-low" : i <= 7 ? "on-mid" : "on-high");
      }
      if (i === 0 && state.suspicion === 0) seg.classList.add("on-low");
      seg.addEventListener("click", () => {
        state.suspicion = i;
        save();
        renderSuspicion();
      });
      track.appendChild(seg);
    }
    $("#suspicionLabel").textContent =
      `${state.suspicion}/10 — ${DATA.suspicionLabels[state.suspicion]}`;
  }

  $("#suspMinus").addEventListener("click", () => {
    state.suspicion = Math.max(0, state.suspicion - 1);
    save(); renderSuspicion();
  });
  $("#suspPlus").addEventListener("click", () => {
    state.suspicion = Math.min(10, state.suspicion + 1);
    save(); renderSuspicion();
  });

  /* ---------------- tabs ---------------- */

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
      document.querySelectorAll(".tab-page").forEach((p) => p.classList.remove("active"));
      tab.classList.add("active");
      $(`#page-${tab.dataset.tab}`).classList.add("active");
    });
  });

  /* ---------------- character sheet ---------------- */

  const sheetFields = {
    chName: "name", chConcept: "concept", chPowers: "powers",
    chGear: "gear", chNotes: "notes",
    stBrawn: "brawn", stBrains: "brains", stCharm: "charm", stWeird: "weird"
  };

  function renderSheet() {
    const c = state.character;
    for (const [id, key] of Object.entries(sheetFields)) $("#" + id).value = c[key];
    $("#hpCur").textContent = c.hp;
    $("#hpMax").value = c.hpMax;
    renderDerived();
    renderPips("#wpPips", c.wp, "wp");
    renderPips("#luckPips", c.luck, "luck");
    positionToken();
  }

  function renderDerived() {
    const brawn = Number(state.character.brawn) || 0;
    $("#dvDodge").textContent = 10 + brawn;
    $("#dvHp").textContent = 8 + brawn;
  }

  for (const [id, key] of Object.entries(sheetFields)) {
    $("#" + id).addEventListener("input", (e) => {
      const isStat = id.startsWith("st");
      state.character[key] = isStat ? Number(e.target.value) : e.target.value;
      if (isStat) renderDerived();
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
    const power = DATA.powers.find((pw) => pw.name === p.power);
    state.character = {
      ...state.character,
      name: p.name, concept: p.concept,
      brawn: p.brawn, brains: p.brains, charm: p.charm, weird: p.weird,
      hp: 8 + p.brawn, hpMax: 8 + p.brawn, wp: 2, luck: 3,
      powers: power ? `${power.name} — ${power.desc}` : p.power,
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
      Dice.animateRoll($("#diceResult"), result, () => {
        state.log.unshift({ txt: result.detail, total: result.total });
        state.log = state.log.slice(0, 30);
        save();
        renderLog();
      });
    });
  });

  /* ---- generators ---- */

  function showGen(text, isPower) {
    $("#genResult").hidden = false;
    $("#genText").textContent = text;
    $("#genAdd").hidden = !isPower;
  }

  $("#genPower").addEventListener("click", () => {
    lastGenPower = Dice.pick(DATA.powers);
    showGen(`🛸 ${lastGenPower.name} — ${lastGenPower.desc}`, true);
  });
  $("#genTell").addEventListener("click", () =>
    showGen(`👁 Clone tell: ${Dice.pick(DATA.cloneTells)}`, false));
  $("#genComp").addEventListener("click", () =>
    showGen(`🌀 Complication: ${Dice.pick(DATA.complications)}`, false));

  $("#genAdd").addEventListener("click", () => {
    if (!lastGenPower) return;
    const line = `${lastGenPower.name} — ${lastGenPower.desc}`;
    state.character.powers = state.character.powers
      ? state.character.powers + "\n" + line : line;
    save();
    $("#chPowers").value = state.character.powers;
  });

  /* ---------------- quests ---------------- */

  function renderQuests() {
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

  /* ---------------- GM toggle ---------------- */

  $("#dmToggle").addEventListener("change", (e) => {
    state.dm = e.target.checked;
    save();
    document.body.classList.toggle("dm", state.dm);
    renderMap();
    renderLocationCard();
    renderQuests();
    renderClues();
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
    renderSuspicion();
    renderSheet();
    renderLog();
    renderQuests();
    renderClues();
  }

  renderAll();
})();
