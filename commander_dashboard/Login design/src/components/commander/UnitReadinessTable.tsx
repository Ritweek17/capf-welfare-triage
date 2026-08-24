import React, { useState } from 'react';
import type { UnitReadinessRecord, UnitStatus } from '../../types/commander';
import { Search, ArrowUpDown, TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react';

interface UnitReadinessTableProps {
  records: UnitReadinessRecord[];
  selectedStatus?: string;
  onSelectUnit: (unit: UnitReadinessRecord) => void;
}

export const UnitReadinessTable: React.FC<UnitReadinessTableProps> = ({
  records,
  selectedStatus,
  onSelectUnit,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof UnitReadinessRecord>('code');
  const [sortAsc, setSortAsc] = useState(true);

  // Filter records
  const filteredRecords = records.filter((r) => {
    const matchesStatus =
      !selectedStatus || selectedStatus === 'all' ? true : r.status === selectedStatus;
    const matchesSearch =
      r.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Sort records
  const sortedRecords = [...filteredRecords].sort((a, b) => {
    const valA = a[sortField];
    const valB = b[sortField];
    if (typeof valA === 'number' && typeof valB === 'number') {
      return sortAsc ? valA - valB : valB - valA;
    }
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return 0;
  });

  const handleSort = (field: keyof UnitReadinessRecord) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const statusBadgeStyles: Record<UnitStatus, string> = {
    stable: 'text-[#70873B] dark:text-[#C9DFA0] bg-[#70873B]/10 dark:bg-[#C9DFA0]/15 border-[#70873B]/20 dark:border-[#C9DFA0]/30',
    moderate: 'text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 border-[#C58A2B]/20 dark:border-[#C4A56A]/30',
    elevated: 'text-[#C58A2B] dark:text-[#C4A56A] bg-[#C58A2B]/10 dark:bg-[#C4A56A]/15 border-[#C58A2B]/20 dark:border-[#C4A56A]/30',
    critical: 'text-[#C85A54] dark:text-[#C77A7A] bg-[#C85A54]/10 dark:bg-[#C77A7A]/15 border-[#C85A54]/20 dark:border-[#C77A7A]/30',
  };

  return (
    <section className="bg-white dark:bg-[#152235] border border-[#E0E7D8] dark:border-[#29384D] rounded-[17px] p-6 shadow-xs font-sans space-y-4 transition-colors duration-250">
      {/* Table Top Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E0E7D8]/60 dark:border-[#29384D]/80 pb-4">
        <div>
          <span className="text-[11px] font-mono font-bold text-[#70873B] dark:text-[#C9DFA0] uppercase tracking-widest block">
            UNIT READINESS
          </span>
          <p className="text-xs text-[#667085] dark:text-[#9AA8B8] mt-0.5">
            Detailed aggregate readiness indicators across monitored units
          </p>
        </div>

        {/* Search Filter Box */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#89947F] dark:text-[#7F8C9B] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search units..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#F8FAF5] dark:bg-[#101A2A] border border-[#E0E7D8] dark:border-[#29384D] rounded-xl pl-9 pr-3 py-2 text-xs text-[#0B1830] dark:text-[#E8EEF5] placeholder:text-[#89947F] dark:placeholder:text-[#7F8C9B] focus:outline-none focus:border-[#70873B]/50 dark:focus:border-[#C9DFA0]/50"
          />
        </div>
      </div>

      {/* Spacious Polished Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-[#E0E7D8] dark:border-[#29384D] text-[10px] font-mono text-[#667085] dark:text-[#9AA8B8] uppercase tracking-wider">
              <th
                onClick={() => handleSort('code')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#0B1830] dark:hover:text-[#E8EEF5] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>UNIT</span>
                  <ArrowUpDown className="w-3 h-3 text-[#89947F] dark:text-[#7F8C9B]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('wellbeing')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#0B1830] dark:hover:text-[#E8EEF5] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>WELLBEING</span>
                  <ArrowUpDown className="w-3 h-3 text-[#89947F] dark:text-[#7F8C9B]" />
                </div>
              </th>
              <th
                onClick={() => handleSort('readiness')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#0B1830] dark:hover:text-[#E8EEF5] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>READINESS</span>
                  <ArrowUpDown className="w-3 h-3 text-[#89947F] dark:text-[#7F8C9B]" />
                </div>
              </th>
              <th className="py-3.5 px-4 font-semibold">TREND</th>
              <th
                onClick={() => handleSort('status')}
                className="py-3.5 px-4 font-semibold cursor-pointer hover:text-[#0B1830] dark:hover:text-[#E8EEF5] transition-colors"
              >
                <div className="flex items-center gap-1">
                  <span>STATUS</span>
                  <ArrowUpDown className="w-3 h-3 text-[#89947F] dark:text-[#7F8C9B]" />
                </div>
              </th>
              <th className="py-3.5 px-4 text-right">ACTION</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E7D8]/60 dark:divide-[#29384D]/80">
            {sortedRecords.map((row) => {
              const isUp = row.trend === 'up';
              const isDown = row.trend === 'down';
              const badgeStyle = statusBadgeStyles[row.status];

              return (
                <tr
                  key={row.id}
                  onClick={() => onSelectUnit(row)}
                  className="hover:bg-[#F8FAF5] dark:hover:bg-[#101A2A] transition-colors cursor-pointer group"
                >
                  {/* Unit Code */}
                  <td className="py-4 px-4 font-extrabold text-[#0B1830] dark:text-[#E8EEF5] font-sans group-hover:text-[#70873B] dark:group-hover:text-[#C9DFA0] transition-colors">
                    {row.code}
                  </td>

                  {/* Wellbeing Index */}
                  <td className="py-4 px-4 font-mono font-bold text-[#0B1830] dark:text-[#E8EEF5]">
                    {row.wellbeing}%
                  </td>

                  {/* Readiness Index */}
                  <td className="py-4 px-4 font-mono font-bold text-[#0B1830] dark:text-[#E8EEF5]">
                    {row.readiness}%
                  </td>

                  {/* Trend Indicator */}
                  <td className="py-4 px-4">
                    <div
                      className={`inline-flex items-center gap-1 text-[11px] font-mono font-semibold ${
                        isUp
                          ? 'text-[#70873B] dark:text-[#C9DFA0]'
                          : isDown
                          ? 'text-[#C85A54] dark:text-[#C77A7A]'
                          : 'text-[#667085] dark:text-[#9AA8B8]'
                      }`}
                    >
                      {isUp && <TrendingUp className="w-3 h-3" />}
                      {isDown && <TrendingDown className="w-3 h-3" />}
                      {!isUp && !isDown && <Minus className="w-3 h-3" />}
                      <span>{row.trendValue}</span>
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${badgeStyle}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Action Link */}
                  <td className="py-4 px-4 text-right">
                    <span className="text-[#70873B] dark:text-[#C9DFA0] group-hover:underline font-semibold inline-flex items-center gap-1 text-xs">
                      View <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};
