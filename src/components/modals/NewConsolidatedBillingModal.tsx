import React, { useState } from 'react';
import { X, FileSpreadsheet, Check, CheckSquare, Square, AlertCircle } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface NewConsolidatedBillingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewConsolidatedBillingModal: React.FC<NewConsolidatedBillingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { invoices, branches, createConsolidatedBilling, setActiveView } = useERP();

  // Rule: Only invoices that are NOT in an active consolidation
  const availableInvoices = invoices.filter(
    (inv) => !inv.consolidatedBillingId || inv.status === 'Billing Set Ready' || inv.status === 'Draft'
  );

  const [selectedIds, setSelectedIds] = useState<string[]>(
    availableInvoices.slice(0, 5).map((i) => i.id)
  );
  const [ublAccount, setUblAccount] = useState('HERE4U — A/C UBL Facilities Management & Engineering Division');
  const [billingPeriod, setBillingPeriod] = useState(
    `${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()} - Batch 1`
  );

  if (!isOpen) return null;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedInvoices = availableInvoices.filter((i) => selectedIds.includes(i.id));
  const grossTotal = selectedInvoices.reduce((acc, i) => acc + i.grossInvoice, 0);
  const salesTaxTotal = selectedInvoices.reduce((acc, i) => acc + i.salesTaxAmount, 0);
  const incomeTaxTotal = selectedInvoices.reduce((acc, i) => acc + i.incomeTaxAmount, 0);
  const otherDeductionTotal = selectedInvoices.reduce((acc, i) => acc + i.otherDeductions, 0);
  const netAmount = grossTotal - (salesTaxTotal + incomeTaxTotal + otherDeductionTotal);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) return;

    createConsolidatedBilling({
      invoiceIds: selectedIds,
      ublAccount,
      billingPeriod,
    });

    onClose();
    setActiveView('consolidated-billing');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Create Consolidated Billing — Naeem Builder &bull; Client: HERE4U</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Multiple individual invoices batched under one Consolidated Bill for client HERE4U (e.g. INV-001 + INV-002 &rarr; CI-2026-001)
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target UBL Account / Department</label>
              <input
                type="text"
                value={ublAccount}
                onChange={(e) => setUblAccount(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Billing Period / Batch Reference</label>
              <input
                type="text"
                value={billingPeriod}
                onChange={(e) => setBillingPeriod(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Select Invoices to Consolidate ({selectedIds.length} Selected)
              </span>
              <div className="space-x-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSelectedIds(availableInvoices.map((i) => i.id))}
                  className="text-emerald-400 hover:underline"
                >
                  Select All
                </button>
                <span className="text-slate-600">|</span>
                <button
                  type="button"
                  onClick={() => setSelectedIds([])}
                  className="text-slate-400 hover:underline"
                >
                  Deselect All
                </button>
              </div>
            </div>

            {availableInvoices.length === 0 ? (
              <div className="p-4 bg-slate-800/60 rounded-lg border border-slate-700 text-center text-slate-400">
                No unconsolidated invoices available. Please generate invoices from completed jobs first.
              </div>
            ) : (
              <div className="max-h-60 overflow-y-auto border border-slate-700 rounded-lg divide-y divide-slate-800">
                {availableInvoices.map((inv) => {
                  const isChecked = selectedIds.includes(inv.id);
                  const branch = branches.find((b) => b.id === inv.branchId);
                  return (
                    <div
                      key={inv.id}
                      onClick={() => toggleSelect(inv.id)}
                      className={`p-3 flex items-center justify-between cursor-pointer transition ${
                        isChecked ? 'bg-slate-800' : 'hover:bg-slate-850'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        {isChecked ? (
                          <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-500 shrink-0" />
                        )}
                        <div>
                          <div className="flex items-center space-x-2">
                            <span className="font-mono font-bold text-white">{inv.invoiceNo}</span>
                            <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                              Job: {inv.jobId}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              Ticket: {inv.ublTicketNo || 'Pending'}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-300 mt-0.5 truncate max-w-sm">
                            {branch?.name} — {inv.description}
                          </div>
                        </div>
                      </div>

                      <div className="text-right font-mono text-xs">
                        <div className="text-white font-semibold">PKR {inv.grossInvoice.toLocaleString()}</div>
                        <div className="text-[10px] text-emerald-400">Net: PKR {inv.netReceivable.toLocaleString()}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Consolidation Summary Card */}
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-slate-300">
              <span>Gross Invoices Total ({selectedIds.length} items):</span>
              <span className="font-mono font-bold text-white">PKR {grossTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Withholding Sales Tax Total:</span>
              <span className="font-mono text-rose-400">- PKR {salesTaxTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-slate-400 text-[11px]">
              <span>Withholding Income Tax Total (3%):</span>
              <span className="font-mono text-rose-400">- PKR {incomeTaxTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm font-bold text-emerald-400 border-t border-slate-800 pt-2">
              <span>Consolidated Net Receivable from UBL:</span>
              <span className="font-mono text-base">PKR {netAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={selectedIds.length === 0}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg font-bold shadow flex items-center space-x-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>Generate Consolidated Billing</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
