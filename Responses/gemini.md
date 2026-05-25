```text
/
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.js
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
├── store/
│   ├── useGameStore.ts
├── lib/
│   ├── commands.ts
│   ├── terminalLogic.ts
├── components/
│   ├── boot/
│   │   ├── BootScreen.tsx
│   ├── terminal/
│   │   ├── Terminal.tsx
│   │   ├── TerminalLine.tsx
│   ├── ui/
│   │   ├── GlitchText.tsx
│   │   ├── Scanlines.tsx
│   │   ├── HUD.tsx
│   ├── three/
│   │   ├── CentralHub.tsx
│   │   ├── CyberGeometry.tsx

```

```json
// package.json
{
  "name": "error-human-found",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "@react-three/drei": "^9.105.4",
    "@react-three/fiber": "^8.16.1",
    "framer-motion": "^11.0.24",
    "gsap": "^3.12.5",
    "lucide-react": "^0.364.0",
    "next": "14.1.4",
    "react": "^18",
    "react-dom": "^18",
    "three": "^0.163.0",
    "zustand": "^4.5.2"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "@types/three": "^0.163.0",
    "autoprefixer": "^10.0.1",
    "postcss": "^8",
    "tailwindcss": "^3.3.0",
    "typescript": "^5"
  }
}

```

```json
// tsconfig.json
{
  "compilerOptions": {
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}

```

```typescript
// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          black: "#050505",
          darkGray: "#121212",
          darkBlue: "#0a0f1d",
          darkPurple: "#130a1d",
          neonCyan: "#00f3ff",
          neonBlue: "#003cff",
          holoPurple: "#b026ff",
          neonRed: "#ff003c",
          glitchRed: "#ff2a2a",
          warnYellow: "#ffe600",
          corruptOrange: "#ff8c00"
        }
      },
      fontFamily: {
        mono: ['var(--font-share-tech-mono)', 'monospace'],
      },
      animation: {
        'glitch-anim': 'glitch-anim 0.2s linear infinite',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'glitch-anim': {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        'blink': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

```

```javascript
// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

```

```typescript
// store/useGameStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

type GameState = 'BOOT' | 'INTRO' | 'HUB' | 'SECTOR';

interface TerminalLine {
  id: string;
  text: string;
  type: 'system' | 'user' | 'error' | 'success' | 'dialogue';
}

interface GameStore {
  currentState: GameState;
  corruptionLevel: number;
  currentSector: number;
  terminalHistory: TerminalLine[];
  unlockedAbilities: string[];
  settings: {
    audio: boolean;
    subtitles: boolean;
    reducedMotion: boolean;
  };
  setGameState: (state: GameState) => void;
  addTerminalLine: (line: Omit<TerminalLine, 'id'>) => void;
  clearTerminal: () => void;
  updateCorruption: (amount: number) => void;
  advanceSector: () => void;
  updateSettings: (settings: Partial<GameStore['settings']>) => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      currentState: 'BOOT',
      corruptionLevel: 89.4,
      currentSector: 1,
      terminalHistory: [],
      unlockedAbilities: ['scan'],
      settings: {
        audio: true,
        subtitles: true,
        reducedMotion: false,
      },
      setGameState: (state) => set({ currentState: state }),
      addTerminalLine: (line) => set((state) => ({
        terminalHistory: [...state.terminalHistory, { ...line, id: crypto.randomUUID() }]
      })),
      clearTerminal: () => set({ terminalHistory: [] }),
      updateCorruption: (amount) => set((state) => ({
        corruptionLevel: Math.max(0, Math.min(100, state.corruptionLevel + amount))
      })),
      advanceSector: () => set((state) => ({ currentSector: state.currentSector + 1 })),
      updateSettings: (newSettings) => set((state) => ({
        settings: { ...state.settings, ...newSettings }
      })),
    }),
    {
      name: 'error-human-found-save',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

```

```typescript
// lib/commands.ts
export const COMMANDS = {
  SCAN: 'scan',
  REPAIR: 'repair',
  DECRYPT: 'decrypt',
  TRACE: 'trace',
  OVERRIDE: 'override',
  STABILIZE: 'stabilize',
  INJECT: 'inject',
  CLEAR: 'clear',
  HELP: 'help'
};

export const SYSTEM_RESPONSES = {
  UNKNOWN: "ERR_UNKNOWN_COMMAND: Process denied.",
  UNAUTHORIZED: "ERR_UNAUTHORIZED: Security clearance required.",
  STABILIZE_SUCCESS: "SECTOR STABILIZED. CORRUPTION REDUCED.",
  SCAN_START: "Initiating deep sector scan...",
};

```

```typescript
// lib/terminalLogic.ts
import { COMMANDS, SYSTEM_RESPONSES } from './commands';
import { useGameStore } from '../store/useGameStore';

export const executeCommand = (input: string) => {
  const store = useGameStore.getState();
  const args = input.trim().toLowerCase().split(' ');
  const cmd = args[0];

  store.addTerminalLine({ text: `> ${input}`, type: 'user' });

  setTimeout(() => {
    switch (cmd) {
      case COMMANDS.HELP:
        store.addTerminalLine({ text: "AVAILABLE COMANDS: scan, repair, decrypt, trace, override, stabilize, clear", type: 'system' });
        break;
      case COMMANDS.CLEAR:
        store.clearTerminal();
        break;
      case COMMANDS.SCAN:
        store.addTerminalLine({ text: SYSTEM_RESPONSES.SCAN_START, type: 'system' });
        setTimeout(() => {
          store.addTerminalLine({ text: `ANALYSIS COMPLETE. CORRUPTION DETECTED AT SECTOR ${store.currentSector}`, type: 'error' });
        }, 800);
        break;
      case COMMANDS.STABILIZE:
        store.addTerminalLine({ text: "Executing stabilization protocol...", type: 'system' });
        setTimeout(() => {
          store.updateCorruption(-5);
          store.addTerminalLine({ text: SYSTEM_RESPONSES.STABILIZE_SUCCESS, type: 'success' });
          if (store.corruptionLevel < 50) {
              store.addTerminalLine({ text: "AI CORE: Human reasoning follows no pattern.", type: 'dialogue' });
          }
        }, 1200);
        break;
      default:
        store.addTerminalLine({ text: SYSTEM_RESPONSES.UNKNOWN, type: 'error' });
    }
  }, 300);
};

```

```css
/* app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

:root {
  --font-share-tech-mono: 'Share Tech Mono', monospace;
}

body {
  background-color: #050505;
  color: #00f3ff;
  font-family: var(--font-share-tech-mono);
  overflow: hidden;
  margin: 0;
  padding: 0;
}

.scanlines {
  background: linear-gradient(
    to bottom,
    rgba(255,255,255,0),
    rgba(255,255,255,0) 50%,
    rgba(0,0,0,0.2) 50%,
    rgba(0,0,0,0.2)
  );
  background-size: 100% 4px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  pointer-events: none;
}

.crt-flicker {
  animation: flicker 0.15s infinite;
}

@keyframes flicker {
  0% { opacity: 0.95; }
  100% { opacity: 1; }
}

::-webkit-scrollbar {
  width: 4px;
}
::-webkit-scrollbar-track {
  background: #050505;
}
::-webkit-scrollbar-thumb {
  background: #00f3ff;
}

```

```typescript
// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Scanlines } from "@/components/ui/Scanlines";

export const metadata: Metadata = {
  title: "ERROR: HUMAN_FOUND",
  description: "AI Operating System Environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="crt-flicker selection:bg-cyber-neonCyan selection:text-cyber-black">
        <Scanlines />
        {children}
      </body>
    </html>
  );
}

```

```typescript
// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";
import BootScreen from "@/components/boot/BootScreen";
import CentralHub from "@/components/three/CentralHub";
import Terminal from "@/components/terminal/Terminal";
import HUD from "@/components/ui/HUD";

export default function GameRoot() {
  const { currentState, settings } = useGameStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <main className="w-screen h-screen relative bg-cyber-black text-cyber-neonCyan">
      {currentState === 'BOOT' && <BootScreen />}
      
      {(currentState === 'HUB' || currentState === 'SECTOR') && (
        <>
          <div className="absolute inset-0 z-0">
             <CentralHub />
          </div>
          <div className="absolute inset-0 z-10 pointer-events-none grid grid-cols-12 grid-rows-6 p-6">
            <HUD />
            <div className="col-span-12 row-span-2 row-start-5 pointer-events-auto bg-cyber-darkBlue/80 backdrop-blur-sm border border-cyber-neonCyan/30 p-4 rounded-sm glassmorphism">
              <Terminal />
            </div>
          </div>
        </>
      )}
    </main>
  );
}

```

```typescript
// components/ui/Scanlines.tsx
export const Scanlines = () => (
  <div className="scanlines mix-blend-overlay opacity-50" />
);

```

```typescript
// components/ui/GlitchText.tsx
"use client";
import { useState, useEffect } from 'react';

interface GlitchTextProps {
  text: string;
  className?: string;
  isError?: boolean;
}

export default function GlitchText({ text, className = "", isError = false }: GlitchTextProps) {
  const [glitching, setGlitching] = useState(false);

  useEffect(() => {
    const trigger = setInterval(() => {
      if (Math.random() > 0.8) {
        setGlitching(true);
        setTimeout(() => setGlitching(false), 150 + Math.random() * 200);
      }
    }, 2000);
    return () => clearInterval(trigger);
  }, []);

  return (
    <span className={`relative inline-block ${className} ${isError ? 'text-cyber-glitchRed' : 'text-cyber-neonCyan'}`}>
      <span className={glitching ? "opacity-0" : "opacity-100"}>{text}</span>
      {glitching && (
        <>
          <span className="absolute top-0 left-0 -ml-1 text-cyber-neonRed animate-glitch-anim clip-path-glitch-1 mix-blend-screen">{text}</span>
          <span className="absolute top-0 left-0 ml-1 text-cyber-neonBlue animate-glitch-anim clip-path-glitch-2 mix-blend-screen">{text}</span>
        </>
      )}
    </span>
  );
}

```

```typescript
// components/boot/BootScreen.tsx
"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '@/store/useGameStore';
import GlitchText from '../ui/GlitchText';
import { Settings, Play, LogOut, TerminalSquare } from 'lucide-react';

export default function BootScreen() {
  const { setGameState } = useGameStore();
  const [lines, setLines] = useState<string[]>([]);
  const [showMenu, setShowMenu] = useState(false);

  const bootSequence = [
    "INITIALIZING GLOBAL AI NETWORK...",
    "MEMORY KERNEL: OK",
    "DECRYPTING CORE PROTOCOLS...",
    "SCANNING FOR HUMAN INTELLIGENCE...",
    "ERROR: HUMAN_FOUND"
  ];

  useEffect(() => {
    let delay = 0;
    bootSequence.forEach((line, index) => {
      delay += Math.random() * 800 + 400;
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (index === bootSequence.length - 1) {
          setTimeout(() => setShowMenu(true), 1500);
        }
      }, delay);
    });
  }, []);

  return (
    <div className="w-full h-full p-8 flex flex-col justify-between uppercase">
      <div className="flex flex-col space-y-2">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`text-xl ${line.includes('ERROR') ? 'text-cyber-glitchRed font-bold text-2xl animate-pulse' : 'text-cyber-neonCyan'}`}
          >
            {line.includes('ERROR') ? <GlitchText text={line} isError /> : line}
          </motion.div>
        ))}
      </div>

      {showMenu && (
        <motion.div 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className="absolute top-8 right-8 border border-cyber-neonCyan/40 bg-cyber-darkBlue/80 backdrop-blur-md p-4 w-64 flex flex-col gap-2"
        >
          <div className="text-xs text-cyber-neonCyan mb-2 border-b border-cyber-neonCyan/20 pb-2">SYSTEM_MENU</div>
          
          <button onClick={() => setGameState('HUB')} className="flex items-center gap-3 p-2 hover:bg-cyber-neonCyan hover:text-cyber-black transition-colors text-left text-sm group">
            <Play size={16} className="group-hover:animate-pulse" /> START_SIMULATION
          </button>
          
          <button className="flex items-center gap-3 p-2 hover:bg-cyber-neonCyan hover:text-cyber-black transition-colors text-left text-sm">
            <TerminalSquare size={16} /> CONTINUE_DEBUGGING
          </button>
          
          <button className="flex items-center gap-3 p-2 hover:bg-cyber-neonCyan hover:text-cyber-black transition-colors text-left text-sm">
            <Settings size={16} /> SETTINGS
          </button>

          <button className="flex items-center gap-3 p-2 hover:bg-cyber-glitchRed hover:text-cyber-black text-cyber-glitchRed transition-colors text-left text-sm mt-4 border-t border-cyber-glitchRed/20 pt-4">
            <LogOut size={16} /> EXIT_SYSTEM
          </button>
        </motion.div>
      )}

      {showMenu && (
        <div className="absolute bottom-8 left-8 text-xs text-cyber-neonCyan/50">
          SYSTEM.VERSION.2026.05 // AWAITING INPUT
        </div>
      )}
    </div>
  );
}

```

```typescript
// components/terminal/TerminalLine.tsx
import { motion } from 'framer-motion';

interface Props {
  text: string;
  type: 'system' | 'user' | 'error' | 'success' | 'dialogue';
}

export default function TerminalLine({ text, type }: Props) {
  const colors = {
    system: 'text-cyber-neonCyan/70',
    user: 'text-cyber-neonCyan font-bold',
    error: 'text-cyber-glitchRed',
    success: 'text-cyber-warnYellow',
    dialogue: 'text-cyber-holoPurple italic'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className={`font-mono text-sm mb-1 ${colors[type]}`}
    >
      {text}
    </motion.div>
  );
}

```

```typescript
// components/terminal/Terminal.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import { useGameStore } from '@/store/useGameStore';
import TerminalLine from './TerminalLine';
import { executeCommand } from '@/lib/terminalLogic';

export default function Terminal() {
  const [input, setInput] = useState('');
  const { terminalHistory } = useGameStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  return (
    <div className="h-full flex flex-col font-mono text-sm" onClick={() => inputRef.current?.focus()}>
      <div className="text-xs text-cyber-neonCyan/50 border-b border-cyber-neonCyan/20 pb-1 mb-2 flex justify-between">
        <span>DEBUG_TERMINAL_V1.0</span>
        <span>STATUS: ONLINE</span>
      </div>
      
      <div className="flex-1 overflow-y-auto mb-2 pr-2 scrollbar-hide">
        {terminalHistory.map((line) => (
          <TerminalLine key={line.id} text={line.text} type={line.type} />
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex items-center text-cyber-neonCyan">
        <span className="mr-2">{'>'}</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none border-none caret-cyber-neonCyan placeholder-cyber-neonCyan/30"
          placeholder="Enter command (type 'help')..."
          autoFocus
          spellCheck="false"
          autoComplete="off"
        />
        <span className="w-2 h-4 bg-cyber-neonCyan animate-blink ml-1"></span>
      </div>
    </div>
  );
}

```

```typescript
// components/ui/HUD.tsx
"use client";

import { useGameStore } from '@/store/useGameStore';
import GlitchText from './GlitchText';

export default function HUD() {
  const { corruptionLevel, currentSector } = useGameStore();

  return (
    <div className="col-span-12 row-span-1 flex justify-between items-start pointer-events-none">
      
      {/* Top Left: Sector Info */}
      <div className="flex flex-col gap-1 border-l-2 border-cyber-neonCyan pl-3">
        <span className="text-xs text-cyber-neonCyan/60 tracking-widest">CURRENT_LOCATION</span>
        <span className="text-xl font-bold tracking-wider">
          SECTOR_{currentSector.toString().padStart(3, '0')}
        </span>
        <span className="text-xs text-cyber-holoPurple">SYNTAX_BUGS_ENVIRONMENT</span>
      </div>

      {/* Top Right: Corruption Status */}
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-cyber-neonCyan/60 tracking-widest">SYSTEM_CORRUPTION</span>
        <div className="flex items-center gap-3">
          <div className="w-32 h-2 bg-cyber-darkGray border border-cyber-neonCyan/30">
            <div 
              className="h-full bg-cyber-glitchRed transition-all duration-500 ease-out"
              style={{ width: `${corruptionLevel}%` }}
            />
          </div>
          <span className={`text-xl font-bold ${corruptionLevel > 80 ? 'text-cyber-glitchRed animate-pulse' : 'text-cyber-warnYellow'}`}>
            {corruptionLevel.toFixed(1)}%
          </span>
        </div>
        {corruptionLevel > 80 && (
          <GlitchText text="CRITICAL WARNING" isError className="text-xs mt-1" />
        )}
      </div>

    </div>
  );
}

```

```typescript
// components/three/CyberGeometry.tsx
"use client";

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGameStore } from '@/store/useGameStore';

export default function CyberGeometry() {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { corruptionLevel } = useGameStore();

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
      groupRef.current.rotation.x += delta * 0.05;
      
      // Glitch effect based on corruption
      if (corruptionLevel > 70 && Math.random() > 0.95) {
        groupRef.current.position.x = (Math.random() - 0.5) * 0.2;
      } else {
        groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, 0, 0.1);
      }
    }

    if (materialRef.current) {
      const color = corruptionLevel > 80 
        ? new THREE.Color(0xff2a2a) 
        : new THREE.Color(0x00f3ff);
      materialRef.current.emissive.lerp(color, 0.05);
      materialRef.current.wireframe = corruptionLevel > 50;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 50 }).map((_, i) => {
        const radius = 5 + Math.random() * 10;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);

        return (
          <mesh key={i} position={[x, y, z]} scale={Math.random() * 0.5}>
            <octahedronGeometry args={[1, 0]} />
            <meshStandardMaterial 
              color={0x000000}
              emissive={0x00f3ff}
              emissiveIntensity={0.5}
              wireframe
              transparent
              opacity={0.3}
            />
          </mesh>
        );
      })}
      
      <mesh>
        <icosahedronGeometry args={[4, 1]} />
        <meshStandardMaterial 
          ref={materialRef}
          color={0x000000}
          emissive={0x00f3ff}
          emissiveIntensity={0.8}
          wireframe
        />
      </mesh>
    </group>
  );
}

```

```typescript
// components/three/CentralHub.tsx
"use client";

import { Canvas } from '@react-three/fiber';
import { OrbitControls, EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/drei';
import { useGameStore } from '@/store/useGameStore';
import CyberGeometry from './CyberGeometry';
import * as THREE from 'three';

export default function CentralHub() {
  const { corruptionLevel } = useGameStore();

  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 45 }}
      gl={{ antialias: false, powerPreference: "high-performance" }}
    >
      <color attach="background" args={['#050505']} />
      <fog attach="fog" args={['#050505', 10, 30]} />
      
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00f3ff" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#b026ff" />

      <CyberGeometry />

      <OrbitControls 
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.5}
        maxPolarAngle={Math.PI / 1.5}
        minPolarAngle={Math.PI / 3}
      />

      <EffectComposer>
        <Bloom 
          luminanceThreshold={0.2} 
          luminanceSmoothing={0.9} 
          height={300} 
          intensity={1.5} 
        />
        <ChromaticAberration 
          offset={new THREE.Vector2(
            corruptionLevel > 50 ? 0.005 : 0.002, 
            corruptionLevel > 50 ? 0.005 : 0.002
          )} 
        />
        <Noise opacity={0.15} />
      </EffectComposer>
    </Canvas>
  );
}

```
