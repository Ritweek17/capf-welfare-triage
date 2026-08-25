import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  AlertCircle, 
  UserCheck, 
  CheckCircle 
} from 'lucide-react';
import type { AlertItem, UserRole } from '../types';

interface AlertModalProps {
  alert: AlertItem;
  role: UserRole;
  onClose: () => void;
  onUpdateStatus: (alertId: string, status: 'New' | 'Under Review' | 'Mitigated') => void;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  alert,
  onClose,
  onUpdateStatus
}) => {
  const [assignedOfficer, setAssignedOfficer] = useState(alert.assignedOfficer || 'Insp. R. Sharma (Welfare Officer)');
  const [interventionNote, setInterventionNote] = useState('');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleAction = (status: 'Under Review' | 'Mitigated', msg: string) => {
    onUpdateStatus(alert.id, status);
    setActionSuccess(msg);
    setTimeout(() => {
      setActionSuccess(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 border border-slate-200 animate-scale-in">
        
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-white ${
              alert.level === 'High' ? 'bg-rose-600' : 'bg-amber-500'
            }`}>
              {alert.level === 'High' ? <AlertTriangle className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">{alert.title}</h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  alert.level === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-800'
                }`}>
                  {alert.level} Priority
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{alert.unit} • Reported {alert.time}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {actionSuccess && (
          <div className="bg-emerald-50 text-emerald-800 border border-emerald-200 p-3 rounded-xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            {actionSuccess}
          </div>
        )}

        {/* Content */}
        <div className="space-y-4 text-xs">
          <div className="p-3.5 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
            <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Description & Root Cause:</p>
            <p className="text-slate-700 leading-relaxed">{alert.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Primary Factor</p>
              <p className="font-bold text-slate-800 mt-0.5">{alert.primaryFactor}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] text-slate-400 font-bold uppercase">Current Status</p>
              <p className="font-bold text-blue-600 mt-0.5">{alert.status}</p>
            </div>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Assigned Welfare Officer:</label>
            <select
              value={assignedOfficer}
              onChange={(e) => setAssignedOfficer(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Insp. R. Sharma (Welfare Officer)">Insp. R. Sharma (Welfare Officer)</option>
              <option value="Sub-Insp. V. Kumar (Welfare Specialist)">Sub-Insp. V. Kumar (Welfare Specialist)</option>
              <option value="Capt. A. Singh (Medical & Rest Coordinator)">Capt. A. Singh (Medical & Rest Coordinator)</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-bold mb-1">Intervention / Rest Recommendation Log:</label>
            <textarea
              rows={3}
              placeholder="Enter recommended shift reallocation or rest advisory notes..."
              value={interventionNote}
              onChange={(e) => setInterventionNote(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => handleAction('Under Review', 'Alert assigned to Welfare Officer for rotation review.')}
            className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-800 border border-purple-200 font-bold rounded-xl text-xs flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            Assign & Set Under Review
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAction('Mitigated', 'Alert marked as resolved & rest cycle dispatched.')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle className="w-3.5 h-3.5" />
              Dispatch Rest & Mitigate
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
