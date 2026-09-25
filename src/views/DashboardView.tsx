import React, { useState } from 'react';
import {
  LayoutDashboard,
  Layers,
  Clock,
  CheckCircle2,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
  TrendingUp,
  Building2,
  Wrench,
  Link2,
  Plus,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { MASTER_JOB_STATUSES, JobStatusCode } from '../types/erp';

interface DashboardViewProps {
  onOpenNewJob: () => void;
  onOpenLinkTicket: (jobId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onOpenNewJob,
  onOpenLinkTicket,
}) => {
  const {
    jobs,
    invoices,
    consolidatedBillings,
    bankReceipts,
    branches,
    currentUserRole,
    openOneJobScreen,
    setActiveView,
  } = useERP();

  const [dashboardTab, setDashboardTab] = useState<'Management' | 'Operations' | 'Accounts'>('Management');

  // Metrics
  const totalJobs = jobs.length;
  const pendingTickets = jobs.filter((j) => j.ticketStatus === 'Pending');
  const activeJobs = jobs.filter((j) => Number(j.statusCode) < 21);
  const completedJobs = jobs.filter((j) => Number(j.statusCode) >= 11 && Number(j.statusCode) < 22);
  const readyForInvoicing = jobs.filter((j) => j.statusCode === '16' || j.statusCode === '17');

  const totalGrossBilling = invoices.reduce((acc, i) => acc + i.grossInvoice, 0);
  const totalNetReceivable = invoices.reduce((acc, i) => acc + i.netReceivable, 0);
  const totalCollected = bankReceipts.reduce((acc, r) => acc + r.netBankReceipt, 0);
  const outstandingNet = totalNetReceivable - totalCollected;

  // Status breakdown
  const statusCounts = MASTER_JOB_STATUSES.map((s) => ({
    ...s,
    count: jobs.filter((j) => j.statusCode === s.code).length,
  }));

  return (
    <div className="space-y-5 animate-in fade-in duration-150">
      {/* Top Banner & Tab Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h1 className="text-lg font-bold text-white tracking-wide">
                Naeem Builder — Operations & Financial Control Hub
              </h1>
              <span className="text-[11px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                Client: HERE4U (UBL Maintenance)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Company: <span className="text-white font-semibold">Naeem Builder</span> &bull; Client: <span className="text-white font-semibold">HERE4U</span> &bull; End-to-End Workflow: Job Creation &rarr; Field Survey &rarr; Estimate &rarr; Procurement &rarr; Delivery Note &rarr; Consolidated Billing &rarr; Bank Settlement
            </p>
          </div>

          <div className="flex items-center space-x-2 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {(['Management', 'Operations', 'Accounts'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setDashboardTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
                  dashboardTab === tab
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab} Dashboard
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Jobs */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Total HERE4U Jobs
              </p>
              <h3 className="text-2xl font-black text-white mt-1">{totalJobs}</h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Layers className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-emerald-400 font-medium">{activeJobs.length} In Progress</span>
            <button
              onClick={() => setActiveView('jobs')}
              className="text-slate-400 hover:text-white flex items-center"
            >
              <span>View all</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Card 2: Tickets Pending Link */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                UBL Tickets Pending
              </p>
              <h3 className="text-2xl font-black text-amber-400 mt-1">
                {pendingTickets.length}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-amber-950 border border-amber-800 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">Survey Type B Jobs</span>
            <button
              onClick={() => setActiveView('ubl-requests')}
              className="text-amber-400 hover:underline flex items-center font-medium"
            >
              <span>Link tickets</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Card 3: Ready for Consolidated Billing */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                Consolidated Bills
              </p>
              <h3 className="text-2xl font-black text-white mt-1">
                {consolidatedBillings.length}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-blue-950 border border-blue-800 flex items-center justify-center text-blue-400">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">
              {readyForInvoicing.length} Ready for Billing Set
            </span>
            <button
              onClick={() => setActiveView('consolidated-billing')}
              className="text-blue-400 hover:text-white flex items-center"
            >
              <span>Consolidate</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>

        {/* Card 4: Bank Receipts & Cash Collected */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">
                UBL Bank Deposits
              </p>
              <h3 className="text-xl font-mono font-bold text-emerald-400 mt-1">
                PKR {totalCollected.toLocaleString()}
              </h3>
            </div>
            <div className="h-9 w-9 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
            <span className="text-slate-400">
              Pending: PKR {outstandingNet.toLocaleString()}
            </span>
            <button
              onClick={() => setActiveView('bank-receipts')}
              className="text-emerald-400 hover:underline flex items-center font-medium"
            >
              <span>Receipts</span>
              <ArrowRight className="w-3 h-3 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Blueprint 22 Master Job Status Progression Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Section 6: Master Job Status Pipeline (22 Operational Stages)
            </h2>
          </div>
          <span className="text-[11px] text-slate-400">Click any stage to filter jobs</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-1.5">
          {statusCounts.map((s) => (
            <div
              key={s.code}
              onClick={() => setActiveView('jobs')}
              className={`p-2 rounded-lg border cursor-pointer transition text-center ${
                s.count > 0
                  ? 'bg-slate-800/90 border-slate-700 hover:border-emerald-500'
                  : 'bg-slate-950/40 border-slate-800/60 opacity-60'
              }`}
            >
              <div className="text-[10px] font-mono text-slate-400 font-bold">{s.code}</div>
              <div
                className="text-[10px] font-semibold text-slate-200 truncate mt-0.5"
                title={s.label}
              >
                {s.label}
              </div>
              <div
                className={`text-xs font-bold font-mono mt-1 ${
                  s.count > 0 ? 'text-emerald-400' : 'text-slate-600'
                }`}
              >
                {s.count}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Urgent Action Items & Recent Jobs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left 2 Cols: Active Jobs Requiring Action */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center space-x-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                Active Maintenance Jobs & Quick Operations
              </h2>
            </div>
            <button
              onClick={onOpenNewJob}
              className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Job</span>
            </button>
          </div>

          <div className="divide-y divide-slate-800">
            {jobs.slice(0, 5).map((job) => {
              const branch = branches.find((b) => b.id === job.branchId);
              const statusDef = MASTER_JOB_STATUSES.find((s) => s.code === job.statusCode);

              return (
                <div
                  key={job.id}
                  className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 px-2 rounded-lg transition"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-400">
                        {job.id}
                      </span>
                      {job.ublTicketNo ? (
                        <span className="text-[10px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800 font-mono">
                          {job.ublTicketNo}
                        </span>
                      ) : (
                        <button
                          onClick={() => onOpenLinkTicket(job.id)}
                          className="text-[10px] bg-amber-950 text-amber-300 hover:bg-amber-900 px-2 py-0.5 rounded border border-amber-800 flex items-center space-x-1 font-mono transition"
                        >
                          <Link2 className="w-2.5 h-2.5" />
                          <span>Link Ticket</span>
                        </button>
                      )}
                      <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${statusDef?.color}`}>
                        {job.statusCode} {statusDef?.label}
                      </span>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded">
                        {job.priority}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-white truncate max-w-md">
                      {job.title}
                    </div>

                    <div className="flex items-center space-x-3 text-[11px] text-slate-400">
                      <span className="flex items-center">
                        <Building2 className="w-3 h-3 mr-1 text-slate-500" />
                        {branch?.name} ({branch?.code})
                      </span>
                      <span>Target: {job.targetCompletionDate}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      onClick={() => openOneJobScreen(job.id)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 text-xs font-semibold rounded-lg border border-slate-700 transition flex items-center space-x-1"
                    >
                      <span>Open Cockpit</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Blueprint Workflow Checklist & Financial Snapshot */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Core Accounting Chain</span>
            </h3>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Parent Relationship</div>
                <div className="font-mono text-emerald-400 font-bold mt-0.5">JOB ID &rarr; Delivery Note</div>
                <p className="text-[11px] text-slate-400 mt-1">Every branch activity revolves around one permanent Job ID.</p>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Invoicing & Consolidation</div>
                <div className="font-mono text-blue-400 font-bold mt-0.5">Jobs &rarr; Invoices &rarr; Consolidated Bill</div>
                <p className="text-[11px] text-slate-400 mt-1">Multiple individual invoices batch under one Consolidated Bill (e.g. CI-2026-001).</p>
              </div>

              <div className="p-2.5 bg-slate-950/80 rounded-lg border border-slate-800">
                <div className="text-[10px] uppercase font-bold text-slate-500">Payment & Tax Allocation</div>
                <div className="font-mono text-purple-400 font-bold mt-0.5">One Bank Receipt &rarr; Multiple Settlements</div>
                <p className="text-[11px] text-slate-400 mt-1">One UBL bank transfer settles multiple invoices via automated allocation.</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Financial Summary (PKR)
            </h3>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-300">
                <span>Gross Billing:</span>
                <span className="font-semibold text-white">PKR {totalGrossBilling.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-400 text-[11px]">
                <span>Sales Tax Deducted:</span>
                <span>- PKR {invoices.reduce((a, c) => a + c.salesTaxAmount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-rose-400 text-[11px]">
                <span>Income Tax Deducted (3%):</span>
                <span>- PKR {invoices.reduce((a, c) => a + c.incomeTaxAmount, 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-300 border-t border-slate-800 pt-1.5">
                <span>Net Billing:</span>
                <span className="font-semibold text-white">PKR {totalNetReceivable.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-emerald-400 font-bold text-sm border-t border-slate-800 pt-1.5">
                <span>Bank Deposited:</span>
                <span>PKR {totalCollected.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
