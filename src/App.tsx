import React, { useState, useEffect, Suspense, useRef } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Float, Text, MeshDistortMaterial, Stars, ContactShadows } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Cpu, Rocket, Brain, Calendar, Shield, Mail, ArrowRight, Volume2, VolumeX, Map as MapIcon, Lock } from 'lucide-react';
import { Page } from './types';
import { Starfield } from './components/3d/Starfield';
import { HologramObject } from './components/3d/HologramObject';
import { GuideBot } from './components/3d/GuideBot';
import { cn } from './lib/utils';
import gsap from 'gsap';
import * as THREE from 'three';

// --- Camera Controller for Transitions ---

const CameraController = ({ page }: { page: Page }) => {
  const { camera } = useThree();
  
  useEffect(() => {
    if (page === 'landing') {
      gsap.to(camera.position, { x: 0, y: 0, z: 20, duration: 2, ease: "power3.inOut" });
    } else if (page === 'command-center') {
      gsap.to(camera.position, { x: 0, y: 5, z: 15, duration: 2, ease: "power3.inOut" });
    } else {
      gsap.to(camera.position, { x: -10, y: 2, z: 10, duration: 2, ease: "power3.inOut" });
    }
  }, [page, camera]);

  return null;
};

// --- UI Components ---

const Overlay = ({ currentPage, onNavigate, isMuted, setIsMuted, achievements }: { 
  currentPage: Page, 
  onNavigate: (page: Page) => void,
  isMuted: boolean,
  setIsMuted: (v: boolean) => void,
  achievements: string[]
}) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex flex-col justify-between p-8">
      {/* Top Bar */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold tracking-tighter text-cyan-400 font-mono glitch-text" data-text="AETHERIS // COMMAND_CENTER">AETHERIS // COMMAND_CENTER</h1>
          <p className="text-[10px] text-cyan-700 font-mono uppercase tracking-[0.2em]">User: Md. Samiul Ahasan // Sector: {currentPage.replace('-', '_').toUpperCase()}</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex flex-col items-end mr-4">
             <div className="text-[9px] text-cyan-700 font-mono uppercase mb-1">XP: {achievements.length * 250} / 1000</div>
             <div className="w-32 h-1 bg-cyan-950 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-cyan-400" 
                  initial={{ width: 0 }}
                  animate={{ width: `${(achievements.length / 4) * 100}%` }}
                />
             </div>
          </div>
          
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 border border-cyan-900/50 bg-cyan-950/20 rounded-full hover:bg-cyan-400/20 transition-colors text-cyan-400"
          >
            {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Mini Map */}
      <div className="absolute top-24 right-8 pointer-events-auto">
        <div className="bg-black/40 backdrop-blur-md border border-cyan-900/30 p-4 rounded-xl flex flex-col gap-2">
          <div className="flex items-center gap-2 text-cyan-400 mb-2">
            <MapIcon size={14} />
            <span className="text-[10px] font-mono uppercase tracking-widest">Sector Map</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {(['command-center', 'about', 'skills', 'projects', 'ai-lab', 'timeline'] as Page[]).map(p => (
              <button
                key={p}
                onClick={() => onNavigate(p)}
                className={cn(
                  "w-8 h-8 border flex items-center justify-center transition-all relative overflow-hidden group",
                  currentPage === p ? "bg-cyan-400 border-cyan-400 text-black" : "border-cyan-900/50 text-cyan-900 hover:border-cyan-400 hover:text-cyan-400"
                )}
              >
                <div className="w-1 h-1 bg-current rounded-full" />
                <div className="absolute inset-0 bg-cyan-400/10 scale-0 group-hover:scale-100 transition-transform" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end pointer-events-auto">
        <div className="max-w-xs">
          <div className="text-[10px] text-cyan-700 font-mono uppercase mb-2 tracking-widest">System Logs</div>
          <div className="bg-black/40 backdrop-blur-md border border-cyan-900/30 p-3 rounded-lg font-mono text-[9px] text-cyan-400/70 leading-relaxed h-20 overflow-hidden">
            {">"} INITIALIZING NEURAL LINK...<br/>
            {">"} SECTOR: {currentPage.toUpperCase()}<br/>
            {">"} ATMOSPHERE: STABLE<br/>
            {">"} ACHIEVEMENTS: {achievements.length}/4 UNLOCKED<br/>
            {">"} READY FOR COMMAND.
          </div>
        </div>

        <div className="flex gap-6">
          <button 
            onClick={() => onNavigate('vault')} 
            className={cn(
              "group flex flex-col items-center gap-2",
              achievements.length < 3 && "opacity-30 cursor-not-allowed"
            )}
            disabled={achievements.length < 3}
          >
            <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500">
              {achievements.length < 3 ? <Lock size={20} /> : <Shield size={20} />}
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/50 group-hover:text-cyan-400">Vault</span>
          </button>
          
          <button onClick={() => onNavigate('contact')} className="group flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full border border-cyan-400/30 flex items-center justify-center group-hover:bg-cyan-400 group-hover:text-black transition-all duration-500">
              <Mail size={20} />
            </div>
            <span className="text-[9px] font-mono uppercase tracking-widest text-cyan-400/50 group-hover:text-cyan-400">Contact</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [achievements, setAchievements] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
    if (!achievements.includes(page) && page !== 'landing' && page !== 'command-center') {
      setAchievements(prev => [...prev, page]);
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#020617] overflow-hidden text-slate-200 selection:bg-cyan-500/30">
      {/* 3D Scene Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows gl={{ antialias: true, alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 20]} fov={75} />
          <CameraController page={currentPage} />
          
          <Suspense fallback={null}>
            <Starfield />
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            
            <ambientLight intensity={0.2} />
            <pointLight position={[10, 10, 10]} intensity={1} color="#00f2ff" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={2} color="#ff00ff" />

            {currentPage === 'landing' && (
              <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                <HologramObject 
                  geometry={<torusKnotGeometry args={[4, 1.2, 128, 32]} />}
                  color="#00f2ff"
                  opacity={0.6}
                />
              </Float>
            )}

            {currentPage === 'command-center' && (
              <group>
                <Float speed={1.5}>
                  <HologramObject 
                    geometry={<sphereGeometry args={[2.5, 32, 32]} />}
                    color="#00f2ff"
                    opacity={0.3}
                  />
                  <mesh>
                    <sphereGeometry args={[2.4, 32, 32]} />
                    <meshStandardMaterial color="#001111" wireframe />
                  </mesh>
                </Float>
                
                <GuideBot />
                
                <NavigationNode position={[-8, 4, 0]} label="About" icon={<Terminal />} onClick={() => handleNavigate('about')} />
                <NavigationNode position={[8, 4, 0]} label="Skills" icon={<Cpu />} onClick={() => handleNavigate('skills')} />
                <NavigationNode position={[-8, -4, 0]} label="Projects" icon={<Rocket />} onClick={() => handleNavigate('projects')} />
                <NavigationNode position={[8, -4, 0]} label="AI Lab" icon={<Brain />} onClick={() => handleNavigate('ai-lab')} />
                <NavigationNode position={[0, -8, 0]} label="Timeline" icon={<Calendar />} onClick={() => handleNavigate('timeline')} />
              </group>
            )}

            {currentPage !== 'landing' && currentPage !== 'command-center' && (
              <group position={[-15, 0, 0]}>
                <Float speed={2}>
                  <HologramObject 
                    geometry={<octahedronGeometry args={[5, 0]} />}
                    color="#ff00ff"
                    opacity={0.2}
                  />
                </Float>
              </group>
            )}

            <Environment preset="night" />
            <ContactShadows position={[0, -10, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          </Suspense>
          
          <OrbitControls 
            enablePan={false} 
            enableZoom={currentPage !== 'landing'} 
            maxDistance={50}
            minDistance={5}
            enableRotate={currentPage === 'command-center'}
          />
        </Canvas>
      </div>

      {/* 2D UI Layer */}
      <AnimatePresence mode="wait">
        {!isLoaded ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[100] bg-slate-950 flex flex-col items-center justify-center"
          >
            <div className="w-64 h-1 bg-cyan-950 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-cyan-400"
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </div>
            <motion.p 
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="mt-4 font-mono text-[10px] uppercase tracking-[0.3em] text-cyan-400"
            >
              Establishing Neural Link...
            </motion.p>
          </motion.div>
        ) : (
          <>
            {currentPage === 'landing' && (
              <motion.div 
                key="landing-ui"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none"
              >
                <div className="text-center space-y-6 pointer-events-auto">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h2 className="text-sm font-mono tracking-[0.5em] text-cyan-500 uppercase mb-2">Welcome to the Future</h2>
                    <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(34,211,238,0.3)] glitch-text" data-text="AETHERIS">
                      AETHERIS
                    </h1>
                  </motion.div>
                  
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="flex flex-col items-center gap-4"
                  >
                    <button 
                      onClick={() => handleNavigate('command-center')}
                      className="px-12 py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all duration-300 flex items-center gap-3 group relative overflow-hidden"
                    >
                      <span className="relative z-10 flex items-center gap-3">
                        Enter Command Center
                        <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                      </span>
                      <div className="absolute inset-0 bg-white scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                    </button>
                    <p className="text-[10px] font-mono text-cyan-700 uppercase tracking-widest">Sector 7G // Neural Interface Active</p>
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentPage !== 'landing' && (
              <Overlay 
                currentPage={currentPage} 
                onNavigate={handleNavigate} 
                isMuted={isMuted} 
                setIsMuted={setIsMuted} 
                achievements={achievements}
              />
            )}

            {/* Page Content Modals */}
            <AnimatePresence>
              {currentPage !== 'landing' && currentPage !== 'command-center' && (
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 120 }}
                  className="absolute top-0 right-0 w-full md:w-[600px] h-full z-40 bg-slate-950/80 backdrop-blur-2xl border-l border-cyan-900/30 p-12 overflow-y-auto"
                >
                  <button 
                    onClick={() => handleNavigate('command-center')}
                    className="mb-8 text-cyan-400 font-mono text-xs uppercase tracking-widest flex items-center gap-2 hover:text-white transition-colors"
                  >
                    <ArrowRight className="rotate-180" size={14} />
                    Back to Hub
                  </button>

                  <div className="relative">
                    {currentPage === 'about' && <AboutContent />}
                    {currentPage === 'skills' && <SkillsContent />}
                    {currentPage === 'projects' && <ProjectsContent />}
                    {currentPage === 'ai-lab' && <AILabContent />}
                    {currentPage === 'timeline' && <TimelineContent />}
                    {currentPage === 'contact' && <ContactContent />}
                    {currentPage === 'vault' && <VaultContent />}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Sub-Components ---

function NavigationNode({ position, label, icon, onClick }: { position: [number, number, number], label: string, icon: React.ReactNode, onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  
  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <mesh 
          onClick={onClick}
          onPointerOver={() => {
            setHovered(true);
            document.body.style.cursor = 'pointer';
          }}
          onPointerOut={() => {
            setHovered(false);
            document.body.style.cursor = 'auto';
          }}
        >
          <octahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={hovered ? "#00f2ff" : "#004444"} 
            emissive={hovered ? "#00f2ff" : "#001111"}
            emissiveIntensity={hovered ? 5 : 0.5}
            wireframe
          />
        </mesh>
      </Float>
      <Text
        position={[0, -1.8, 0]}
        fontSize={0.6}
        color={hovered ? "#00f2ff" : "#ffffff"}
        font="/fonts/Inter-Bold.woff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {label.toUpperCase()}
      </Text>
    </group>
  );
}

// --- Content Components ---

const AboutContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">About Terminal</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>
    
    <div className="grid grid-cols-2 gap-4">
      <div className="p-4 border border-cyan-900/30 bg-cyan-950/10 rounded-lg">
        <span className="text-[10px] font-mono text-cyan-600 uppercase">Subject Name</span>
        <p className="text-lg font-bold">Md. Samiul Ahasan</p>
      </div>
      <div className="p-4 border border-cyan-900/30 bg-cyan-950/10 rounded-lg">
        <span className="text-[10px] font-mono text-cyan-600 uppercase">Department</span>
        <p className="text-lg font-bold">Software Engineering</p>
      </div>
    </div>

    <div className="space-y-4 text-slate-400 leading-relaxed font-light">
      <p>
        I am a dedicated learner exploring the vast landscapes of <span className="text-cyan-400 font-medium">Software Engineering</span> and <span className="text-cyan-400 font-medium">Artificial Intelligence</span>. Currently pursuing my degree at <span className="text-white">Daffodil International University</span>.
      </p>
      <p>
        My journey is fueled by a passion for building systems that solve real-world problems. From low-level C programming to high-level AI automation, I am constantly expanding my neural horizons.
      </p>
    </div>

    <div className="pt-8 border-t border-cyan-900/20">
      <h3 className="text-xs font-mono text-cyan-500 uppercase tracking-widest mb-4">Core Directives</h3>
      <ul className="space-y-3">
        {['Continuous Learning', 'Scalable Architecture', 'AI Integration', 'Creative Problem Solving'].map(d => (
          <li key={d} className="flex items-center gap-3 text-sm">
            <div className="w-1.5 h-1.5 bg-cyan-400 rotate-45" />
            {d}
          </li>
        ))}
      </ul>
    </div>
  </motion.div>
);

const SkillsContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Skills Reactor</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>

    <div className="space-y-8">
      <SkillCategory title="Backend Core" skills={['C', 'Java', 'Python', 'C# .NET']} />
      <SkillCategory title="Data & AI" skills={['NumPy', 'Pandas', 'Matplotlib', 'Seaborn', 'n8n', 'Zapier']} />
      <SkillCategory title="Frontend" skills={['HTML', 'CSS', 'React (Learning)']} />
    </div>
  </motion.div>
);

const SkillCategory = ({ title, skills }: { title: string, skills: string[] }) => (
  <div className="space-y-4">
    <h3 className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">{title}</h3>
    <div className="grid grid-cols-2 gap-3">
      {skills.map(s => (
        <div key={s} className="p-3 bg-cyan-950/20 border border-cyan-900/30 rounded-lg flex items-center justify-between group hover:border-cyan-400 transition-colors">
          <span className="text-sm text-cyan-100">{s}</span>
          <div className="w-2 h-2 rounded-full bg-cyan-500 group-hover:animate-pulse" />
        </div>
      ))}
    </div>
  </div>
);

const ProjectsContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Project Hangar</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>

    <div className="grid gap-6">
      {[
        { title: 'Nexus AI Assistant', tech: 'n8n / Python', desc: 'Automated workflow system for personal task management.' },
        { title: 'Data Insight Pro', tech: 'Python / Pandas', desc: 'Automated data visualization and analysis tool.' },
        { title: 'AlgoVisual C', tech: 'C / Ncurses', desc: 'Low-level algorithm visualization in the terminal.' }
      ].map((p, i) => (
        <div key={i} className="group p-6 border border-cyan-900/30 bg-cyan-950/10 rounded-xl hover:border-cyan-400/50 transition-all">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold group-hover:text-cyan-400 transition-colors">{p.title}</h3>
            <span className="text-[9px] font-mono text-cyan-700 uppercase px-2 py-1 border border-cyan-900/50 rounded">Tech: {p.tech}</span>
          </div>
          <p className="text-sm text-slate-400 mb-6">{p.desc}</p>
          <button className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2 group-hover:gap-3 transition-all">
            View Details <ArrowRight size={12} />
          </button>
        </div>
      ))}
    </div>
  </motion.div>
);

const AILabContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">AI Lab</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>
    <div className="p-8 border border-dashed border-cyan-900/50 rounded-2xl text-center bg-cyan-950/5">
      <Brain className="mx-auto text-cyan-500 mb-4 animate-pulse" size={48} />
      <h3 className="text-lg font-bold mb-2">Neural Network in Training</h3>
      <p className="text-sm text-slate-400 max-w-sm mx-auto">This sector is dedicated to AI experiments, automation workflows with n8n, and machine learning models.</p>
      
      <div className="mt-8 grid grid-cols-3 gap-4">
        {[1,2,3,4,5,6].map(i => (
          <div key={i} className="h-12 bg-cyan-900/20 rounded flex items-center justify-center">
            <div className="w-1 h-1 bg-cyan-400 rounded-full animate-ping" />
          </div>
        ))}
      </div>
    </div>
  </motion.div>
);

const TimelineContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Timeline</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>
    <div className="space-y-12 relative before:absolute before:left-0 before:top-0 before:bottom-0 before:w-px before:bg-cyan-900/50 pl-8">
      {[
        { year: '2024', title: 'Started Software Engineering', desc: 'Enrolled at Daffodil International University.' },
        { year: '2025', title: 'Deep Dive into Python & AI', desc: 'Focused on data science and automation tools.' },
        { year: 'Future', title: 'AI Specialist', desc: 'Building complex intelligent systems.' }
      ].map((item, i) => (
        <div key={i} className="relative">
          <div className="absolute -left-[37px] top-1 w-4 h-4 rounded-full bg-cyan-500 border-4 border-slate-950" />
          <span className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">{item.year}</span>
          <h3 className="text-lg font-bold text-white mt-1">{item.title}</h3>
          <p className="text-sm text-slate-400 mt-2">{item.desc}</p>
        </div>
      ))}
    </div>
  </motion.div>
);

const ContactContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Contact Station</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>
    <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">Identification</label>
        <input type="text" placeholder="Your Name" className="w-full bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">Comms Channel</label>
        <input type="email" placeholder="Your Email" className="w-full bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
      </div>
      <div className="space-y-2">
        <label className="text-[10px] font-mono text-cyan-600 uppercase tracking-widest">Transmission</label>
        <textarea rows={4} placeholder="Your Message" className="w-full bg-cyan-950/20 border border-cyan-900/50 rounded-lg p-4 text-sm focus:outline-none focus:border-cyan-400 transition-colors" />
      </div>
      <button className="w-full py-4 bg-cyan-500 text-black font-bold uppercase tracking-widest rounded-lg hover:bg-white transition-all">
        Send Transmission
      </button>
    </form>
  </motion.div>
);

const VaultContent = () => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-8"
  >
    <header>
      <h2 className="text-4xl font-black tracking-tighter text-white mb-2 uppercase">Secret Vault</h2>
      <div className="h-1 w-20 bg-cyan-500" />
    </header>
    
    <div className="p-8 border border-cyan-400 bg-cyan-400/10 rounded-2xl text-center">
      <Shield className="mx-auto text-cyan-400 mb-4" size={48} />
      <h3 className="text-xl font-bold mb-4">ACCESS GRANTED</h3>
      <p className="text-sm text-cyan-100/70 mb-8">You have unlocked the secret sector. Here lie the blueprints for the next generation of AI systems.</p>
      
      <div className="grid grid-cols-1 gap-4 text-left">
        <div className="p-4 bg-black/40 border border-cyan-400/30 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-1">Easter Egg #1</h4>
          <p className="text-xs text-slate-400">The command center is powered by a Dyson Sphere simulation.</p>
        </div>
        <div className="p-4 bg-black/40 border border-cyan-400/30 rounded-lg">
          <h4 className="text-cyan-400 font-bold mb-1">Future Vision</h4>
          <p className="text-xs text-slate-400">Integrating real-time neural processing into web interfaces.</p>
        </div>
      </div>
    </div>
  </motion.div>
);
