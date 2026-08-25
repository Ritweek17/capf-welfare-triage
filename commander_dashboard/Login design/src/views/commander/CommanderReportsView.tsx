import React, { useState } from 'react';
import { FileText, Download, CheckCircle, Clock, Calendar } from 'lucide-react';

interface ReportItem {
  id: string;
  title: string;
  category: string;
  dateRange: string;
  generatedDate: string;
  status: 'Ready' | 'Generating';
  fileSize: string;
}

const MOCK_REPORTS: ReportItem[] = [
  {
    id: 'rep-01',
    title: 'Sector Wellbeing & Readiness Executive Summary',
    category: 'Sector Wellbeing Summary',
    dateRange: 'Past 30 Days',
    generatedDate: '24 Aug 2026, 08:00 AM',
    status: 'Ready',
    fileSize: '2.4 MB PDF',
  },
  {
    id: 'rep-02',
    title: 'Operational Readiness & Shift Load Audit',
    category: 'Operational Readiness Report',
    dateRange: 'Past 14 Days',
    generatedDate: '23 Aug 2026, 18:30 PM',
    status: 'Ready',
    fileSize: '1.8 MB PDF',
  },
  {
    id: 'rep-03',
    title: 'Longitudinal Stress Trajectory Analysis',
    category: '30-Day Trend Analysis',
    dateRange: 'Past 90 Days',
    generatedDate: '20 Aug 2026, 09:15 AM',
    status: 'Ready',
    fileSize: '4.1 MB PDF',
  },
  {
    id: 'rep-04',
    title: 'Unit-Level Aggregate Welfare Index Breakdown',
    category: 'Unit Readiness Summary',
    dateRange: 'Past 7 Days',
    generatedDate: '18 Aug 2026, 12:00 PM',
    status: 'Ready',
    fileSize: '1.2 MB PDF',
  },
];

export const CommanderReportsView: React.FC = () => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    setTimeout(() => {
      setDownloadingId(null);
    }, 1200);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#70873B] dark:text-[#C9DFA0]" />
            <h1 className="text-xl font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans">
              Sector Intelligence Reports
            </h1>
          </div>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-1">
            Automated sector wellbeing briefings, readiness audits, and trend analysis reports ready for review or distribution.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] bg-[#F1F5E9] dark:bg-[#101A2A] px-3.5 py-2 rounded-xl border border-[#E0E7D8] dark:border-[#29384D]">
          <Calendar className="w-4 h-4" />
          <span>4 Reports Generated</span>
        </div>
      </div>

      {/* Reports Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_REPORTS.map((report) => (
          <div
            key={report.id}
            className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs hover:shadow-sm transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-wider">
                  {report.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3" /> {report.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-[#0B1830] dark:text-[#E8EEF5] font-sans">
                {report.title}
              </h3>

              <div className="flex items-center gap-3 text-xs text-[#667085] dark:text-[#9AA8B8] font-mono pt-1">
                <span>Range: {report.dateRange}</span>
                <span>•</span>
                <span>Size: {report.fileSize}</span>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E0E7D8]/60 dark:border-[#29384D]/80 flex items-center justify-between text-xs">
              <span className="text-[11px] text-[#89947F] dark:text-[#7F8C9B] font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" /> {report.generatedDate}
              </span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownload(report.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#70873B] dark:bg-[#C9DFA0] hover:bg-[#4B7361] dark:hover:bg-[#7FA68A] text-white dark:text-[#0D1522] font-bold text-xs transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{downloadingId === report.id ? 'Downloading...' : 'Download'}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
