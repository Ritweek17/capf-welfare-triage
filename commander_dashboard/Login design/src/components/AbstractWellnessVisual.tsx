import React, { useState, useRef, useEffect } from 'react';
import { Activity, ShieldCheck, Heart, Sparkles, Brain } from 'lucide-react';

interface TermItem {
  id: string;
  text: string;
  x: number; // percentage pos 0..100
  y: number; // percentage pos 0..100
  category: 'neural' | 'cardio' | 'respiratory' | 'recovery' | 'performance';
  connectedRegion?: { x: number; y: number }; // SVG canvas coordinates 0..100
}

export const AbstractWellnessVisual: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const [activeSignalIndex, setActiveSignalIndex] = useState(0);

  // Anatomical and wellness terms specified in user request
  const wellnessTerms: TermItem[] = [
    { id: '1', text: 'NEURAL', x: 22, y: 18, category: 'neural', connectedRegion: { x: 50, y: 18 } },
    { id: '2', text: 'COGNITIVE LOAD', x: 74, y: 16, category: 'neural', connectedRegion: { x: 50, y: 18 } },
    { id: '3', text: 'CARDIOVASCULAR', x: 16, y: 38, category: 'cardio', connectedRegion: { x: 48, y: 34 } },
    { id: '4', text: 'HEART RATE', x: 80, y: 36, category: 'cardio', connectedRegion: { x: 48, y: 34 } },
    { id: '5', text: 'RESPIRATORY', x: 18, y: 48, category: 'respiratory', connectedRegion: { x: 52, y: 32 } },
    { id: '6', text: 'BREATHING', x: 78, y: 48, category: 'respiratory', connectedRegion: { x: 52, y: 32 } },
    { id: '7', text: 'STRESS RESPONSE', x: 14, y: 60, category: 'recovery', connectedRegion: { x: 50, y: 42 } },
    { id: '8', text: 'RECOVERY CAPACITY', x: 76, y: 60, category: 'recovery', connectedRegion: { x: 50, y: 48 } },
    { id: '9', text: 'MUSCULOSKELETAL', x: 20, y: 72, category: 'performance', connectedRegion: { x: 44, y: 55 } },
    { id: '10', text: 'RECOVERY', x: 78, y: 72, category: 'recovery', connectedRegion: { x: 50, y: 50 } },
    { id: '11', text: 'SLEEP', x: 26, y: 84, category: 'recovery', connectedRegion: { x: 50, y: 22 } },
    { id: '12', text: 'FATIGUE', x: 72, y: 84, category: 'recovery', connectedRegion: { x: 50, y: 45 } },
    { id: '13', text: 'RESILIENCE', x: 50, y: 10, category: 'performance' },
    { id: '14', text: 'HUMAN PERFORMANCE', x: 50, y: 92, category: 'performance' },
    { id: '15', text: 'WELLNESS', x: 50, y: 78, category: 'performance' },
  ];

  const signalsList = [
    { title: 'CONFIDENTIAL TELEMETRY', label: '100% End-to-End Privacy Preserved' },
    { title: 'EARLY SUPPORT MONITORING', label: 'Proactive Human Wellness Signal Analysis' },
    { title: 'AGGREGATE READINESS', label: 'Anonymized Unit Resilience Vector' },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSignalIndex((prev) => (prev + 1) % signalsList.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [signalsList.length]);

  // Track mouse coordinates normalized 0..1 inside container
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setMousePos({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0.5, y: 0.5 });
  };

  // Calculate mouse offset for parallax
  const parallaxX = (mousePos.x - 0.5) * 16;
  const parallaxY = (mousePos.y - 0.5) * 16;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full min-h-[500px] flex flex-col items-center justify-between p-6 bg-gradient-to-b from-white/70 via-white/50 to-[#111214]/5 rounded-3xl border border-[#111214]/12 shadow-sm overflow-hidden select-none group"
    >
      {/* Subtle Background Glow Orbs */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-[#C8FF2C]/10 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(calc(-50% + ${parallaxX * 0.8}px), calc(-50% + ${parallaxY * 0.8}px))`,
        }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#9D9BB0]/15 rounded-full blur-3xl pointer-events-none transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${parallaxX * -0.5}px, ${parallaxY * -0.5}px)`,
        }}
      />

      {/* Top Header Label - PRESERVED */}
      <div className="w-full flex items-center justify-between z-20">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[#111214]/10 shadow-2xs text-xs font-medium text-[#111214]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C8FF2C] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C8FF2C]"></span>
          </span>
          <span className="font-mono text-[11px] uppercase tracking-wider font-semibold text-[#111214]/80">
            Wellness Core Telemetry
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-[#111214]/8 text-[11px] font-mono text-[#111214]/60">
          <Sparkles className="w-3 h-3 text-[#8A9A86]" />
          <span>Anatomical Signal Map</span>
        </div>
      </div>

      {/* Center Interactive Visualization Area */}
      <div className="relative w-full flex-1 my-2 flex items-center justify-center min-h-[360px]">
        
        {/* Floating Anatomical Terminology Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {wellnessTerms.map((term) => {
            // Distance from mouse in percentage coords
            const dx = (mousePos.x * 100) - term.x;
            const dy = (mousePos.y * 100) - term.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            const isNear = dist < 25;
            
            // Subtle proximity brightness & drift
            const proximityFactor = Math.max(0, (25 - dist) / 25);
            const driftX = (dx / (dist + 0.1)) * proximityFactor * -6;
            const driftY = (dy / (dist + 0.1)) * proximityFactor * -6;

            return (
              <div
                key={term.id}
                className="absolute transition-all duration-300 ease-out font-mono tracking-widest text-[10px] sm:text-[11px] font-semibold whitespace-nowrap transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${term.x}%`,
                  top: `${term.y}%`,
                  transform: `translate(calc(-50% + ${driftX}px), calc(-50% + ${driftY}px))`,
                  opacity: 0.25 + proximityFactor * 0.65,
                  color: isNear
                    ? '#111214'
                    : term.category === 'neural'
                    ? '#333539'
                    : term.category === 'cardio'
                    ? '#4A5043'
                    : '#666970',
                  textShadow: isNear ? '0 0 10px rgba(200, 255, 44, 0.7)' : 'none',
                }}
              >
                {term.text}
              </div>
            );
          })}
        </div>

        {/* Central Anatomical Illustration (Clean, Medical Vector Line-Art) */}
        <div
          className="relative z-0 w-64 h-80 sm:w-72 sm:h-96 transition-transform duration-500 ease-out flex items-center justify-center"
          style={{
            transform: `translate(${parallaxX}px, ${parallaxY}px) scale(1.02)`,
          }}
        >
          <svg
            className="w-full h-full drop-shadow-xs"
            viewBox="0 0 200 300"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Soft Gradient for Body Contour */}
              <linearGradient id="bodyGradient" x1="100" y1="20" x2="100" y2="280" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#111214" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#111214" stopOpacity="0.65" />
                <stop offset="100%" stopColor="#111214" stopOpacity="0.4" />
              </linearGradient>

              {/* Glowing Pulse Shader */}
              <radialGradient id="pulseGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C8FF2C" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#C8FF2C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Background Medical Alignment Grid & Radar Lines */}
            <circle cx="100" cy="140" r="110" stroke="#111214" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.15" />
            <circle cx="100" cy="140" r="80" stroke="#8A9A86" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.2" />
            <line x1="100" y1="10" x2="100" y2="280" stroke="#111214" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />
            <line x1="20" y1="140" x2="180" y2="140" stroke="#111214" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.15" />

            {/* NEUTRAL HUMAN ANATOMY SILHOUETTE & LINE ART (Presentation Safe, Medical Illustration) */}
            <g stroke="url(#bodyGradient)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
              
              {/* 1. Cranial / Head Silhouette & Cranial Vault */}
              <path d="M100 24 C91 24 84 31 84 41 C84 49 88 56 94 59 L94 66 L106 66 L106 59 C112 56 116 49 116 41 C116 31 109 24 100 24 Z" strokeWidth="1.3" />
              
              {/* Cranial Neural Lattice Lines */}
              <path d="M92 34 C97 30 103 30 108 34" stroke="#C8FF2C" strokeWidth="1" opacity="0.8" />
              <path d="M90 42 C95 38 105 38 110 42" stroke="#111214" strokeWidth="0.8" opacity="0.5" />
              <circle cx="100" cy="38" r="2.5" fill="#C8FF2C" />

              {/* 2. Neck & Trapezius Axis */}
              <path d="M94 66 L80 76 L70 88" strokeWidth="1.2" />
              <path d="M106 66 L120 76 L130 88" strokeWidth="1.2" />

              {/* 3. Spinal Column Axis (Vertebral Alignment) */}
              <line x1="100" y1="66" x2="100" y2="210" stroke="#111214" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.6" />
              {/* Vertebral node markers */}
              {[74, 90, 106, 122, 138, 154, 170, 186, 202].map((yVal, idx) => (
                <line key={idx} x1="96" y1={yVal} x2="104" y2={yVal} stroke="#111214" strokeWidth="0.8" opacity="0.4" />
              ))}

              {/* 4. Shoulder & Clavicle Assembly */}
              <path d="M70 88 C85 82 115 82 130 88" strokeWidth="1.2" />
              {/* Shoulder Joint Nodes */}
              <circle cx="68" cy="90" r="4" stroke="#111214" strokeWidth="1" fill="#F4F5F2" />
              <circle cx="132" cy="90" r="4" stroke="#111214" strokeWidth="1" fill="#F4F5F2" />

              {/* 5. Chest Ribcage & Thoracic Contours */}
              <path d="M68 90 C62 104 62 136 72 154 C82 164 92 168 100 168 C108 168 118 164 128 154 C138 136 138 104 132 90" strokeWidth="1.3" />
              {/* Rib arch vectors */}
              <path d="M74 104 C88 112 112 112 126 104" strokeWidth="0.8" opacity="0.5" />
              <path d="M72 118 C88 126 112 126 128 118" strokeWidth="0.8" opacity="0.5" />
              <path d="M73 132 C88 140 112 140 127 132" strokeWidth="0.8" opacity="0.5" />
              <path d="M76 146 C88 152 112 152 124 146" strokeWidth="0.8" opacity="0.5" />

              {/* Cardiac Heart Node & Pulmonary Vector (Left Thorax) */}
              <circle cx="92" cy="112" r="7" fill="url(#pulseGlow)" className="animate-pulse" />
              <circle cx="92" cy="112" r="3.5" fill="#111214" />
              <circle cx="92" cy="112" r="1.5" fill="#C8FF2C" />

              {/* 6. Arms Contour (Upper Torso Alignment) */}
              <path d="M66 94 L58 138 L54 180" strokeWidth="1.1" strokeDasharray="6 2" opacity="0.7" />
              <path d="M134 94 L142 138 L146 180" strokeWidth="1.1" strokeDasharray="6 2" opacity="0.7" />

              {/* 7. Lumbar, Core & Pelvic Axis Contour */}
              <path d="M72 154 C70 174 74 198 82 216 C90 226 100 228 100 228 C100 228 110 226 118 216 C126 198 130 174 128 154" strokeWidth="1.3" />
              
              {/* Core Resilience Center Pulse */}
              <circle cx="100" cy="172" r="4" stroke="#8A9A86" strokeWidth="1" fill="#F4F5F2" />
              <circle cx="100" cy="172" r="1.5" fill="#C8FF2C" />

              {/* 8. Legs Alignment Vector */}
              <path d="M84 220 L80 265 L78 290" strokeWidth="1.1" opacity="0.6" />
              <path d="M116 220 L120 265 L122 290" strokeWidth="1.1" opacity="0.6" />

            </g>

            {/* ANATOMICAL SIGNAL CONNECTOR LEADER LINES & TARGET CROSSHAIRS */}

            {/* Cranial Neural Signal Target */}
            <g className="transition-opacity duration-300" opacity="0.85">
              <circle cx="100" cy="38" r="8" stroke="#C8FF2C" strokeWidth="0.8" strokeDasharray="2 2" />
              <line x1="100" y1="38" x2="135" y2="28" stroke="#111214" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
              <circle cx="135" cy="28" r="1.5" fill="#111214" />
            </g>

            {/* Cardiac Signal Target */}
            <g className="transition-opacity duration-300" opacity="0.9">
              <circle cx="92" cy="112" r="12" stroke="#111214" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.4" />
              <line x1="92" y1="112" x2="40" y2="105" stroke="#C8FF2C" strokeWidth="0.8" strokeDasharray="2 2" />
              <circle cx="40" cy="105" r="2" fill="#C8FF2C" />
            </g>

            {/* Pulmonary / Respiratory Target */}
            <g opacity="0.7">
              <line x1="114" y1="112" x2="160" y2="120" stroke="#111214" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.3" />
              <circle cx="114" cy="112" r="2" fill="#8A9A86" />
            </g>

            {/* Lumbar / Stress Core Target */}
            <g opacity="0.8">
              <line x1="100" y1="172" x2="45" y2="175" stroke="#111214" strokeWidth="0.6" strokeDasharray="2 2" opacity="0.4" />
              <circle cx="45" cy="175" r="1.5" fill="#111214" />
            </g>
          </svg>
        </div>
      </div>

      {/* Dynamic Telemetry Status Banner at Bottom - PRESERVED */}
      <div className="w-full z-20">
        <div className="p-3.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#111214]/10 shadow-xs transition-all duration-500">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#111214] text-[#C8FF2C] shadow-2xs">
                {activeSignalIndex === 0 ? (
                  <ShieldCheck className="w-4 h-4" />
                ) : activeSignalIndex === 1 ? (
                  <Activity className="w-4 h-4" />
                ) : (
                  <Heart className="w-4 h-4" />
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-mono font-bold tracking-wider text-[#111214]/50 uppercase">
                  {signalsList[activeSignalIndex].title}
                </span>
                <span className="text-xs font-semibold text-[#111214]">
                  {signalsList[activeSignalIndex].label}
                </span>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F4F5F2] border border-[#111214]/8">
              <Brain className="w-3.5 h-3.5 text-[#8A9A86]" />
              <span className="text-[11px] font-mono font-medium text-[#111214]/80">Human Vector</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
