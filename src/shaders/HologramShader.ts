import * as THREE from 'three';

export const HologramShader = {
  uniforms: {
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#00f2ff') },
    uOpacity: { value: 0.5 },
  },
  vertexShader: `
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;
    void main() {
      vUv = uv;
      vPosition = position;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float uTime;
    uniform vec3 uColor;
    uniform float uOpacity;
    varying vec2 vUv;
    varying vec3 vPosition;
    varying vec3 vNormal;

    void main() {
      float scanline = sin(vPosition.y * 50.0 - uTime * 5.0) * 0.1 + 0.9;
      float flicker = sin(uTime * 20.0) * 0.05 + 0.95;
      
      float rim = 1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0);
      rim = pow(rim, 3.0);

      vec3 finalColor = uColor * scanline * flicker;
      float alpha = uOpacity * (scanline + rim);
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
};
