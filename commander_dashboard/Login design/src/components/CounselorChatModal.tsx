import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Lock, 
  Bot, 
  PhoneCall 
} from 'lucide-react';

interface CounselorChatModalProps {
  onClose: () => void;
}

export const CounselorChatModal: React.FC<CounselorChatModalProps> = ({ onClose }) => {
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: 'Jai Hind, Sgt. Vikram Singh. I am your 24/7 confidential welfare assistant. Your conversation is encrypted with 256-bit hash anonymity and is never stored on operational servers. How can I assist your wellbeing today?',
      time: 'Just now'
    }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      time: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput('');

    setTimeout(() => {
      let botReply = 'Thank you for sharing. Rest assured, your duty load metrics and fatigue indices are monitored to protect your readiness. Would you like me to request a mandatory 24-hour rest window recommendation from your Welfare Officer?';
      if (currentInput.toLowerCase().includes('leave') || currentInput.toLowerCase().includes('family')) {
        botReply = 'I can help expedite your pending leave request under the CAPF Emergency Leave Policy. Would you like to flag your pending request for priority review?';
      } else if (currentInput.toLowerCase().includes('sleep') || currentInput.toLowerCase().includes('tired') || currentInput.toLowerCase().includes('fatigue')) {
        botReply = 'Your sleep spectrum indicates 3 consecutive night duty shifts. I recommend activating the post-deployment rest protocol in your unit check-in.';
      }

      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          text: botReply,
          time: 'Just now'
        }
      ]);
    }, 800);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 select-none">
      <div className="bg-[#141517] rounded-[28px] max-w-lg w-full p-6 shadow-2xl border border-slate-800 text-white space-y-4 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4F638] flex items-center justify-center text-slate-900 font-bold shadow-lg shadow-[#D4F638]/20">
              <Sparkles className="w-5 h-5 fill-slate-900" />
            </div>
            <div>
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                Anonymous Welfare Care
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  256-Bit Encrypted
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Confidential Officer & Soldier Support</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anonymity Banner */}
        <div className="bg-[#1D1E22] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-[11px] text-slate-300">
          <span className="flex items-center gap-2 font-medium">
            <Lock className="w-3.5 h-3.5 text-[#D4F638]" />
            Your identity is masked from unit command logs.
          </span>
          <a href="tel:1800112233" className="text-[#D4F638] font-bold flex items-center gap-1 hover:underline">
            <PhoneCall className="w-3 h-3" /> Helpline
          </a>
        </div>

        {/* Message Thread */}
        <div className="h-64 overflow-y-auto space-y-3 pr-1 text-xs">
          {messages.map(msg => (
            <div 
              key={msg.id}
              className={`flex items-start gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'bot' && (
                <div className="w-7 h-7 rounded-xl bg-slate-800 flex items-center justify-center text-[#D4F638] shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div className={`p-3 rounded-2xl max-w-[80%] leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-[#D4F638] text-slate-900 font-medium rounded-tr-xs'
                  : 'bg-[#1E2024] text-slate-200 border border-white/5 rounded-tl-xs'
              }`}>
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                  VS
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="flex items-center gap-2 pt-2 border-t border-slate-800">
          <input
            type="text"
            placeholder="Type your message confidentially..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-[#1E2024] border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#D4F638]"
          />
          <button
            type="submit"
            className="p-2.5 bg-[#D4F638] hover:bg-[#c2e42b] text-slate-900 font-bold rounded-xl transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
};
