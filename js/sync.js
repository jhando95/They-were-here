/* Two-window sync for remote play (Discord screen-share).
   The GM keeps the main window private and opens a spoiler-free Player View
   via the header button; the windows talk over window.postMessage, which
   works on file:// and hosted alike. The Player View sends a heartbeat so
   the GM window knows to route scene cards, sounds, and rolls to it. */

const Sync = (() => {
  const params = new URLSearchParams(location.search);
  const IS_PLAYER = params.get("view") === "player" || location.hash === "#player";

  let peer = IS_PLAYER ? window.opener : null;
  let lastHello = 0;
  const handlers = {};

  function on(type, fn) { handlers[type] = fn; }

  function send(msg) {
    try { if (peer && !peer.closed) peer.postMessage({ __twh: true, ...msg }, "*"); }
    catch (e) { /* peer gone — heartbeat will re-establish */ }
  }

  window.addEventListener("message", (e) => {
    const m = e.data;
    if (!m || !m.__twh) return;
    peer = e.source || peer;           // recover the reference after reloads
    if (m.type === "hello") lastHello = Date.now();
    if (handlers[m.type]) handlers[m.type](m);
  });

  if (IS_PLAYER) {
    const hello = () => send({ type: "hello" });
    hello();
    setInterval(hello, 3000);
    window.addEventListener("beforeunload", () => send({ type: "bye" }));
  }

  return {
    isPlayer: IS_PLAYER,
    on,
    send,
    setPeer: (w) => { peer = w; },
    /* GM side: is a Player View window alive right now? */
    playerViewActive: () => !IS_PLAYER && Date.now() - lastHello < 8000
  };
})();
