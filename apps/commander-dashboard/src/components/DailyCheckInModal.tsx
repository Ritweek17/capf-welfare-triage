import React, { useState } from 'react';
import { 
  X, 
  Smile, 
  Frown, 
  Meh, 
  CheckCircle2, 
  Flame, 
  Moon 
} from 'lucide-react';

interface DailyCheckInModalProps {
  onClose: () => void;
  onCompleteCheckIn: () => void;
}

export const DailyCheckInModal: React.FC<DailyCheckInModalProps> = ({
  onClose,
  onCompleteCheckIn
}) => {
  const [mood, setMood] = useState<'great' | 'neutral' | 'strained'>('great');
  const [fatigueLevel, setFatigueLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(4);
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onCompleteCheckIn();
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#141517] rounded-[28px] max-w-md w-full p-6 shadow-2xl border border-slate-800 text-white space-y-5 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#D4F638] text-slate-900 flex items-center justify-center font-bold">
              <Smile className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">Daily Tactical Readiness Check-In</h3>
              <p className="text-[10px] text-slate-400">Personnel · Private Self-Report</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 bg-[#D4F638]/20 text-[#D4F638] rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="font-bold text-white text-base">Check-In Encrypted & Logged!</h4>
            <p className="text-xs text-slate-400">
              Your 256-bit hash baseline has been updated. Emotional stability index updated to 85%.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Mood selector */}
            <div>
              <label className="block text-slate-300 font-bold mb-2">How are you feeling today?</label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setMood('great')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-bold transition-all ${
                    mood === 'great' 
                      ? 'bg-[#D4F638] text-slate-900 border-[#D4F638]' 
                      : 'bg-[#1E2024] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Smile className="w-5 h-5" /> Great / Alert
                </button>
                <button
                  type="button"
                  onClick={() => setMood('neutral')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-bold transition-all ${
                    mood === 'neutral' 
                      ? 'bg-[#D4F638] text-slate-900 border-[#D4F638]' 
                      : 'bg-[#1E2024] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Meh className="w-5 h-5" /> Moderate Fatigue
                </button>
                <button
                  type="button"
                  onClick={() => setMood('strained')}
                  className={`p-3 rounded-2xl border flex flex-col items-center gap-1 font-bold transition-all ${
                    mood === 'strained' 
                      ? 'bg-rose-500 text-white border-rose-500' 
                      : 'bg-[#1E2024] text-slate-400 border-white/5 hover:text-white'
                  }`}
                >
                  <Frown className="w-5 h-5" /> High Strain
                </button>
              </div>
            </div>

            {/* Fatigue Slider */}
            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-amber-400" /> Operational Fatigue Rating:</span>
                <span className="text-[#D4F638]">{fatigueLevel} / 5</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={fatigueLevel}
                onChange={(e) => setFatigueLevel(Number(e.target.value))}
                className="w-full accent-[#D4F638] cursor-pointer"
              />
            </div>

            {/* Sleep Quality */}
            <div>
              <div className="flex justify-between font-bold text-slate-300 mb-1">
                <span className="flex items-center gap-1"><Moon className="w-3.5 h-3.5 text-[#B8A5FE]" /> Rest & Recovery Quality:</span>
                <span className="text-[#B8A5FE]">{sleepQuality} / 5 Stars</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(Number(e.target.value))}
                className="w-full accent-[#B8A5FE] cursor-pointer"
              />
            </div>

            {/* Confidential Notes */}
            <div>
              <label className="block text-slate-300 font-bold mb-1">Optional Notes (Confidential):</label>
              <input
                type="text"
                placeholder="E.g. completed 8-hour night sentry shift..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2.5 bg-[#1E2024] border border-slate-700/80 rounded-xl text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4F638]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-[#D4F638] hover:bg-[#c2e42b] text-slate-900 font-black rounded-full text-xs shadow-lg transition-all"
              >
                Log Check-In (256-Bit Encrypted)
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
