import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Calendar, 
  Bell, 
  ChevronDown, 
  Filter, 
  Check, 
  AlertTriangle,
  AlertCircle,
  FileSpreadsheet
} from 'lucide-react';
import type { DateRangeOption, UserRole, AlertItem } from '../types';

interface HeaderProps {
  dateRange: DateRangeOption;
  setDateRange: (range: DateRangeOption) => void;
  selectedCompany: string;
  setSelectedCompany: (company: string) => void;
  role: UserRole;
  activeTab: string;
  alerts: AlertItem[];
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  dateRange,
  setDateRange,
  selectedCompany,
  setSelectedCompany,
  role,
  activeTab,
  alerts,
  onOpenReportModal
}) => {
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showCompanyDropdown, setShowCompanyDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const dateOptions: DateRangeOption[] = ['Last 7 Days', 'Last 30 Days', 'Last 90 Days', 'Year to Date'];
  
  const companyOptions = [
    'All Companies (Unit Level)',
    'Alpha Company',
    'Bravo Company',
    'Charlie Company',
    'Delta Company',
    'Echo Company',
    'Foxtrot Company',
    'Golf Company',
    'Hotel Company'
  ];

  const unreadAlerts = alerts.filter(a => a.status === 'New');

  const tabTitles: Record<string, string> = {
    dashboard: role === 'Commander' ? 'Commander Dashboard' : 'Welfare Officer Dashboard',
    unit_overview: 'Unit & Company Overview',
    trends: 'Trends & Fatigue Analytics',
    alerts: 'Welfare Alerts & Incident Feed',
    reports: 'Welfare Audit & Reports',
    resources: 'Resource Directory & Guidelines',
    settings: 'System & Risk Threshold Settings'
  };

  return (
    <header className="px-8 py-4 bg-white border-b border-slate-200 flex items-center justify-between shrink-0 shadow-xs z-10 sticky top-0">
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-bold text-slate-900 leading-tight">
            {tabTitles[activeTab] || 'Commander Dashboard'}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5 font-medium">
          <span>{selectedCompany}</span>
          <span>•</span>
          <span className="text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-semibold">
            {role === 'Commander' ? 'Aggregate Mode' : 'Intervention Mode'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* Company Unit Selector */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowCompanyDropdown(!showCompanyDropdown);
              setShowDateDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Filter className="w-3.5 h-3.5 text-blue-600" />
            <span className="max-w-[140px] truncate">{selectedCompany}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showCompanyDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase">
                Filter by Company Unit
              </div>
              {companyOptions.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setSelectedCompany(c);
                    setShowCompanyDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 font-medium"
                >
                  <span className="truncate">{c}</span>
                  {selectedCompany === c && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Date Range Selector */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowDateDropdown(!showDateDropdown);
              setShowCompanyDropdown(false);
              setShowNotifications(false);
            }}
            className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors shadow-2xs"
          >
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {dateRange}
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDateDropdown && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 text-xs">
              <div className="px-3 py-1.5 border-b border-slate-100 font-bold text-slate-400 text-[10px] uppercase">
                Time Interval
              </div>
              {dateOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    setDateRange(opt);
                    setShowDateDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-50 flex items-center justify-between text-slate-700 hover:text-slate-900 font-medium"
                >
                  {opt}
                  {dateRange === opt && <Check className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Export Quick Button */}
        <button
          onClick={onOpenReportModal}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold transition-colors"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          Export Data
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button 
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowCompanyDropdown(false);
              setShowDateDropdown(false);
            }}
            className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadAlerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white animate-ping" />
            )}
            {unreadAlerts.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-2xl py-2 z-50 text-xs overflow-hidden">
              <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
                <span className="font-bold text-slate-900">Recent Notifications</span>
                <span className="px-2 py-0.5 text-[10px] bg-rose-100 text-rose-700 font-bold rounded-full">
                  {unreadAlerts.length} New
                </span>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
                {alerts.map((a) => (
                  <div key={a.id} className="p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-start gap-2">
                      {a.level === 'High' ? (
                        <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="font-bold text-slate-800 leading-snug">{a.title}</p>
                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{a.description}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-medium">
                          <span className="font-semibold text-slate-600">{a.unit}</span>
                          <span>•</span>
                          <span>{a.time}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2 border-t border-slate-100 text-center bg-slate-50">
                <span className="text-[11px] text-blue-600 font-bold cursor-pointer hover:underline">
                  View All Welfare Notifications
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
