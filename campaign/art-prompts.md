# AI Art Prompt Pack

The app ships with hand-drawn SVG art, but it will **automatically upgrade itself**
the moment you drop real images into an `art/` folder next to `index.html`.
Generate them with whatever you like (Midjourney, DALL-E, Ideogram, etc.), save
them with the exact filenames below, refresh the page — done. No code changes.

| Slot | Filename | Recommended shape |
|---|---|---|
| Town map background | `art/map.jpg` | landscape, ~10:7 (it's stretched over a 1000×700 canvas) |
| Location card headers | `art/loc-<id>.jpg` | wide, ~16:6 (cards crop to a wide strip) |
| Transition scene backdrops | `art/scene-<id>.jpg` | 16:9 |

`.png` and `.webp` also work. If a file is missing, the built-in SVG shows instead —
you can upgrade one image at a time.

---

## The Style Bible (paste this block at the start of every prompt)

> Cinematic film still, 1980s American suburb at night, Amblin-era Spielberg mood,
> teal-blue moonlight with warm amber sodium streetlights, low mist over the lawns,
> 35mm film grain, soft halation, nostalgic but quietly uneasy, richly detailed,
> no people unless specified, no text, no watermark, no logos.

Keeping this block identical across every generation is what makes the whole app
feel like one movie instead of twenty stock photos.

---

## The Map — `art/map.jpg`

> {STYLE BIBLE} — top-down aerial view at night of a small suburban town,
> illustrated game-map style, painterly: a horizontal main avenue crossing a
> vertical main street at center; a cul-de-sac with a ring road in the upper
> left surrounded by small houses; a park with trees left of center; a large
> grocery store with a parking lot bottom center; a water tower on a hill in
> the upper right; a dense dark pine forest along the right edge; a reservoir
> lake in the bottom right; warm lit windows, streetlight pools of amber light,
> deep blue-green darkness between houses, faint ground mist.

Marker pins and labels are drawn on top of your image, so aim for scenery
without labels. (The built-in layout follows this same description, so pins
land in sensible places.)

## Location Cards — `art/loc-<id>.jpg`

- **loc-home** — modest suburban house at night, one upstairs window warmly lit, porch light glowing, bicycle on the lawn, seen from the street.
- **loc-henderson** — a too-perfect suburban house at night, immaculate lawn with fresh mower stripes, a single garden gnome facing the camera, faint ring of scorched shingles around the chimney.
- **loc-pemberton** — a lush backyard flower garden at night, begonias in unnaturally perfect rows, a casserole dish sitting alone on a garden table, steam rising.
- **loc-school** — small-town middle school at night, empty flagpole, one hallway light on, a hobby drone hovering above the roofline.
- **loc-diner** — classic roadside diner at night, neon sign glowing warm, coffee steam in the window, one waitress silhouette, parking lot puddles reflecting neon.
- **loc-wendell** — cluttered electronics repair shop storefront at night, CRT televisions stacked in the window all showing static, a big antenna on the roof.
- **loc-gazette** — small-town newspaper office at night, gold lettering on the window, one desk lamp burning inside, stacks of yellowed newspapers.
- **loc-sheriff** — small brick sheriff's office at night, one patrol car out front, porch light, children's crayon drawings taped inside the window.
- **loc-community** — suburban community center at night, banner over the entrance, folding tables visible through glass doors, unsettlingly tidy.
- **loc-freshmart** — brand-new big-box grocery store glowing fluorescent white at night, empty parking lot, rows of identical shopping carts, faint green glow from a basement vent.
- **loc-watertower** — old water tower on a hill at night against the stars, red beacon light, the grass around its legs unnaturally green and vivid.
- **loc-woods** — dark pine forest edge at night, mist between the trunks, two tiny green lights deep in the dark like eyes.
- **loc-crash** — a perfect circle of flattened glowing grass in a forest clearing at night, faint blue luminescence, mist, seen from just inside the treeline.
- **loc-undermart** — vast dim underground vault filled with rows of glowing translucent sleep pods, each softly lit blue, cables on the ceiling, one aisle leading to darkness. *(interior — drop the "suburb" phrase from the style bible)*
- **loc-reservoir** — calm small-town reservoir at night, moonlight path on the water, fishing dock, a faint column of light touching the far shore.

## Transition Scenes — `art/scene-<id>.jpg`

- **scene-cold-open** — suburban street at dusk, rows of houses with porch lights coming on, telephone wires against an orange-to-navy sky, a distant water tower silhouette.
- **scene-act-one** — quiet suburban house at 2 AM under a huge moon, one window lit, a lone streetlamp, everything still.
- **scene-abduction** — a man in a bathrobe floating up into a cone of cyan light above a suburban lawn at night, clutching a garden gnome, seen from across the street, houses dark below. *(the money shot — worth rerolling until it's perfect)*
- **scene-mandatory-fun** — closeup of a suburban front door at night with a cream flyer taped to it, porch light glow, the flyer crisp and official-looking, slight dutch angle.
- **scene-act-two** — three identical suburban houses side by side at night, each with one window glowing green, garden gnomes on every lawn all facing the camera.
- **scene-undermart** — cathedral-scale underground chamber of glowing blue sleep pods in rows, a tiny human silhouette at the entrance for scale. *(interior)*
- **scene-act-three** — small-town festival at night: bunting, folding chairs, a crowd of silhouettes, fireworks bursting over a water tower.
- **scene-unzip** — a tall man in a gray suit standing at a podium at night, lit by a single spotlight, a thin vertical seam of green light glowing down the center of his chest, his smile too wide. *(one specified person)*
- **scene-ending-treaty** — sunrise over a suburban street, a human hand and a translucent green gelatinous hand meeting in a handshake in silhouette against the sun.
- **scene-ending-boom** — a water tower erupting in a spectacular burst of golden fireworks and white salt crystals at night, shockwave ring, sparks raining, seen from a lawn below.
- **scene-perfected** — impossibly perfect suburban street in bright daylight, every lawn identical, every house identical, residents waving in unison from their porches, colors slightly too saturated, eerie. *(daylight — swap "at night" out of the style bible)*

---

### Tips

- Generate everything in one sitting with the same model/settings for consistency.
- If a generator adds text or signage gibberish, add "blank signs" to the prompt.
- The scene overlay letterboxes and grades your image (scrim + scanlines), so
  slightly-too-bright generations still look cinematic in the app.
- Portraits of NPCs also slot in nicely as custom clue pins — pin a clue and
  describe what the player sees.
