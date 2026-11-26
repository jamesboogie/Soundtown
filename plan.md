# SoundByte Retro Soundboard — Implementation Plan

## Product scope
Build a single-page, web-based soundboard for playing classic retro game-inspired effects. It must use free, openly licensed assets; offer immediate button/tap playback; display and support dedicated keyboard hotkeys; prevent unwanted overlap; include Stop, volume, mute, hotkey reference, and an accessible credits/licensing section. It must work well on desktop and mobile while preserving keyboard interaction where supported.

## Implementation approach
- **Static-first application:** Build a dependency-free HTML/CSS/JavaScript site in `public/` and serve it with a minimal Node static server on port 3000. No user data, accounts, backend, or database are necessary.
- **CC0 source assets:** Curate a small, named set of effects from SubspaceAudio's *512 Sound Effects (8-bit style)* pack, published on OpenGameArt under CC0. Selected files will be copied into `public/audio/`; provenance is retained in `CREDITS.md` and explained in the in-app credits panel.
- **Playback control:** Create one `HTMLAudioElement` per cue. A central playback controller resets any currently playing cue before starting the next, updates active visual state, applies global volume, and supports mute and Stop. Button activation works by click/tap, Enter, and Space; numeric and letter hotkeys trigger the same controller except while focus is in an editable control.
- **Responsive UI:** Use semantic controls, visible hotkey badges, ARIA live status, strong focus treatment, and a compact 1–6 mapping reference. The layout reduces cleanly from a cabinet-style desktop faceplate to a vertical mobile stack.

## Design direction — Candy Cabinet Pop

### Design movement
**Candy Cabinet Pop**: a playful pastel arcade-cabinet interface that treats each sound as a collectible tactile tile rather than an austere control.

### Core principles
1. **Tactile delight:** pressable tiles, raised shadows, and deliberate release animations make every cue feel like a cabinet button.
2. **Fast legibility:** label, color, icon, and hotkey work together so a cue can be found at a glance.
3. **Cheerful restraint:** bright, candy-toned accents sit on a calm ink-blue backdrop rather than filling every surface.
4. **Inclusive utility:** keyboard paths, focus states, readable labels, and clear persistent controls are first-class features.

### Color philosophy
A deep berry-navy foundation resembles the interior of an arcade cabinet and lets the candy palette carry the interaction. Signature bubblegum pink (`#FF5CA8`) defines the brand; aqua, citrus, lilac, and orange distinguish cues without relying on color alone. Pale cream surfaces maintain readable contrast and soften the nostalgic aesthetic.

### Layout paradigm
The page is composed as a tilted **cabinet faceplate**: a top marquee and compact status readout lead into a staggered cue field, while the side/cartridge-like utility strip houses playback controls and the complete hotkey legend. On smaller screens, these parts collapse into a clean vertical arcade stack rather than a generic centered card grid.

### Signature elements
- Sticker-like icon medallions with pixel-stepped edges.
- Raised cue pads with chunky offset cabinet shadows and keycap hotkey badges.
- Small sparkle/star bursts and a glowing `NOW PLAYING` terminal-style readout.

### Interaction philosophy
Every action must have immediate, unambiguous feedback: tile press/release animation, active tile illumination, live status text, and synchronised stop/mute controls. The app remains usable with pointer, touch, and keyboard input; sound never overlaps accidentally.

### Animation
Use brief 120–180 ms easing for tile press states, readout transitions, and decorative sparkles. Respect `prefers-reduced-motion` by removing nonessential motion while preserving active-state clarity. Do not autoplay audio.

### Typography system
Use **Silkscreen** for the display-forward wordmark, key labels, and high-level headings. Pair it with a readable system sans-serif for descriptions and credits. Labels are sentence case; hotkeys and micro-status text use uppercase pixel treatment.

### Brand essence
**SoundByte turns open retro effects into an instantly playable pocket arcade for creators and game-night hosts.**

Personality: playful, tactile, generous.

### Brand voice
Short, energetic, and friendly—with clear functional language.

- “Tap a tile. Wake the arcade.”
- “Hit a key—hear the cabinet answer.”

### Wordmark & logo
`SOUNDBYTE` appears as a stacked pixel-wordmark with a small, four-point sparkle replacing the dot in the “B” counter. It is rendered in display typography and bracketed by tiny cartridge tabs, avoiding a generic text-only header.

### Signature brand color
**Bubblegum Arcade Pink — `#FF5CA8`**.

## Project structure

```text
public/
  index.html            # Semantic single-page structure and accessible controls
  styles.css            # Candy Cabinet Pop design, responsive layout, motion preferences
  app.js                # Cue catalog, audio playback state, hotkeys, volume/mute/stop logic
  audio/                # Curated local CC0 .wav sound effects
  manus-routes.json     # Required route declaration for the single page
  favicon.svg           # Small pixel-style SoundByte mark
CREDITS.md              # Exact asset source, author, license, and attribution note
package.json            # Minimal static-server scripts (no runtime framework)
server.js               # Safe static file server for local preview
app.config.ts           # Project logo metadata
```

## Material constraints
- Only CC0 audio from the verified OpenGameArt source will ship in the project.
- No commercial-game audio, trademarks, login, remote API calls, analytics, or tracking.
- The soundboard will ship with six small local WAV files for immediate, offline-friendly playback.
- The target is a lightweight static website; it is not a PWA or recording/editing tool.
