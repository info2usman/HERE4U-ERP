import React, { useState } from 'react';
import {
  DollarSign,
  Building2,
  Calendar,
  CheckCircle2,
  FileText,
  Plus,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

interface BankReceiptsViewProps {
  onOpenRecordPayment: (consolidatedNo: string) => void;
}

export const BankReceiptsView: React.FC<BankReceiptsViewProps> = ({ onOpenRecordPayment }) => {
  const { bankReceipts, paymentAllocations, consolidatedBillings, invoices, openOneJobScreen } = useERP();

  const [activeTab, setActiveTab] = useState<'receipts' | 'allocations'>('receipts');

  const pendingSettlement = consolidatedBillings.filter((cb) => cb.status !== 'Paid');

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">29–30. Bank Receipts & Payment Allocation</h1>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              Naeem Builder &bull; Client: HERE4U
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Key Accounting Rule: Bank deposits received by <strong className="text-white">Naeem Builder</strong> from client <strong className="text-white">HERE4U</strong> settle multiple individual invoices under Consolidated Billing.
          </p>
        </div>

        {pendingSettlement.length > 0 && (
          <button
            onClick={() => onOpenRecordPayment(pendingSettlement[0].consolidatedNo)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Record Bank Deposit</span>
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('receipts')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'receipts'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          29. Bank Receipts ({bankReceipts.length})
        </button>
        <button
          onClick={() => setActiveTab('allocations')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'allocations'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          30. Invoice Payment Allocations ({paymentAllocations.length})
        </button>
      </div>

      {/* TAB 1: Bank Receipts */}
      {activeTab === 'receipts' && (
        <div className="space-y-3">
          {bankReceipts.map((rcp) => (
            <div
              key={rcp.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                      {rcp.paymentId}
                    </span>
                    <span className="font-mono text-xs text-white">
                      Ref: {rcp.bankReference}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold">
                      Deposit Confirmed
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    Bank: <span className="text-slate-200">{rcp.bankName}</span> &bull; A/C: {rcp.accountNo} &bull; Date: {rcp.transferDate}
                  </div>
                </div>

                <div className="text-right font-mono text-xs">
                  <span className="text-slate-400 text-[10px] block">Net Bank Transfer:</span>
                  <span className="text-base font-black text-emerald-400">
                    PKR {rcp.netBankReceipt.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Deduction details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Consolidated Bill</span>
                  <span className="text-white font-bold">{rcp.consolidatedBillingNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Gross Billing</span>
                  <span className="text-slate-300">PKR {rcp.grossBilling.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Sales Tax Withheld</span>
                  <span className="text-rose-400">- PKR {rcp.salesTaxDeduction.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-bold block uppercase">Income Tax Withheld</span>
                  <span className="text-rose-400">- PKR {rcp.incomeTaxDeduction.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Payment Allocations (Underlying invoice settlements) */}
      {activeTab === 'allocations' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800 font-sans">
                <tr>
                  <th className="py-3 px-3">Allocation ID</th>
                  <th className="py-3 px-3">Payment ID</th>
                  <th className="py-3 px-3">Consolidated No.</th>
                  <th className="py-3 px-3">Invoice No.</th>
                  <th className="py-3 px-3">Job ID</th>
                  <th className="py-3 px-3 text-right">Gross (PKR)</th>
                  <th className="py-3 px-3 text-right">Tax Withheld (PKR)</th>
                  <th className="py-3 px-3 text-right">Net Allocated (PKR)</th>
                  <th className="py-3 px-3 font-sans">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {paymentAllocations.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-slate-800/40 cursor-pointer"
                    onClick={() => openOneJobScreen(a.jobId)}
                  >
                    <td className="p-3 text-slate-400">{a.id}</td>
                    <td className="p-3 text-emerald-400">{a.paymentId}</td>
                    <td className="p-3 text-blue-300">{a.consolidatedBillingNo}</td>
                    <td className="p-3 text-white font-bold">{a.invoiceId}</td>
                    <td className="p-3 text-emerald-400 font-bold">{a.jobId}</td>
                    <td className="p-3 text-right text-slate-300">PKR {a.grossAmount.toLocaleString()}</td>
                    <td className="p-3 text-right text-rose-400">- PKR {a.taxDeduction.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      PKR {a.netAllocated.toLocaleString()}
                    </td>
                    <td className="p-3 font-sans">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
