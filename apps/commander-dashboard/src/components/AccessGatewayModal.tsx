import React, { useEffect } from 'react';
import type { RoleOption } from '../types';
import { ROLE_CONFIGS } from './RoleSelector';
import { ShieldCheck, CheckCircle2, RefreshCw, Key, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface AccessGatewayModalProps {
  role: RoleOption;
  onReset: () => void;
}

export const AccessGatewayModal: React.FC<AccessGatewayModalProps> = ({
  role,
  onReset,
}) => {
  const roleConfig = ROLE_CONFIGS.find((r) => r.id === role) || ROLE_CONFIGS[0];

  useEffect(() => {
    // Trigger subtle confetti burst
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#C8FF2C', '#111214', '#9D9BB0', '#8A9A86'],
    });
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111214]/75 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-lg bg-white rounded-3xl p-8 shadow-2xl border-2 border-[#C8FF2C] overflow-hidden">
        {/* Popping Top Glow Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#111214] via-[#C8FF2C] to-[#111214]" />

        {/* Status Pill Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111214] text-[#C8FF2C] text-xs font-mono font-bold tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#C8FF2C] animate-pulse" />
            <span>RBAC Handshake Complete</span>
          </div>
          <span className="text-xs font-mono text-[#111214]/50">Phase 1 Demo Gateway</span>
        </div>

        {/* Selected Role Icon & Title */}
        <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl bg-[#F4F5F2] border border-[#111214]/10">
          <div className="p-3.5 rounded-xl bg-[#111214] text-[#C8FF2C]">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#111214]/60">
              Access Level Authorized
            </span>
            <h3 className="text-2xl font-extrabold text-[#111214] tracking-tight">
              {roleConfig.title}
            </h3>
          </div>
        </div>

        {/* Simulation Payload Details */}
        <div className="space-y-3 mb-6 font-mono text-xs text-[#111214]/80">
          <div className="p-3 rounded-xl bg-white border border-[#111214]/10 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#111214]/60">
              <Key className="w-3.5 h-3.5 text-[#111214]" /> Security Scope:
            </span>
            <span className="font-bold text-[#111214]">{roleConfig.securityNote}</span>
          </div>

          <div className="p-3 rounded-xl bg-white border border-[#111214]/10 flex items-center justify-between">
            <span className="flex items-center gap-2 text-[#111214]/60">
              <Lock className="w-3.5 h-3.5 text-[#111214]" /> Permissions Verified:
            </span>
            <span className="font-bold text-[#8A9A86] flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#8A9A86]" /> {roleConfig.accessLevelLabel}
            </span>
          </div>
        </div>

        {/* Notice regarding next phase */}
        <div className="p-4 rounded-2xl bg-[#C8FF2C]/15 border border-[#C8FF2C]/40 text-xs text-[#111214] mb-6 leading-relaxed">
          <p className="font-bold mb-1 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#111214]" />
            Interaction Test Successful!
          </p>
          As per project specification, the dashboard screens for {roleConfig.title} will be loaded here in the next build iteration once visual direction approval is confirmed.
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex-1 py-3.5 px-5 rounded-2xl bg-[#111214] text-[#C8FF2C] hover:bg-[#1B1D21] font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Select Another Role</span>
          </button>
        </div>
      </div>
    </div>
  );
};
