import React from 'react';
import type { RoleConfig } from '../types';
import { Shield, HeartHandshake, User, CheckCircle2, ArrowRight } from 'lucide-react';

interface RoleCardProps {
  config: RoleConfig;
  isSelected: boolean;
  onSelect: (roleId: RoleConfig['id']) => void;
}

export const RoleCard: React.FC<RoleCardProps> = ({
  config,
  isSelected,
  onSelect,
}) => {
  // Render corresponding icon
  const renderIcon = () => {
    const iconClass = "w-6 h-6 transition-transform duration-300 group-hover:scale-110";
    switch (config.id) {
      case 'commander':
        return <Shield className={iconClass} />;
      case 'welfare_officer':
        return <HeartHandshake className={iconClass} />;
      case 'personnel':
        return <User className={iconClass} />;
      default:
        return <Shield className={iconClass} />;
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      aria-selected={isSelected}
      onClick={() => onSelect(config.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(config.id);
        }
      }}
      className={`
        group relative w-full text-left p-6 rounded-2xl cursor-pointer outline-hidden
        transition-all duration-300 ease-out select-none
        ${
          isSelected
            ? 'bg-white shadow-xl translate-y-[-4px] ring-2 ring-[#111214] border-l-4 border-l-[#C8FF2C]'
            : 'bg-white/90 hover:bg-white border border-[#111214]/12 hover:border-[#111214]/30 hover:shadow-lg hover:-translate-y-1.5'
        }
      `}
    >
      {/* Popping Edge Hover Highlight Effect */}
      <div
        className={`
          absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-300
          ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
        `}
        style={{
          boxShadow: isSelected
            ? '0 0 20px rgba(200, 255, 44, 0.25), inset 0 0 0 1px rgba(200, 255, 44, 0.4)'
            : '0 0 15px rgba(200, 255, 44, 0.15)',
        }}
      />

      {/* Top Header Row: Icon + Badge + Checkmark */}
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-center gap-3">
          {/* Role Icon Container */}
          <div
            className={`
              p-3 rounded-xl transition-all duration-300 shadow-xs
              ${
                config.id === 'commander'
                  ? 'bg-[#111214] text-[#C8FF2C] group-hover:bg-[#1B1D21]'
                  : config.id === 'welfare_officer'
                  ? 'bg-[#EAE8F5] text-[#554F78] group-hover:bg-[#DFDCF0]'
                  : 'bg-[#F0F4EF] text-[#3D523A] group-hover:bg-[#E2EBE0]'
              }
            `}
          >
            {renderIcon()}
          </div>

          {/* Role Badge */}
          <div className="flex flex-col">
            <span className="text-[11px] font-mono font-bold tracking-wider uppercase text-[#111214]/60">
              {config.badge}
            </span>
            <h3 className="text-lg font-bold font-['Plus_Jakarta_Sans'] text-[#111214] tracking-tight group-hover:text-black">
              {config.title}
            </h3>
          </div>
        </div>

        {/* Selected Indicator Pill */}
        <div className="flex items-center">
          {isSelected ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#111214] text-[#C8FF2C] text-xs font-semibold shadow-xs animate-in fade-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected</span>
            </div>
          ) : (
            <div className="w-5 h-5 rounded-full border border-[#111214]/20 group-hover:border-[#C8FF2C] group-hover:bg-[#C8FF2C]/20 transition-colors flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-transparent group-hover:bg-[#111214] transition-colors" />
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-[#111214]/75 font-normal leading-relaxed mb-4">
        {config.description}
      </p>

      {/* Security Scope & Feature Bullets */}
      <div className="pt-3.5 border-t border-[#111214]/8 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2 text-[#111214]/60">
          <span className="w-1.5 h-1.5 rounded-full bg-[#C8FF2C] group-hover:animate-ping" />
          <span className="font-mono text-[11px]">{config.securityNote}</span>
        </div>

        <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#111214]/70 group-hover:text-[#111214] group-hover:translate-x-0.5 transition-all">
          <span>{config.accessLevelLabel}</span>
          <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </div>
  );
};
