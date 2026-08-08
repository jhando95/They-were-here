/* Scene-card art — 800x450 cinematic SVG backdrops for transition scenes.
   Drop a real image at art/scene-<id>.jpg to replace any of these; these are
   the built-in fallbacks so the app is beautiful out of the box. */

const SCENE_ART = (() => {

  const stars = `<g fill="#c3d6e4">
    <circle cx="60" cy="50" r="1.6"/><circle cx="150" cy="90" r="1.1"/>
    <circle cx="250" cy="40" r="1.4"/><circle cx="330" cy="110" r="1"/>
    <circle cx="430" cy="60" r="1.6"/><circle cx="520" cy="30" r="1.1"/>
    <circle cx="600" cy="95" r="1.3"/><circle cx="700" cy="50" r="1.6"/>
    <circle cx="760" cy="120" r="1"/><circle cx="380" cy="150" r="0.9"/>
    <circle cx="90" cy="160" r="0.9"/><circle cx="660" cy="170" r="1"/>
  </g>`;

  const cine = (id, skyTop, skyBot, inner, opts = {}) => `
  <svg viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice" role="img">
    <defs>
      <linearGradient id="sky-${id}" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${skyTop}"/>
        <stop offset="1" stop-color="${skyBot}"/>
      </linearGradient>
      <filter id="soft-${id}" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="16"/>
      </filter>
      <radialGradient id="glow-${id}">
        <stop offset="0" stop-color="${opts.glow || "#5ff2d6"}" stop-opacity="0.65"/>
        <stop offset="1" stop-color="${opts.glow || "#5ff2d6"}" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="800" height="450" fill="url(#sky-${id})"/>
    ${opts.stars === false ? "" : stars}
    ${inner}
    ${opts.fog === false ? "" : `<g filter="url(#soft-${id})" opacity="0.45">
      <ellipse cx="190" cy="440" rx="330" ry="42" fill="#070b10"/>
      <ellipse cx="640" cy="450" rx="360" ry="48" fill="#070b10"/>
    </g>`}
  </svg>`;

  const suburbanHouse = (x, y, s, winFill) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <rect x="0" y="30" width="110" height="60" fill="#0d151d"/>
      <path d="M-10 30 L55 -8 L120 30 Z" fill="#111b25"/>
      <rect x="20" y="52" width="20" height="38" fill="#070c12"/>
      <rect x="66" y="48" width="24" height="20" fill="${winFill}"/>
      <rect x="70" y="10" width="12" height="20" fill="#0d151d"/>
    </g>`;

  const gnome = (x, y, s = 1) => `
    <g transform="translate(${x} ${y}) scale(${s})">
      <path d="M0 0 L7 -18 L14 0 Z" fill="#131f29"/>
      <circle cx="7" cy="2" r="6" fill="#131f29"/>
      <rect x="2" y="4" width="10" height="10" rx="3" fill="#131f29"/>
    </g>`;

  const scenes = {

    "cold-open": cine("co", "#141c33", "#6b3d2a", `
      <circle cx="400" cy="330" r="170" fill="url(#glow-co)" opacity="0.5"/>
      <rect y="360" width="800" height="90" fill="#0a0f0c"/>
      ${suburbanHouse(40, 280, 1, "#ffd98a")}
      ${suburbanHouse(220, 290, 0.85, "#ffd98a")}
      ${suburbanHouse(380, 285, 0.9, "#0a121a")}
      ${suburbanHouse(540, 292, 0.8, "#ffd98a")}
      <g stroke="#0d151d" stroke-width="5">
        <line x1="180" y1="360" x2="180" y2="210"/>
        <line x1="700" y1="360" x2="700" y2="200"/>
      </g>
      <path d="M180 220 Q 440 260 700 212" stroke="#0d151d" stroke-width="2" fill="none"/>
      <path d="M180 232 Q 440 274 700 224" stroke="#0d151d" stroke-width="2" fill="none"/>
      <g transform="translate(690 90)" opacity="0.9">
        <g stroke="#10181f" stroke-width="6" fill="none">
          <line x1="-28" y1="180" x2="-6" y2="70"/><line x1="42" y1="180" x2="20" y2="70"/>
        </g>
        <ellipse cx="7" cy="58" rx="52" ry="26" fill="#10181f"/>
        <ellipse cx="7" cy="44" rx="52" ry="16" fill="#131d26"/>
      </g>`,
      { glow: "#e8a05c" }),

    "act-one": cine("a1", "#070d1c", "#152438", `
      <circle cx="620" cy="90" r="46" fill="#e6eef4"/>
      <circle cx="604" cy="82" r="42" fill="#0a1120"/>
      <circle cx="620" cy="90" r="70" fill="url(#glow-a1)" opacity="0.35"/>
      <rect y="370" width="800" height="80" fill="#0a0f0c"/>
      ${suburbanHouse(120, 250, 1.35, "#0a121a")}
      <rect x="209" y="272" width="27" height="22" fill="#ffd98a"/>
      <g transform="translate(560 240)">
        <line x1="0" y1="130" x2="0" y2="0" stroke="#0d151d" stroke-width="6"/>
        <path d="M0 0 h34" stroke="#0d151d" stroke-width="5"/>
        <circle cx="36" cy="4" r="7" fill="#ffcf6b"/>
        <path d="M6 130 L36 12 L66 130 Z" fill="#ffcf6b" opacity="0.10"/>
      </g>`,
      { glow: "#c3d6e4" }),

    "abduction": cine("ab", "#050a14", "#0d1b2c", `
      <ellipse cx="400" cy="26" rx="150" ry="34" fill="#0a1420"/>
      <ellipse cx="400" cy="18" rx="150" ry="26" fill="#0e1a28"/>
      <g fill="#5ff2d6"><circle cx="310" cy="30" r="4"/><circle cx="400" cy="40" r="4"/><circle cx="490" cy="30" r="4"/></g>
      <path d="M400 40 L250 450 L550 450 Z" fill="#5ff2d6" opacity="0.16"/>
      <path d="M400 40 L320 450 L480 450 Z" fill="#5ff2d6" opacity="0.16"/>
      <circle cx="400" cy="240" r="130" fill="url(#glow-ab)" opacity="0.25"/>
      <g transform="translate(400 250)">
        <circle cx="0" cy="-26" r="11" fill="#0a121a"/>
        <path d="M-14 -14 h28 l6 44 h-40 Z" fill="#0a121a"/>
        <path d="M-18 30 h12 v14 h-12 Z M6 30 h12 v14 h-12 Z" fill="#0a121a"/>
        <g transform="translate(26 6)">${gnome(0, 0, 1.4)}</g>
      </g>
      <rect y="400" width="800" height="50" fill="#0a0f0c"/>
      ${suburbanHouse(560, 320, 1, "#0a121a")}
      ${suburbanHouse(60, 330, 0.85, "#ffd98a")}`),

    "mandatory-fun": cine("mf", "#10161f", "#1b242e", `
      <rect x="240" y="40" width="320" height="410" rx="6" fill="#1d2833"/>
      <rect x="262" y="70" width="120" height="150" rx="4" fill="#161f29"/>
      <rect x="418" y="70" width="120" height="150" rx="4" fill="#161f29"/>
      <rect x="262" y="250" width="120" height="160" rx="4" fill="#161f29"/>
      <rect x="418" y="250" width="120" height="160" rx="4" fill="#161f29"/>
      <circle cx="560" cy="245" r="9" fill="#b98a2e"/>
      <circle cx="90" cy="60" r="80" fill="url(#glow-mf)" opacity="0.7"/>
      <g transform="translate(330 150) rotate(-4)">
        <rect width="150" height="196" rx="3" fill="#e8e2d0"/>
        <rect x="18" y="22" width="114" height="9" fill="#2b3642"/>
        <rect x="30" y="40" width="90" height="6" fill="#8a8474"/>
        <rect x="18" y="66" width="114" height="6" fill="#8a8474"/>
        <rect x="18" y="82" width="114" height="6" fill="#8a8474"/>
        <rect x="18" y="98" width="80" height="6" fill="#8a8474"/>
        <rect x="30" y="128" width="90" height="10" fill="#a33c2f"/>
        <rect x="18" y="152" width="114" height="6" fill="#8a8474"/>
        <rect x="40" y="168" width="70" height="6" fill="#8a8474"/>
      </g>`,
      { glow: "#ffcf6b", stars: false, fog: false }),

    "act-two": cine("a2", "#0a1120", "#16283c", `
      <rect y="360" width="800" height="90" fill="#0a100c"/>
      ${suburbanHouse(70, 270, 1, "#9dff70")}
      ${suburbanHouse(330, 270, 1, "#9dff70")}
      ${suburbanHouse(590, 270, 1, "#9dff70")}
      ${gnome(140, 396, 1.6)}${gnome(400, 396, 1.6)}${gnome(660, 396, 1.6)}
      ${gnome(240, 402, 1.3)}${gnome(500, 402, 1.3)}
      <g fill="#9dff70" opacity="0.9">
        <circle cx="149" cy="390" r="1.8"/><circle cx="155" cy="390" r="1.8"/>
        <circle cx="409" cy="390" r="1.8"/><circle cx="415" cy="390" r="1.8"/>
        <circle cx="669" cy="390" r="1.8"/><circle cx="675" cy="390" r="1.8"/>
      </g>
      <rect x="0" y="352" width="800" height="4" fill="#131c14"/>`,
      { glow: "#9dff70" }),

    "the-offer": cine("of", "#101720", "#1c2531", `
      <rect y="330" width="800" height="120" fill="#131b23"/>
      <g stroke="#0d141b" stroke-width="10">
        <line x1="120" y1="330" x2="120" y2="60"/><line x1="680" y1="330" x2="680" y2="60"/>
      </g>
      <rect x="80" y="40" width="640" height="26" fill="#0d141b"/>
      <circle cx="400" cy="120" r="60" fill="url(#glow-of)" opacity="0.8"/>
      <circle cx="400" cy="108" r="12" fill="#ffcf6b"/>
      <g transform="translate(230 250)">
        <rect x="-40" y="0" width="80" height="12" rx="4" fill="#22303c"/>
        <path d="M-34 12 L-40 80 M34 12 L40 80" stroke="#22303c" stroke-width="7"/>
        <path d="M-40 -34 q 40 -22 80 0 l 0 34 l -80 0 Z" fill="#22303c"/>
      </g>
      <g transform="translate(570 250)">
        <rect x="-40" y="0" width="80" height="12" rx="4" fill="#22303c"/>
        <path d="M-34 12 L-40 80 M34 12 L40 80" stroke="#22303c" stroke-width="7"/>
        <path d="M-40 -34 q 40 -22 80 0 l 0 34 l -80 0 Z" fill="#22303c"/>
      </g>
      <g transform="translate(400 262)">
        <rect x="-52" y="0" width="104" height="10" fill="#1a232d"/>
        <rect x="-6" y="10" width="12" height="58" fill="#1a232d"/>
        <path d="M-18 -34 h28 l6 34 h-40 Z" fill="#e8e2d0" opacity="0.9"/>
        <rect x="-22" y="-38" width="44" height="6" rx="3" fill="#e8e2d0" opacity="0.9"/>
        <rect x="-14" y="-28" width="20" height="22" fill="#ffcf6b" opacity="0.45"/>
      </g>
      <g transform="translate(660 180)">
        <circle cx="0" cy="-56" r="17" fill="#0b1119"/>
        <path d="M-30 -36 Q 0 -50 30 -36 L 40 90 L -40 90 Z" fill="#0b1119"/>
        <path d="M-5 -34 L0 -26 L5 -34 L2 6 L-2 6 Z" fill="#1a2531"/>
      </g>
      <g stroke="#0d141b" stroke-width="4" opacity="0.9">
        <line x1="60" y1="360" x2="740" y2="360"/>
        <line x1="90" y1="330" x2="90" y2="356"/><line x1="710" y1="330" x2="710" y2="356"/>
      </g>`,
      { glow: "#ffcf6b", stars: false }),

    "undermart": cine("um", "#04070c", "#071624", `
      <circle cx="400" cy="220" r="200" fill="url(#glow-um)" opacity="0.18"/>
      ${[
        [30, 90, 1.1], [190, 110, 0.92], [320, 125, 0.78],
        [640, 90, 1.1], [500, 110, 0.92], [400, 125, 0.6]
      ].map(([x, y, s]) => `
        <g transform="translate(${x} ${y}) scale(${s})">
          <rect width="130" height="240" rx="60" fill="#0b141f" stroke="#16394a" stroke-width="3"/>
          <rect x="22" y="40" width="86" height="140" rx="40" fill="#5ff2d6" opacity="0.13"/>
          <circle cx="65" cy="86" r="22" fill="#060d14"/>
          <path d="M40 130 q 25 16 50 0" stroke="#060d14" stroke-width="6" fill="none"/>
          <line x1="65" y1="0" x2="65" y2="-40" stroke="#16394a" stroke-width="8"/>
        </g>`).join("")}
      <rect y="400" width="800" height="50" fill="#03060a"/>
      <g stroke="#0e2432" stroke-width="2" opacity="0.8">
        <line x1="0" y1="412" x2="800" y2="412"/><line x1="0" y1="428" x2="800" y2="428"/>
      </g>`,
      { stars: false }),

    "act-three": cine("a3", "#0b1226", "#1c2c4c", `
      <g stroke="#ffcf6b" opacity="0.9" stroke-width="2.5">
        ${[[200, 110], [560, 80], [660, 170]].map(([cx, cy]) => `
          <g transform="translate(${cx} ${cy})">
            <line x1="-34" y1="0" x2="34" y2="0"/><line x1="0" y1="-34" x2="0" y2="34"/>
            <line x1="-24" y1="-24" x2="24" y2="24"/><line x1="-24" y1="24" x2="24" y2="-24"/>
          </g>`).join("")}
      </g>
      <g stroke="#5ff2d6" opacity="0.85" stroke-width="2">
        <g transform="translate(360 160)">
          <line x1="-22" y1="0" x2="22" y2="0"/><line x1="0" y1="-22" x2="0" y2="22"/>
          <line x1="-16" y1="-16" x2="16" y2="16"/><line x1="-16" y1="16" x2="16" y2="-16"/>
        </g>
      </g>
      <circle cx="200" cy="110" r="60" fill="url(#glow-a3)" opacity="0.3"/>
      <g transform="translate(600 180)">
        <g stroke="#0d151d" stroke-width="9" fill="none">
          <line x1="-46" y1="220" x2="-12" y2="60"/><line x1="66" y1="220" x2="32" y2="60"/>
          <line x1="-34" y1="160" x2="54" y2="160"/>
        </g>
        <ellipse cx="10" cy="46" rx="78" ry="38" fill="#0d151d"/>
        <ellipse cx="10" cy="28" rx="78" ry="24" fill="#111b25"/>
        <circle cx="10" cy="-8" r="5" fill="#ff5252"/>
      </g>
      <rect y="400" width="800" height="50" fill="#0a0f0c"/>
      <g fill="#0d141b">
        ${[60, 110, 160, 220, 270, 330, 390, 440].map((x) =>
          `<circle cx="${x}" cy="400" r="16"/>`).join("")}
      </g>
      <path d="M0 60 L70 20 L140 60" stroke="#a33c2f" stroke-width="3" fill="none"/>
      <g fill="#a33c2f">
        <path d="M14 52 l10 16 l10 -22 Z"/><path d="M52 32 l10 16 l10 -22 Z"/><path d="M96 34 l10 16 l10 -20 Z"/>
      </g>`,
      { glow: "#ffcf6b" }),

    "unzip": cine("uz", "#0a0e15", "#131b26", `
      <path d="M400 0 L280 450 L520 450 Z" fill="#ffcf6b" opacity="0.07"/>
      <circle cx="400" cy="180" r="150" fill="url(#glow-uz)" opacity="0.25"/>
      <g transform="translate(400 130)">
        <circle cx="0" cy="0" r="34" fill="#0b1119"/>
        <path d="M-70 60 Q 0 28 70 60 L 96 320 L -96 320 Z" fill="#0b1119"/>
        <path d="M-9 62 L0 78 L9 62 L4 130 L-4 130 Z" fill="#1a2531" transform="rotate(6)"/>
        <line x1="0" y1="70" x2="0" y2="320" stroke="#9dff70" stroke-width="5" opacity="0.9"/>
        <line x1="0" y1="70" x2="0" y2="320" stroke="#9dff70" stroke-width="14" opacity="0.25"/>
        <circle cx="0" cy="72" r="6" fill="#9dff70"/>
      </g>
      <rect y="410" width="800" height="40" fill="#080c11"/>
      <ellipse cx="400" cy="416" rx="150" ry="12" fill="#05080c"/>`,
      { glow: "#9dff70", stars: false }),

    "ending-treaty": cine("et", "#25355c", "#d98a4b", `
      <circle cx="400" cy="330" r="120" fill="#ffdf9e" opacity="0.9"/>
      <circle cx="400" cy="330" r="200" fill="url(#glow-et)" opacity="0.5"/>
      <rect y="330" width="800" height="120" fill="#131a14"/>
      <g fill="#10161c">
        <path d="M60 450 L60 400 Q 60 380 90 376 L 250 356 Q 300 350 340 330 L 372 314 L 380 330 L 350 352 Q 300 376 250 382 L 110 398 L 110 450 Z"/>
        <path d="M740 450 L740 396 Q 700 388 660 372 Q 590 344 520 330 Q 470 320 436 316 L 428 332 Q 470 338 520 352 Q 600 374 660 396 L 690 450 Z"/>
        <circle cx="404" cy="322" r="14"/>
      </g>
      <circle cx="404" cy="322" r="26" fill="url(#glow-et)" opacity="0.8"/>`,
      { glow: "#ffcf6b", stars: false }),

    "ending-boom": cine("eb", "#0a0f1c", "#16233a", `
      <g transform="translate(400 150)">
        <circle r="90" fill="#fff4d6" opacity="0.9"/>
        <circle r="130" fill="url(#glow-eb)" opacity="0.8"/>
        <circle r="180" fill="none" stroke="#ffcf6b" stroke-width="3" opacity="0.5"/>
        <circle r="230" fill="none" stroke="#5ff2d6" stroke-width="2" opacity="0.3"/>
        <g stroke="#ffdf9e" stroke-width="3" opacity="0.9">
          ${[0, 30, 60, 90, 120, 150].map((a) =>
            `<line transform="rotate(${a})" x1="-160" y1="0" x2="-96" y2="0"/>
             <line transform="rotate(${a})" x1="96" y1="0" x2="160" y2="0"/>`).join("")}
        </g>
        <g fill="#eef4f8">
          <circle cx="-190" cy="-60" r="3"/><circle cx="170" cy="-90" r="2.5"/>
          <circle cx="210" cy="20" r="3"/><circle cx="-150" cy="90" r="2.5"/>
          <circle cx="60" cy="-170" r="3"/><circle cx="-60" cy="160" r="2.5"/>
        </g>
      </g>
      <g transform="translate(360 250)" opacity="0.95">
        <g stroke="#0d151d" stroke-width="9" fill="none">
          <line x1="-40" y1="200" x2="-20" y2="40" transform="rotate(-8)"/>
          <line x1="120" y1="200" x2="60" y2="40" transform="rotate(8)"/>
        </g>
        <ellipse cx="30" cy="30" rx="70" ry="34" fill="#0d151d" transform="rotate(-12)"/>
      </g>
      <rect y="410" width="800" height="40" fill="#0a0f0c"/>`,
      { glow: "#ffcf6b" }),

    "perfected": cine("pf", "#9fc6dc", "#e6dfc8", `
      <circle cx="140" cy="80" r="46" fill="#fff8e0"/>
      <circle cx="140" cy="80" r="80" fill="url(#glow-pf)" opacity="0.5"/>
      <rect y="340" width="800" height="110" fill="#69a05c"/>
      <rect y="336" width="800" height="6" fill="#5b8f50"/>
      ${suburbanHouse(70, 250, 1, "#fdf6e0")}
      ${suburbanHouse(330, 250, 1, "#fdf6e0")}
      ${suburbanHouse(590, 250, 1, "#fdf6e0")}
      ${gnome(150, 372, 1.6)}${gnome(410, 372, 1.6)}${gnome(670, 372, 1.6)}
      <g stroke="#57814c" stroke-width="2" opacity="0.7">
        ${[0, 40, 80, 120, 160, 200, 240, 280, 320, 360, 400, 440, 480, 520, 560, 600, 640, 680, 720, 760]
          .map((x) => `<line x1="${x}" y1="342" x2="${x + 26}" y2="450"/>`).join("")}
      </g>
      <g transform="translate(500 120)" opacity="0.85">
        <line x1="0" y1="0" x2="60" y2="-6" stroke="#c8bfa4" stroke-width="2"/>
      </g>`,
      { glow: "#fff8e0", stars: false, fog: false })
  };

  return { get: (id) => scenes[id] || scenes["cold-open"] };
})();
