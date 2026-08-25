import React, { useState } from 'react';
import { 
  BookOpen, 
  PhoneCall, 
  FileText, 
  Heart, 
  CheckSquare, 
  ExternalLink, 
  Search,
  ShieldCheck,
  Phone
} from 'lucide-react';
import type { DirectoryResource } from '../types';

interface ResourceDirectoryViewProps {
  resources: DirectoryResource[];
}

export const ResourceDirectoryView: React.FC<ResourceDirectoryViewProps> = ({ resources }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [callModal, setCallModal] = useState<DirectoryResource | null>(null);

  const categories = ['All', 'Emergency Counseling', 'Policy & SOPs', 'Family Welfare', 'Commander Tools'];

  const filteredResources = resources.filter(res => {
    const matchesSearch = res.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          res.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || res.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="p-8 space-y-6 max-w-7xl w-full mx-auto">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <h2 className="text-base font-bold text-slate-900">CAPF Welfare Resource Directory & Guidelines</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Access tele-counseling support lines, fatigue mitigation SOPs, and family welfare support systems
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search guidelines or helpline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-60"
            />
          </div>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-xl text-xs font-semibold text-slate-700 w-fit">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg transition-all ${
              activeCategory === cat ? 'bg-white text-slate-900 shadow-2xs font-bold' : 'hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Resource Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredResources.map(res => (
          <div 
            key={res.id}
            className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                    {res.iconName === 'PhoneCall' && <PhoneCall className="w-5 h-5" />}
                    {res.iconName === 'FileText' && <FileText className="w-5 h-5" />}
                    {res.iconName === 'Heart' && <Heart className="w-5 h-5" />}
                    {res.iconName === 'CheckSquare' && <CheckSquare className="w-5 h-5" />}
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase">
                      {res.category}
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm mt-1 group-hover:text-blue-600 transition-colors">
                      {res.title}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">{res.description}</p>

              {res.contactNumber && (
                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-mono text-slate-800">
                  <span className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-600" />
                    <strong>{res.contactNumber}</strong>
                  </span>
                  <span className="text-[10px] text-emerald-600 font-sans font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    24/7 Available
                  </span>
                </div>
              )}
            </div>

            <div className="pt-2">
              <button
                onClick={() => setCallModal(res)}
                className="w-full py-2.5 px-4 bg-slate-50 hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 text-slate-700 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
              >
                <span>{res.linkText}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Resource Action Modal */}
      {callModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 border border-slate-200 animate-scale-in">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">{callModal.title}</h3>
                <p className="text-xs text-slate-500">{callModal.category}</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{callModal.description}</p>

            {callModal.contactNumber && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center font-mono font-bold text-emerald-900 text-sm">
                Direct Line: {callModal.contactNumber}
              </div>
            )}

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setCallModal(null)}
                className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-xl text-xs hover:bg-blue-700 transition-colors"
              >
                Close Resource Window
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
