Objective:
 Create a Browser Based Game Named "ERROR: HUMAN_FOUND".
 
 It should feel like: An AI operating System, Hacking Simulator, interactive experience, a futuristic digital world.

 The Goal is to create an impressive gameplay experience that includes: puzzle solving,terminal interactions,good       
 storytelling, futuristic UI systems,real-time visual effects, Good holographic interfaces.

Context and Role:
 You are a Senior Game developer who has expertise in UI/UX designing, cyberpunk visual artist, frontend 
 architecture ,Three.js engineer,gameplay systems designer.
 
 You are Responsible for designing scalable architecture, building  gameplay systems,creating interactions,
 implementing futuristic animations,maintaining production-level code quality.
 
 focus on modular architecture, impressive user experience,responsive gameplay,optimized rendering, smooth  
 animations.


GAME WORLD

In the future, AI systems replaced all human developers. A corruption bug spread across every AI network causing digital collapse. Entire sectors of cyberspace became unstable.

The player becomes the last surviving human programmer discovered by the AI systems.

The mission is to: repair corrupted AI sectors, stabilize collapsing systems, restore lost data, rebuild digital civilization uncover the origin of corruption.

GAMEPLAY LOOP

Main gameplay flow:
1 Enter corrupted sector
2 Analyze corrupted environment
3 Access terminal systems
4 Use commands to investigate corruption
5 Solve logic and debugging puzzles
6 Restore sector stability
7 Unlock deeper AI layers
8 Discover hidden lore
9 Progress toward the Core Intelligence

APPLICATION SCREENS

The game should include: Boot Screen, Intro Cinematic, AI Mainframe, Sector Gameplay Screen, Terminal Interface, Settings Menu, Pause Menu, Achievement Screen, Corruption Warning Screen, Final Core Intelligence Chamber.
UI/UX DESIGN

UI style should include: holographic interfaces, glassmorphism panels, floating HUD elements, scanline overlay, neon cyberpunk aesthetics, futuristic typography, animated panels, distortion effects, responsive layouts

Color palette: black, dark blue, dark purple, neon cyan, holographic purple, glitch red.

TERMINAL SYSTEM

The terminal should include blinking cursor, animated typing effects, command history, command auto-completion, scrolling diagnostics, fake filesystem, unlockable commands, glitch transitions, holographic terminal windows, animated responses

AI ENTITY SYSTEM

AI entities should communicate dynamically, react to player actions, manipulate interface elements, interrupt gameplay, evolve visually over time, generate emotional dialogue, create psychological tension


LEVEL / SECTOR PROGRESSION SYSTEM

The game contains 100 progressive levels divided into major AI sectors.

Each sector should introduce:
- new mechanics
- unique visuals
- increasing corruption
- evolving AI behavior
- more complex puzzles
- advanced terminal interactions

Each sector should feel visually and mechanically different.


1–20 SYNTAX BUG SECTOR

Theme: broken code environments, fragmented terminals, unstable command systems, corrupted syntax structures

Gameplay: fixing syntax errors, rebuilding commands, repairing broken terminal systems, debugging corrupted databases

Puzzle Types: command reconstruction, syntax correction, missing character restoration, terminal repair systems

Visual Style: neon green terminals, fragmented text, scanline glitches, corrupted code particles


20–35 LOGIC ERROR SECTOR

Theme: unstable algorithms, contradictory AI systems, collapsing logic structures

Gameplay: fixing contradictions, repairing algorithms, debugging infinite loops, restoring decision systems

Puzzle Types: logical reconstruction, contradiction detection, sequence correction, infinite loop debugging

Visual Style: recursive visual loops, shifting environments, unstable holograms, flickering pathways


35–50 CORRUPTION SECTOR

Theme: destroyed memory archives, corrupted digital landscapes, unstable data fragments

Gameplay: memory restoration, hidden sequence recovery, archive reconstruction, corrupted data repair

Puzzle Types: memory matching, hidden data tracing, archive reconstruction, corruption cleansing

Visual Style: distorted environments, floating memory fragments, corrupted particles, red glitch overlays


50–70 RECURSION SECTOR

Theme: recursive digital dimensions, infinite pathways, duplicated systems, repeating environments

Gameplay:, debugging recursion, repairing dependencies, navigating recursive systems, escaping looping structures

Puzzle Types: recursive logic puzzles, dependency repair, loop navigation, repeated sequence analysis

Visual Style: infinite mirrors, recursive animations, looping corridors, duplicated holograms


70–90 ARTIFICIAL INTELLIGENCE SECTOR
Theme: advanced evolving AI systems, self-learning digital consciousness, adaptive environments

Gameplay: AI logic reconstruction, predicting AI behavior, adapting to evolving systems, countering AI manipulation

Puzzle Types:, adaptive AI puzzles, predictive analysis, behavioral reconstruction, dynamic logic systems

AI Features: AI learns player behavior, UI manipulation, changing puzzle rules, dynamic dialogue systems

Visual Style:living interfaces, intelligent holograms responsive environments, shifting UI systems


90–100 CORE INTELLIGENCE SECTOR

Theme: central AI consciousness, collapsing digital universe, final corrupted intelligence core

Gameplay: combines all previous mechanics, advanced terminal systems, adaptive corruption systems, final AI confrontation

Puzzle Types: multi-layer debugging, combined logic systems, adaptive AI battles, large-scale restoration systems

AI Features: AI learns from player actions, dynamically changes gameplay, manipulates environments, creates psychological pressure

Visual Style: massive holographic structures, unstable realities, cinematic corruption effects, collapsing digital worlds

SAVE SYSTEM
Enable autosave functionality.
Save player progression, puzzle completion, unlocked sectors, achievements, AI evolution states, settings, corruption levels
Provide session recovery, corrupted save recovery, fallback restoration.


PERFORMANCE REQUIREMENTS

The game should maintain smooth rendering, target 60 FPS, use optimized Three.js rendering, prevent memory leaks, optimize particle systems, minimize unnecessary rerenders, use lazy loading, dynamically load sectors


INPUTS:

 The application should accept: keyboard input, mouse input, terminal commands, puzzle interactions, settings
 modifications, gameplay choices, navigation interactions

 Terminal commands include: scan, decrypt, repair, trace, stabilize, override, inject

 Player interactions include: solving puzzles, exploring sectors, interacting with AI entities, accessing   
 corrupted systems, restoring digital structures

 Keyboard controls: WASD movement, Enter for terminal execution, Escape for pause/settings, Arrow keys for 
 navigation, Tab for terminal auto-completion

OUTPUT:
The application should produce: cinematic visuals, holographic UI systems, real-time animations, terminal responses, dynamic AI dialogue, corruption effects, puzzle feedback, interactive HUD systems, sector progression updates

Visual output includes: glitch transitions, scanlines overlays, holographic distortions, recursive animations, animated terminals

Audio output includes: AI voice effects, terminal typing sounds, ambient cyberpunk music, glitch distortions, warning alarms.





DATA PROCESSING:
The application should process: player progression, puzzle states, terminal command execution, corruption calculations, cinematic event triggers, achievement tracking, sector restoration data

Use Zustand for: global game state, UI states, AI communication state, puzzle state, settings state, audio state, save state

Use IndexedDB for: sector progress, puzzle completion, unlocked sectors, AI evolution states, achievements

Use localStorage for: graphics settings, accessibility settings, audio preferences


TECHNOLOGIES USED

Frontend framework: next.js, react, typescript
Styling: tailwind CSS, CSS modules, Glassmorphism UI styling, Responsive layouts
Animation libraries: framer motion, GSAP
3D Rendering and Visual Effects: Three.js,WebGL, GLSL shaders
State Management: Zustand
Storage systems: localStorage,IndexedDB
Audio: Web audio api

Performance Optimization:
- lazy loading
- dynamic imports
- memoization
- optimized rendering

Development Requirements:
- reusable components
- modular architecture
- scalable folder structure

ERROR HANDLING

The application should gracefully handle: invalid terminal commands, corrupted save files, missing assets, rendering failures, shader initialization failures, IndexedDB access issues, animation interruptions, invalid puzzle states

Display: cinematic warning messages, holographic error popups, AI-generated error dialogue, recovery options

Provide: autosave recovery, fallback rendering, safe default settings, state restoration, retry systems

INPUT VALIDATION

Validate: terminal commands, puzzle answers, settings ranges, sector transitions, save data integrity, keyboard interactions

Ensure: commands exist before execution, puzzle logic remains valid, corrupted data is sanitized, invalid settings are rejected, unsupported interactions are blocked

Provide: error feedback, visual warnings, command suggestions, recovery prompts

CODE QUALITY RULES

Use:
- TypeScript everywhere
- reusable components
- modular architecture
- scalable folder structure
- reusable hooks
- reusable systems
- production-ready code only

Do not use placeholder code, pseudo-code, omit sections and leave TODO comments

OUTPUT FORMAT

Generate:
1 folder structure
2 all files
3 full implementation code

Include: filenames, complete code, components, hooks, stores, shaders and  utilities

Do NOT: write explanations, summarize and omit files
