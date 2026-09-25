import React, { useState } from 'react';
import {
  Calculator,
  Plus,
  CheckCircle2,
  FileText,
  Clock,
  ExternalLink,
  Building2,
  Calendar,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

interface EstimatesViewProps {
  onOpenNewEstimate: (jobId: string) => void;
}

export const EstimatesView: React.FC<EstimatesViewProps> = ({ onOpenNewEstimate }) => {
  const { estimates, jobs, branches, openOneJobScreen } = useERP();
  const [selectedVersion, setSelectedVersion] = useState<string>('ALL');

  const filteredEstimates = estimates.filter((e) => {
    if (selectedVersion === 'ALL') return true;
    return e.version.includes(selectedVersion);
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Calculator className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">06. Estimates & Quotation Versioning</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Version control V1, V2, V3, Final Version, Approved Version. Previous versions are strictly preserved and never overwritten.
          </p>
        </div>

        <button
          onClick={() => onOpenNewEstimate(jobs[0]?.id || '')}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Quotation Version</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        {['ALL', 'V1', 'V2', 'V3', 'Final', 'Approved'].map((v) => (
          <button
            key={v}
            onClick={() => setSelectedVersion(v)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedVersion === v
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {v === 'ALL' ? 'All Estimates' : v}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredEstimates.map((est) => {
          const branch = branches.find((b) => b.id === est.branchId);

          return (
            <div key={est.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                      {est.estimateNo}
                    </span>
                    <span className="font-mono text-emerald-400 font-bold">Job: {est.jobId}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                      {est.version}
                    </span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {est.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Branch: <span className="text-slate-200">{branch?.name} ({branch?.code})</span> &bull; Prepared By: {est.preparedBy} &bull; Date: {est.date}
                  </div>
                </div>

                <div className="text-right font-mono">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Quotation Total:</span>
                  <span className="text-base font-black text-emerald-400">
                    PKR {est.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="text-slate-300 text-xs italic">
                Scope: {est.scopeOfWork}
              </div>

              {/* Line Items Table */}
              <div className="overflow-x-auto border border-slate-800 rounded-lg">
                <table className="w-full text-left text-slate-300 font-mono text-[11px]">
                  <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800 font-sans">
                    <tr>
                      <th className="py-2 px-3">Description</th>
                      <th className="py-2 px-2">Category</th>
                      <th className="py-2 px-2 text-center">Qty</th>
                      <th className="py-2 px-2 text-center">Unit</th>
                      <th className="py-2 px-3 text-right">Material Rate</th>
                      <th className="py-2 px-3 text-right">Labour Rate</th>
                      <th className="py-2 px-3 text-right">Line Amount (PKR)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {est.items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-800/30">
                        <td className="p-2.5 font-sans text-white">{item.description}</td>
                        <td className="p-2.5 font-sans text-slate-400">{item.category}</td>
                        <td className="p-2.5 text-center">{item.quantity}</td>
                        <td className="p-2.5 text-center">{item.unit}</td>
                        <td className="p-2.5 text-right">{item.materialRate ? `PKR ${item.materialRate.toLocaleString()}` : '-'}</td>
                        <td className="p-2.5 text-right">{item.labourRate ? `PKR ${item.labourRate.toLocaleString()}` : '-'}</td>
                        <td className="p-2.5 text-right font-bold text-emerald-400">PKR {item.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-1 font-mono text-xs">
                <div className="text-slate-400">
                  Subtotal: <span className="text-white">PKR {est.subtotal.toLocaleString()}</span> &bull; Configured Tax ({est.taxPercent.toFixed(1)}%): <span className="text-amber-400">PKR {est.taxAmount.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => openOneJobScreen(est.jobId)}
                  className="text-emerald-400 hover:underline font-semibold font-sans text-xs"
                >
                  Open in One-Job Screen &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
