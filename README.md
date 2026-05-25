# ERROR: HUMAN_FOUND

Live: [https://ethara-assessment-k44c.vercel.app/](https://ethara-assessment-k44c.vercel.app/)

`ERROR: HUMAN_FOUND` is a browser-based cinematic AI operating-system game where the player becomes the last human programmer discovered after a global AI collapse. The mission is to debug corrupted sectors, repair logic systems, stabilize networks, and reach the Core Intelligence.

## Tech Stack

- Next.js
- React
- Tailwind CSS
- Framer Motion
- GSAP
- Three.js
- Zustand
- localStorage
- IndexedDB

## Gameplay

The game combines hacking-simulator interactions, debugging puzzles, terminal commands, AI communication, cinematic storytelling, pattern recognition, and logic reconstruction.

Core loop:

1. Enter a corrupted AI sector
2. Analyze corruption
3. Use terminal commands
4. Solve the sector puzzle
5. Restore stability
6. Unlock deeper AI layers
7. Reach Core Intelligence

## Terminal Commands

Available commands:

```txt
scan
repair
decrypt
trace
override
stabilize
inject
```

Each sector requires a different command sequence. Correct execution lowers corruption, raises stability, and unlocks deeper sectors.

## Game Sectors

- `1-20` Syntax Bug Sector
- `20-35` Logic Error Sector
- `35-50` Corruption Sector
- `50-70` Recursion Sector
- `70-90` Artificial Intelligence Sector
- `90-100` Core Intelligence Sector

## Features

- Cinematic boot sequence
- Intro cinematic with AI collapse story
- Holographic mainframe sector map
- Debug terminal with animated command feedback
- Corruption-driven UI instability
- AI communication panels with emotional states
- Sector progress, stability, achievements, and corruption stats
- Autosave using localStorage and IndexedDB
- Accessibility settings
- Reduced motion support
- High contrast mode
- Colorblind assistance
- UI scaling
- Keyboard navigation support
- Browser-only architecture with no backend

## Local Setup

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

## Build

```bash
npm run build
```

Start production build:

```bash
npm run start
```

## Project Structure

```txt
app/
components/
components/three/
data/
hooks/
lib/
store/
types/
```

## Save System

Progress, restored sectors, settings, achievements, command history, and story flags are saved locally in the browser using:

- `localStorage`
- `IndexedDB`

No backend, database, authentication, cloud storage, APIs, or user profiles are used.

## Accessibility

The game includes:

- Subtitles
- Reduced motion mode
- High contrast mode
- Colorblind assistance
- UI scaling
- Keyboard controls

## Deployment

The project is deployed on Vercel:

[https://ethara-assessment-k44c.vercel.app/](https://ethara-assessment-k44c.vercel.app/)
