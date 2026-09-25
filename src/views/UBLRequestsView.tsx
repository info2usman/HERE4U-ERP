import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Link2,
  CheckCircle2,
  AlertCircle,
  Mail,
  Building2,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { RequestType } from '../types/erp';

interface UBLRequestsViewProps {
  onOpenNewJob: () => void;
  onOpenLinkTicket: (jobId: string) => void;
}

export const UBLRequestsView: React.FC<UBLRequestsViewProps> = ({
  onOpenNewJob,
  onOpenLinkTicket,
}) => {
  const { jobs, branches, openOneJobScreen } = useERP();
  const [filterType, setFilterType] = useState<string>('ALL');

  const pendingTicketJobs = jobs.filter((j) => j.ticketStatus === 'Pending');
  const linkedTicketJobs = jobs.filter((j) => j.ticketStatus === 'Linked');

  const filteredJobs = jobs.filter((j) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'PENDING') return j.ticketStatus === 'Pending';
    return j.requestType.startsWith(filterType);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">02. UBL Requests & Tickets Queue</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manages Request Types A, B, and C. Every request receives a permanent Job ID, and unlinked tickets can be linked later without duplicating records.
          </p>
        </div>
        <button
          onClick={onOpenNewJob}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New UBL Request</span>
        </button>
      </div>

      {/* Alert Card for Pending Tickets */}
      {pendingTicketJobs.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/80 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-xs font-bold text-amber-300">
                {pendingTicketJobs.length} Jobs Awaiting UBL Helpdesk Ticket Numbers
              </h3>
              <p className="text-[11px] text-amber-400/90 mt-0.5">
                These jobs were initiated under Survey Type B without a ticket. Once UBL issues the ticket number, click "Link Ticket" to update the existing record.
              </p>
            </div>
          </div>
          <button
            onClick={() => setFilterType('PENDING')}
            className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition shrink-0"
          >
            Filter Pending ({pendingTicketJobs.length})
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'ALL', label: `All Requests (${jobs.length})` },
          { id: 'PENDING', label: `Ticket Pending (${pendingTicketJobs.length})` },
          { id: 'A', label: 'Type A: Ticket Received' },
          { id: 'B', label: 'Type B: Survey Request' },
          { id: 'C', label: 'Type C: Other Instruction' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              filterType === tab.id
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="divide-y divide-slate-800">
          {filteredJobs.map((job) => {
            const branch = branches.find((b) => b.id === job.branchId);

            return (
              <div
                key={job.id}
                className="p-4 hover:bg-slate-850/60 transition flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-bold text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {job.id}
                    </span>

                    {job.ublTicketNo ? (
                      <span className="font-mono text-xs text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-800 font-semibold">
                        {job.ublTicketNo}
                      </span>
                    ) : (
                      <span className="text-xs text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800 font-bold flex items-center space-x-1">
                        <AlertCircle className="w-3 h-3" />
                        <span>Ticket Pending</span>
                      </span>
                    )}

                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {job.requestType}
                    </span>

                    <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                      Created: {job.createdAt}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-white">{job.title}</h3>
                  <p className="text-[11px] text-slate-400 max-w-2xl">{job.description}</p>

                  <div className="flex items-center space-x-3 text-[11px] text-slate-400 pt-0.5">
                    <span className="flex items-center text-slate-300">
                      <Building2 className="w-3 h-3 mr-1 text-slate-500" />
                      {branch?.name} ({branch?.code})
                    </span>
                    <span>BOM: {branch?.bomName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0">
                  {!job.ublTicketNo && (
                    <button
                      onClick={() => onOpenLinkTicket(job.id)}
                      className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs rounded-lg transition flex items-center space-x-1 shadow-sm"
                    >
                      <Link2 className="w-3.5 h-3.5" />
                      <span>Link Ticket</span>
                    </button>
                  )}
                  <button
                    onClick={() => openOneJobScreen(job.id)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1"
                  >
                    <span>One-Job Screen</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
