import React, { useState } from 'react';
import { X, Link2, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface LinkTicketModalProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
}

export const LinkTicketModal: React.FC<LinkTicketModalProps> = ({
  isOpen,
  jobId,
  onClose,
}) => {
  const { jobs, linkUblTicket } = useERP();
  const [ticketNo, setTicketNo] = useState('');

  if (!isOpen || !jobId) return null;

  const job = jobs.find((j) => j.id === jobId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketNo.trim()) return;

    linkUblTicket(jobId, ticketNo.trim());
    setTicketNo('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link2 className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Link UBL Ticket to Job</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div className="text-[11px] text-slate-400">Target HERE4U Job ID:</div>
            <div className="text-sm font-mono font-bold text-emerald-400 mt-0.5">
              {job?.id}
            </div>
            <div className="text-xs text-slate-300 mt-1">{job?.title}</div>
            <div className="mt-2 text-[10px] text-slate-400">
              Current Ticket Status:{' '}
              <span className="font-semibold text-amber-400">
                {job?.ublTicketNo || 'Pending / Unlinked'}
              </span>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Official UBL Ticket Number <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. UBL-HD-99412"
              value={ticketNo}
              onChange={(e) => setTicketNo(e.target.value)}
              required
              autoFocus
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
            />
          </div>

          <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-lg p-2.5 flex items-start space-x-2 text-[11px] text-emerald-300">
            <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold">Core System Rule:</span> Linking this ticket
              preserves the single permanent Job ID without generating any duplicate job records.
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow flex items-center space-x-1.5 transition"
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Link Ticket Now</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
