import React, { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { BarChart2, Zap, ShieldCheck } from 'lucide-react';
import type { TrendDataPoint, CompanyUnit, DateRangeOption } from '../types';

interface TrendsViewProps {
  trendData: TrendDataPoint[];
  units: CompanyUnit[];
  dateRange: DateRangeOption;
}

export const TrendsView: React.FC<TrendsViewProps> = ({ trendData, units, dateRange }) => {
  const [activeMetric, setActiveMetric] = useState<'risk' | 'duty' | 'leave'>('risk');

  const dutyChartData = trendData.map(d => ({
    date: d.date,
    avgHours: d.dutyHoursAvg || 58,
    benchmark: 48,
    nightShiftPct: Math.round((d.dutyHoursAvg || 58) * 0.9)
  }));

  const companyBarData = units.map(u => ({
    name: u.code,
    fullName: u.name,
    highRisk: u.highRisk,
    moderateRisk: u.moderateRisk,
    lowRisk: u.lowRisk,
    dutyHours: u.avgDutyHoursPerWeek
  }));

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">Trends & Fatigue Predictive Analytics</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Analyzing duty shift intensity, night rotation density, and risk migration over <strong>{dateRange}</strong>
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold text-slate-700">
          <button
            onClick={() => setActiveMetric('risk')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'risk' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Risk Category Migration
          </button>
          <button
            onClick={() => setActiveMetric('duty')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeMetric === 'duty' ? 'bg-blue-600 text-white shadow-xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            Duty Hours vs Rest Load
          </button>
        </div>
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-12 gap-5">
        
        {/* Primary Comparative Trend Line Chart */}
        <div className="col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                {activeMetric === 'risk' ? 'Personnel Risk Category Timeline' : 'Duty Hour Load vs Recommended Target'}
              </h3>
              <p className="text-xs text-slate-500">Weekly tracking across all operational companies</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="flex items-center gap-1 text-slate-600 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Duty Hours Avg
              </span>
            </div>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {activeMetric === 'risk' ? (
                <LineChart data={trendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1536', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Line type="monotone" name="High Risk" dataKey="high" stroke="#EF4444" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" name="Moderate Risk" dataKey="moderate" stroke="#F59E0B" strokeWidth={3} dot={{ r: 4 }} />
                  <Line type="monotone" name="Low Risk" dataKey="low" stroke="#10B981" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              ) : (
                <BarChart data={dutyChartData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                  <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0B1536', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar name="Actual Duty Hrs / Wk" dataKey="avgHours" fill="#3B82F6" radius={[6, 6, 0, 0]} />
                  <Bar name="Recommended Max (48h)" dataKey="benchmark" fill="#94A3B8" radius={[6, 6, 0, 0]} />
                </BarChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

        {/* Predictive Forecasting Box */}
        <div className="col-span-4 bg-gradient-to-br from-[#0B1536] to-[#14235b] text-white p-6 rounded-2xl shadow-lg flex flex-col justify-between border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Zap className="w-4 h-4" /> Predictive Welfare Insights
            </div>
            <h3 className="text-lg font-bold mt-2 leading-snug">30-Day Fatigue Projection</h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Based on scheduled convoy deployments in Sector 1 & Sector 2, <strong>Alpha Company</strong> and <strong>Charlie Company</strong> are projected to experience a <strong>+14% increase in High Stress Indicators</strong> unless night shift rotations are adjusted by June 15.
            </p>
          </div>

          <div className="space-y-3 bg-white/10 p-4 rounded-xl backdrop-blur-xs border border-white/10 my-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Target Shift Reduction:</span>
              <span className="font-bold text-emerald-400">-8 Duty Hours / Wk</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-300">Mandatory Rest Window:</span>
              <span className="font-bold text-white">48h post-deployment</span>
            </div>
          </div>

          <div className="pt-2">
            <button className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 font-bold rounded-xl text-xs text-white shadow-md transition-colors flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              Dispatch Rotation Advisory
            </button>
          </div>
        </div>

      </div>

      {/* Company Risk Breakdown Bar Comparison */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900">Risk Profile Comparison Across All 8 Companies</h3>
          <p className="text-xs text-slate-500">Distribution of High, Moderate, and Low risk personnel by company unit</p>
        </div>

        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={companyBarData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <YAxis tick={{ fontSize: 11, fill: '#64748B' }} stroke="#E2E8F0" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B1536', borderRadius: '12px', color: '#fff', fontSize: '11px', border: 'none' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar name="Low Risk" dataKey="lowRisk" stackId="a" fill="#10B981" />
              <Bar name="Moderate Risk" dataKey="moderateRisk" stackId="a" fill="#F59E0B" />
              <Bar name="High Risk" dataKey="highRisk" stackId="a" fill="#EF4444" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};
