import React, { useState } from 'react';
import { Wrench, Camera, Plus, CheckCircle2, Building2, Calendar, FileText } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const WorkExecutionView: React.FC = () => {
  const { workOrders, workExecutions, jobs, branches, staff, openOneJobScreen } = useERP();
  const [activeTab, setActiveTab] = useState<'orders' | 'daily-progress'>('orders');

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Wrench className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">19–20. Work Orders & Daily Execution Progress</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Module 19: Authorized Work Instructions &bull; Module 20: Daily work log, material consumption and before/during/after photo evidence.
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'orders'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          19. Work Orders ({workOrders.length})
        </button>
        <button
          onClick={() => setActiveTab('daily-progress')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'daily-progress'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          20. Daily Work & Photos ({workExecutions.length})
        </button>
      </div>

      {/* TAB 1: Work Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-3">
          {workOrders.map((wo) => {
            const branch = branches.find((b) => b.id === wo.branchId);
            const supervisor = staff.find((s) => s.id === wo.supervisorId);

            return (
              <div key={wo.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {wo.workOrderNo}
                      </span>
                      <span className="font-mono text-emerald-400 font-bold">Job: {wo.jobId}</span>
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                        {wo.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 mt-1">
                      {branch?.name} ({branch?.code}) &bull; Supervisor: {supervisor?.name}
                    </div>
                  </div>

                  <button
                    onClick={() => openOneJobScreen(wo.jobId)}
                    className="text-emerald-400 hover:underline font-semibold text-xs"
                  >
                    Open Job Screen &rarr;
                  </button>
                </div>

                <div className="space-y-2 text-[11px]">
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">Scope of Work</span>
                    <p className="text-slate-200 mt-0.5">{wo.scopeOfWork}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">Materials Authorized</span>
                    <p className="text-slate-300 mt-0.5 font-mono">{wo.materialSummary}</p>
                  </div>
                  <div>
                    <span className="text-slate-500 uppercase font-bold text-[10px] block">Special Instructions</span>
                    <p className="text-amber-300 mt-0.5">{wo.instructions}</p>
                  </div>
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-400 pt-2 border-t border-slate-800 font-mono">
                  <span>Start: {wo.startDate}</span>
                  <span>Target Completion: {wo.expectedCompletion}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Work Execution & Progress */}
      {activeTab === 'daily-progress' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {workExecutions.map((x) => {
            const tech = staff.find((s) => s.id === x.staffId);

            return (
              <div key={x.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono font-bold text-emerald-400">Job: {x.jobId}</span>
                    <div className="font-semibold text-white mt-0.5">{x.workPerformed}</div>
                    <div className="text-[10px] text-slate-400">Tech: {tech?.name} &bull; Date: {x.date}</div>
                  </div>
                  <span className="text-sm font-mono font-bold text-emerald-400 bg-slate-950 px-2 py-1 rounded border border-slate-800">
                    {x.progressPercentage}%
                  </span>
                </div>

                <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] space-y-1">
                  <div>Materials Used: <span className="text-slate-200 font-mono">{x.materialUsed}</span></div>
                  <div>Remarks: <span className="text-slate-300">{x.remarks}</span></div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {x.beforePhoto && (
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">Before / Defect Photo</span>
                      <img src={x.beforePhoto} alt="Before" className="h-24 w-full object-cover rounded border border-slate-800" />
                    </div>
                  )}
                  {x.afterPhoto && (
                    <div>
                      <span className="text-[9px] uppercase font-bold text-slate-500 block mb-0.5">After / Commissioned Photo</span>
                      <img src={x.afterPhoto} alt="After" className="h-24 w-full object-cover rounded border border-slate-800" />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
