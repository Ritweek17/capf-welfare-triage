import React, { useState } from 'react';
import { 
  Users, 
  ShieldCheck, 
  AlertCircle, 
  AlertTriangle, 
  Download, 
  Info, 
  TrendingUp,
  ArrowUpRight,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import type { 
  RiskDistributionItem, 
  TrendDataPoint, 
  StressIndicator, 
  AlertItem, 
  CompanyUnit,
  DateRangeOption 
} from '../types';

interface DashboardViewProps {
  dateRange: DateRangeOption;
  selectedCompany: string;
  trendData: TrendDataPoint[];
  stressIndicators: StressIndicator[];
  alerts: AlertItem[];
  units: CompanyUnit[];
  onSelectAlert: (alert: AlertItem) => void;
  onOpenReportModal: () => void;
  onNavigateToTab: (tab: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  dateRange,
  selectedCompany,
  trendData,
  stressIndicators,
  alerts,
  units,
  onSelectAlert,
  onOpenReportModal,
  onNavigateToTab
}) => {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState('10 mins ago');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Compute stats dynamically if company filter applied
  const filteredUnits = selectedCompany === 'All Companies (Unit Level)'
    ? units
    : units.filter(u => u.name === selectedCompany);

  const totalPersonnel = filteredUnits.reduce((acc, u) => acc + u.totalPersonnel, 0);
  const totalLow = filteredUnits.reduce((acc, u) => acc + u.lowRisk, 0);
  const totalMod = filteredUnits.reduce((acc, u) => acc + u.moderateRisk, 0);
  const totalHigh = filteredUnits.reduce((acc, u) => acc + u.highRisk, 0);

  const lowPct = totalPersonnel > 0 ? ((totalLow / totalPersonnel) * 100).toFixed(1) : '71.5';
  const modPct = totalPersonnel > 0 ? ((totalMod / totalPersonnel) * 100).toFixed(1) : '18.3';
  const highPct = totalPersonnel > 0 ? ((totalHigh / totalPersonnel) * 100).toFixed(1) : '10.2';

  const dynamicDistribution: RiskDistributionItem[] = [
    { name: 'Low Risk', value: totalLow, color: '#10B981', percentage: `${lowPct}%` },
    { name: 'Moderate Risk', value: totalMod, color: '#F59E0B', percentage: `${modPct}%` },
    { name: 'High Risk', value: totalHigh, color: '#EF4444', percentage: `${highPct}%` },
  ];

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      setLastRefreshed('Just now');
    }, 600);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto animate-fade-in">
      
      {/* Top Bar Status Indicator & Controls */}
      <div className="flex items-center justify-between bg-white px-5 py-3 rounded-xl border border-slate-200/80 shadow-2xs">
        <div className="flex items-center gap-3 text-xs font-medium text-slate-600">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Real-time Monitoring active across <strong>{filteredUnits.length} Company Units</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500">Filter applied: <strong>{dateRange}</strong></span>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-blue-600 transition-colors font-medium"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          Refresh Data
        </button>
      </div>

      {/* Top KPI Cards */}
      <div className="grid grid-cols-4 gap-5">
        {/* Total Personnel */}
        <div 
          onClick={() => onNavigateToTab('unit_overview')}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
        >
          <div>
            <p className="text-xs text-slate-500 font-medium">Total Personnel</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalPersonnel.toLocaleString()}</p>
            <p className="text-[11px] text-slate-400 mt-0.5 group-hover:text-blue-600 flex items-center gap-0.5 transition-colors">
              Across {filteredUnits.length} {filteredUnits.length === 1 ? 'Company' : 'Companies'} <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
            </p>
          </div>
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
            <Users className="w-5 h-5" />
          </div>
        </div>

        {/* Low Risk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Low Risk</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalLow.toLocaleString()}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{lowPct}% of total</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
        </div>

        {/* Moderate Risk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">Moderate Risk</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalMod.toLocaleString()}</p>
            <p className="text-[11px] text-amber-600 font-medium mt-0.5">{modPct}% of total</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
            <AlertCircle className="w-5 h-5" />
          </div>
        </div>

        {/* High Risk */}
        <div className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-500 font-medium">High Risk</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{totalHigh.toLocaleString()}</p>
            <p className="text-[11px] text-rose-600 font-medium mt-0.5">{highPct}% of total</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Analytics & Indicators Grid */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* 1. Risk Distribution (Unit Level) */}
        <div className="col-span-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Risk Distribution</h3>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-semibold">
              {selectedCompany === 'All Companies (Unit Level)' ? 'Unit Level' : 'Filtered'}
            </span>
          </div>
          
          <div className="relative w-full h-44 flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dynamicDistribution}
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {dynamicDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(val) => [`${val} personnel`, 'Count']}
                  contentStyle={{ borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-base font-bold text-slate-900 leading-none">{totalPersonnel.toLocaleString()}</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Total</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {dynamicDistribution.map((item) => (
              <div key={item.name} className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
                <span className="flex items-center gap-2 text-slate-600 text-[11px] font-medium">
                  <span className="w-2.5 h-2.5 rounded-full shadow-2xs" style={{ backgroundColor: item.color }} />
                  {item.name} ({item.percentage})
                </span>
                <span className="font-bold text-slate-800 text-[11px]">{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-slate-400 mt-3 flex items-center gap-1">
            Data updated {lastRefreshed}
          </p>
        </div>

        {/* 2. Risk Trend Line Chart */}
        <div className="col-span-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Risk Trend ({dateRange})</h3>
              <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
            </div>
            <div className="flex items-center gap-3 text-[10px] font-medium">
              <span className="flex items-center gap-1 text-rose-600">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> High
              </span>
              <span className="flex items-center gap-1 text-amber-600">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Moderate
              </span>
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Low
              </span>
            </div>
          </div>

          <div className="w-full h-52">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
                <YAxis tick={{ fontSize: 10, fill: '#94A3B8' }} stroke="#E2E8F0" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0B1536', borderRadius: '8px', color: '#fff', fontSize: '11px', border: 'none' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line type="monotone" dataKey="low" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="moderate" stroke="#F59E0B" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="high" stroke="#EF4444" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 border-t border-slate-100 pt-2">
            <span>High Risk shift: -3.2% vs previous period</span>
            <button 
              onClick={() => onNavigateToTab('trends')}
              className="text-blue-600 font-semibold hover:underline flex items-center gap-0.5"
            >
              Detailed Analytics <ExternalLink className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* 3. Top Stress Indicators */}
        <div className="col-span-3 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Top Stress Indicators</h3>
            <span className="text-[10px] text-slate-400">Unit Level</span>
          </div>
          <div className="space-y-3.5 my-auto">
            {stressIndicators.map((ind) => (
              <div key={ind.id} className="group">
                <div className="flex justify-between text-[11px] font-medium text-slate-700 mb-1">
                  <span className="truncate max-w-[170px]" title={ind.label}>{ind.label}</span>
                  <span className="font-bold text-slate-900">{ind.percentage}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ease-out ${ind.color}`} 
                    style={{ width: `${ind.percentage}%` }} 
                  />
                </div>
                <p className="text-[9px] text-slate-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  Affects ~{ind.affectedCount} personnel
                </p>
              </div>
            ))}
          </div>
          <div className="mt-2 pt-2 border-t border-slate-100 text-[10px] text-slate-400">
            Primary Driver: Operational Overtime Shift Density
          </div>
        </div>

        {/* 4. Recent Alerts Summary */}
        <div className="col-span-2 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wide">Recent Alerts</h3>
            <button 
              onClick={() => onNavigateToTab('alerts')}
              className="text-[11px] text-blue-600 font-bold hover:underline"
            >
              View All
            </button>
          </div>

          <div className="space-y-2.5 my-auto">
            {alerts.slice(0, 3).map((alert) => (
              <div 
                key={alert.id} 
                onClick={() => onSelectAlert(alert)}
                className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-slate-100/80 hover:border-slate-200 transition-all cursor-pointer space-y-1 group"
              >
                <div className="flex items-center gap-1.5 text-xs font-medium text-slate-800">
                  {alert.level === 'High' ? (
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className="truncate text-[11px] font-bold group-hover:text-blue-700 transition-colors">
                    {alert.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{alert.unit}</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>

          <button 
            onClick={onOpenReportModal}
            className="w-full mt-2 py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-300 rounded-lg text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            Download Report
          </button>
        </div>

      </div>

      {/* Privacy Enforcement Notice Banner */}
      <div className="bg-blue-50/90 border border-blue-200/90 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-950 font-medium shadow-2xs">
        <div className="flex items-center gap-2.5">
          <Info className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            This is an aggregate view. Individual identifiable data is strictly restricted and accessible only to authorized Welfare Officers under CAPF Data Guidelines.
          </span>
        </div>
        <button 
          onClick={() => setShowPrivacyModal(true)}
          className="text-[11px] font-bold text-blue-700 underline hover:text-blue-900 shrink-0 ml-4"
        >
          View Privacy Policy & Protocol
        </button>
      </div>

      {/* Privacy Info Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-in">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">CAPF Welfare Data Privacy & Anonymity</h3>
                <p className="text-xs text-slate-500">Security & Anonymization Protocols</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-600 leading-relaxed">
              <p>
                <strong>Aggregate Commander View:</strong> Commanders receive macro-level unit stress indices, duty hour averages, and company risk distribution totals to guide shift planning without compromising individual identity.
              </p>
              <p>
                <strong>Role-Based Access Control (RBAC):</strong> PII (Personally Identifiable Information) is encrypted at rest and in transit. Only designated Welfare Officers with verified two-factor authentication can access anonymized case support queues.
              </p>
              <p>
                <strong>Non-Punitive Assurance:</strong> Self-reported stress indices and helpline usage logs are segregated from operational performance reviews to ensure psychological safety.
              </p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Acknowledge & Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
