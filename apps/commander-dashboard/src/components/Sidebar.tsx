import React from 'react';
import { 
  ShieldCheck, 
  LayoutDashboard, 
  Users, 
  BarChart2, 
  Bell, 
  FileText, 
  BookOpen, 
  Settings, 
  ChevronDown,
  UserCheck,
  Award
} from 'lucide-react';
import type { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  alertCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  role,
  setRole,
  alertCount
}) => {
  const [showRoleMenu, setShowRoleMenu] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'unit_overview', label: 'Unit Overview', icon: Users },
    { id: 'trends', label: 'Trends & Analytics', icon: BarChart2 },
    { id: 'alerts', label: 'Alerts (Summary)', icon: Bell, badge: alertCount },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'resources', label: 'Resource Directory', icon: BookOpen },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#0B1536] text-slate-300 flex flex-col justify-between shrink-0 select-none border-r border-slate-800/80 shadow-xl z-20">
      <div>
        {/* Logo Header */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800/80 bg-[#09112d]">
          <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-900/40 ring-2 ring-blue-400/30">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-white text-xs tracking-wider uppercase leading-tight">CAPF Welfare</h1>
            <p className="text-[11px] text-slate-400 font-medium">Monitoring System</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="p-4 space-y-1 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 text-left ${
                  isActive 
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30' 
                    : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span className="text-xs">{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
                    isActive ? 'bg-white text-blue-700' : 'bg-rose-500 text-white animate-pulse-subtle'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Role Switcher & User Profile */}
      <div className="p-4 border-t border-slate-800/80 bg-[#09112d]/80 relative">
        {showRoleMenu && (
          <div className="absolute bottom-16 left-4 right-4 bg-[#14214d] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs space-y-1 backdrop-blur-md">
            <p className="px-2 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Switch View Role</p>
            <button
              onClick={() => { setRole('Commander'); setShowRoleMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                role === 'Commander' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <div>
                <p className="font-semibold">Commander View</p>
                <p className="text-[10px] opacity-75">Aggregate unit metrics</p>
              </div>
            </button>

            <button
              onClick={() => { setRole('WelfareOfficer'); setShowRoleMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                role === 'WelfareOfficer' ? 'bg-blue-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <div>
                <p className="font-semibold">Welfare Officer</p>
                <p className="text-[10px] opacity-75">Intervention management</p>
              </div>
            </button>

            <button
              onClick={() => { setRole('Personnel'); setShowRoleMenu(false); }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center gap-2 ${
                role === 'Personnel' ? 'bg-[#D4F638] text-slate-900 font-bold' : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <div>
                <p className="font-semibold">CENTURION Tactical</p>
                <p className="text-[10px] opacity-75">Personnel Self Check-In</p>
              </div>
            </button>
          </div>
        )}

        <div 
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          className="flex items-center justify-between cursor-pointer p-2 rounded-xl hover:bg-slate-800/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-indigo-500 flex items-center justify-center text-xs font-bold text-white shadow-inner">
              {role === 'Commander' ? 'CO' : 'WO'}
            </div>
            <div>
              <p className="text-xs font-semibold text-white">
                {role === 'Commander' ? 'Commander' : 'Welfare Officer'}
              </p>
              <p className="text-[10px] text-slate-400">HQ Division • Sector 1</p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showRoleMenu ? 'rotate-180' : ''}`} />
        </div>
      </div>
    </aside>
  );
};
