/* Dice engine — animated rolls, advantage/disadvantage, and a rolling log. */

const Dice = (() => {

  const roll = (sides) => Math.floor(Math.random() * sides) + 1;

  /* Roll qty dice of `sides`, plus modifier. adv/dis applies to a single d20. */
  function rollDice(sides, qty, mod, advMode) {
    qty = Math.min(Math.max(qty, 1), 6);
    let rolls = [];
    let note = "";

    if (sides === 20 && qty === 1 && advMode !== "normal") {
      const a = roll(20), b = roll(20);
      const kept = advMode === "adv" ? Math.max(a, b) : Math.min(a, b);
      rolls = [kept];
      note = `${advMode === "adv" ? "ADV" : "DIS"} [${a}, ${b}] kept ${kept}`;
    } else {
      for (let i = 0; i < qty; i++) rolls.push(roll(sides));
    }

    const sum = rolls.reduce((t, r) => t + r, 0);
    const total = sum + mod;

    const parts = [];
    parts.push(`${qty}d${sides}${mod > 0 ? "+" + mod : mod < 0 ? mod : ""}`);
    if (note) parts.push(note);
    else if (qty > 1) parts.push(`[${rolls.join(", ")}]`);

    return {
      total,
      rolls,
      detail: parts.join(" · "),
      crit: sides === 20 && qty === 1 && rolls[0] === 20,
      fumble: sides === 20 && qty === 1 && rolls[0] === 1
    };
  }

  /* Shuffle numbers on screen before settling — the theatrics matter. */
  function animateRoll(el, result, done) {
    const totalEl = el.querySelector(".dice-total");
    const detailEl = el.querySelector(".dice-detail");
    totalEl.classList.remove("crit", "fumble");
    detailEl.textContent = "rolling…";

    let ticks = 0;
    const timer = setInterval(() => {
      totalEl.textContent = Math.floor(Math.random() * 20) + 1;
      if (++ticks >= 9) {
        clearInterval(timer);
        totalEl.textContent = result.total;
        detailEl.textContent = result.detail +
          (result.crit ? " · NAT 20 — something delightful happens" : "") +
          (result.fumble ? " · NAT 1 — the universe apologizes (+1 WP)" : "");
        if (result.crit) totalEl.classList.add("crit");
        if (result.fumble) totalEl.classList.add("fumble");
        if (done) done();
      }
    }, 55);
  }

  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  return { rollDice, animateRoll, pick };
})();
