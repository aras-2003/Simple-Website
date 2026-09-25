# Decision Theatre V2 — Decision Spine

Branch: `feature/decision-theatre-v2`  
Route: `/lab/decision-theatre-v2`  
Status: isolated visual prototype. Do not promote to staging/production without owner acceptance.

## Creative direction

V2 keeps the strongest parts of the Astra prototype: warm editorial surface, a dark system field, restrained green accent, one persistent spatial object and executive typography.

It removes the arbitrary nine-cube metaphor.

The new object is one organizational system with five named layers:

**Direction → Ownership → Architecture → Portfolio → Execution**

A single decision plane crosses every layer. The object therefore explains the narrative structurally:

1. **Friction** — the layers exist but are spatially misaligned.
2. **Align** — the same layers form one coherent system around a shared axis.
3. **Decide** — the decision plane visibly crosses all layers instead of appearing as an isolated event.
4. **Execute** — the same layers open into execution lanes and signals move through them.

Nothing disappears and gets replaced by an unrelated illustration. The viewer keeps orientation because the same object transforms continuously.

## External-tool workflow used

- **Firecrawl** — extracted reusable motion grammar from Auralis, House and Vesper: scene continuity, scroll-scrubbed progression and meaningful transformation rather than decorative motion.
- **Figma** — `Arkadiusz Kamrowski — Motion Lab` establishes the four narrative states before implementation.
- **GSAP 3.15** — production-like choreography prototype with scroll-linked sequencing and responsive matchMedia handling.
- **Astro / CSS 3D** — semantic page structure and the actual spatial object. No WebGL dependency is used yet.

Three.js is intentionally deferred. The current concept does not need a real camera or mesh lighting to communicate the system. If V2 is accepted but lacks sufficient spatial depth, Three.js becomes the next escalation, not the starting point.

## Quality intent

The visual subject must stay understandable without reading every sentence. Motion is judged by continuity, hierarchy, easing and conceptual clarity, not by how many objects move.

Desktop uses one sticky scene over native scrolling. Mobile removes the pinned choreography and presents the same four ideas in normal document flow.

Reduced motion removes the scroll choreography.
