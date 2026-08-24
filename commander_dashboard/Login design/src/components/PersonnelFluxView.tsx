import React, { useState } from 'react';
import { 
  Shield, 
  Activity, 
  Moon, 
  Heart, 
  Flame, 
  Bell, 
  Search, 
  ChevronDown, 
  Calendar, 
  Smile, 
  Sparkles, 
  FileText, 
  MessageSquare, 
  Compass,
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { CounselorChatModal } from './CounselorChatModal';
import { DailyCheckInModal } from './DailyCheckInModal';

interface PersonnelFluxViewProps {
  onSwitchToCommander?: () => void;
}

export const PersonnelFluxView: React.FC<PersonnelFluxViewProps> = ({ onSwitchToCommander }) => {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showCounselorModal, setShowCounselorModal] = useState(false);
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [leaveRequested, setLeaveRequested] = useState(false);
  const [dateFilter, setDateFilter] = useState('Today');

  const handleLeaveRequest = () => {
    setLeaveRequested(true);
    setTimeout(() => setLeaveRequested(false), 3000);
  };

  return (
    <div className="flex h-screen bg-[#EBECEF] p-5 font-sans text-slate-800 antialiased overflow-hidden select-none">
      
      {/* Outer App Frame with Rounded Window */}
      <div className="flex w-full h-full bg-white rounded-[32px] overflow-hidden shadow-2xl border border-slate-200/60">
        
        {/* ================= 1. DARK SIDEBAR ================= */}
        <aside className="w-60 bg-[#141517] text-white flex flex-col justify-between p-5 shrink-0">
          <div>
            {/* Logo & App Switcher */}
            <div className="flex items-center justify-between px-2 py-3 mb-4 border-b border-slate-800/80">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-xl bg-[#D4F638] flex items-center justify-center text-black font-black text-xs shadow-md shadow-[#D4F638]/20">
                  <Shield className="w-4 h-4 fill-black" />
                </div>
                <span className="font-bold tracking-tight text-sm text-white">CENTURION</span>
              </div>

              {onSwitchToCommander && (
                <button
                  onClick={onSwitchToCommander}
                  className="text-[10px] font-bold bg-white/10 hover:bg-[#D4F638] hover:text-black px-2 py-1 rounded-lg text-slate-300 transition-all"
                  title="Switch to Commander HQ View"
                >
                  HQ
                </button>
              )}
            </div>

            {/* Nav Items */}
            <nav className="space-y-1.5">
              <button 
                onClick={() => setActiveTab('Overview')}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-full font-semibold text-xs transition-all ${
                  activeTab === 'Overview'
                    ? 'bg-white text-slate-900 shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Activity className="w-4 h-4" />
                  <span>Overview</span>
                </div>
                <span className="w-5 h-5 rounded-full bg-[#D4F638] text-black text-[10px] font-bold flex items-center justify-center">
                  1
                </span>
              </button>

              {[
                { name: 'Daily Check-In', icon: Smile, action: () => setShowCheckInModal(true) },
                { name: 'Recovery & Sleep', icon: Moon, action: () => setActiveTab('Recovery & Sleep') },
                { name: 'Duty History', icon: Compass, action: () => setActiveTab('Duty History') },
                { name: 'Medical & Leave', icon: FileText, action: () => setActiveTab('Medical & Leave') },
                { name: 'Officer Help', icon: MessageSquare, action: () => setShowCounselorModal(true) },
              ].map((item) => {
                const isActive = activeTab === item.name;
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={item.action}
                    className={`w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full font-medium text-xs transition-colors ${
                      isActive
                        ? 'bg-white/20 text-white font-bold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Bottom Card - Support Shield */}
          <div className="bg-[#1D1E22] rounded-2xl p-4 border border-white/5 text-center relative overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-[#D4F638]/20 flex items-center justify-center text-[#D4F638] mx-auto mb-2">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-white">Anonymous Care</p>
            <p className="text-[10px] text-slate-400 mt-0.5 mb-3 leading-relaxed">
              Confidential check-ins protected by 256-bit hash.
            </p>
            <button 
              onClick={() => setShowCounselorModal(true)}
              className="w-full py-2 bg-[#D4F638] text-black font-bold text-[11px] rounded-full hover:brightness-105 transition-all shadow-md shadow-[#D4F638]/20"
            >
              Talk to Counselor
            </button>
          </div>
        </aside>

        {/* ================= 2. MAIN WORKSPACE ================= */}
        <main className="flex-1 flex flex-col bg-[#F3F4F6] overflow-y-auto">
          
          {/* Top Bar */}
          <header className="px-8 py-4 bg-white/70 backdrop-blur-md flex items-center justify-between border-b border-slate-200/50 sticky top-0 z-20">
            {/* User Profile Pill */}
            <div className="flex items-center gap-3 bg-[#F8F9FA] border border-slate-200/80 px-3 py-1.5 rounded-full">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                VS
              </div>
              <div className="text-left pr-2">
                <p className="text-xs font-bold text-slate-900 leading-tight">Sgt. Vikram Singh</p>
                <p className="text-[10px] text-slate-500 font-mono">14th Bn Bravo Co.</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input 
                  type="text" 
                  placeholder="Search logs..." 
                  className="bg-white border border-slate-200/80 rounded-full pl-8 pr-4 py-1.5 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none w-48"
                />
              </div>

              <div className="relative">
                <button 
                  onClick={() => setDateFilter(dateFilter === 'Today' ? 'Past 7 Days' : 'Today')}
                  className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200/80 rounded-full text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  <Calendar className="w-3 h-3 text-slate-500" />
                  <span>{dateFilter}</span>
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>
              </div>

              <button 
                onClick={() => setShowCounselorModal(true)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200/80 flex items-center justify-center text-slate-600 relative hover:bg-slate-50 transition-colors"
                title="Notifications & Counselor Alert"
              >
                <Bell className="w-3.5 h-3.5" />
                <span className="w-2 h-2 rounded-full bg-[#D4F638] absolute top-1 right-1 border-2 border-white" />
              </button>
            </div>
          </header>

          {/* Content Body */}
          <div className="p-8 space-y-5 max-w-6xl w-full mx-auto">
            
            {/* Title & Quick Action */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Tactical Wellness</h1>
                <p className="text-xs text-slate-500 mt-0.5">Track recovery baseline, fatigue load, and mental stamina.</p>
              </div>

              <button
                onClick={() => setShowCheckInModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-[#141517] hover:bg-black text-white font-bold text-xs rounded-full shadow-lg transition-all"
              >
                <Smile className="w-4 h-4 text-[#D4F638]" />
                <span>Log Daily Check-In</span>
              </button>
            </div>

            {/* Render Tab Views */}
            {activeTab === 'Overview' && (
              <>
                {/* TOP ROW: 3 Cards */}
                <div className="grid grid-cols-12 gap-5">
                  
                  {/* Card 1: Operational Energy Used (Bubbles) */}
                  <div className="col-span-5 bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-slate-900" />
                        <span className="text-xs font-bold text-slate-900">Energy & Strain</span>
                      </div>
                      <span className="bg-[#D4F638] text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">+4% vs Base</span>
                    </div>

                    <div className="my-2">
                      <div className="text-3xl font-black text-slate-900 tracking-tight">
                        4,120 <span className="text-xs text-slate-400 font-semibold">kcal load</span>
                      </div>
                    </div>

                    {/* Overlapping Bubble Infographic */}
                    <div className="relative h-32 my-1 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-[#B8A5FE] flex flex-col items-center justify-center text-slate-900 font-bold z-10 shadow-lg -mr-4 transform hover:scale-105 transition-transform cursor-pointer">
                        <span className="text-base font-black leading-tight">2.4k</span>
                        <span className="text-[10px] opacity-75 font-semibold">Duty Load</span>
                      </div>
                      <div className="w-20 h-20 rounded-full bg-[#141517] text-white flex flex-col items-center justify-center z-20 shadow-md transform hover:scale-105 transition-transform cursor-pointer">
                        <span className="text-sm font-black leading-tight">1.2k</span>
                        <span className="text-[9px] text-slate-400 font-medium">Patrol</span>
                      </div>
                      <div className="w-14 h-14 rounded-full bg-[#D4F638] text-slate-900 flex flex-col items-center justify-center -ml-3 z-30 font-bold shadow-md transform hover:scale-105 transition-transform cursor-pointer">
                        <span className="text-xs font-black">520</span>
                        <span className="text-[8px] font-semibold">Drills</span>
                      </div>
                    </div>

                    {/* Horizontal Progress Bars */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>48% Field Patrol</span>
                          <span className="w-2 h-2 rounded-full bg-[#B8A5FE]" />
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#B8A5FE] rounded-full" style={{ width: '48%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>32% Tactical Drills</span>
                          <span className="w-2 h-2 rounded-full bg-[#141517]" />
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#141517] rounded-full" style={{ width: '32%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-[11px] font-semibold text-slate-600 mb-1">
                          <span>20% Guard & Sentry</span>
                          <span className="w-2 h-2 rounded-full bg-[#D4F638]" />
                        </div>
                        <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-[#D4F638] rounded-full" style={{ width: '20%' }} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2: Biometrics & Activity (Middle Column) */}
                  <div className="col-span-3 space-y-4 flex flex-col justify-between">
                    
                    {/* Heart Rate Card */}
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs flex-1 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Heart className="w-3.5 h-3.5 text-rose-500" /> Vitals
                        </span>
                        <span className="text-[10px] text-slate-400">Rest: 54 bpm</span>
                      </div>
                      <div className="my-1">
                        <span className="text-3xl font-black text-slate-900">58</span>
                        <span className="text-xs text-slate-400 font-semibold ml-1">bpm</span>
                      </div>
                      <p className="text-[10px] text-emerald-600 font-semibold">Optimal cardio baseline</p>
                    </div>

                    {/* Tactical Movement Card */}
                    <div className="bg-white p-5 rounded-[24px] border border-slate-100 shadow-xs flex-1 flex flex-col justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between text-slate-400">
                        <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                          <Activity className="w-3.5 h-3.5 text-blue-500" /> Movement
                        </span>
                        <span className="text-[10px] text-slate-400">Active: 110 min</span>
                      </div>
                      <div className="my-1">
                        <span className="text-3xl font-black text-slate-900">14.2</span>
                        <span className="text-xs text-slate-400 font-semibold ml-1">km</span>
                      </div>
                      <p className="text-[10px] text-slate-400 font-mono">GPS logged · Sentry + Patrol</p>
                    </div>
                  </div>

                  {/* Card 3: Wellness & Readiness Index (Dot Matrix Grid) */}
                  <div className="col-span-4 bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">Wellness Index</span>
                      <span className="bg-[#D4F638] text-slate-900 text-[10px] font-black px-2 py-0.5 rounded-full">+12%</span>
                    </div>

                    <div className="my-2">
                      <span className="text-4xl font-black text-slate-900">82</span>
                      <span className="text-base text-slate-400 font-bold ml-0.5">%</span>
                    </div>

                    {/* Dot Matrix Heatmap */}
                    <div className="p-3 bg-[#F8F9FB] rounded-2xl border border-slate-100 my-auto">
                      <div className="grid grid-cols-7 gap-2">
                        {[
                          3, 4, 2, 5, 4, 3, 5,
                          4, 5, 3, 5, 5, 4, 5,
                          5, 4, 4, 5, 3, 5, 4,
                          2, 3, 4, 5, 5, 4, 5
                        ].map((val, idx) => (
                          <div 
                            key={idx}
                            className={`w-3 h-3 rounded-full transition-all hover:scale-125 cursor-pointer ${
                              val === 5 ? 'bg-[#B8A5FE]' : 
                              val === 4 ? 'bg-[#D4F638]' : 
                              val === 3 ? 'bg-slate-300' : 'bg-slate-200'
                            }`}
                            title={`Day ${idx + 1}: Score ${val * 20}%`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-500 text-center font-medium mt-1">
                      Consecutive 7-day emotional stability score
                    </p>
                  </div>

                </div>

                {/* BOTTOM ROW: Deep Charcoal Sleep Analysis Card */}
                <div className="bg-[#141517] text-white p-6 rounded-[28px] shadow-xl">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <Moon className="w-4 h-4 text-[#D4F638]" />
                      <span className="text-sm font-bold text-white">Sleep & Recovery Spectrum</span>
                    </div>

                    <button 
                      onClick={() => setActiveTab('Recovery & Sleep')}
                      className="flex items-center gap-1.5 px-3 py-1 bg-[#23252A] rounded-full text-xs font-semibold text-slate-300 hover:text-white transition-colors"
                    >
                      <span>Weekly Breakdown</span>
                      <ArrowRight className="w-3 h-3 text-[#D4F638]" />
                    </button>
                  </div>

                  <div className="grid grid-cols-12 gap-6 items-center">
                    {/* Metric Readouts */}
                    <div className="col-span-4 flex gap-6">
                      <div>
                        <span className="text-3xl font-black text-white">88%</span>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D4F638]" /> Efficiency
                        </p>
                      </div>
                      <div>
                        <span className="text-3xl font-black text-white">7h 40m</span>
                        <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B8A5FE]" /> Rest Duration
                        </p>
                      </div>
                    </div>

                    {/* Stylized Vertical Bar Spectrum */}
                    <div className="col-span-8 flex items-end justify-between gap-3 h-28 px-4 pt-2">
                      {[
                        { day: 'Mon', h1: 'h-12', h2: 'h-8' },
                        { day: 'Tue', h1: 'h-16', h2: 'h-10' },
                        { day: 'Wed', h1: 'h-10', h2: 'h-6' },
                        { day: 'Thu', h1: 'h-24', h2: 'h-16', active: true },
                        { day: 'Fri', h1: 'h-14', h2: 'h-10' },
                        { day: 'Sat', h1: 'h-20', h2: 'h-12' },
                        { day: 'Sun', h1: 'h-16', h2: 'h-8' },
                      ].map((bar) => (
                        <div key={bar.day} className="flex flex-col items-center gap-2 group cursor-pointer">
                          <div className="flex items-end gap-1">
                            <div 
                              className={`w-3.5 rounded-full transition-all ${
                                bar.active ? 'bg-[#D4F638] shadow-lg shadow-[#D4F638]/20' : 'bg-slate-700 group-hover:bg-slate-600'
                              } ${bar.h1}`} 
                            />
                            <div 
                              className={`w-3.5 rounded-full transition-all ${
                                bar.active ? 'bg-[#B8A5FE]' : 'bg-slate-800 group-hover:bg-slate-700'
                              } ${bar.h2}`} 
                            />
                          </div>
                          <span className={`text-[10px] font-mono ${bar.active ? 'text-[#D4F638] font-bold' : 'text-slate-500'}`}>
                            {bar.day}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* TAB 2: Recovery & Sleep Breakdown */}
            {activeTab === 'Recovery & Sleep' && (
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Sleep & HRV Recovery Spectrum</h3>
                    <p className="text-xs text-slate-500">7-day continuous bio-feedback logged from military tactical band</p>
                  </div>
                  <span className="bg-[#D4F638] text-slate-900 font-black text-xs px-3 py-1 rounded-full">
                    HRV Score: 78 ms
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs">
                  <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Deep Sleep Ratio</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">2h 15m</p>
                    <p className="text-emerald-600 font-bold mt-1">Optimal physical muscle repair</p>
                  </div>

                  <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">REM Sleep Ratio</p>
                    <p className="text-2xl font-black text-[#B8A5FE] mt-1">1h 50m</p>
                    <p className="text-purple-600 font-bold mt-1">Cognitive & memory consolidation</p>
                  </div>

                  <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Sleep Window Deficit</p>
                    <p className="text-2xl font-black text-amber-500 mt-1">-35 mins</p>
                    <p className="text-amber-600 font-bold mt-1">Due to 02:00 sentry rotation</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowCheckInModal(true)}
                  className="w-full py-3 bg-[#141517] text-white font-bold rounded-2xl text-xs flex items-center justify-center gap-2 hover:bg-black"
                >
                  <Smile className="w-4 h-4 text-[#D4F638]" />
                  Log Sleep Recovery Feedback
                </button>
              </div>
            )}

            {/* TAB 3: Duty History */}
            {activeTab === 'Duty History' && (
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs space-y-4 animate-fade-in">
                <h3 className="text-base font-bold text-slate-900">Recent Duty Shift & Patrol Log</h3>
                
                <div className="divide-y divide-slate-100 text-xs">
                  {[
                    { date: 'Today 06:00 - 14:00', task: 'Forward Border Patrol Sector 1', strain: 'High Strain (840 kcal)', status: 'Completed' },
                    { date: 'Yesterday 22:00 - 02:00', task: 'Night Sentry Guard Duty', strain: 'Moderate Fatigue', status: 'Completed' },
                    { date: '21 Aug 10:00 - 13:00', task: 'Tactical Reconnaissance Drill', strain: 'Normal Duty Load', status: 'Completed' },
                  ].map((log, idx) => (
                    <div key={idx} className="py-3 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-slate-900">{log.task}</p>
                        <p className="text-[11px] text-slate-400 mt-0.5">{log.date} • {log.strain}</p>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-full text-[10px]">
                        {log.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 4: Medical & Leave */}
            {activeTab === 'Medical & Leave' && (
              <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-xs space-y-5 animate-fade-in">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">Medical Fitness & Annual Leave Portal</h3>
                    <p className="text-xs text-slate-500">Track leave balance, medical certificates, and rest requests</p>
                  </div>

                  {leaveRequested && (
                    <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      Leave Request Submitted to CO!
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Casual Leave Balance</p>
                    <p className="text-2xl font-black text-slate-900 mt-1">14 Days Remaining</p>
                    <p className="text-slate-500 mt-1">Granted: 15 days / year</p>
                  </div>

                  <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-slate-100">
                    <p className="text-slate-400 font-bold uppercase text-[10px]">Medical Fitness Certificate</p>
                    <p className="text-2xl font-black text-emerald-600 mt-1">SHAPE-1 Valid</p>
                    <p className="text-slate-500 mt-1">Next Annual Audit: Oct 2026</p>
                  </div>
                </div>

                <button
                  onClick={handleLeaveRequest}
                  className="w-full py-3 bg-[#D4F638] text-slate-900 font-black rounded-2xl text-xs flex items-center justify-center gap-2 hover:brightness-105 shadow-md"
                >
                  <Plus className="w-4 h-4" />
                  Submit Annual / Rest Leave Application
                </button>
              </div>
            )}

          </div>
        </main>
      </div>

      {/* Counselor Support Chat Modal */}
      {showCounselorModal && (
        <CounselorChatModal onClose={() => setShowCounselorModal(false)} />
      )}

      {/* Daily Check-In Modal */}
      {showCheckInModal && (
        <DailyCheckInModal 
          onClose={() => setShowCheckInModal(false)}
          onCompleteCheckIn={() => setActiveTab('Overview')}
        />
      )}

    </div>
  );
};
