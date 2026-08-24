import React, { useState } from 'react';
import type { WellbeingTrendPoint } from '../../types/commander';
import { TrendingUp, Calendar, Info } from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface WellbeingTrendChartProps {
  data: WellbeingTrendPoint[];
}

export const WellbeingTrendChart: React.FC<WellbeingTrendChartProps> = ({
  data,
}) => {
  const [metricKey, setMetricKey] = useState<'wellbeingIndex' | 'readinessIndex'>('wellbeingIndex');

  const latestPoint = data[data.length - 1] || { wellbeingIndex: 87, readinessIndex: 94 };
  const prevPoint = data[data.length - 2] || { wellbeingIndex: 86, readinessIndex: 93 };
  const delta = (latestPoint[metricKey] - prevPoint[metricKey]).toFixed(1);
  const isPositive = Number(delta) >= 0;

  return (
    <div className="bg-[#0C121A] p-5 rounded-xl border border-slate-800/80 shadow-sm flex flex-col justify-between font-sans h-full">
      {/* Header & Controls */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
              WELLBEING TREND OVER TIME
            </h3>
            <span className="px-2 py-0.5 rounded bg-[#C8FF2C]/10 text-[#C8FF2C] font-mono text-[10px] font-bold">
              AGGREGATE VECTOR
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Macro organizational health index across 21 sector units
          </p>
        </div>

        {/* Toggle Metrics & Range */}
        <div className="flex items-center gap-2">
          <div className="bg-[#101821] p-1 rounded-lg border border-slate-800 flex items-center gap-1">
            <button
              onClick={() => setMetricKey('wellbeingIndex')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                metricKey === 'wellbeingIndex'
                  ? 'bg-[#C8FF2C] text-[#070B10] font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Wellbeing
            </button>
            <button
              onClick={() => setMetricKey('readinessIndex')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
                metricKey === 'readinessIndex'
                  ? 'bg-[#0EA5E9] text-[#070B10] font-bold shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Readiness
            </button>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#101821] border border-slate-800 text-[11px] font-mono text-slate-300">
            <Calendar className="w-3 h-3 text-[#0EA5E9]" />
            <span>30 Days</span>
          </div>
        </div>
      </div>

      {/* KPI Value Callout */}
      <div className="flex items-baseline justify-between mb-3 px-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white tracking-tight font-sans">
            {latestPoint[metricKey]}%
          </span>
          <span className="text-xs text-slate-400">current aggregate</span>
        </div>
        <div
          className={`flex items-center gap-1 text-xs font-mono font-bold ${
            isPositive ? 'text-[#C8FF2C]' : 'text-rose-400'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>{isPositive ? `+${delta}%` : `${delta}%`} vs last checkpoint</span>
        </div>
      </div>

      {/* Main Line / Area Chart */}
      <div className="w-full h-64 my-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="wellbeingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C8FF2C" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#C8FF2C" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="readinessGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0EA5E9" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0EA5E9" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1E293B" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
            />
            <YAxis
              domain={[50, 100]}
              tick={{ fontSize: 11, fill: '#64748B' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={false}
              unit="%"
            />

            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const val = payload[0].value;
                  return (
                    <div className="bg-[#101821] border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1 font-sans">
                      <p className="font-mono text-[10px] text-slate-400 uppercase">{label}</p>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C8FF2C]" />
                        <span className="font-bold text-white text-sm">
                          {metricKey === 'wellbeingIndex' ? 'Wellbeing Index' : 'Readiness Index'}: {val}%
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 border-t border-slate-800 pt-1 mt-1">
                        Aggregate unit telemetry • Stable trajectory
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Area
              type="monotone"
              dataKey={metricKey}
              stroke={metricKey === 'wellbeingIndex' ? '#C8FF2C' : '#0EA5E9'}
              strokeWidth={3}
              fillOpacity={1}
              fill={metricKey === 'wellbeingIndex' ? 'url(#wellbeingGradient)' : 'url(#readinessGradient)'}
              dot={{ r: 4, fill: '#0C121A', stroke: metricKey === 'wellbeingIndex' ? '#C8FF2C' : '#0EA5E9', strokeWidth: 2 }}
              activeDot={{ r: 6, fill: metricKey === 'wellbeingIndex' ? '#C8FF2C' : '#0EA5E9' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Info */}
      <div className="pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-[#0EA5E9]" />
          Zero individual check-ins exposed. All data anonymized at unit boundary.
        </span>
        <span className="font-mono text-[10px] text-slate-500">Telemetry Sampling: 4h Sync</span>
      </div>
    </div>
  );
};
