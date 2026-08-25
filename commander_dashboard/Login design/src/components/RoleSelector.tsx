import React from 'react';
import type { RoleConfig, RoleOption } from '../types';
import { RoleCard } from './RoleCard';
import { ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

interface RoleSelectorProps {
  selectedRole: RoleOption | null;
  onRoleSelect: (role: RoleOption) => void;
  onContinue: () => void;
}

export const ROLE_CONFIGS: RoleConfig[] = [
  {
    id: 'commander',
    title: 'COMMANDER',
    badge: 'Executive & Strategic',
    description: 'View aggregate readiness and unit-level wellness intelligence.',
    accentColor: '#111214',
    accentBorder: '#C8FF2C',
    badgeBg: '#111214',
    badgeText: '#C8FF2C',
    icon: 'Shield',
    highlights: ['Aggregate Wellness Vectors', 'Unit Stress Telemetry', 'Strategic Readiness Index'],
    securityNote: 'Aggregate Data Only · Zero PII Access',
    accessLevelLabel: 'Command Level 1 Access',
  },
  {
    id: 'welfare_officer',
    title: 'WELFARE OFFICER',
    badge: 'Care Coordination',
    description: 'Review welfare signals and coordinate timely support.',
    accentColor: '#554F78',
    accentBorder: '#9D9BB0',
    badgeBg: '#EAE8F5',
    badgeText: '#554F78',
    icon: 'HeartHandshake',
    highlights: ['Actionable Alert Triage', 'Anonymous Outreach', 'Intervention Logs'],
    securityNote: 'Encrypted Case Coordination',
    accessLevelLabel: 'Officer Level 2 Access',
  },
  {
    id: 'personnel',
    title: 'PERSONNEL',
    badge: 'Private Personnel',
    description: 'Check in privately and manage your own wellbeing.',
    accentColor: '#3D523A',
    accentBorder: '#8A9A86',
    badgeBg: '#F0F4EF',
    badgeText: '#3D523A',
    icon: 'User',
    highlights: ['Private Wellness Check-in', 'Self-Support Tracker', 'Direct Anonymous Helpline'],
    securityNote: 'Strictly Confidential · Self Controlled',
    accessLevelLabel: 'Personnel Private Portal',
  },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  selectedRole,
  onRoleSelect,
  onContinue,
}) => {
  const getSelectedConfig = () => ROLE_CONFIGS.find((c) => c.id === selectedRole);
  const activeConfig = getSelectedConfig();

  return (
    <div className="flex flex-col gap-6 w-full max-w-xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold uppercase tracking-wider text-[#111214]/60">
          <Sparkles className="w-3.5 h-3.5 text-[#8A9A86]" />
          <span>Role Authentication</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Plus_Jakarta_Sans'] text-[#111214] tracking-tight">
          How are you accessing the platform?
        </h2>
        <p className="text-sm text-[#111214]/70">
          Select your authorized access level below to enter your customized interface.
        </p>
      </div>

      {/* 3 Role Selection Cards */}
      <div className="flex flex-col gap-3.5">
        {ROLE_CONFIGS.map((config) => (
          <RoleCard
            key={config.id}
            config={config}
            isSelected={selectedRole === config.id}
            onSelect={onRoleSelect}
          />
        ))}
      </div>

      {/* CTA Button & RBAC Note */}
      <div className="flex flex-col gap-3 pt-2">
        <button
          onClick={onContinue}
          disabled={!selectedRole}
          className={`
            group relative w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300
            flex items-center justify-center gap-3 cursor-pointer outline-hidden shadow-md
            ${
              selectedRole
                ? 'bg-[#C8FF2C] text-[#111214] hover:bg-[#D4FF55] hover:shadow-xl hover:translate-y-[-2px] active:translate-y-0 ring-2 ring-[#111214]'
                : 'bg-[#111214]/10 text-[#111214]/40 cursor-not-allowed border border-[#111214]/10 shadow-none'
            }
          `}
        >
          <span>
            {activeConfig
              ? `Continue as ${activeConfig.title}`
              : 'Select a Role to Access Platform'}
          </span>
          <ArrowRight
            className={`w-5 h-5 transition-transform duration-300 ${
              selectedRole ? 'group-hover:translate-x-1.5' : ''
            }`}
          />

          {/* Popping Glow Border Effect on Active CTA */}
          {selectedRole && (
            <div className="absolute inset-0 rounded-2xl bg-[#C8FF2C]/30 blur-md -z-10 group-hover:bg-[#C8FF2C]/50 transition-all" />
          )}
        </button>

        {/* Security Sub-line */}
        <div className="flex items-center justify-center gap-2 text-center text-xs text-[#111214]/60">
          <ShieldCheck className="w-3.5 h-3.5 text-[#111214]/70" />
          <span>Your access level determines the information you can view.</span>
        </div>
      </div>
    </div>
  );
};
