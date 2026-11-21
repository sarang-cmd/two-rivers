# Two Rivers — India × Germany

A single-file, dependency-light 3D world. Two river arms — an Indian one and a German one — meet at a common harbour mouth and flow out to a mirrored sea. Monuments, gardens, ghats, warehouses, vineyards, trains, boats and birds are all generated procedurally at load time.

**Everything lives in [`index.html`](index.html).** Three.js is pulled from an import map at runtime; there is no build step and no asset folder. Open the file in a browser (or serve the folder) and it runs.

```bash
python3 -m http.server 8080
# then open http://localhost:8080/index.html
```

## What's in the scene

| | |
|---|---|
| **India arm** | Taj Mahal with its char-bagh garden, great gate, mosque and *jawab*; Red Fort; Qutub Minar; Golden Temple; Meenakshi gopurams; Konark; Mysore Palace |
| **Germany arm** | Cologne Cathedral; Brandenburg Gate; Neuschwanstein and Hohenzollern on their crags; the Holstentor; half-timbered towns |
| **Harbour** | twin gateways, ghats, chai and pretzel stalls, stepped quays, warehouses and cranes |
| **Life** | river boats and wakes, steam trains, road traffic, walking crowds, flocks of birds, mist and cloud bands |
| **World** | sculpted valley terrain, two rivers, a shared estuary, a mirrored sea reflection of the monuments |

## Controls

* **drag** — orbit · **wheel** — zoom · **right-drag** — pan
* **1–4** — light presets (Golden · Dawn mist · Moonlit · Festival)
* **H** — photo mode (hides the panel)
* **R** — reset view

The side panel offers:

* **Light** — Golden hour, Dawn mist, Moonlit, Festival dusk
* **Quality** — High / Medium / Low (Low drops fine ornament but keeps every monument silhouette)
* **Crowds & traffic** — Light / Full / Bustle
* **River sail** — a guided boat-height flight up one river and down the other, with play/pause and a scrub slider
* **Views** — Steam deck, Taj far bank, Garden from gate, India aerial, Germany aerial, Harbour gates, Whole valley
* **Mirrored pairs** — jump to any paired composition and its reflection

## Performance notes

The scene is built for a real GPU: roughly 1.3–1.6 M triangles and 300–550 draw calls at High quality. Everything repeated (trees, people, crops, boats, reeds) is instanced; monument ornament is merged per monument into a handful of buffers. On software renderers (SwiftShader) expect a few frames per second — that is the renderer, not the scene, but Quality → Low helps a lot.

## Repo layout

```
index.html        the whole experience
test/             Puppeteer harnesses used to build and verify the scene
  shot.js         single screenshot with optional JS injected into the page
  multi.js        N shots from one server/page + fps/tri/call stats
  views.js        click through the "Views" presets, one screenshot each
  presets.js      screenshot arbitrary camera/target pairs
  modes.js        full UI smoke test (light, quality, density, sail, presets, photo mode)
  perf.js         render timing with and without instanced meshes
  chunk*.js       the build chunks the single file was assembled from
```

The harnesses need a local Chrome for Puppeteer and a static server; they were used under `/home/user/test` during development and expect the page to be reachable on a local port (each script starts its own).
