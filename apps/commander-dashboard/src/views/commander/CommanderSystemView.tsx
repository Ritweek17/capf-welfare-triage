import React from 'react';
import { Server, CheckCircle2 } from 'lucide-react';

interface SystemModule {
  name: string;
  category: string;
  status: 'Operational' | 'Degraded' | 'Offline';
  latency: string;
  uptime: string;
}

const SYSTEM_MODULES: SystemModule[] = [
  {
    name: 'Telemetry Ingestion Engine',
    category: 'Data Pipeline',
    status: 'Operational',
    latency: '14 ms',
    uptime: '99.98%',
  },
  {
    name: 'Sector Data Synchronization',
    category: 'Sync Services',
    status: 'Operational',
    latency: '42 ms',
    uptime: '99.95%',
  },
  {
    name: 'Anonymized Analytics Engine',
    category: 'Machine Intelligence',
    status: 'Operational',
    latency: '88 ms',
    uptime: '100.0%',
  },
  {
    name: 'Real-time Alerting Engine',
    category: 'Notification Dispatch',
    status: 'Operational',
    latency: '12 ms',
    uptime: '99.99%',
  },
  {
    name: 'Commander REST & GraphQL API Gateway',
    category: 'API Services',
    status: 'Operational',
    latency: '24 ms',
    uptime: '99.96%',
  },
  {
    name: 'Privacy Anonymization Boundary',
    category: 'Security & Compliance',
    status: 'Operational',
    latency: '< 1 ms',
    uptime: '100.0%',
  },
];

export const CommanderSystemView: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-[#70873B] dark:text-[#C9DFA0]" />
            <h1 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              CENTURION Infrastructure & Telemetry Health
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-1">
            System status monitoring, telemetry pipeline health, latency benchmarks, and privacy encryption boundary integrity.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 px-3.5 py-2 rounded-xl border border-[#70873B]/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>ALL SYSTEMS OPERATIONAL</span>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase block">
            AVERAGE PIPELINE LATENCY
          </span>
          <span className="text-2xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-mono">
            30 ms
          </span>
          <span className="text-xs text-[#70873B] dark:text-[#C9DFA0] font-bold block">
            Optimal Performance
          </span>
        </div>

        <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase block">
            INFRASTRUCTURE UPTIME (30D)
          </span>
          <span className="text-2xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-mono">
            99.98%
          </span>
          <span className="text-xs text-[#70873B] dark:text-[#C9DFA0] font-bold block">
            Zero Degradation Events
          </span>
        </div>

        <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-5 shadow-xs space-y-1">
          <span className="text-[10px] font-mono font-bold text-[#667085] dark:text-[#9AA8B8] uppercase block">
            LAST FULL SYNCHRONIZATION
          </span>
          <span className="text-2xl font-extrabold text-[#70873B] dark:text-[#C9DFA0] font-mono">
            2 min ago
          </span>
          <span className="text-xs text-[#667085] dark:text-[#9AA8B8] font-bold block">
            Auto-Sync Active (Every 60s)
          </span>
        </div>
      </div>

      {/* Detailed System Modules List */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs space-y-4 transition-colors">
        <div className="flex items-center justify-between border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
          <span className="text-[11px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-widest block">
            CORE PLATFORM MODULES & SERVICES
          </span>
          <span className="text-xs font-mono text-[#667085] dark:text-[#9AA8B8]">
            6/6 Modules Healthy
          </span>
        </div>

        <div className="divide-y divide-[#E0E7D8]/60 dark:divide-[#29384D]/80">
          {SYSTEM_MODULES.map((mod, idx) => (
            <div
              key={idx}
              className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-sans hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A] px-3 rounded-xl transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-[#70873B] dark:bg-[#C9DFA0]" />
                <div>
                  <span className="font-extrabold text-[#0B1830] dark:text-[#E8EEF5] block text-sm">
                    {mod.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#667085] dark:text-[#9AA8B8]">
                    {mod.category}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6 font-mono text-xs">
                <div>
                  <span className="text-[#89947F] dark:text-[#7F8C9B] text-[10px] block">LATENCY</span>
                  <span className="font-bold text-[#0B1830] dark:text-[#E8EEF5]">{mod.latency}</span>
                </div>
                <div>
                  <span className="text-[#89947F] dark:text-[#7F8C9B] text-[10px] block">UPTIME</span>
                  <span className="font-bold text-[#0B1830] dark:text-[#E8EEF5]">{mod.uptime}</span>
                </div>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 text-[#70873B] dark:text-[#C9DFA0] border border-[#70873B]/20">
                  {mod.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
