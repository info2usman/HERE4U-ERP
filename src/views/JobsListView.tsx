import React, { useState } from 'react';
import {
  Layers,
  Search,
  Filter,
  Plus,
  Link2,
  ExternalLink,
  ChevronRight,
  Building2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { MASTER_JOB_STATUSES, JobStatusCode } from '../types/erp';

interface JobsListViewProps {
  onOpenNewJob: () => void;
  onOpenLinkTicket: (jobId: string) => void;
}

export const JobsListView: React.FC<JobsListViewProps> = ({
  onOpenNewJob,
  onOpenLinkTicket,
}) => {
  const { jobs, branches, staff, openOneJobScreen, updateJobStatus } = useERP();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [branchFilter, setBranchFilter] = useState<string>('ALL');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');

  const filteredJobs = jobs.filter((j) => {
    const matchesSearch =
      j.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (j.ublTicketNo && j.ublTicketNo.toLowerCase().includes(searchTerm.toLowerCase())) ||
      j.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || j.statusCode === statusFilter;
    const matchesBranch = branchFilter === 'ALL' || j.branchId === branchFilter;
    const matchesPriority = priorityFilter === 'ALL' || j.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesBranch && matchesPriority;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">02. Master Jobs Directory</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full lifecycle tracking across all 22 Master Job Statuses. Permanent HERE4U Job ID with optional UBL Ticket linkage.
          </p>
        </div>
        <button
          onClick={onOpenNewJob}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Job Request</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {/* Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search Job ID, Ticket # or Title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500 text-xs"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All 22 Job Statuses ({jobs.length})</option>
              {MASTER_JOB_STATUSES.map((s) => {
                const count = jobs.filter((j) => j.statusCode === s.code).length;
                return (
                  <option key={s.code} value={s.code}>
                    {s.code} - {s.label} ({count})
                  </option>
                );
              })}
            </select>
          </div>

          {/* Branch Filter */}
          <div>
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All UBL Branches</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} - {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Priorities</option>
              <option value="Emergency">Emergency</option>
              <option value="High">High</option>
              <option value="Normal">Normal</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">UBL Ticket</th>
                <th className="py-3 px-3">Branch & BOM</th>
                <th className="py-3 px-3">Work Title & Category</th>
                <th className="py-3 px-3">Stage / Status</th>
                <th className="py-3 px-3 text-right">Gross (PKR)</th>
                <th className="py-3 px-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredJobs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-8 text-slate-500 italic">
                    No jobs match the specified filters.
                  </td>
                </tr>
              ) : (
                filteredJobs.map((job) => {
                  const branch = branches.find((b) => b.id === job.branchId);
                  const statusDef = MASTER_JOB_STATUSES.find((s) => s.code === job.statusCode);

                  return (
                    <tr
                      key={job.id}
                      className="hover:bg-slate-800/50 transition cursor-pointer"
                      onClick={() => openOneJobScreen(job.id)}
                    >
                      {/* Job ID */}
                      <td className="p-3 font-mono font-bold text-emerald-400 whitespace-nowrap">
                        {job.id}
                      </td>

                      {/* Ticket No / Link Action */}
                      <td className="p-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        {job.ublTicketNo ? (
                          <span className="font-mono text-[11px] bg-blue-950 text-blue-300 px-2 py-0.5 rounded border border-blue-800">
                            {job.ublTicketNo}
                          </span>
                        ) : (
                          <button
                            onClick={() => onOpenLinkTicket(job.id)}
                            className="text-[10px] bg-amber-950 text-amber-300 hover:bg-amber-900 px-2 py-0.5 rounded border border-amber-700 flex items-center space-x-1 font-mono transition"
                            title="Click to link UBL ticket number"
                          >
                            <Link2 className="w-2.5 h-2.5" />
                            <span>Link Ticket</span>
                          </button>
                        )}
                      </td>

                      {/* Branch */}
                      <td className="p-3">
                        <div className="font-semibold text-white truncate max-w-xs">{branch?.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          {branch?.code} &bull; {branch?.bomName}
                        </div>
                      </td>

                      {/* Title & Category */}
                      <td className="p-3">
                        <div className="font-semibold text-slate-200 truncate max-w-sm">{job.title}</div>
                        <div className="text-[10px] text-slate-400 flex items-center space-x-2 mt-0.5">
                          <span>{job.workCategory}</span>
                          <span>&bull;</span>
                          <span
                            className={
                              job.priority === 'Emergency'
                                ? 'text-rose-400 font-bold'
                                : job.priority === 'High'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }
                          >
                            {job.priority}
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-3 whitespace-nowrap">
                        <span className={`text-[10px] px-2 py-0.5 rounded border font-semibold ${statusDef?.color}`}>
                          {job.statusCode} {statusDef?.label}
                        </span>
                      </td>

                      {/* Financial Gross */}
                      <td className="p-3 text-right font-mono font-semibold text-white whitespace-nowrap">
                        {job.grossBilling || job.approvedAmount || job.estimatedCost
                          ? `PKR ${(job.grossBilling || job.approvedAmount || job.estimatedCost || 0).toLocaleString()}`
                          : '-'}
                      </td>

                      {/* Action */}
                      <td className="p-3 text-center whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => openOneJobScreen(job.id)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-[11px] font-semibold transition flex items-center space-x-1 mx-auto"
                        >
                          <span>Open</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
