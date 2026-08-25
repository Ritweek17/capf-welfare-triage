import React, { useState } from 'react';
import type { RoleOption } from '../types';
import { BrandMark } from '../components/BrandMark';
import { AbstractWellnessVisual } from '../components/AbstractWellnessVisual';
import { RoleSelector } from '../components/RoleSelector';
import { PrivacyBadge } from '../components/PrivacyBadge';
import { AccessGatewayModal } from '../components/AccessGatewayModal';
import { ShieldCheck, Heart, Users, Activity, Eye } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<RoleOption | null>(null);
  const [isGatewayActive, setIsGatewayActive] = useState(false);

  const handleContinue = () => {
    if (selectedRole) {
      setIsGatewayActive(true);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F4F5F2] text-[#111214] flex flex-col justify-between overflow-x-hidden selection:bg-[#C8FF2C] selection:text-[#111214]">
      {/* Background Decorative Atmosphere */}
      <div className="absolute inset-0 bg-subtle-grid opacity-70 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C8FF2C]/8 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#9D9BB0]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <BrandMark size="md" />

        {/* Status Pill Badge */}
        <div className="hidden md:flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/80 border border-[#111214]/10 shadow-2xs text-xs font-medium">
            <span className="w-2 h-2 rounded-full bg-[#8A9A86] animate-pulse" />
            <span className="text-[#111214]/75">CAPF Welfare Guard Network</span>
          </div>
          <div className="text-xs font-mono font-medium text-[#111214]/60">
            <span>v2.4 Sovereign Shield</span>
          </div>
        </div>
      </header>

      {/* Main Hero & Role Selection Container */}
      <main className="relative z-10 w-full max-w-7xl mx-auto px-6 py-4 md:py-8 flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
        
        {/* Left Side: Brand Visual & Abstract Telemetry Core */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between space-y-8">
          
          {/* Header Copy */}
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111214] text-[#C8FF2C] text-xs font-mono font-bold tracking-wider uppercase shadow-xs">
              <Activity className="w-3.5 h-3.5" />
              <span>Early-Warning & Wellness Platform</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#111214] tracking-tight leading-[1.08]">
              Human Wellbeing <br />
              <span className="text-[#111214]/40 font-normal">Meets Precision Intelligence</span>
            </h1>

            <p className="text-base text-[#111214]/75 leading-relaxed font-normal">
              A sovereign welfare platform designed for CAPF and defense forces. Transforming non-intrusive early wellness signals into timely care, operational resilience, and unit readiness.
            </p>
          </div>

          {/* Interactive Abstract 3D Wellness Visual */}
          <div className="w-full max-w-xl">
            <AbstractWellnessVisual />
          </div>

          {/* Key Platform Safeguard Pillars */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-xl">
            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#111214]/8 shadow-2xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111214]">
                <Users className="w-3.5 h-3.5 text-[#8A9A86]" />
                <span>Personnel</span>
              </div>
              <span className="text-[11px] text-[#111214]/60">100% Private Wellness</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#111214]/8 shadow-2xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111214]">
                <Heart className="w-3.5 h-3.5 text-[#9D9BB0]" />
                <span>Welfare</span>
              </div>
              <span className="text-[11px] text-[#111214]/60">Early Support Triage</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/70 border border-[#111214]/8 shadow-2xs flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#111214]">
                <Eye className="w-3.5 h-3.5 text-[#111214]" />
                <span>Commander</span>
              </div>
              <span className="text-[11px] text-[#111214]/60">Aggregate Vector</span>
            </div>
          </div>
        </div>

        {/* Right Side: Role Selector Component */}
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center">
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-white/80 backdrop-blur-md border border-[#111214]/10 shadow-lg popping-edge-card">
            <RoleSelector
              selectedRole={selectedRole}
              onRoleSelect={(role) => setSelectedRole(role)}
              onContinue={handleContinue}
            />
          </div>
        </div>
      </main>

      {/* Footer & Privacy Badge Section */}
      <footer className="relative z-20 w-full max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#111214]/8">
        <div className="flex items-center gap-2 text-xs text-[#111214]/60">
          <ShieldCheck className="w-4 h-4 text-[#8A9A86]" />
          <span>© 2026 CENTURION Intelligence Platform · Sovereign Welfare System</span>
        </div>

        {/* Center Privacy Badge Component */}
        <PrivacyBadge />

        <div className="text-xs font-mono text-[#111214]/50">
          RBAC Security Level: Active
        </div>
      </footer>

      {/* Access Gateway simulation modal */}
      {isGatewayActive && selectedRole && (
        <AccessGatewayModal
          role={selectedRole}
          onReset={() => {
            setIsGatewayActive(false);
          }}
        />
      )}
    </div>
  );
};
