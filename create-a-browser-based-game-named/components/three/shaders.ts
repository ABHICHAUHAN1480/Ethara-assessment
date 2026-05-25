export const coreVertexShader = `
  varying vec2 vUv;
  varying vec3 vPosition;

  void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const coreFragmentShader = `
  uniform float uTime;
  uniform float uCorruption;
  varying vec2 vUv;
  varying vec3 vPosition;

  float scan(float value) {
    return step(0.48, sin(value * 90.0 + uTime * 8.0) * 0.5 + 0.5);
  }

  void main() {
    float ring = abs(length(vUv - 0.5) - 0.28);
    float pulse = 0.02 / ring;
    float glitch = scan(vUv.y + uCorruption * 0.01) * uCorruption * 0.006;
    vec3 cyan = vec3(0.0, 0.96, 1.0);
    vec3 purple = vec3(0.58, 0.22, 1.0);
    vec3 red = vec3(1.0, 0.05, 0.2);
    vec3 color = mix(cyan, purple, vUv.x + sin(uTime) * 0.1);
    color = mix(color, red, glitch);
    float alpha = clamp(pulse + glitch, 0.0, 0.82);
    gl_FragColor = vec4(color, alpha);
  }
`;
