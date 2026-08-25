import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Clock, 
  Moon, 
  Calendar, 
  MapPin, 
  Search, 
  ChevronRight,
  X,
  FileSpreadsheet
} from 'lucide-react';
import type { CompanyUnit } from '../types';

interface UnitOverviewViewProps {
  units: CompanyUnit[];
  onOpenReportModal: () => void;
}

export const UnitOverviewView: React.FC<UnitOverviewViewProps> = ({ units, onOpenReportModal }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedUnit, setSelectedUnit] = useState<CompanyUnit | null>(null);

  const filteredUnits = units.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          u.commander.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          u.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
        <div>
          <h2 className="text-base font-bold text-slate-900">Company & Unit Operational Welfare Breakdown</h2>
          <p className="text-xs text-slate-500 mt-0.5">Monitoring duty loads, night shifts, and fatigue levels across 8 Companies</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search company or commander..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-56"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold text-slate-600">
            {['All', 'High Attention Required', 'Elevated Stress', 'Normal'].map(st => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  statusFilter === st ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
                }`}
              >
                {st === 'High Attention Required' ? 'High Risk' : st}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenReportModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Export Audit
          </button>
        </div>
      </div>

      {/* Grid of Company Unit Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {filteredUnits.map((unit) => {
          const highRiskPct = ((unit.highRisk / unit.totalPersonnel) * 100).toFixed(1);
          return (
            <div
              key={unit.id}
              onClick={() => setSelectedUnit(unit)}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md hover:border-blue-300 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
            >
              <div className={`absolute top-0 left-0 right-0 h-1.5 ${
                unit.status === 'High Attention Required' ? 'bg-rose-500' :
                unit.status === 'Elevated Stress' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />

              <div>
                <div className="flex items-start justify-between gap-2 mt-1">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors flex items-center gap-1.5">
                      {unit.name}
                      <span className="text-[10px] bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded font-mono">
                        {unit.code}
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {unit.location}
                    </p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    unit.status === 'High Attention Required' ? 'bg-rose-100 text-rose-700' :
                    unit.status === 'Elevated Stress' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {unit.status}
                  </span>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Personnel Strength</p>
                    <p className="font-bold text-slate-800 text-sm">{unit.totalPersonnel}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">High Stress Count</p>
                    <p className="font-bold text-rose-600 text-sm">{unit.highRisk} ({highRiskPct}%)</p>
                  </div>
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" /> Avg Duty Hours/Wk
                    </span>
                    <span className={`font-bold ${unit.avgDutyHoursPerWeek > 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {unit.avgDutyHoursPerWeek} hrs
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Moon className="w-3.5 h-3.5 text-slate-400" /> Night Shift Ratio
                    </span>
                    <span className={`font-bold ${unit.nightShiftPercentage > 60 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {unit.nightShiftPercentage}%
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600 text-[11px]">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> Pending Leave Requests
                    </span>
                    <span className="font-bold text-slate-800">
                      {unit.leaveDeficitCount}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-blue-600 font-semibold group-hover:text-blue-700">
                <span>Commander: {unit.commander}</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Unit Detail Modal */}
      {selectedUnit && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold ${
                  selectedUnit.status === 'High Attention Required' ? 'bg-rose-600' :
                  selectedUnit.status === 'Elevated Stress' ? 'bg-amber-500' : 'bg-emerald-600'
                }`}>
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                    {selectedUnit.name} ({selectedUnit.code})
                  </h3>
                  <p className="text-xs text-slate-500">Commander: {selectedUnit.commander} • {selectedUnit.location}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedUnit(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">Low Risk Personnel</p>
                <p className="text-xl font-bold text-emerald-600 mt-0.5">{selectedUnit.lowRisk}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {((selectedUnit.lowRisk / selectedUnit.totalPersonnel) * 100).toFixed(1)}% of unit
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">Moderate Risk Personnel</p>
                <p className="text-xl font-bold text-amber-600 mt-0.5">{selectedUnit.moderateRisk}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {((selectedUnit.moderateRisk / selectedUnit.totalPersonnel) * 100).toFixed(1)}% of unit
                </p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <p className="text-[11px] text-slate-500 font-medium">High Risk Personnel</p>
                <p className="text-xl font-bold text-rose-600 mt-0.5">{selectedUnit.highRisk}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {((selectedUnit.highRisk / selectedUnit.totalPersonnel) * 100).toFixed(1)}% of unit
                </p>
              </div>
            </div>

            <div className="space-y-3 bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">Welfare Diagnostic Summary</h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-500 font-medium">Weekly Duty Hour Average:</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedUnit.avgDutyHoursPerWeek} Hours / Week</p>
                  <p className="text-[10px] text-slate-400">Target Benchmark: &lt; 50 Hours</p>
                </div>
                <div>
                  <p className="text-slate-500 font-medium">Night Duty Density:</p>
                  <p className="font-bold text-slate-800 text-sm">{selectedUnit.nightShiftPercentage}% Shift Volume</p>
                  <p className="text-[10px] text-slate-400">Target Benchmark: &lt; 35%</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedUnit(null)}
                className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold rounded-xl text-xs"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  setSelectedUnit(null);
                  onOpenReportModal();
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                Generate Unit Audit Report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
