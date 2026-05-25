"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { coreFragmentShader, coreVertexShader } from "@/components/three/shaders";
import { useGameStore } from "@/store/gameStore";

export function AIOperatingSystemScene() {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const settings = useGameStore((state) => state.settings);
  const screen = useGameStore((state) => state.screen);
  const sectors = useGameStore((state) => state.sectors);
  const currentSectorId = useGameStore((state) => state.currentSectorId);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: settings.graphics !== "eco", alpha: true, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(52, window.innerWidth / window.innerHeight, 0.1, 200);
    const clock = new THREE.Clock();
    const mouse = new THREE.Vector2(0, 0);
    const sector = sectors.find((item) => item.id === currentSectorId) ?? sectors[0];
    const corruption = sector?.corruption ?? 70;
    const pixelRatio = settings.graphics === "ultra" ? Math.min(window.devicePixelRatio, 2) : settings.graphics === "balanced" ? Math.min(window.devicePixelRatio, 1.5) : 1;
    const particleCount = settings.graphics === "ultra" ? 1600 : settings.graphics === "balanced" ? 950 : 420;

    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 0.2, screen === "boot" ? 7 : 5.4);

    const particles = createParticles(particleCount, corruption);
    scene.add(particles);

    const group = new THREE.Group();
    scene.add(group);

    const torus = new THREE.Mesh(
      new THREE.TorusKnotGeometry(1.15, 0.02, 220, 12, 3, 7),
      new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.52 })
    );
    group.add(torus);

    const torusTwo = new THREE.Mesh(
      new THREE.TorusGeometry(1.86, 0.008, 10, 180),
      new THREE.MeshBasicMaterial({ color: 0x9a4dff, transparent: true, opacity: 0.35 })
    );
    torusTwo.rotation.x = Math.PI / 2;
    group.add(torusTwo);

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uCorruption: { value: corruption }
      },
      vertexShader: coreVertexShader,
      fragmentShader: coreFragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    const planes: THREE.Mesh[] = [];
    for (let index = 0; index < 5; index += 1) {
      const plane = new THREE.Mesh(new THREE.PlaneGeometry(2.8 + index * 0.42, 2.8 + index * 0.42, 1, 1), shaderMaterial);
      plane.rotation.z = index * 0.34;
      plane.position.z = -index * 0.08;
      planes.push(plane);
      group.add(plane);
    }

    const onMouseMove = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("resize", onResize);

    let frame = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();
      frame += 1;
      shaderMaterial.uniforms.uTime.value = time;
      shaderMaterial.uniforms.uCorruption.value = corruption;

      const speed = settings.reducedMotion ? 0.08 : 1;
      group.rotation.y = time * 0.12 * speed + mouse.x * 0.1;
      group.rotation.x = mouse.y * 0.08 + Math.sin(time * 0.22) * 0.08 * speed;
      torus.rotation.z = time * 0.09 * speed;
      torusTwo.rotation.y = time * -0.13 * speed;
      particles.rotation.y = time * 0.015 * speed;
      particles.rotation.x = Math.sin(time * 0.08) * 0.04;

      if (corruption > 70 && frame % 90 < 6) {
        particles.position.x = (Math.random() - 0.5) * 0.05;
        group.position.x = (Math.random() - 0.5) * 0.025;
      } else {
        particles.position.x *= 0.9;
        group.position.x *= 0.9;
      }

      camera.position.x += (mouse.x * 0.22 - camera.position.x) * 0.04;
      camera.position.y += (mouse.y * 0.16 + 0.2 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      particles.geometry.dispose();
      (particles.material as THREE.Material).dispose();
      torus.geometry.dispose();
      (torus.material as THREE.Material).dispose();
      torusTwo.geometry.dispose();
      (torusTwo.material as THREE.Material).dispose();
      planes.forEach((plane) => plane.geometry.dispose());
      shaderMaterial.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [currentSectorId, screen, sectors, settings.graphics, settings.reducedMotion]);

  return <div ref={mountRef} className="fixed inset-0 z-0" aria-hidden />;
}

function createParticles(count: number, corruption: number) {
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const cyan = new THREE.Color("#00f5ff");
  const purple = new THREE.Color("#9a4dff");
  const red = new THREE.Color("#ff2d55");

  for (let index = 0; index < count; index += 1) {
    const radius = 2.3 + Math.random() * 6.6;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[index * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[index * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta) * 0.58;
    positions[index * 3 + 2] = radius * Math.cos(phi);

    const color = Math.random() * 100 < corruption ? red.clone().lerp(purple, Math.random() * 0.5) : cyan.clone().lerp(purple, Math.random());
    colors[index * 3] = color.r;
    colors[index * 3 + 1] = color.g;
    colors[index * 3 + 2] = color.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  const material = new THREE.PointsMaterial({
    size: 0.022,
    vertexColors: true,
    transparent: true,
    opacity: 0.82,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  return new THREE.Points(geometry, material);
}
