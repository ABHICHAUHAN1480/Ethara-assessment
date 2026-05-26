export const vertexShader = `
  varying vec2 vUv;
  varying float vPulse;
  uniform float uTime;

  void main() {
    vUv = uv;
    vec3 transformed = position;
    transformed.z += sin((position.x + uTime) * 2.4) * 0.08;
    transformed.y += cos((position.z + uTime) * 1.7) * 0.05;
    vPulse = transformed.z;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`;

export const fragmentShader = `
  varying vec2 vUv;
  varying float vPulse;
  uniform float uTime;
  uniform float uCorruption;
  uniform vec3 uAccent;

  float lines(vec2 uv) {
    return smoothstep(0.48, 0.5, abs(fract(uv.y * 34.0 + uTime * 0.8) - 0.5));
  }

  void main() {
    float grid = max(lines(vUv), lines(vUv.yx));
    float pulse = 0.5 + 0.5 * sin(uTime * 2.2 + vPulse * 3.0);
    float glitch = step(0.96 - uCorruption * 0.25, fract(sin(dot(vUv * uTime, vec2(12.9898,78.233))) * 43758.5453));
    vec3 color = mix(vec3(0.0, 0.95, 1.0), uAccent, pulse);
    color += glitch * vec3(1.0, 0.05, 0.18);
    float alpha = 0.16 + grid * 0.42 + pulse * 0.08;
    gl_FragColor = vec4(color, alpha);
  }
`;
