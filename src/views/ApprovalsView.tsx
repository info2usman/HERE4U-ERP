import React from 'react';
import { CheckSquare, CheckCircle2, AlertCircle, FileText, Calendar, DollarSign, Building2 } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ApprovalsView: React.FC = () => {
  const { approvals, jobs, openOneJobScreen } = useERP();

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <CheckSquare className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-bold text-white">07. UBL Formal Approvals</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Approval tracking, sanctioned amounts, approver designation & authorization email attachments.
        </p>
      </div>

      <div className="space-y-3">
        {approvals.map((app) => (
          <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-sm font-bold text-white">{app.estimateNo}</span>
                  <span className="font-mono text-emerald-400 font-bold">Job: {app.jobId}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    {app.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Approver: <span className="text-white font-semibold">{app.ublApprover}</span> ({app.designation}) &bull; Date: {app.approvalDate}
                </div>
              </div>

              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-400 block uppercase font-bold">Approved Sanction:</span>
                <span className="text-base font-black text-emerald-400">
                  PKR {app.approvedAmount.toLocaleString()}
                </span>
              </div>
            </div>

            <p className="text-slate-300 text-xs bg-slate-950/70 p-3 rounded-lg border border-slate-800">
              "{app.remarks}"
            </p>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-[11px] text-slate-400 pt-1">
              <div>
                Submitted By: {app.submittedBy} &bull; Email Ref: <span className="text-slate-300 font-mono">{app.approvalEmail}</span>
              </div>
              <button
                onClick={() => openOneJobScreen(app.jobId)}
                className="text-emerald-400 hover:underline font-semibold"
              >
                Open Job Screen &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
