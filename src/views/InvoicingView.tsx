import React, { useState } from 'react';
import {
  DollarSign,
  Plus,
  FileSpreadsheet,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  FileText,
  Percent,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { IndividualInvoice } from '../types/erp';

interface InvoicingViewProps {
  onOpenConsolidateModal: () => void;
}

export const InvoicingView: React.FC<InvoicingViewProps> = ({ onOpenConsolidateModal }) => {
  const { invoices, jobs, branches, createInvoice, openOneJobScreen } = useERP();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [description, setDescription] = useState('');
  const [serviceAmount, setServiceAmount] = useState(100000);
  const [salesTaxPercent, setSalesTaxPercent] = useState(13.0);
  const [incomeTaxPercent, setIncomeTaxPercent] = useState(3.0);
  const [otherDeductions, setOtherDeductions] = useState(0);

  const readyToConsolidate = invoices.filter(
    (inv) => !inv.consolidatedBillingId || inv.status === 'Billing Set Ready'
  );

  const salesTaxAmount = (serviceAmount * salesTaxPercent) / 100;
  const incomeTaxAmount = (serviceAmount * incomeTaxPercent) / 100;
  const grossInvoice = serviceAmount + salesTaxAmount;
  const totalDeduction = salesTaxAmount + incomeTaxAmount + otherDeductions;
  const netReceivable = grossInvoice - totalDeduction;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === selectedJobId);
    if (!job) return;

    const nextInvNum = invoices.length + 1;
    const invNo = `INV-2026-${String(nextInvNum).padStart(3, '0')}`;

    createInvoice({
      invoiceNo: invNo,
      invoiceDate: new Date().toISOString().slice(0, 10),
      jobId: job.id,
      company: 'Naeem Builder',
      client: 'HERE4U',
      ublTicketNo: job.ublTicketNo,
      branchId: job.branchId,
      customer: 'HERE4U (Client: UBL Projects)',
      description: description || job.title,
      serviceAmount,
      salesTaxPercent,
      salesTaxAmount,
      incomeTaxPercent,
      incomeTaxAmount,
      otherDeductions,
      grossInvoice,
      totalDeduction,
      netReceivable,
      status: 'Billing Set Ready',
    });

    setShowCreateModal(false);
    setDescription('');
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">24. Individual Invoices</h1>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              Naeem Builder &rarr; HERE4U
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Issued by <strong className="text-white">Naeem Builder</strong> to client <strong className="text-white">HERE4U</strong> (for UBL Maintenance). Configurable tax & withholding calculation bases.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {readyToConsolidate.length > 0 && (
            <button
              onClick={onOpenConsolidateModal}
              className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Consolidate Invoices ({readyToConsolidate.length})</span>
            </button>
          )}

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Invoices List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Invoice No.</th>
                <th className="py-3 px-3">Job ID & Ticket</th>
                <th className="py-3 px-3">Branch</th>
                <th className="py-3 px-3 text-right">Service Amt (PKR)</th>
                <th className="py-3 px-3 text-right">Gross Total (PKR)</th>
                <th className="py-3 px-3 text-right">Withholding Deductions</th>
                <th className="py-3 px-3 text-right">Net Receivable (PKR)</th>
                <th className="py-3 px-3">Consolidation Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 font-mono text-xs">
              {invoices.map((inv) => {
                const branch = branches.find((b) => b.id === inv.branchId);

                return (
                  <tr
                    key={inv.id}
                    onClick={() => openOneJobScreen(inv.jobId)}
                    className="hover:bg-slate-800/50 transition cursor-pointer"
                  >
                    <td className="p-3 text-white font-bold">{inv.invoiceNo}</td>
                    <td className="p-3">
                      <div className="text-emerald-400 font-bold">{inv.jobId}</div>
                      <div className="text-[10px] text-slate-400">
                        {inv.ublTicketNo ? `Ticket: ${inv.ublTicketNo}` : 'Ticket Pending'}
                      </div>
                    </td>
                    <td className="p-3 font-sans">
                      <div className="text-white font-semibold">{branch?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{branch?.code}</div>
                    </td>
                    <td className="p-3 text-right text-slate-300">
                      PKR {inv.serviceAmount.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-white">
                      PKR {inv.grossInvoice.toLocaleString()}
                    </td>
                    <td className="p-3 text-right text-rose-400">
                      <div>- PKR {inv.totalDeduction.toLocaleString()}</div>
                      <div className="text-[10px] text-slate-500">
                        ST {inv.salesTaxPercent}% + IT {inv.incomeTaxPercent}%
                      </div>
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-400 text-sm">
                      PKR {inv.netReceivable.toLocaleString()}
                    </td>
                    <td className="p-3 font-sans">
                      {inv.consolidatedBillingId ? (
                        <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono font-bold">
                          {inv.consolidatedBillingId}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-950 text-amber-300 px-2 py-0.5 rounded border border-amber-800 font-bold">
                          Ready for Consolidation
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                  <span>Generate Individual Invoice (Module 24)</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Configurable Sales Tax & Income Tax Deduction bases
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target HERE4U Job</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 font-mono text-xs"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} - {j.ublTicketNo || 'Ticket Pending'} ({j.title.slice(0, 40)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Invoice Description</label>
                <input
                  type="text"
                  placeholder="e.g. 4-Ton Cabinet AC Compressor Replacement and Commissioning"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Service / Base Amount (PKR)</label>
                <input
                  type="number"
                  value={serviceAmount}
                  onChange={(e) => setServiceAmount(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 bg-slate-800/60 p-3 rounded-lg border border-slate-700">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Sales Tax Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={salesTaxPercent}
                    onChange={(e) => setSalesTaxPercent(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Tax: PKR {salesTaxAmount.toLocaleString()}
                  </span>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Income Tax WHT Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={incomeTaxPercent}
                    onChange={(e) => setIncomeTaxPercent(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    WHT: PKR {incomeTaxAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Calculated Totals Box */}
              <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-1.5 font-mono text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Invoice Total:</span>
                  <span className="text-white font-bold">PKR {grossInvoice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-rose-400 text-[11px]">
                  <span>Total Tax Deductions:</span>
                  <span>- PKR {totalDeduction.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-bold text-sm border-t border-slate-800 pt-1.5">
                  <span>Net Receivable from UBL:</span>
                  <span>PKR {netReceivable.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Generate Invoice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
