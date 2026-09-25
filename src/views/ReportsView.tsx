import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Users, Building2, Download, Printer } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ReportsView: React.FC = () => {
  const { jobs, invoices, branches, staff, bankReceipts, calculateJobCosting } = useERP();
  const [reportType, setReportType] = useState<'operational' | 'billing' | 'tax' | 'profitability'>('operational');

  // Aggregated data
  const totalGross = invoices.reduce((a, b) => a + b.grossInvoice, 0);
  const totalNet = invoices.reduce((a, b) => a + b.netReceivable, 0);
  const totalDeposits = bankReceipts.reduce((a, b) => a + b.netBankReceipt, 0);
  const outstanding = totalNet - totalDeposits;

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">34. Operational, Billing & Tax Reports</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Operational status aging, branch-wise jobs, billing submission vs pending, tax certificates & job margins.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Export Summary</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'operational', label: 'Operational & Job Status Aging' },
          { id: 'billing', label: 'Billing & Collection Ledger' },
          { id: 'tax', label: 'Tax Deductions & Withholding Certificates' },
          { id: 'profitability', label: 'Profitability & Margin Breakdown' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              reportType === tab.id
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {reportType === 'operational' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Branch-Wise Job Distribution</h3>
            <div className="space-y-2">
              {branches.map((b) => {
                const count = jobs.filter((j) => j.branchId === b.id).length;
                return (
                  <div key={b.id} className="flex justify-between items-center p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                    <div>
                      <div className="font-semibold text-white">{b.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{b.code} &bull; {b.region}</div>
                    </div>
                    <span className="font-mono font-bold text-emerald-400 text-sm">{count} Jobs</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <h3 className="font-bold text-white text-xs uppercase tracking-wider">Field Staff Deployment Hours</h3>
            <div className="space-y-2">
              {staff.map((s) => (
                <div key={s.id} className="flex justify-between items-center p-2.5 bg-slate-950/70 rounded-lg border border-slate-800">
                  <div>
                    <div className="font-semibold text-white">{s.name}</div>
                    <div className="text-[10px] text-slate-400">{s.designation} &bull; {s.employeeId}</div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-emerald-400 font-bold">Active Staff</span>
                    <div className="text-[10px] text-slate-400">PKR {s.dailyInternalCost}/day</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {reportType === 'billing' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 font-mono text-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Gross Invoiced</span>
              <span className="text-white font-bold text-sm">PKR {totalGross.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Net Receivable</span>
              <span className="text-white font-bold text-sm">PKR {totalNet.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Bank Deposited</span>
              <span className="text-emerald-400 font-bold text-sm">PKR {totalDeposits.toLocaleString()}</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase font-bold block">Outstanding Balance</span>
              <span className="text-amber-400 font-bold text-sm">PKR {outstanding.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {reportType === 'profitability' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300 font-mono">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800 font-sans">
              <tr>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Estimated Cost (PKR)</th>
                <th className="py-3 px-3">Actual Purchases + Labour</th>
                <th className="py-3 px-3">Gross Billing</th>
                <th className="py-3 px-3 text-right">Job Margin (PKR)</th>
                <th className="py-3 px-3 text-right">Margin %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-xs">
              {jobs.map((j) => {
                const c = calculateJobCosting(j.id);
                return (
                  <tr key={j.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-emerald-400">{j.id}</td>
                    <td className="p-3 text-slate-300">PKR {c.estimatedCost.total.toLocaleString()}</td>
                    <td className="p-3 text-amber-400">PKR {c.actualCost.total.toLocaleString()}</td>
                    <td className="p-3 text-white">PKR {c.grossBilling.toLocaleString()}</td>
                    <td className="p-3 text-right font-bold text-emerald-400">
                      PKR {c.jobMargin.toLocaleString()}
                    </td>
                    <td className="p-3 text-right font-bold text-white">
                      {c.marginPercentage.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
