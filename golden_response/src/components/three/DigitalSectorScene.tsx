"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { getBandForLevel } from "@/data/sectors";
import { fragmentShader, vertexShader } from "@/lib/shaders";
import { useGameStore } from "@/stores/gameStore";

export function DigitalSectorScene() {
  const level = useGameStore((state) => state.level);
  const corruption = useGameStore((state) => state.corruption);
  const graphics = useGameStore((state) => state.settings.graphics);
  const band = getBandForLevel(level);

  return (
    <div className="absolute inset-0">
      <Canvas
        camera={{ position: [0, 2.4, 7.4], fov: 58 }}
        dpr={graphics === "ultra" ? [1, 2] : [1, 1.35]}
        gl={{ antialias: graphics !== "low", alpha: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#03040a"]} />
        <fog attach="fog" args={["#060916", 5, 18]} />
        <ambientLight intensity={0.32} />
        <pointLight position={[0, 4, 2]} intensity={1.4} color={band.accent} />
        <pointLight position={[-4, 1, -3]} intensity={0.8} color={band.secondary} />
        <SectorWorld accent={band.accent} secondary={band.secondary} corruption={corruption / 100} quality={graphics} />
      </Canvas>
    </div>
  );
}

function SectorWorld({
  accent,
  secondary,
  corruption,
  quality
}: {
  accent: string;
  secondary: string;
  corruption: number;
  quality: "low" | "balanced" | "ultra";
}) {
  const group = useRef<THREE.Group>(null);
  const keys = usePressedKeys();

  useFrame((_, delta) => {
    if (!group.current) return;
    group.current.rotation.y += delta * (0.08 + corruption * 0.14);
    const moveSpeed = delta * 1.7;
    if (keys.has("KeyA")) group.current.position.x += moveSpeed;
    if (keys.has("KeyD")) group.current.position.x -= moveSpeed;
    if (keys.has("KeyW")) group.current.position.z += moveSpeed;
    if (keys.has("KeyS")) group.current.position.z -= moveSpeed;
    group.current.position.x = THREE.MathUtils.clamp(group.current.position.x, -2.4, 2.4);
    group.current.position.z = THREE.MathUtils.clamp(group.current.position.z, -2.2, 2.2);
  });

  return (
    <group ref={group}>
      <HolographicPlane accent={accent} corruption={corruption} />
      <DataSpires accent={accent} secondary={secondary} corruption={corruption} count={quality === "low" ? 9 : quality === "ultra" ? 21 : 15} />
      <ParticleField accent={accent} corruption={corruption} count={quality === "low" ? 240 : quality === "ultra" ? 900 : 520} />
      <gridHelper args={[16, 32, accent, "#243047"]} position={[0, -1.12, 0]} />
    </group>
  );
}

function HolographicPlane({ accent, corruption }: { accent: string; corruption: number }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const accentColor = useMemo(() => new THREE.Color(accent), [accent]);

  useFrame(({ clock }) => {
    if (!material.current) return;
    material.current.uniforms.uTime.value = clock.elapsedTime;
    material.current.uniforms.uCorruption.value = corruption;
  });

  return (
    <mesh rotation={[-Math.PI / 2.7, 0, 0]} position={[0, -0.9, 0]}>
      <planeGeometry args={[12, 12, 96, 96]} />
      <shaderMaterial
        ref={material}
        transparent
        depthWrite={false}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{
          uTime: { value: 0 },
          uCorruption: { value: corruption },
          uAccent: { value: accentColor }
        }}
      />
    </mesh>
  );
}

function DataSpires({ accent, secondary, corruption, count }: { accent: string; secondary: string; corruption: number; count: number }) {
  const spires = useMemo(
    () =>
      Array.from({ length: count }, (_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const radius = 1.8 + (index % 4) * 0.72;
        return {
          position: [Math.cos(angle) * radius, -0.45 + (index % 5) * 0.28, Math.sin(angle) * radius] as [number, number, number],
          scale: [0.08 + (index % 3) * 0.03, 0.8 + (index % 7) * 0.26, 0.08 + (index % 2) * 0.04] as [number, number, number],
          color: index % 3 === 0 ? secondary : accent,
          speed: 0.35 + index * 0.015
        };
      }),
    [accent, count, secondary]
  );

  return (
    <>
      {spires.map((spire, index) => (
        <AnimatedSpire key={`${spire.color}-${index}`} {...spire} corruption={corruption} />
      ))}
    </>
  );
}

function AnimatedSpire({
  position,
  scale,
  color,
  speed,
  corruption
}: {
  position: [number, number, number];
  scale: [number, number, number];
  color: string;
  speed: number;
  corruption: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = clock.elapsedTime * speed;
    ref.current.position.y = position[1] + Math.sin(clock.elapsedTime * speed * 2 + position[0]) * (0.12 + corruption * 0.3);
  });

  return (
    <mesh ref={ref} position={position} scale={scale}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9 + corruption} transparent opacity={0.42} roughness={0.18} metalness={0.65} />
    </mesh>
  );
}

function ParticleField({ accent, corruption, count }: { accent: string; corruption: number; count: number }) {
  const points = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const data = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      data[i * 3] = (Math.random() - 0.5) * 12;
      data[i * 3 + 1] = (Math.random() - 0.2) * 5;
      data[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    return data;
  }, [count]);

  useFrame(({ clock }) => {
    if (!points.current) return;
    points.current.rotation.y = clock.elapsedTime * (0.035 + corruption * 0.05);
    points.current.rotation.x = Math.sin(clock.elapsedTime * 0.2) * 0.06;
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={accent} size={0.026 + corruption * 0.018} transparent opacity={0.78} depthWrite={false} />
    </points>
  );
}

function usePressedKeys() {
  const [keys] = useState(() => new Set<string>());

  useEffect(() => {
    const down = (event: KeyboardEvent) => keys.add(event.code);
    const up = (event: KeyboardEvent) => keys.delete(event.code);
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      keys.clear();
    };
  }, [keys]);

  return keys;
}
