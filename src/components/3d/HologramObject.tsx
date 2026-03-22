import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { HologramShader } from '../../shaders/HologramShader';

export function HologramObject({ geometry, color = '#00f2ff', opacity = 0.5, ...props }: any) {
  const mesh = useRef<THREE.Mesh>(null!);
  
  const shaderArgs = useMemo(() => ({
    uniforms: THREE.UniformsUtils.clone(HologramShader.uniforms),
    vertexShader: HologramShader.vertexShader,
    fragmentShader: HologramShader.fragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
  }), []);

  useFrame((state) => {
    if (mesh.current) {
      const material = mesh.current.material as THREE.ShaderMaterial;
      material.uniforms.uTime.value = state.clock.elapsedTime;
      material.uniforms.uColor.value.set(color);
      material.uniforms.uOpacity.value = opacity;
    }
  });

  return (
    <mesh ref={mesh} {...props}>
      {geometry}
      <shaderMaterial args={[shaderArgs]} />
    </mesh>
  );
}
