/* Location art — tiny inline-SVG night vignettes, one per location.
   All drawn in code: no image files, nothing to load. */

const ART = (() => {
  const SKY = "#0b141d", GROUND = "#0e1912", SIL = "#131f2b", SIL2 = "#0a121a",
        WIN = "#ffd98a", CYAN = "#5ff2d6", GREEN = "#9dff70";

  const stars = `<g fill="#9fb7c9" opacity="0.75">
    <circle cx="20" cy="14" r="1.1"/><circle cx="55" cy="30" r="0.8"/>
    <circle cx="95" cy="12" r="1"/><circle cx="140" cy="22" r="0.8"/>
    <circle cx="185" cy="10" r="1.1"/><circle cx="220" cy="28" r="0.7"/>
    <circle cx="285" cy="42" r="0.9"/><circle cx="118" cy="40" r="0.6"/>
  </g>`;
  const moon = `<circle cx="262" cy="17" r="9" fill="#dfe8ef" opacity="0.9"/>
    <circle cx="257" cy="14" r="8.5" fill="${SKY}"/>`;

  const frame = (inner, interior) =>
    `<svg viewBox="0 0 300 100" preserveAspectRatio="xMidYMid slice" role="img">
      <rect width="300" height="100" fill="${interior ? "#070c12" : SKY}"/>
      ${interior ? "" : stars + moon}
      ${interior ? "" : `<rect y="82" width="300" height="18" fill="${GROUND}"/>`}
      ${inner}
    </svg>`;

  const house = (x, lit) => `
    <rect x="${x}" y="48" width="66" height="34" fill="${SIL}"/>
    <path d="M${x - 6} 48 L${x + 33} 26 L${x + 72} 48 Z" fill="#16232f"/>
    <rect x="${x + 12}" y="60" width="12" height="22" fill="${SIL2}"/>
    ${lit ? `<rect x="${x + 40}" y="56" width="14" height="12" fill="${WIN}"/>` : ""}`;

  const scenes = {
    home: frame(`
      ${house(60, true)}
      <circle cx="78" cy="58" r="7" fill="${WIN}" opacity="0.4"/>
      <rect x="170" y="70" width="3" height="12" fill="${SIL}"/>
      <circle cx="171.5" cy="67" r="5" fill="${WIN}" opacity="0.7"/>
      <text x="205" y="76" font-family="monospace" font-size="9" fill="#46545f">2:47 AM</text>`),

    henderson: frame(`
      <path d="M150 -4 L108 82 L192 82 Z" fill="${CYAN}" opacity="0.15"/>
      <path d="M150 -4 L126 82 L174 82 Z" fill="${CYAN}" opacity="0.15"/>
      <circle cx="150" cy="34" r="4.5" fill="${SIL2}"/>
      <rect x="145" y="39" width="10" height="13" rx="3" fill="${SIL2}"/>
      <circle cx="162" cy="46" r="3.5" fill="#a33" opacity="0.9"/>
      ${house(196, true)}
      <rect x="40" y="74" width="30" height="8" fill="#132218"/>`),

    pemberton: frame(`
      <g stroke="#1e3524" stroke-width="2">
        <line x1="50" y1="82" x2="50" y2="66"/><line x1="80" y1="82" x2="80" y2="64"/>
        <line x1="110" y1="82" x2="110" y2="66"/><line x1="140" y1="82" x2="140" y2="64"/>
        <line x1="170" y1="82" x2="170" y2="66"/>
      </g>
      <circle cx="50" cy="63" r="5" fill="#b4557a"/><circle cx="80" cy="61" r="5" fill="#b4557a"/>
      <circle cx="110" cy="63" r="5" fill="#b4557a"/><circle cx="140" cy="61" r="5" fill="#b4557a"/>
      <circle cx="170" cy="63" r="5" fill="#b4557a"/>
      <ellipse cx="235" cy="76" rx="20" ry="8" fill="${SIL}"/>
      <path d="M218 70 q 17 -10 34 0" fill="none" stroke="${SIL}" stroke-width="3"/>
      <path d="M258 66 q 4 -6 1 -10 M263 70 q 5 -5 3 -11" stroke="#3b4d43" stroke-width="1.5" fill="none"/>`),

    school: frame(`
      <rect x="60" y="44" width="150" height="38" fill="${SIL}"/>
      <rect x="120" y="34" width="30" height="10" fill="#16232f"/>
      <rect x="128" y="58" width="14" height="24" fill="${SIL2}"/>
      <rect x="72" y="52" width="12" height="10" fill="${SIL2}"/><rect x="94" y="52" width="12" height="10" fill="${SIL2}"/>
      <rect x="164" y="52" width="12" height="10" fill="${SIL2}"/><rect x="186" y="52" width="12" height="10" fill="${WIN}"/>
      <line x1="238" y1="82" x2="238" y2="30" stroke="#2b3642" stroke-width="2"/>
      <path d="M238 30 h16 v9 h-16 Z" fill="#4a5b68"/>`),

    diner: frame(`
      <rect x="70" y="50" width="160" height="32" fill="${SIL}"/>
      <rect x="70" y="58" width="160" height="12" fill="${WIN}" opacity="0.55"/>
      <rect x="118" y="32" width="64" height="16" rx="4" fill="#1b2733" stroke="#ffcf6b"/>
      <text x="150" y="44" font-family="monospace" font-size="11" fill="#ffcf6b" text-anchor="middle">DUKE'S</text>
      <path d="M248 62 q 3 -6 0 -10 M254 64 q 4 -6 1 -12" stroke="#7d8f9c" stroke-width="1.5" fill="none" opacity="0.7"/>
      <ellipse cx="250" cy="72" rx="8" ry="5" fill="#233240"/>`),

    wendell: frame(`
      <rect x="90" y="52" width="90" height="30" fill="${SIL}"/>
      <rect x="104" y="62" width="12" height="20" fill="${SIL2}"/>
      <rect x="130" y="60" width="26" height="11" fill="${GREEN}" opacity="0.35"/>
      <line x1="168" y1="52" x2="168" y2="16" stroke="#2b3642" stroke-width="2"/>
      <g stroke="${CYAN}" fill="none" opacity="0.6">
        <path d="M160 18 a 10 10 0 0 1 16 0"/>
        <path d="M155 12 a 17 17 0 0 1 26 0"/>
        <path d="M150 6 a 24 24 0 0 1 36 0"/>
      </g>
      <text x="216" y="72" font-family="monospace" font-size="8" fill="#46545f">BACK IN 5 MIN</text>`),

    gazette: frame(`
      <rect x="86" y="34" width="120" height="48" fill="${SIL}"/>
      <rect x="98" y="42" width="14" height="11" fill="${SIL2}"/><rect x="122" y="42" width="14" height="11" fill="${WIN}"/>
      <rect x="146" y="42" width="14" height="11" fill="${SIL2}"/><rect x="170" y="42" width="14" height="11" fill="${SIL2}"/>
      <rect x="136" y="62" width="16" height="20" fill="${SIL2}"/>
      <text x="146" y="30" font-family="monospace" font-size="10" fill="#8ba0af" text-anchor="middle" letter-spacing="3">GAZETTE</text>
      <rect x="226" y="72" width="18" height="4" fill="#39444f"/>
      <rect x="224" y="76" width="22" height="4" fill="#2b3642"/>`),

    sheriff: frame(`
      <rect x="80" y="46" width="110" height="36" fill="${SIL}"/>
      <rect x="118" y="60" width="14" height="22" fill="${SIL2}"/>
      <path d="M105 52 l2.4 5 5.4 .5 -4 3.7 1.2 5.3 -5 -2.8 -5 2.8 1.2 -5.3 -4 -3.7 5.4 -.5 Z" fill="#8ba0af"/>
      <rect x="150" y="54" width="14" height="10" fill="${WIN}"/>
      <rect x="210" y="68" width="52" height="14" rx="4" fill="#16232f"/>
      <circle cx="222" cy="82" r="5" fill="${SIL2}"/><circle cx="250" cy="82" r="5" fill="${SIL2}"/>
      <rect x="228" y="63" width="14" height="5" rx="2" fill="#233240"/>`),

    community: frame(`
      <rect x="92" y="52" width="116" height="30" fill="${SIL}"/>
      <path d="M84 52 L150 30 L216 52 Z" fill="#16232f"/>
      <g fill="#1c2a37">
        <rect x="102" y="56" width="7" height="26"/><rect x="122" y="56" width="7" height="26"/>
        <rect x="146" y="56" width="7" height="26"/><rect x="170" y="56" width="7" height="26"/>
        <rect x="190" y="56" width="7" height="26"/>
      </g>
      <rect x="96" y="38" width="108" height="9" fill="#3d2f14" stroke="#ffcf6b" stroke-width="0.6"/>
      <text x="150" y="45" font-family="monospace" font-size="7" fill="#ffcf6b" text-anchor="middle">MANDATORY FUN SATURDAY</text>`),

    freshmart: frame(`
      <rect x="60" y="40" width="180" height="42" fill="${SIL}"/>
      <rect x="60" y="46" width="180" height="12" fill="${GREEN}" opacity="0.25"/>
      <text x="150" y="56" font-family="monospace" font-size="10" fill="${GREEN}" text-anchor="middle" letter-spacing="4">FRESHMART</text>
      <rect x="132" y="62" width="36" height="20" fill="${SIL2}"/>
      <rect x="60" y="80" width="180" height="2" fill="${GREEN}" opacity="0.5"/>
      <path d="M256 70 h12 l3 8 h-13 Z M258 78 l-2 4 m10 -4 l2 4" stroke="#4a5b68" fill="none" stroke-width="1.5"/>
      <circle cx="259" cy="84" r="2" fill="#4a5b68"/><circle cx="268" cy="84" r="2" fill="#4a5b68"/>`),

    watertower: frame(`
      <g stroke="#233240" stroke-width="3" fill="none">
        <line x1="128" y1="82" x2="142" y2="34"/><line x1="172" y1="82" x2="158" y2="34"/>
        <line x1="132" y1="66" x2="168" y2="66"/><line x1="136" y1="50" x2="164" y2="50"/>
      </g>
      <ellipse cx="150" cy="28" rx="30" ry="16" fill="${SIL}"/>
      <ellipse cx="150" cy="20" rx="30" ry="10" fill="#16232f"/>
      <text x="150" y="32" font-family="monospace" font-size="7" fill="#5c6f7d" text-anchor="middle">PINEBROOK</text>
      <line x1="150" y1="10" x2="150" y2="2" stroke="#2b3642" stroke-width="2"/>
      <circle cx="150" cy="4" r="2.5" fill="#ff5252"/>
      <circle cx="150" cy="4" r="5" fill="#ff5252" opacity="0.25"/>
      <ellipse cx="150" cy="84" rx="42" ry="5" fill="${GREEN}" opacity="0.12"/>`),

    woods: frame(`
      <g fill="#101c14">
        <path d="M50 82 L70 30 L90 82 Z"/><path d="M95 82 L118 22 L141 82 Z"/>
        <path d="M150 82 L170 36 L190 82 Z"/><path d="M200 82 L224 26 L248 82 Z"/>
        <path d="M245 82 L262 44 L279 82 Z"/>
      </g>
      <circle cx="143" cy="60" r="2" fill="${GREEN}"/><circle cx="152" cy="60" r="2" fill="${GREEN}"/>
      <text x="40" y="20" font-family="monospace" font-size="8" fill="#3d4a55">...hello? hello. hello.</text>`),

    crash: frame(`
      <ellipse cx="150" cy="80" rx="70" ry="9" fill="${CYAN}" opacity="0.14"/>
      <ellipse cx="150" cy="80" rx="46" ry="6" fill="none" stroke="${CYAN}" stroke-width="1" opacity="0.4"/>
      <ellipse cx="150" cy="44" rx="40" ry="10" fill="${SIL}"/>
      <ellipse cx="150" cy="38" rx="18" ry="8" fill="#1c2a37"/>
      <g fill="${CYAN}" opacity="0.8">
        <circle cx="122" cy="46" r="2"/><circle cx="150" cy="50" r="2"/><circle cx="178" cy="46" r="2"/>
      </g>
      <path d="M150 54 L138 78 L162 78 Z" fill="${CYAN}" opacity="0.18"/>
      <path d="M60 82 L76 52 L92 82 Z" fill="#101c14"/><path d="M215 82 L232 48 L249 82 Z" fill="#101c14"/>`),

    undermart: frame(`
      <rect x="0" y="88" width="300" height="12" fill="#0a1118"/>
      ${[40, 105, 170, 235].map((x) => `
        <rect x="${x}" y="26" width="46" height="62" rx="20" fill="#101a24" stroke="#1e3542"/>
        <rect x="${x + 8}" y="38" width="30" height="34" rx="12" fill="${CYAN}" opacity="0.14"/>
        <circle cx="${x + 23}" cy="50" r="7" fill="${SIL2}"/>
        <line x1="${x + 23}" y1="26" x2="${x + 23}" y2="12" stroke="#1e3542" stroke-width="3"/>
      `).join("")}
      <line x1="0" y1="12" x2="300" y2="12" stroke="#1e3542" stroke-width="2"/>
      <text x="150" y="98" font-family="monospace" font-size="7" fill="#3a6a75" text-anchor="middle">COMFORT: MAXIMUM</text>`, true),

    reservoir: frame(`
      <rect x="0" y="60" width="300" height="22" fill="#0f2437"/>
      <g stroke="#1e4560" stroke-width="1.5" opacity="0.8">
        <line x1="30" y1="68" x2="70" y2="68"/><line x1="120" y1="74" x2="170" y2="74"/>
        <line x1="210" y1="66" x2="260" y2="66"/><line x1="60" y1="78" x2="100" y2="78"/>
      </g>
      <g stroke="#dfe8ef" stroke-width="1.5" opacity="0.4">
        <line x1="250" y1="64" x2="272" y2="64"/><line x1="255" y1="70" x2="269" y2="70"/>
      </g>
      <path d="M90 -4 L78 60 L102 60 Z" fill="${CYAN}" opacity="0.10"/>
      <path d="M40 82 L52 60 L64 82 Z" fill="#101c14"/>`)
  };

  const generic = frame(`
    <rect x="110" y="50" width="80" height="32" fill="${SIL}"/>
    <rect x="140" y="60" width="14" height="22" fill="${SIL2}"/>`);

  return { get: (id) => scenes[id] || generic };
})();
