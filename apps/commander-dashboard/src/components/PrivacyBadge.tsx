import React, { useState } from 'react';
import { Lock, ShieldCheck, CheckCircle, Info, X } from 'lucide-react';

export const PrivacyBadge: React.FC = () => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <div className="inline-flex items-center justify-center gap-2.5 px-4 py-2 rounded-full bg-white/70 backdrop-blur-md border border-[#111214]/10 shadow-xs hover:border-[#111214]/25 transition-all text-xs text-[#111214]/75 group cursor-pointer"
        onClick={() => setShowPrivacyModal(true)}
      >
        <Lock className="w-3.5 h-3.5 text-[#111214] group-hover:text-[#8A9A86] transition-colors" />
        <span className="font-medium tracking-tight">
          Privacy by design <span className="text-[#111214]/30">·</span> Access is role-based <span className="text-[#111214]/30">·</span> Personnel wellness data remains protected
        </span>
        <Info className="w-3 h-3 text-[#111214]/40 group-hover:text-[#111214] transition-colors ml-1" />
      </div>

      {/* Security Protocol Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#111214]/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-[#111214]/15">
            {/* Close button */}
            <button
              onClick={() => setShowPrivacyModal(false)}
              className="absolute top-5 right-5 p-1.5 rounded-full hover:bg-[#F4F5F2] text-[#111214]/60 hover:text-[#111214] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-[#111214] text-[#C8FF2C]">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-[#111214]">Privacy & Governance</h3>
                <p className="text-xs text-[#111214]/60">CENTURION Security Protocol</p>
              </div>
            </div>

            {/* Points */}
            <div className="flex flex-col gap-3 my-5 text-sm text-[#111214]/80">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F5F2]">
                <CheckCircle className="w-4 h-4 text-[#8A9A86] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#111214]">Differential Privacy Safeguards</span>
                  <p className="text-xs text-[#111214]/70 mt-0.5">
                    Commanders see aggregate unit-level readiness trends. No individual check-ins or identifiable details are ever exposed.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F4F5F2]">
                <CheckCircle className="w-4 h-4 text-[#8A9A86] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-[#111214]">Role-Based Access Control (RBAC)</span>
                  <p className="text-xs text-[#111214]/70 mt-0.5">
                    Welfare officers receive encrypted triage alerts without surveillance logging. Personnel data is private by default.
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowPrivacyModal(false)}
              className="w-full py-3 rounded-xl bg-[#111214] text-[#C8FF2C] font-semibold text-sm hover:bg-[#1B1D21] transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}
    </>
  );
};
