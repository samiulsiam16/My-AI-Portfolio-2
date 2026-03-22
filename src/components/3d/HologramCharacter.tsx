import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Html } from '@react-three/drei';
import * as THREE from 'three';
import { HologramShader } from '../../shaders/HologramShader';

export function HologramCharacter({ position = [0, 0, 0], scale = 1, label = "AI_ASSISTANT" }: any) {
  const group = useRef<THREE.Group>(null!);
  
  // Create a stylized "anime" character using primitive shapes for performance and style
  // Head, body, limbs
  const characterParts = useMemo(() => {
    return (
      <group>
        {/* Head */}
        <mesh position={[0, 1.6, 0]}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        {/* Body */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.2, 0.4, 0.8, 8]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.4, 1.1, 0]} rotation={[0, 0, 0.5]}>
          <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        <mesh position={[0.4, 1.1, 0]} rotation={[0, 0, -0.5]}>
          <capsuleGeometry args={[0.05, 0.4, 4, 8]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        {/* Legs */}
        <mesh position={[-0.15, 0.3, 0]}>
          <capsuleGeometry args={[0.07, 0.6, 4, 8]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        <mesh position={[0.15, 0.3, 0]}>
          <capsuleGeometry args={[0.07, 0.6, 4, 8]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        {/* Hair / Spiky Bits */}
        <mesh position={[0, 1.9, 0.1]} rotation={[0.5, 0, 0]}>
          <coneGeometry args={[0.2, 0.4, 4]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        <mesh position={[-0.15, 1.85, 0.1]} rotation={[0.3, 0, 0.4]}>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        <mesh position={[0.15, 1.85, 0.1]} rotation={[0.3, 0, -0.4]}>
          <coneGeometry args={[0.15, 0.3, 4]} />
          <shaderMaterial 
            args={[THREE.UniformsUtils.clone(HologramShader.uniforms)]} 
            vertexShader={HologramShader.vertexShader}
            fragmentShader={HologramShader.fragmentShader}
            transparent
          />
        </mesh>
        {/* Halo / Energy Ring */}
        <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.02, 16, 32]} />
          <meshStandardMaterial color="#00f2ff" emissive="#00f2ff" emissiveIntensity={5} />
        </mesh>
      </group>
    );
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.position.y = position[1] + Math.sin(t * 2) * 0.1;
    group.current.rotation.y = Math.sin(t * 0.5) * 0.2;
    
    // Update shader time
    group.current.traverse((child) => {
      if (child instanceof THREE.Mesh && child.material instanceof THREE.ShaderMaterial) {
        child.material.uniforms.uTime.value = t;
        child.material.uniforms.uColor.value.set('#ff00ff');
      }
    });
  });

  return (
    <group ref={group} position={position} scale={scale}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={0.5}>
        {characterParts}
      </Float>
      
      <Html distanceFactor={10} position={[0, 2.5, 0]}>
        <div className="bg-cyan-500/20 backdrop-blur-md border border-cyan-500/50 px-2 py-1 rounded">
          <p className="text-[8px] font-mono text-cyan-400 uppercase tracking-widest">{label}</p>
        </div>
      </Html>
    </group>
  );
}
