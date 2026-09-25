import React, { useState } from 'react';
import {
  ClipboardCheck,
  CheckCircle2,
  FolderLock,
  Plus,
  Check,
  Building2,
  Calendar,
  FileText,
  Camera,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { DeliveryNote } from '../types/erp';

export const ClosureView: React.FC = () => {
  const {
    deliveryNotes,
    workCompletions,
    ticketClosures,
    jobs,
    branches,
    addDeliveryNote,
    openOneJobScreen,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'delivery-notes' | 'completions' | 'closures'>('delivery-notes');
  const [showDnModal, setShowDnModal] = useState(false);

  // New Delivery Note State
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [workDescription, setWorkDescription] = useState('Satisfactory repair, testing and commissioning completed in full accordance with UBL standards.');
  const [ublRep, setUblRep] = useState('Naveed Akhtar');
  const [designation, setDesignation] = useState('Branch Operations Manager (BOM)');
  const [stampReceived, setStampReceived] = useState(true);

  const handleDnSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === jobId);
    const branch = branches.find((b) => b.id === job?.branchId);

    const dnNo = `DN-2026-${branch?.code?.replace('UBL-', '') || '0101'}-${String(deliveryNotes.length + 1).padStart(2, '0')}`;

    addDeliveryNote({
      dnNo,
      jobId,
      ticketNo: job?.ublTicketNo,
      branchId: job?.branchId || 'BR-001',
      workDescription,
      completionDate: new Date().toISOString().slice(0, 10),
      ublRepresentative: ublRep,
      designation,
      signature: `${ublRep} (Signed on Hard-Copy)`,
      ublStampReceived: stampReceived,
      dateSigned: new Date().toISOString().replace('T', ' ').slice(0, 16),
      scanDocUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
      status: stampReceived ? 'Signed & Stamped' : 'Draft',
    });

    setShowDnModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <ClipboardCheck className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">21–23. Handover, Delivery Notes & Ticket Closure</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Signed & Stamped Delivery Note (DN) is mandatory for billing set preparation and UBL invoice acceptance.
          </p>
        </div>

        <button
          onClick={() => setShowDnModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Generate Delivery Note</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('delivery-notes')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'delivery-notes'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          21. Delivery Notes ({deliveryNotes.length})
        </button>
        <button
          onClick={() => setActiveTab('completions')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'completions'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          22. Completion Evidence ({workCompletions.length})
        </button>
        <button
          onClick={() => setActiveTab('closures')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'closures'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          23. Ticket Closures ({ticketClosures.length})
        </button>
      </div>

      {/* TAB 1: Delivery Notes */}
      {activeTab === 'delivery-notes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveryNotes.map((dn) => {
            const branch = branches.find((b) => b.id === dn.branchId);

            return (
              <div key={dn.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-white text-sm">{dn.dnNo}</span>
                    <div className="font-mono text-emerald-400 font-bold mt-0.5">Job: {dn.jobId}</div>
                    <div className="text-[11px] text-slate-300">{branch?.name} ({branch?.code})</div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    {dn.status}
                  </span>
                </div>

                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-2">
                  <p className="text-slate-300 text-[11px] leading-relaxed">{dn.workDescription}</p>

                  <div className="pt-2 border-t border-slate-800 text-[11px] space-y-1">
                    <div className="text-white">
                      UBL Signatory: <span className="font-semibold">{dn.ublRepresentative}</span> ({dn.designation})
                    </div>
                    <div className="text-emerald-400 flex items-center space-x-1 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Branch Verification Stamp Received</span>
                    </div>
                    <div className="text-slate-500 font-mono text-[10px]">Signed on: {dn.dateSigned}</div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-[10px] font-mono text-slate-400">
                    Ticket: {dn.ticketNo || 'Pending Link'}
                  </span>
                  <button
                    onClick={() => openOneJobScreen(dn.jobId)}
                    className="text-emerald-400 hover:underline text-xs font-semibold"
                  >
                    Open Job Screen &rarr;
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Work Completion Reports */}
      {activeTab === 'completions' && (
        <div className="space-y-3">
          {workCompletions.map((c) => (
            <div key={c.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-white text-sm">Completion Ref: {c.id}</span>
                  <span className="font-mono text-emerald-400 font-bold ml-2">Job: {c.jobId}</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                  {c.status}
                </span>
              </div>

              <p className="text-slate-300 text-xs bg-slate-950/70 p-3 rounded border border-slate-800">
                {c.reportSummary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] text-slate-400">
                <div>Field Staff: <span className="text-slate-200">{c.staffWorkDetails}</span></div>
                <div>UBL Ref: <span className="text-slate-200 font-mono">{c.ublConfirmationRef}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Ticket Closures */}
      {activeTab === 'closures' && (
        <div className="space-y-3">
          {ticketClosures.map((tc) => (
            <div key={tc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div>
                  <span className="font-mono font-bold text-white text-sm">UBL Ticket: {tc.ublTicketNo}</span>
                  <span className="font-mono text-emerald-400 font-bold ml-2">Job: {tc.jobId}</span>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
                  Closed: {tc.closedDate}
                </span>
              </div>
              <p className="text-slate-300 text-xs bg-slate-950/70 p-3 rounded border border-slate-800">
                "{tc.ublResponse}"
              </p>
              <div className="text-[11px] text-slate-400">
                Closed By: <span className="text-white font-semibold">{tc.closedBy}</span> &bull; {tc.remarks}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Delivery Note Modal */}
      {showDnModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <ClipboardCheck className="w-4 h-4 text-emerald-400" />
                  <span>Generate UBL Delivery Note (Module 21)</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Authorizes completed work with BOM signature and stamp
                </p>
              </div>
              <button onClick={() => setShowDnModal(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleDnSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target HERE4U Job</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} - {j.ublTicketNo || 'Pending'} ({j.title.slice(0, 35)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Work Description Completed</label>
                <textarea
                  rows={3}
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">UBL Representative Name</label>
                  <input
                    type="text"
                    value={ublRep}
                    onChange={(e) => setUblRep(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Designation</label>
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
                <input
                  type="checkbox"
                  id="stampReceived"
                  checked={stampReceived}
                  onChange={(e) => setStampReceived(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-700 text-emerald-500 focus:ring-emerald-400"
                />
                <label htmlFor="stampReceived" className="font-semibold text-white cursor-pointer text-xs">
                  Physical UBL Branch Stamp Received on Delivery Note
                </label>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowDnModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Confirm & Sign Delivery Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
