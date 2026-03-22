import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, Html } from '@react-three/drei';
import * as THREE from 'three';

export function GuideBot() {
  const group = useRef<THREE.Group>(null!);
  const [hovered, setHovered] = useState(false);
  const [message, setMessage] = useState("AWAITING COMMAND...");

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.position.y = Math.sin(t * 0.5) * 0.5 + 2;
    group.current.rotation.y = t * 0.2;
  });

  const handleClick = () => {
    const messages = [
      "SYSTEMS NOMINAL.",
      "EXPLORE THE HANGAR FOR PROJECTS.",
      "SKILLS REACTOR AT 100% CAPACITY.",
      "NEURAL LINK ESTABLISHED.",
      "WELCOME, COMMANDER."
    ];
    setMessage(messages[Math.floor(Math.random() * messages.length)]);
  };

  return (
    <group ref={group} position={[5, 2, -5]}>
      <Float speed={5} rotationIntensity={2} floatIntensity={2}>
        <mesh 
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
          onClick={handleClick}
        >
          <icosahedronGeometry args={[0.5, 1]} />
          <meshStandardMaterial 
            color={hovered ? "#00f2ff" : "#004444"} 
            emissive={hovered ? "#00f2ff" : "#001111"}
            emissiveIntensity={2}
            wireframe
          />
        </mesh>
      </Float>
      
      {hovered && (
        <Html distanceFactor={10} position={[0, 1, 0]}>
          <div className="bg-black/80 backdrop-blur-md border border-cyan-500 p-2 rounded whitespace-nowrap">
            <p className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">{message}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
