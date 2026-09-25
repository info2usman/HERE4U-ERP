import React, { useState } from 'react';
import { Percent, FileText, CheckCircle2, AlertCircle, ExternalLink, Calendar, DollarSign } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const TaxDeductionView: React.FC = () => {
  const { taxDeductions, consolidatedBillings, invoices, openOneJobScreen } = useERP();

  const totalSalesTax = taxDeductions.reduce((acc, t) => acc + t.salesTaxAmount, 0);
  const totalIncomeTax = taxDeductions.reduce((acc, t) => acc + t.incomeTaxAmount, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Percent className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">26. Tax Deduction & Withholding (FBR WHT)</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Record UBL deductions separately from the invoice and payment. Upload applicable Sales Tax evidence & Income Tax withholding certificates.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-mono">
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Sales Tax</span>
            <span className="text-rose-400 font-bold">PKR {totalSalesTax.toLocaleString()}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-lg border border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">Total Income Tax (3%)</span>
            <span className="text-rose-400 font-bold">PKR {totalIncomeTax.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800 font-sans">
              <tr>
                <th className="py-3 px-3">Consolidated No.</th>
                <th className="py-3 px-3">Invoice No.</th>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3 text-right">Taxable Gross (PKR)</th>
                <th className="py-3 px-3 text-right">Sales Tax Deducted</th>
                <th className="py-3 px-3 text-right">Income Tax WHT (3%)</th>
                <th className="py-3 px-3 text-right">Net Receivable</th>
                <th className="py-3 px-3">WHT Certificate No.</th>
                <th className="py-3 px-3 font-sans">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {taxDeductions.map((tax) => (
                <tr
                  key={tax.id}
                  className="hover:bg-slate-800/40 cursor-pointer"
                  onClick={() => openOneJobScreen(tax.jobId)}
                >
                  <td className="p-3 text-blue-300 font-bold">{tax.consolidatedBillingId}</td>
                  <td className="p-3 text-white font-bold">{tax.invoiceId}</td>
                  <td className="p-3 text-emerald-400 font-bold">{tax.jobId}</td>
                  <td className="p-3 text-right text-slate-300">PKR {tax.taxableAmount.toLocaleString()}</td>
                  <td className="p-3 text-right text-rose-400">
                    PKR {tax.salesTaxAmount.toLocaleString()} ({tax.salesTaxRate}%)
                  </td>
                  <td className="p-3 text-right text-rose-400">
                    PKR {tax.incomeTaxAmount.toLocaleString()} ({tax.incomeTaxRate}%)
                  </td>
                  <td className="p-3 text-right font-bold text-emerald-400">
                    PKR {tax.netAmount.toLocaleString()}
                  </td>
                  <td className="p-3 text-slate-200">
                    {tax.certificateNo || (
                      <span className="text-amber-400 text-[10px] font-sans">Pending Certificate</span>
                    )}
                  </td>
                  <td className="p-3 font-sans">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                        tax.status === 'Verified'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                          : 'bg-amber-950 text-amber-300 border-amber-800'
                      }`}
                    >
                      {tax.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
