import React, { useState, useEffect } from 'react';
import type {
  DateRangeOption,
  UnitReadinessRecord,
  AttentionItem,
} from '../../types/commander';

import {
  MOCK_SECTOR_HEALTH,
  MOCK_WELLBEING_TREND,
  MOCK_REQUIRES_ATTENTION,
  MOCK_SECTOR_DISTRIBUTION,
  MOCK_UNIT_RECORDS,
} from '../../data/mockCommanderData';

import { ThemeProvider } from '../../context/ThemeContext';
import { CommanderSidebar } from './CommanderSidebar';
import { CommanderTopbar } from './CommanderTopbar';
import { UnitDetailDrawer } from './UnitDetailDrawer';
import { CommanderPrivacyModal } from './CommanderPrivacyPanel';
import { ShieldCheck } from 'lucide-react';

import { CommanderOverviewView } from '../../views/commander/CommanderOverviewView';
import { CommanderReadinessView } from '../../views/commander/CommanderReadinessView';
import { CommanderTrendsView } from '../../views/commander/CommanderTrendsView';
import { CommanderAlertsView } from '../../views/commander/CommanderAlertsView';
import { CommanderReportsView } from '../../views/commander/CommanderReportsView';
import { CommanderSystemView } from '../../views/commander/CommanderSystemView';

interface CommanderDashboardProps {
  onLogout?: () => void;
}

export type CommanderTabId = 'overview' | 'readiness' | 'trends' | 'alerts' | 'reports' | 'status';

const CommanderDashboardContent: React.FC<CommanderDashboardProps> = ({ onLogout }) => {
  const getTabFromHash = (hash: string): CommanderTabId => {
    if (hash === '#commander/readiness') return 'readiness';
    if (hash === '#commander/trends') return 'trends';
    if (hash === '#commander/alerts') return 'alerts';
    if (hash === '#commander/reports') return 'reports';
    if (hash === '#commander/system') return 'status';
    return 'overview';
  };

  const [activeNavTab, setActiveNavTab] = useState<CommanderTabId>(() => {
    if (typeof window !== 'undefined') {
      return getTabFromHash(window.location.hash);
    }
    return 'overview';
  });

  const [dateRange, setDateRange] = useState<DateRangeOption>('30d');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');
  const [selectedUnitRecord, setSelectedUnitRecord] = useState<UnitReadinessRecord | null>(null);
  const [selectedAttentionItem, setSelectedAttentionItem] = useState<AttentionItem | null>(null);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState<boolean>(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Synchronize active view with hash changes (browser Back / Forward / direct URL)
  useEffect(() => {
    const handleHashChange = () => {
      const currentTab = getTabFromHash(window.location.hash);
      setActiveNavTab(currentTab);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleTabChange = (tabId: string) => {
    setActiveNavTab(tabId as CommanderTabId);
  };

  const handleSelectAttentionItem = (item: AttentionItem) => {
    setSelectedAttentionItem(item);
    const matchingUnit = MOCK_UNIT_RECORDS.find((u) => u.code === item.unitCode);
    if (matchingUnit) {
      setSelectedUnitRecord(matchingUnit);
    }
  };

  const handleSelectUnitRecord = (record: UnitReadinessRecord) => {
    setSelectedUnitRecord(record);
    const matchingAttention = MOCK_REQUIRES_ATTENTION.find((a) => a.unitCode === record.code);
    setSelectedAttentionItem(matchingAttention || null);
  };

  const handleCloseDrawer = () => {
    setSelectedUnitRecord(null);
    setSelectedAttentionItem(null);
  };

  return (
    <div className="commander-shell min-h-screen bg-[#F8FAF5] dark:bg-[#0D1522] text-[#0B1830] dark:text-[#E8EEF5] flex font-sans selection:bg-[#E1EFBD] dark:selection:bg-[#26371E] selection:text-[#0B1830] dark:selection:text-[#E8EEF5] transition-colors duration-250">
      {/* Sidebar Navigation */}
      <CommanderSidebar
        activeTab={activeNavTab}
        onTabChange={handleTabChange}
        attentionCount={MOCK_REQUIRES_ATTENTION.length}
        onOpenPrivacyModal={() => setIsPrivacyModalOpen(true)}
        onLogout={onLogout}
        isOpen={isMobileNavOpen}
        onClose={() => setIsMobileNavOpen(false)}
      />

      {isMobileNavOpen && (
        <button className="fixed inset-0 z-20 bg-[#0B1830]/35 lg:hidden" onClick={() => setIsMobileNavOpen(false)} aria-label="Close navigation overlay" />
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <CommanderTopbar
          dateRange={dateRange}
          onDateRangeChange={(range) => setDateRange(range)}
          lastSync={MOCK_SECTOR_HEALTH.lastSync}
          onOpenMenu={() => setIsMobileNavOpen(true)}
        />

        {/* Dynamic View Canvas */}
        <main className="p-5 sm:p-8 max-w-6xl w-full mx-auto">
          {activeNavTab === 'overview' && (
            <CommanderOverviewView
              healthMetrics={MOCK_SECTOR_HEALTH}
              trendData={MOCK_WELLBEING_TREND}
              attentionItems={MOCK_REQUIRES_ATTENTION}
              sectorDistribution={MOCK_SECTOR_DISTRIBUTION}
              unitRecords={MOCK_UNIT_RECORDS}
              selectedStatusFilter={selectedStatusFilter}
              onSelectStatusFilter={setSelectedStatusFilter}
              onSelectAttentionItem={handleSelectAttentionItem}
              onSelectUnitRecord={handleSelectUnitRecord}
            />
          )}

          {activeNavTab === 'readiness' && (
            <CommanderReadinessView
              unitRecords={MOCK_UNIT_RECORDS}
              sectorDistribution={MOCK_SECTOR_DISTRIBUTION}
              onSelectUnitRecord={handleSelectUnitRecord}
            />
          )}

          {activeNavTab === 'trends' && (
            <CommanderTrendsView trendData={MOCK_WELLBEING_TREND} />
          )}

          {activeNavTab === 'alerts' && (
            <CommanderAlertsView
              attentionItems={MOCK_REQUIRES_ATTENTION}
              unitRecords={MOCK_UNIT_RECORDS}
              onSelectUnit={handleSelectAttentionItem}
            />
          )}

          {activeNavTab === 'reports' && <CommanderReportsView />}

          {activeNavTab === 'status' && <CommanderSystemView />}

          {/* Privacy Footnote Badge */}
          <footer className="pt-8 pb-8 mt-8 border-t border-[#E0E7D8] dark:border-[#29384D] flex items-center justify-between text-xs text-[#667085] dark:text-[#9AA8B8] font-mono">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#70873B] dark:text-[#C9DFA0]" />
              <span>Privacy protected · Commander view contains aggregate unit-level insights only.</span>
            </div>
            <span>CENTURION Human Wellbeing Intelligence v2.4</span>
          </footer>
        </main>
      </div>

      {/* Slide-in Unit Detail Drawer */}
      <UnitDetailDrawer
        unitRecord={selectedUnitRecord}
        attentionItem={selectedAttentionItem}
        onClose={handleCloseDrawer}
      />

      {/* Sovereign Privacy Protocol Modal */}
      <CommanderPrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
};

export const CommanderDashboard: React.FC<CommanderDashboardProps> = (props) => {
  return (
    <ThemeProvider>
      <CommanderDashboardContent {...props} />
    </ThemeProvider>
  );
};
