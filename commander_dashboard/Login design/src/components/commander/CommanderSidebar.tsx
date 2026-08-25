import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Activity,
  TrendingUp,
  AlertTriangle,
  FileText,
  Server,
  Lock,
  Settings,
  LogOut,
  X,
} from 'lucide-react';

interface CommanderSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  attentionCount: number;
  onOpenPrivacyModal: () => void;
  onLogout?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const CommanderSidebar: React.FC<CommanderSidebarProps> = ({
  activeTab,
  onTabChange,
  attentionCount,
  onOpenPrivacyModal,
  onLogout,
  isOpen,
  onClose,
}) => {
  const navItems = [
    { id: 'overview', hash: '#commander', label: 'Overview', icon: LayoutDashboard },
    { id: 'readiness', hash: '#commander/readiness', label: 'Unit Readiness', icon: Activity },
    { id: 'trends', hash: '#commander/trends', label: 'Wellbeing Trends', icon: TrendingUp },
    { id: 'alerts', hash: '#commander/alerts', label: 'Alerts', icon: AlertTriangle, badge: attentionCount },
    { id: 'reports', hash: '#commander/reports', label: 'Reports', icon: FileText },
    { id: 'status', hash: '#commander/system', label: 'System Status', icon: Server },
  ];

  const handleNavClick = (id: string, hash: string) => {
    if (typeof window !== 'undefined') {
      window.location.hash = hash;
    }
    onTabChange(id);
    onClose();
  };

  return (
    <aside className={`fixed inset-y-0 left-0 lg:sticky lg:translate-x-0 w-[250px] bg-[#F1F5E9] dark:bg-[#111B2B] border-r border-[#E0E7D8] dark:border-[#29384D] flex flex-col justify-between h-screen top-0 z-30 shrink-0 select-none font-sans transition-transform duration-200 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <div>
        {/* Brand & System Title */}
        <div className="p-5 border-b border-[#E0E7D8] dark:border-[#29384D]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[13px] bg-white dark:bg-[#E8EEF5] shadow-sm flex items-center justify-center">
              <Shield className="w-5 h-5 text-[#0B1830]" />
            </div>
            <div className="flex-1">
              <span className="font-extrabold tracking-tight text-[#0B1830] dark:text-[#E8EEF5] text-sm block leading-none font-sans">
                Commander Desk
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#667085] dark:text-[#9AA8B8] uppercase mt-1 block">
                Aggregate unit view
              </span>
            </div>
            <button onClick={onClose} className="lg:hidden p-1.5 rounded-lg text-[#667085] dark:text-[#9AA8B8]" aria-label="Close navigation"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {/* Commander Context */}
        <div className="px-6 py-4 border-b border-[#E0E7D8] dark:border-[#29384D]">
          <p className="text-xs font-bold text-[#0B1830] dark:text-[#E8EEF5]">COMMANDER</p>
          <p className="text-[11px] font-mono text-[#667085] dark:text-[#9AA8B8] mt-0.5">Alpha Sector HQ</p>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id, item.hash)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#B7DB50] dark:bg-[#B7DB50] text-[#0B1830] dark:text-[#0B1830] font-bold shadow-xs'
                    : 'text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5] hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? 'text-[#0B1830] dark:text-[#0B1830]' : 'text-[#667085] dark:text-[#9AA8B8]'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive
                        ? 'bg-[#0B1830] dark:bg-[#0B1830] text-white'
                        : 'bg-[#C58A2B]/15 dark:bg-[#C4A56A]/15 text-[#C58A2B] dark:text-[#C4A56A] border border-[#C58A2B]/30'
                    }`}
                  >
                    0{item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Actions */}
      <div className="p-4 border-t border-[#E0E7D8] dark:border-[#29384D] space-y-3">
        {/* Data Privacy Trigger */}
        <button
          onClick={onOpenPrivacyModal}
          className="w-full flex items-center justify-between p-3 rounded-xl bg-[#F8FAF5] dark:bg-[#101A2A] hover:bg-[#F1F5E9] dark:hover:bg-[#1B293D] border border-[#E0E7D8] dark:border-[#29384D] text-left transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <Lock className="w-3.5 h-3.5 text-[#70873B] dark:text-[#C9DFA0]" />
            <div>
              <p className="text-xs font-semibold text-[#0B1830] dark:text-[#E8EEF5]">Data Privacy</p>
              <p className="text-[10px] text-[#667085] dark:text-[#9AA8B8]">Aggregate insights only</p>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-[#70873B] dark:bg-[#C9DFA0]" />
        </button>

        <div className="space-y-0.5">
          <button
            onClick={() => handleNavClick('status', '#commander/system')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#667085] dark:text-[#9AA8B8] hover:text-[#0B1830] dark:hover:text-[#E8EEF5] hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A] transition-colors cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5 text-[#667085] dark:text-[#9AA8B8]" />
            <span>Settings</span>
          </button>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-[#667085] dark:text-[#9AA8B8] hover:text-[#C85A54] dark:hover:text-[#C77A7A] hover:bg-[#C85A54]/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-[#667085] dark:text-[#9AA8B8]" />
            <span>Log Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
