import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  CheckCircle 
} from 'lucide-react';
import type { WelfareReport, DateRangeOption, CompanyUnit } from '../types';

interface ReportsViewProps {
  reports: WelfareReport[];
  units: CompanyUnit[];
  dateRange: DateRangeOption;
  selectedCompany: string;
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  reports,
  units,
  dateRange,
  selectedCompany
}) => {
  const [selectedReportType, setSelectedReportType] = useState<string>('Monthly CAPF Unit Welfare & Operational Fatigue Audit');
  const [reportFormat, setReportFormat] = useState<'PDF' | 'CSV'>('CSV');
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleGenerateAndDownload = (title: string, format: 'PDF' | 'CSV') => {
    setIsGenerating(true);
    setDownloadSuccess(null);

    setTimeout(() => {
      // Build dynamic content for CSV/Text download
      const timestamp = new Date().toISOString().split('T')[0];
      let csvContent = `CAPF WELFARE & OPERATIONAL READINESS REPORT\n`;
      csvContent += `Generated On: ${new Date().toLocaleString()}\n`;
      csvContent += `Scope: ${selectedCompany} | Filter: ${dateRange}\n`;
      csvContent += `--------------------------------------------------------\n\n`;
      csvContent += `COMPANY,TOTAL PERSONNEL,LOW RISK,MODERATE RISK,HIGH RISK,AVG DUTY HRS/WK,NIGHT SHIFT %,PENDING LEAVE\n`;

      units.forEach(u => {
        csvContent += `"${u.name}",${u.totalPersonnel},${u.lowRisk},${u.moderateRisk},${u.highRisk},${u.avgDutyHoursPerWeek},${u.nightShiftPercentage}%,${u.leaveDeficitCount}\n`;
      });

      // Trigger standard browser download
      const blob = new Blob([csvContent], { type: format === 'CSV' ? 'text/csv' : 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${timestamp}.${format.toLowerCase()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      setIsGenerating(false);
      setDownloadSuccess(`Successfully exported "${title}" as ${format}`);
      setTimeout(() => setDownloadSuccess(null), 4000);
    }, 800);
  };

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">CAPF Welfare Audit & Readiness Reports</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Generate compliance reports for Brigade HQ, Ministry of Home Affairs, and Unit Welfare Boards
          </p>
        </div>

        {downloadSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {downloadSuccess}
          </div>
        )}
      </div>

      {/* Main Builder & Templates Grid */}
      <div className="grid grid-cols-12 gap-6">
        
        {/* Custom Report Generator Card */}
        <div className="col-span-5 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Custom Report Builder</h3>
            <p className="text-xs text-slate-500 mt-0.5">Select parameters to compile a customized welfare audit</p>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Report Template:</label>
              <select
                value={selectedReportType}
                onChange={(e) => setSelectedReportType(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
              >
                <option value="Monthly CAPF Unit Welfare & Operational Fatigue Audit">Monthly Unit Welfare & Operational Fatigue Audit</option>
                <option value="High Duty Hours & Rest Cycle Deficit Assessment">High Duty Hours & Rest Cycle Deficit Assessment</option>
                <option value="Leave Processing & Pending Request Backlog Audit">Leave Processing & Pending Request Backlog Audit</option>
                <option value="Welfare Intervention & Tele-Counseling Utilization Log">Welfare Intervention & Tele-Counseling Utilization Log</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Target Scope:</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center justify-between">
                <span>{selectedCompany}</span>
                <span className="text-[10px] text-blue-600 font-bold bg-blue-50 px-2 py-0.5 rounded">Active Filter</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Date Span:</label>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium flex items-center justify-between">
                <span>{dateRange}</span>
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Export Format:</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setReportFormat('CSV')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    reportFormat === 'CSV' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4" /> CSV Data Sheet
                </button>
                <button
                  type="button"
                  onClick={() => setReportFormat('PDF')}
                  className={`p-3 rounded-xl border flex items-center justify-center gap-2 font-bold transition-all ${
                    reportFormat === 'PDF' 
                      ? 'bg-blue-50 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' 
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <FileText className="w-4 h-4" /> Formatted Text/PDF
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => handleGenerateAndDownload(selectedReportType, reportFormat)}
              disabled={isGenerating}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs shadow-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isGenerating ? (
                <>Compiling Data...</>
              ) : (
                <>
                  <Download className="w-4 h-4" /> Generate & Download Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Existing Pre-Compiled Reports List */}
        <div className="col-span-7 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Archived Audit Reports</h3>

          <div className="space-y-3">
            {reports.map((rep) => (
              <div 
                key={rep.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex items-start justify-between gap-4 group"
              >
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 mt-0.5 font-bold">
                    {rep.format === 'CSV' ? <FileSpreadsheet className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">
                      {rep.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{rep.summary}</p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-2 font-medium">
                      <span>Type: <strong className="text-slate-600">{rep.type}</strong></span>
                      <span>•</span>
                      <span>Generated: {rep.generatedDate}</span>
                      <span>•</span>
                      <span>{rep.fileSize}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleGenerateAndDownload(rep.title, rep.format)}
                  className="p-2.5 bg-slate-50 hover:bg-blue-50 text-slate-600 hover:text-blue-700 border border-slate-200 rounded-xl shrink-0 transition-colors"
                  title="Download Archived Report"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
