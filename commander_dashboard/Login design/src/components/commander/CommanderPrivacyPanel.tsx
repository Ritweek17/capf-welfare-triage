import React from 'react';
import { ShieldCheck, Lock, EyeOff, CheckCircle2, X } from 'lucide-react';

interface CommanderPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommanderPrivacyModal: React.FC<CommanderPrivacyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-[#E0E7D8] rounded-[17px] max-w-xl w-full p-6 shadow-2xl space-y-5 text-[#0B1830] animate-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E0E7D8] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F1F5E9] border border-[#E0E7D8] flex items-center justify-center text-[#70873B]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-[#0B1830] text-base tracking-tight font-sans">
                CENTURION Sovereign Privacy Architecture
              </h3>
              <p className="text-xs text-[#667085] font-mono">
                Commander Scope Anonymization Protocols
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#667085] hover:text-[#0B1830] p-1.5 rounded-lg hover:bg-[#F8FAF5] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Principles */}
        <div className="space-y-3 text-xs leading-relaxed">
          <div className="p-4 rounded-xl bg-[#F8FAF5] border border-[#E0E7D8] space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#0B1830]">
              <EyeOff className="w-4 h-4 text-[#70873B]" />
              <span>Strict Aggregate Boundary (0 PII Exposed)</span>
            </div>
            <p className="text-[#667085] text-[11px]">
              Commanders receive macro-level unit stress indices, shift density averages, and company readiness metrics. Individual names, IDs, medical records, or specific check-in responses are programmatically excluded at the database boundary layer.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF5] border border-[#E0E7D8] space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#0B1830]">
              <Lock className="w-4 h-4 text-[#70873B]" />
              <span>Role-Based Access Control (RBAC)</span>
            </div>
            <p className="text-[#667085] text-[11px]">
              Individual case triage is handled exclusively by authorized Welfare Officers. Commanders cannot view or request individual personnel data under organization policy.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAF5] border border-[#E0E7D8] space-y-1">
            <div className="flex items-center gap-2 font-bold text-[#0B1830]">
              <CheckCircle2 className="w-4 h-4 text-[#70873B]" />
              <span>Non-Punitive Psychological Safety Assurance</span>
            </div>
            <p className="text-[#667085] text-[11px]">
              Wellness indicators are segregated from operational performance reviews to protect trust and encourage honest self-reporting across all ranks.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-[#E0E7D8] flex items-center justify-between text-xs">
          <span className="font-mono text-[10px] text-[#89947F]">
            AGGREGATE INTELLIGENCE ONLY
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#70873B] hover:bg-[#4B7361] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-xs"
          >
            Acknowledge Privacy Protocol
          </button>
        </div>
      </div>
    </div>
  );
};
