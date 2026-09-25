import React, { useState } from 'react';
import { X, DollarSign, Check, Building2, Calendar, FileText } from 'lucide-react';
import { useERP } from '../../context/ERPContext';

interface RecordPaymentModalProps {
  isOpen: boolean;
  consolidatedNo: string | null;
  onClose: () => void;
}

export const RecordPaymentModal: React.FC<RecordPaymentModalProps> = ({
  isOpen,
  consolidatedNo,
  onClose,
}) => {
  const { consolidatedBillings, recordBankReceipt, setActiveView } = useERP();

  const cb = consolidatedBillings.find((c) => c.consolidatedNo === consolidatedNo);

  const [bankName, setBankName] = useState('United Bank Limited (Corporate Operating A/C)');
  const [accountNo, setAccountNo] = useState('0109-204918274');
  const [transferDate, setTransferDate] = useState(new Date().toISOString().slice(0, 10));
  const [bankReference, setBankReference] = useState(`FT-UBL-${Date.now().toString().slice(-6)}`);

  if (!isOpen || !cb) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const paymentId = `PAY-2026-${Date.now().toString().slice(-4)}`;

    recordBankReceipt({
      paymentId,
      consolidatedBillingNo: cb.consolidatedNo,
      bankName,
      accountNo,
      transferDate,
      grossBilling: cb.grossTotal,
      salesTaxDeduction: cb.salesTaxTotal,
      incomeTaxDeduction: cb.incomeTaxTotal,
      otherDeduction: cb.otherDeductionsTotal,
      netBankReceipt: cb.netAmount,
      bankReference,
      bankStatementUrl: `Statement_Proof_${bankReference}.pdf`,
    });

    onClose();
    setActiveView('bank-receipts');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Record UBL Bank Payment & Auto-Allocate</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Settles Consolidated Billing and allocates payment across individual invoices
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Target Consolidated Billing Details */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 space-y-1.5 font-mono text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Consolidated Billing No:</span>
              <span className="font-bold text-emerald-400">{cb.consolidatedNo}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Invoices Linked:</span>
              <span className="text-white">{cb.numberOfInvoices} Individual Invoices</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Gross Billing:</span>
              <span className="text-white">PKR {cb.grossTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-rose-400">
              <span>Total Tax Deductions (ST + IT):</span>
              <span>- PKR {(cb.salesTaxTotal + cb.incomeTaxTotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-emerald-300 font-bold text-sm border-t border-slate-700 pt-1">
              <span>Net Bank Deposit:</span>
              <span>PKR {cb.netAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Receiving Bank & Account</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Transfer Date</label>
                <input
                  type="date"
                  value={transferDate}
                  onChange={(e) => setTransferDate(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                UBL Bank Transfer Reference / FT Number
              </label>
              <input
                type="text"
                value={bankReference}
                onChange={(e) => setBankReference(e.target.value)}
                required
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-[11px] text-emerald-300 leading-relaxed">
            <span className="font-bold">Accounting Rule Enforced:</span> Recording this bank transfer
            will mark Consolidated Billing <span className="font-mono">{cb.consolidatedNo}</span> as Paid,
            allocate settlement to each of the {cb.numberOfInvoices} invoices, and automatically advance
            all associated jobs to <span className="font-bold">21 PAID</span>.
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
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow flex items-center space-x-1.5 transition"
            >
              <Check className="w-4 h-4" />
              <span>Confirm Bank Receipt & Settle</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
