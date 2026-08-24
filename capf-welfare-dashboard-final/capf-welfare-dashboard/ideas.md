# CAPF Welfare Officer Dashboard — Design Direction

## Three stylistic approaches

### Approach 1 — Command Calm
A light, editorial operations desk with deep navy navigation, black typography, and quiet cobalt accents. It feels authoritative without becoming punitive, making sensitive welfare triage read as careful human work rather than surveillance.

**Probability:** 0.07

### Approach 2 — Field Signal
A darker control-room interface with navy panels, thin signal lines, and focused cobalt highlights. It emphasizes urgency and situational awareness, but risks making the system feel more like an incident console than a welfare tool.

**Probability:** 0.03

### Approach 3 — Care Ledger
A warmer ivory workspace with generous whitespace, softly framed records, and handwritten-note inspired details. It feels approachable and humane, but could underplay the operational precision needed for an authorized officer queue.

**Probability:** 0.08

## Chosen direction — Command Calm

### Design Movement
Contemporary editorial information design blended with civic service software: the clarity of a field report, the restraint of a public-service identity, and the warmth of a human case review.

### Core Principles
1. **Welfare before warning.** Risk is framed as a pattern worth a check-in, never as a diagnosis or disciplinary label.
2. **Operational clarity.** Every signal, count, and action has one job; the interface should be scannable in a short shift handover.
3. **Quiet authority.** Navy anchors the experience, black carries the facts, and cobalt marks action without alarmist red.
4. **Human in the loop.** The officer's judgment remains visible through context, explainability, and follow-up logging.

### Color Philosophy
Deep navy (#07162E) creates trust and command presence without using black as a wall. Near-black (#0E1624) is reserved for primary text and high-contrast controls. Ivory (#F5F7FA) softens the environment, while white surfaces create space for sensitive records. Cobalt (#2B66F6) is the ownable action color: precise, calm, and distinct from crisis-red semantics. Secondary status tones use subdued slate, pale blue, and warm sand rather than a traffic-light palette.

### Layout Paradigm
A persistent left rail acts like a field folder spine. The main workspace uses an asymmetric split: a short situational header and metrics band on top, a wide alert queue on the left, and a narrow explainability/support rail on the right. Cards are intentionally varied in height and density so the page reads as an operational brief, not a uniform tile grid.

### Signature Elements
- A thin cobalt "signal rule" that travels through the header and active navigation state.
- White record cards with navy micro-labels and small index numerals, echoing a case file system.
- A navy insight panel with a fine-line pulse texture, used only for aggregate readiness and privacy cues.

### Interaction Philosophy
Interactions should feel deliberate and reversible. Selecting a flagged person expands their context in place, filters update the queue without page jumps, and every placeholder control produces a clear toast rather than a dead-end. Hover is a quiet lift and underline; active actions use a short press response. No interaction should imply that a model has made a final judgment.

### Animation
Use 180–260ms ease-out transitions for nav, tabs, filters, and card emphasis. Queue items enter with a 40ms stagger only on the initial load. Insight panels may fade in with a 4px upward translation. Avoid looping animation except for a small, slow pulse on the live status indicator. Respect prefers-reduced-motion and remove entrance movement when requested.

### Typography System
Use **DM Sans** for the interface body and utility labels, with **Manrope** for large headings and key numeric metrics. H1 is 34/1.05 with weight 750; section titles are 17/1.2 weight 700; body is 14/1.45 weight 500; metadata is 11/1.2 weight 700 with increased tracking and uppercase styling. Numeric scores use Manrope with tabular numerals.

### Brand Essence
A privacy-first welfare triage desk for authorized CAPF welfare officers, built to turn drifting work patterns into timely human check-ins without turning people into scores.

**Personality:** steady, humane, exact.

### Brand Voice
Headlines are direct and grounded. CTAs say what the officer can do next, not what the model believes. Microcopy repeatedly reinforces consent, explainability, and human review.

- Example headline: **The unit is steady. Three people need a closer look.**
- Example CTA: **Open the context before you decide.**

### Wordmark & Logo
Use a compact shield-and-compass mark: a navy shield with an ivory four-point compass star and a protective arc. The wordmark is set in a custom all-caps lockup with a narrow cobalt signal rule underneath; never use the mark as a generic stock badge.

### Signature Brand Color
**Signal Cobalt — #2B66F6.** This is the dashboard's ownable action color: bright enough to guide an officer's eye, restrained enough to avoid emergency-red urgency.

## Implementation reminders

- Keep this design direction visible at the top of `client/src/index.css`, `client/src/pages/Home.tsx`, and any new component files.
- Avoid purple gradients, generic centered layouts, excessive rounded cards, and Inter.
- Use the generated emblem and avatar assets through their provided `/manus-storage/` URLs; do not reference local asset paths in application code.
- Keep the interface frontend-only with synthetic demo data and explicit privacy framing.

> Design test: does this choice reinforce or dilute **Command Calm**?
