# CLAUDE.md — LOTUS POWER ARCHITECT

**MASTER BRIEF & SYSTEM ARCHITECTURE**
Version 1.0 | April 2026 — Candidate: Carlos Lucero

## [0. MANDATORY FIRST STEP — CONTEXTUAL ANALYSIS]

Before writing code, you must internalize the "Deep Tech" nature of the client:

1. Analyze `https://www.lotus-microsystems.com/` — Focus on their Silicon-on-Insulator (SOI) technology and their "Interposer" value proposition. We are not just selling "chips"; we are selling space and thermal efficiency.
2. Analyze `https://teenage.engineering/` (UI Reference) — Study their use of high-contrast, technical typography, and "knurled" textures. This is our aesthetic benchmark for "Engineering Luxury."

## [1. IDENTITY — POWERING THE INVISIBLE]

Lotus Microsystems doesn't make consumer gadgets; they make the invisible heart of high-performance electronics.

**The Mission:**
"silicon-based power for the next frontier"

**Brand Feeling:**

- **Precision Engineering:** Every pixel must feel calculated. No "fuzzy" shadows.
- **Minimalist Swiss:** Helvetica Neue (or Inter), strict 12-column grids, monochrome with "Signal" accents (Power Orange `#FF5F00`).
- **Hardware-as-Software:** The interface should feel like a physical testing bench.

## [2. THE PROJECT: THE INTERACTIVE CONFIGURATOR]

The "Lotus Power Architect" is a tool where a hardware engineer inputs their power requirements and sees a real-time comparison between "Standard Industry Solutions" and "Lotus Solution."

### 2.1 The "Power vs. Space" Visualization

- **The Problem:** Traditional converters take up too much PCB real estate.
- **The Solution:** A 3D or 2D-top-down view of a PCB.
- **Interaction:** A slider that changes "Output Current." As it increases, the "Standard" footprint grows exponentially, while the "Lotus" footprint stays compact and efficient.

### 2.2 Technical Curves (D3.js / Framer Motion)

- Efficiency curves (Efficiency % vs Load).
- The lines must be "Silk Smooth" (using the `SILK` easing: `[0.25, 0.1, 0.25, 1.0]`).
- When hovering over a data point, show a "Technical Tooltip" with monospaced font.

## [3. DESIGN SYSTEM (THE LUCERO STANDARD)]

### 3.1 Typography

- **Primary:** `Helvetica Neue` (fallback `Inter`).
- **Data/Monospace:** `JetBrains Mono` for all numerical values and chip specs.
- **Rules:**
  - Labels in ALL CAPS, `10px`, letter-spacing `0.15em`.
  - Values in Large Medium weight.

### 3.2 Color Palette

```css
--bg-white:      #FFFFFF;
--ui-linen:      #F2F2F2;    /* Subtle zones */
--silicon-grey:  #2D2D2D;    /* For the chips */
--signal-orange: #FF5F00;    /* Power/Action */
--data-green:    #00FF41;    /* Efficiency "Go" */
--border-thin:   #E5E5E5;    /* 0.5px borders only */
```

### 3.3 The "Swiss Grid"

- Strict 12-column layout.
- All components must align to an 8px baseline grid.
- Use "Technical Borders" (0.5px) instead of shadows to separate sections.

## [4. CLAUDE CODE — IMPLEMENTATION WORKFLOW]

Use Claude Code to automate the heavy lifting of the technical components:

1. **Phase 1: The Physics Engine.** Create a utility file `powerLogic.ts` that calculates PCB area based on Lotus data sheets (input voltage, output current, frequency).
   - Command: `claude "Create a TypeScript logic file that calculates thermal dissipation and area requirements based on Lotus SOI specs vs standard TI buck converters."`
2. **Phase 2: The Swiss UI.** Build the dashboard using Next.js and Tailwind.
   - Command: `claude "Build a React dashboard. 12-column grid. Left: Inputs. Right: 3D Visualization of PCB space. Use Helvetica Neue. Borders 0.5px. No shadows. High contrast."`
3. **Phase 3: The "Vibe Coding" Layer.** Add the transitions.
   - Command: `claude "Add Framer Motion to the sliders. When the user changes power input, the PCB components should settle with a FLOAT easing [0.22, 1, 0.36, 1]."`

## [5. ARCHITECTURE & TECH STACK]

- **Framework:** Next.js 14 (App Router).
- **Styling:** Tailwind CSS (Strictly using utility classes for the grid).
- **Visualization:** Three.js (for the 3D chip view) or SVG-dynamic (for 2D PCB view).
- **AI Integration:** A "Technical Copilot" sidebar where engineers can ask: "What is the quiescent current at 5V input?" and it queries a JSON of Lotus documentation.

## [6. THE "NO" LIST (CRITICAL)]

- No gradients (unless it's a heatmap for thermal visualization).
- No rounded corners (Chips are square, engineering is precise).
- No "marketing" fluff. Only data-driven claims.
- No icon libraries. Use custom, thin-line SVG icons only.

## [7. EXECUTION LOG — APRIL 2026]

- **v1.0:** Initial draft for Lotus Microsystems Student Position. Focus on transforming "Deep Tech" into "High-End UX." Leveraging Claude Code for rapid prototyping of the hardware-math-engine.
