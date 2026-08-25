import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Check, 
  Lock, 
  Save 
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [maxDutyHours, setMaxDutyHours] = useState(60);
  const [maxNightShiftPct, setMaxNightShiftPct] = useState(50);
  const [maxLeaveDelayDays, setMaxLeaveDelayDays] = useState(21);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [strictAnonymity, setStrictAnonymity] = useState(true);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 3000);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">System Thresholds & Welfare Governance Settings</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Configure automated alert triggers, duty fatigue parameters, and security encryption protocols
          </p>
        </div>

        {savedToast && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Risk Thresholds Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Sliders className="w-4 h-4 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Automated Fatigue Threshold Triggers</h3>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Maximum Weekly Duty Hour Limit:</span>
                <span className="text-blue-600">{maxDutyHours} Hours / Week</span>
              </div>
              <input
                type="range"
                min="40"
                max="80"
                value={maxDutyHours}
                onChange={(e) => setMaxDutyHours(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Triggers High Risk alert when company average exceeds this weekly operational load.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Night Duty Shift Density Cap:</span>
                <span className="text-blue-600">{maxNightShiftPct}% Volume</span>
              </div>
              <input
                type="range"
                min="20"
                max="75"
                value={maxNightShiftPct}
                onChange={(e) => setMaxNightShiftPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Triggers Moderate/High Alert when night rotation volume exceeds cap.
              </p>
            </div>

            <div>
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Leave Request Delay Threshold:</span>
                <span className="text-blue-600">{maxLeaveDelayDays} Days Pending</span>
              </div>
              <input
                type="range"
                min="7"
                max="45"
                value={maxLeaveDelayDays}
                onChange={(e) => setMaxLeaveDelayDays(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Flags administrative backlog when leave processing exceeds threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Security & Notifications Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <Lock className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Privacy & Notification Controls</h3>
            </div>

            <div className="space-y-4 text-xs mt-4">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Strict PII Anonymization Protocol</p>
                  <p className="text-[10px] text-slate-500">Enforce strict data aggregation on Commander View</p>
                </div>
                <input
                  type="checkbox"
                  checked={strictAnonymity}
                  onChange={(e) => setStrictAnonymity(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">High Risk Email Dispatch</p>
                  <p className="text-[10px] text-slate-500">Send instant advisory emails to Welfare Officers</p>
                </div>
                <input
                  type="checkbox"
                  checked={emailAlerts}
                  onChange={(e) => setEmailAlerts(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div>
                  <p className="font-bold text-slate-800">Operational SMS Alerts</p>
                  <p className="text-[10px] text-slate-500">SMS alerts for critical duty hour spikes</p>
                </div>
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors"
            >
              <Save className="w-4 h-4" /> Save System Thresholds
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
