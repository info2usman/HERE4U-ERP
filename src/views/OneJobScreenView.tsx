import React, { useState } from 'react';
import {
  Layers,
  Building2,
  Calendar,
  User,
  Shield,
  CheckCircle2,
  Mail,
  MapPin,
  Calculator,
  ShoppingBag,
  Users,
  Navigation,
  Receipt,
  Wrench,
  Camera,
  FolderOpen,
  DollarSign,
  Percent,
  PieChart,
  History,
  Link2,
  ChevronRight,
  Plus,
  ArrowRight,
  Check,
  ExternalLink,
  Clock,
  AlertCircle,
  FileText,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { MASTER_JOB_STATUSES, JobStatusCode } from '../types/erp';

interface OneJobScreenViewProps {
  onOpenLinkTicket: (jobId: string) => void;
  onOpenNewEstimate: (jobId: string) => void;
}

export const OneJobScreenView: React.FC<OneJobScreenViewProps> = ({
  onOpenLinkTicket,
  onOpenNewEstimate,
}) => {
  const {
    jobs,
    selectedJobId,
    setSelectedJobId,
    branches,
    staff,
    gmailThreads,
    siteVisits,
    estimates,
    approvals,
    purchaseRequests,
    purchaseOrders,
    staffAssignments,
    staffAttendance,
    gpsEvents,
    jobExpenses,
    staffAdvances,
    workOrders,
    workExecutions,
    deliveryNotes,
    workCompletions,
    ticketClosures,
    invoices,
    consolidatedBillings,
    taxDeductions,
    bankReceipts,
    paymentAllocations,
    documents,
    auditLogs,
    calculateJobCosting,
    updateJobStatus,
  } = useERP();

  const [activeTab, setActiveTab] = useState<string>('all');

  // Find selected job or default to first
  const currentJob = jobs.find((j) => j.id === selectedJobId) || jobs[0];

  if (!currentJob) {
    return (
      <div className="p-8 text-center text-slate-400">
        No jobs found. Please create a new job first.
      </div>
    );
  }

  const branch = branches.find((b) => b.id === currentJob.branchId);
  const supervisor = staff.find((s) => s.id === currentJob.supervisorId);
  const statusDef = MASTER_JOB_STATUSES.find((s) => s.code === currentJob.statusCode);

  // Linked records
  const jobGmail = gmailThreads.find((g) => g.jobId === currentJob.id);
  const jobSiteVisits = siteVisits.filter((v) => v.jobId === currentJob.id);
  const jobEstimates = estimates.filter((e) => e.jobId === currentJob.id);
  const jobApprovals = approvals.filter((a) => a.jobId === currentJob.id);
  const jobPRs = purchaseRequests.filter((p) => p.jobId === currentJob.id);
  const jobPOs = purchaseOrders.filter((p) => p.jobId === currentJob.id);
  const jobAssignments = staffAssignments.filter((a) => a.jobId === currentJob.id);
  const jobAttendanceList = staffAttendance.filter((a) => a.jobId === currentJob.id);
  const jobGps = gpsEvents.filter((g) => g.jobId === currentJob.id);
  const jobExpList = jobExpenses.filter((e) => e.jobId === currentJob.id);
  const jobAdvancesList = staffAdvances.filter((a) => a.jobId === currentJob.id);
  const jobWorkOrders = workOrders.filter((w) => w.jobId === currentJob.id);
  const jobExecutions = workExecutions.filter((x) => x.jobId === currentJob.id);
  const jobDeliveryNotes = deliveryNotes.filter((d) => d.jobId === currentJob.id);
  const jobCompletion = workCompletions.find((c) => c.jobId === currentJob.id);
  const jobClosure = ticketClosures.find((t) => t.jobId === currentJob.id);
  const jobInvoice = invoices.find((i) => i.jobId === currentJob.id);
  const jobTaxDeduction = taxDeductions.find((t) => t.jobId === currentJob.id);
  const jobAllocation = paymentAllocations.find((a) => a.jobId === currentJob.id);
  const jobDocs = documents.filter((d) => d.jobId === currentJob.id);
  const jobAudits = auditLogs.filter((a) => a.recordId === currentJob.id || a.recordId.includes(currentJob.id));

  const costing = calculateJobCosting(currentJob.id);

  // Status Progression Helper
  const currentStatusIndex = MASTER_JOB_STATUSES.findIndex((s) => s.code === currentJob.statusCode);
  const nextStatus = currentStatusIndex < MASTER_JOB_STATUSES.length - 1 ? MASTER_JOB_STATUSES[currentStatusIndex + 1] : null;

  const handleAdvanceStatus = () => {
    if (nextStatus) {
      updateJobStatus(currentJob.id, nextStatus.code, 'Advanced by Management');
    }
  };

  const sectionsList = [
    { id: 'all', label: 'All 13 Sections View' },
    { id: 'comm', label: '1. Communication (Gmail)' },
    { id: 'site', label: '2. Site & Survey' },
    { id: 'commercial', label: '3. Commercial & Approval' },
    { id: 'procurement', label: '4. Procurement & POs' },
    { id: 'staff', label: '5. Staff & Attendance' },
    { id: 'field', label: '6. Field & GPS' },
    { id: 'expenses', label: '7. Job Expenses' },
    { id: 'execution', label: '8. Work Execution' },
    { id: 'closure', label: '9. Delivery Note & Handover' },
    { id: 'billing', label: '10. Invoicing & Billing' },
    { id: 'tax', label: '11. Tax & Deductions' },
    { id: 'payment', label: '12. Bank Settlement' },
    { id: 'costing', label: '13. Costing & Margin' },
    { id: 'audit', label: '14. Audit History' },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* SECTION: Top Job Selector & Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Management One-Job Cockpit:
          </span>
          <select
            value={currentJob.id}
            onChange={(e) => setSelectedJobId(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-emerald-400 font-mono font-bold text-xs rounded-lg px-2.5 py-1 focus:ring-1 focus:ring-emerald-500"
          >
            {jobs.map((j) => (
              <option key={j.id} value={j.id}>
                {j.id} — {j.ublTicketNo || 'Ticket Pending'} ({j.title.slice(0, 35)}...)
              </option>
            ))}
          </select>
        </div>

        {/* Section Filter Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto max-w-full pb-1 sm:pb-0 text-xs">
          {sectionsList.slice(0, 7).map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveTab(s.id)}
              className={`px-2 py-1 rounded-md text-[11px] font-medium whitespace-nowrap transition ${
                activeTab === s.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {s.label}
            </button>
          ))}
          {activeTab !== 'all' && (
            <button
              onClick={() => setActiveTab('all')}
              className="px-2 py-1 bg-slate-800 text-emerald-400 hover:bg-slate-700 rounded-md text-[11px] font-bold"
            >
              Show All
            </button>
          )}
        </div>
      </div>

      {/* SECTION 12 — HEADER CARD (Mandated by Section 12 of Blueprint) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-base font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-md border border-emerald-800">
                {currentJob.id}
              </span>

              <span className="text-xs bg-slate-800 text-slate-200 font-semibold px-2 py-0.5 rounded border border-slate-700">
                Company: <strong className="text-white">Naeem Builder</strong>
              </span>

              <span className="text-xs bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                Client: <strong>HERE4U</strong>
              </span>

              {/* UBL Ticket linking badge */}
              {currentJob.ublTicketNo ? (
                <span className="font-mono text-xs font-bold text-blue-300 bg-blue-950/80 px-2.5 py-1 rounded-md border border-blue-800 flex items-center space-x-1">
                  <span>Ticket: {currentJob.ublTicketNo}</span>
                  <Check className="w-3 h-3 text-blue-400" />
                </span>
              ) : (
                <button
                  onClick={() => onOpenLinkTicket(currentJob.id)}
                  className="text-xs font-bold text-amber-300 bg-amber-950/80 hover:bg-amber-900 px-2.5 py-1 rounded-md border border-amber-700 flex items-center space-x-1 transition animate-pulse"
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Ticket Pending &bull; Link Ticket Now</span>
                </button>
              )}

              <span className={`text-xs px-2.5 py-1 rounded-md border font-bold ${statusDef?.color}`}>
                Status {currentJob.statusCode} : {statusDef?.label}
              </span>

              <span className="text-xs font-semibold px-2 py-1 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                Priority: {currentJob.priority}
              </span>
            </div>

            <h1 className="text-base font-bold text-white mt-2 leading-snug">
              {currentJob.title}
            </h1>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {currentJob.description}
            </p>
          </div>

          {/* Quick Advancement Action */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 shrink-0">
            {nextStatus && (
              <button
                onClick={handleAdvanceStatus}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-xs rounded-lg shadow flex items-center space-x-2 transition"
                title={`Advance job status to ${nextStatus.label}`}
              >
                <span>Advance to Stage {nextStatus.code}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => onOpenNewEstimate(currentJob.id)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-lg border border-slate-700 flex items-center space-x-1.5 transition"
            >
              <Calculator className="w-3.5 h-3.5 text-emerald-400" />
              <span>Create Estimate</span>
            </button>
          </div>
        </div>

        {/* Header Metadata Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">UBL Branch</span>
            <span className="text-white font-semibold font-sans mt-0.5 block truncate">
              {branch?.name} ({branch?.code})
            </span>
            <span className="text-slate-400 text-[10px]">{branch?.bomName}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Assigned Supervisor</span>
            <span className="text-white font-semibold font-sans mt-0.5 block truncate">
              {supervisor?.name || 'Unassigned'}
            </span>
            <span className="text-slate-400 text-[10px]">{supervisor?.mobile}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Target Completion</span>
            <span className="text-emerald-400 font-bold mt-0.5 block">
              {currentJob.targetCompletionDate}
            </span>
            <span className="text-slate-400 text-[10px]">Created: {currentJob.createdAt}</span>
          </div>

          <div className="bg-slate-950/60 p-2.5 rounded-lg border border-slate-800">
            <span className="text-slate-500 text-[10px] uppercase font-bold block">Job Margin & Profit</span>
            <span className="text-emerald-400 font-bold mt-0.5 block">
              PKR {costing.jobMargin.toLocaleString()} ({costing.marginPercentage.toFixed(1)}%)
            </span>
            <span className="text-slate-400 text-[10px]">
              Actual Cost: PKR {costing.actualCost.total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* 13 DETAILED SECTIONS AS LAID OUT IN BLUEPRINT SECTION 12 */}

      {/* 1. COMMUNICATION (Gmail thread, latest email, attachments) */}
      {(activeTab === 'all' || activeTab === 'comm') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                1. Communication & Email Threads
              </h2>
            </div>
            {jobGmail && (
              <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                Thread Ref: {jobGmail.id}
              </span>
            )}
          </div>

          {jobGmail ? (
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-semibold text-white">{jobGmail.subject}</div>
                  <div className="text-slate-400 text-[11px] mt-0.5">
                    From: <span className="text-slate-200">{jobGmail.sender}</span> ({jobGmail.senderDesignation}) &bull; To: {jobGmail.recipient}
                  </div>
                </div>
                <div className="text-[10px] text-slate-500">{jobGmail.date}</div>
              </div>
              <p className="text-slate-300 text-xs whitespace-pre-line bg-slate-900/80 p-3 rounded border border-slate-800 font-mono text-[11px] leading-relaxed">
                {jobGmail.fullBody}
              </p>
              {jobGmail.attachments.length > 0 && (
                <div className="pt-2 flex items-center space-x-2">
                  <span className="text-[11px] text-slate-400 font-semibold">Attachments:</span>
                  {jobGmail.attachments.map((att, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center text-[10px] font-mono bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700"
                    >
                      <FileText className="w-3 h-3 mr-1" />
                      {att.name} ({att.size})
                    </span>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-2">
              No Gmail threads linked yet. New messages received at operations@here4u-erp.com matching this Job ID will appear here.
            </div>
          )}
        </div>
      )}

      {/* 2. SITE (Visit history, measurements, photos, GPS) */}
      {(activeTab === 'all' || activeTab === 'site') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                2. Site Visit History, Survey & Measurements
              </h2>
            </div>
            <span className="text-xs text-slate-400">{jobSiteVisits.length} Visits Logged</span>
          </div>

          {jobSiteVisits.length > 0 ? (
            <div className="space-y-3">
              {jobSiteVisits.map((v) => (
                <div key={v.id} className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-emerald-400">{v.id}</span>
                      <span className="bg-slate-800 text-slate-300 font-semibold px-2 py-0.5 rounded text-[10px]">
                        {v.visitType}
                      </span>
                      <span className="text-slate-400 text-[11px]">&bull; {v.visitDate}</span>
                    </div>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                      {v.gpsCheckIn.status} ({v.gpsCheckIn.distanceMeters}m from branch)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-[11px]">
                    <div>
                      <span className="text-slate-500 font-bold uppercase block">Problem Finding</span>
                      <p className="text-slate-300 mt-0.5">{v.problemDescription}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 font-bold uppercase block">Measurements Taken</span>
                      <p className="text-slate-300 mt-0.5 font-mono">{v.measurements}</p>
                    </div>
                  </div>

                  <div className="pt-1 text-[11px]">
                    <span className="text-slate-500 font-bold uppercase block">Required Work & Materials</span>
                    <p className="text-slate-300 mt-0.5">{v.requiredWork} &bull; {v.requiredMaterial}</p>
                  </div>

                  {v.photos.length > 0 && (
                    <div className="pt-2">
                      <span className="text-slate-500 font-bold uppercase text-[10px] block mb-1.5">Site Inspection Photos</span>
                      <div className="flex space-x-2 overflow-x-auto">
                        {v.photos.map((p, idx) => (
                          <img
                            key={idx}
                            src={p}
                            alt="Survey"
                            className="h-20 w-28 object-cover rounded-md border border-slate-700 shadow-xs"
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-2">
              No site visit logged yet. Scheduled visit pending for assigned staff.
            </div>
          )}
        </div>
      )}

      {/* 3. COMMERCIAL (Estimate versions, approval and approved amount) */}
      {(activeTab === 'all' || activeTab === 'commercial') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                3. Commercial: Estimates, Version Control & UBL Approval
              </h2>
            </div>
            <button
              onClick={() => onOpenNewEstimate(currentJob.id)}
              className="text-emerald-400 hover:text-emerald-300 text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Version</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Estimates list */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Preserved Estimate Versions</div>
              {jobEstimates.map((est) => (
                <div key={est.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-white">{est.estimateNo}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-300 font-semibold px-2 py-0.5 rounded border border-emerald-800">
                      {est.version}
                    </span>
                  </div>
                  <div className="text-slate-400 text-[11px]">{est.scopeOfWork}</div>
                  <div className="flex justify-between items-center font-mono text-[11px] pt-1 border-t border-slate-800/80">
                    <span className="text-slate-400">Subtotal: PKR {est.subtotal.toLocaleString()}</span>
                    <span className="font-bold text-emerald-400">Grand Total: PKR {est.total.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Approval evidence */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">UBL Formal Approval Record</div>
              {jobApprovals.length > 0 ? (
                jobApprovals.map((app) => (
                  <div key={app.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-emerald-400">Status: {app.status}</span>
                      <span className="text-slate-400 text-[10px]">{app.approvalDate}</span>
                    </div>
                    <div className="text-slate-200">
                      Approved By: <span className="font-semibold">{app.ublApprover}</span> ({app.designation})
                    </div>
                    <div className="font-mono text-xs text-white">
                      Approved Sanction: <span className="font-bold text-emerald-400">PKR {app.approvedAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 italic">"{app.remarks}"</div>
                  </div>
                ))
              ) : (
                <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800 text-center text-slate-500 text-xs italic">
                  Awaiting formal UBL zonal approval.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. PROCUREMENT (Purchase requests, POs, vendor and actual purchase) */}
      {(activeTab === 'all' || activeTab === 'procurement') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                4. Procurement, Materials & Purchase Orders (POs)
              </h2>
            </div>
            <span className="text-xs text-slate-400">{jobPOs.length} POs Issued</span>
          </div>

          {jobPOs.length > 0 ? (
            <div className="overflow-x-auto border border-slate-800 rounded-lg">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
                  <tr>
                    <th className="py-2 px-3">PO Number</th>
                    <th className="py-2 px-3">Material / Equipment</th>
                    <th className="py-2 px-2 text-center">Qty</th>
                    <th className="py-2 px-3 text-right">Cost (PKR)</th>
                    <th className="py-2 px-3">Delivery Status</th>
                    <th className="py-2 px-3">Payment</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono text-[11px]">
                  {jobPOs.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-800/40">
                      <td className="p-3 text-emerald-400 font-bold">{po.poNo}</td>
                      <td className="p-3 font-sans text-white">{po.item}</td>
                      <td className="p-2 text-center">{po.quantity}</td>
                      <td className="p-3 text-right font-bold text-white">PKR {po.amount.toLocaleString()}</td>
                      <td className="p-3">
                        <span className="text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded font-sans">
                          {po.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-400">{po.paymentStatus}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-slate-500 text-xs italic py-2">
              No purchase orders issued yet against this job.
            </div>
          )}
        </div>
      )}

      {/* 5. STAFF (Assigned staff, attendance and hours) */}
      {(activeTab === 'all' || activeTab === 'staff') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                5. Staff Deployment & Job Attendance (Separated from Office Attendance)
              </h2>
            </div>
            <span className="text-xs text-slate-400">{jobAssignments.length} Assigned</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400">Assigned Field Crew</span>
              {jobAssignments.map((a) => {
                const s = staff.find((st) => st.id === a.staffId);
                return (
                  <div key={a.id} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                    <div>
                      <div className="font-semibold text-white">{s?.name} ({s?.employeeId})</div>
                      <div className="text-[11px] text-slate-400">{a.role} &bull; {a.requiredSkill}</div>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                        {a.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase text-slate-400">Job-Specific Attendance Logs</span>
              {jobAttendanceList.length > 0 ? (
                jobAttendanceList.map((att) => {
                  const s = staff.find((st) => st.id === att.staffId);
                  return (
                    <div key={att.id} className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="font-semibold text-slate-200">{s?.name}</span>
                        <span className="text-emerald-400 font-mono font-bold">{att.hours} Hours Logged</span>
                      </div>
                      <div className="text-[11px] text-slate-400">{att.workType}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{att.date} ({att.checkIn} - {att.checkOut})</div>
                    </div>
                  );
                })
              ) : (
                <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800 text-slate-500 text-xs italic">
                  No job attendance registered yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. FIELD (GPS check-ins/outs, work photos) */}
      {(activeTab === 'all' || activeTab === 'field') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                6. Field Operations: GPS Geofence Check-Ins & Work Proof
              </h2>
            </div>
            <span className="text-xs text-slate-400">{jobGps.length} GPS Events</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {jobGps.map((g) => (
              <div key={g.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-white">{g.eventType}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 px-1.5 py-0.5 rounded font-mono font-semibold">
                    {g.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono">
                  Coords: {g.latitude.toFixed(4)}, {g.longitude.toFixed(4)}
                </div>
                <div className="text-[11px] text-emerald-300">
                  Distance from Branch: <span className="font-bold">{g.distanceFromBranchMeters} meters</span>
                </div>
                {g.photoUrl && (
                  <img
                    src={g.photoUrl}
                    alt="GPS Check-in Proof"
                    className="h-28 w-full object-cover rounded-md border border-slate-800"
                  />
                )}
                <div className="text-[10px] text-slate-500">{g.dateTime}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. EXPENSES (Job expenses, advances and approvals) */}
      {(activeTab === 'all' || activeTab === 'expenses') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div className="flex items-center space-x-2">
              <Receipt className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                7. Job Expenses, Staff Advances & Multi-Level Approvals
              </h2>
            </div>
            <span className="font-mono text-xs text-emerald-400 font-bold">
              Total Expenses: PKR {jobExpList.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
            </span>
          </div>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Description</th>
                  <th className="py-2 px-3 text-right">Amount (PKR)</th>
                  <th className="py-2 px-3">Payment Method</th>
                  <th className="py-2 px-3">Approval Flow</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-[11px]">
                {jobExpList.map((exp) => (
                  <tr key={exp.id} className="hover:bg-slate-800/40">
                    <td className="p-3 font-mono text-slate-400">{exp.date}</td>
                    <td className="p-3 font-semibold text-white">{exp.category}</td>
                    <td className="p-3 text-slate-300">{exp.description}</td>
                    <td className="p-3 text-right font-mono font-bold text-white">
                      PKR {exp.amount.toLocaleString()}
                    </td>
                    <td className="p-3 text-slate-400">{exp.paymentMethod}</td>
                    <td className="p-3">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                        {exp.approvalStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 8. EXECUTION & 9. CLOSURE (Work orders, progress photos, Delivery Notes) */}
      {(activeTab === 'all' || activeTab === 'execution' || activeTab === 'closure') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Execution Progress */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <Wrench className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                8. Work Order & Daily Execution
              </h2>
            </div>
            {jobExecutions.map((x) => (
              <div key={x.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-white">{x.workPerformed}</span>
                  <span className="font-mono text-emerald-400 font-bold">{x.progressPercentage}% Completed</span>
                </div>
                <div className="text-[11px] text-slate-400">Materials Used: {x.materialUsed}</div>
                {x.afterPhoto && (
                  <img
                    src={x.afterPhoto}
                    alt="Work Proof"
                    className="h-28 w-full object-cover rounded border border-slate-800 mt-2"
                  />
                )}
              </div>
            ))}
          </div>

          {/* Delivery Note & Handover */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                9. Signed & Stamped Delivery Note (DN)
              </h2>
            </div>
            {jobDeliveryNotes.length > 0 ? (
              jobDeliveryNotes.map((dn) => (
                <div key={dn.id} className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-emerald-400 text-sm">{dn.dnNo}</span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                      {dn.status}
                    </span>
                  </div>
                  <div className="text-slate-300 text-xs">{dn.workDescription}</div>
                  <div className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1">
                    <div className="text-white">
                      Signed By: <span className="font-semibold">{dn.ublRepresentative}</span> ({dn.designation})
                    </div>
                    <div className="flex items-center space-x-2 text-emerald-400 font-semibold">
                      <Check className="w-3.5 h-3.5" />
                      <span>Official UBL Branch Stamp Received on Physical Copy</span>
                    </div>
                    <div className="text-slate-400 text-[10px]">Date Signed: {dn.dateSigned}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 bg-slate-950/40 rounded-lg border border-slate-800 text-center text-slate-500 text-xs italic">
                Work execution in progress. Delivery note will be generated upon completion.
              </div>
            )}
          </div>
        </div>
      )}

      {/* 10. BILLING, 11. TAX & 12. PAYMENT */}
      {(activeTab === 'all' || activeTab === 'billing' || activeTab === 'tax' || activeTab === 'payment') && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-4">
          <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              10-12. Invoicing, Consolidated Billing, Tax Deductions & Bank Settlement
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Invoice card */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Individual Invoice</div>
              {jobInvoice ? (
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="font-bold text-white text-xs">{jobInvoice.invoiceNo}</div>
                  <div className="text-slate-400">Date: {jobInvoice.invoiceDate}</div>
                  <div className="text-slate-300">Gross: PKR {jobInvoice.grossInvoice.toLocaleString()}</div>
                  <div className="text-rose-400">Deductions: - PKR {jobInvoice.totalDeduction.toLocaleString()}</div>
                  <div className="text-emerald-400 font-bold pt-1 border-t border-slate-800">
                    Net: PKR {jobInvoice.netReceivable.toLocaleString()}
                  </div>
                  <div className="pt-1 text-[10px] text-slate-400">
                    Consolidated under:{' '}
                    <span className="text-blue-400 font-semibold">{jobInvoice.consolidatedBillingId || 'Pending Batching'}</span>
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-2">Invoice not yet prepared.</div>
              )}
            </div>

            {/* Tax Card */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">Tax Withholding</div>
              {jobTaxDeduction ? (
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-slate-300">Sales Tax (13%): PKR {jobTaxDeduction.salesTaxAmount.toLocaleString()}</div>
                  <div className="text-slate-300">Income Tax WHT (3%): PKR {jobTaxDeduction.incomeTaxAmount.toLocaleString()}</div>
                  <div className="text-emerald-400">Certificate: {jobTaxDeduction.certificateNo || 'Pending'}</div>
                  <div className="text-[10px] text-slate-400">Status: {jobTaxDeduction.status}</div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-2">Tax details generated upon invoice consolidation.</div>
              )}
            </div>

            {/* Payment Allocation Card */}
            <div className="bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 space-y-2">
              <div className="text-[11px] font-bold uppercase text-slate-400">UBL Bank Payment Settlement</div>
              {jobAllocation ? (
                <div className="space-y-1.5 font-mono text-[11px]">
                  <div className="text-emerald-400 font-bold text-xs">Payment Allocated</div>
                  <div className="text-slate-300">Settled Net: PKR {jobAllocation.netAllocated.toLocaleString()}</div>
                  <div className="text-slate-400">Date: {jobAllocation.allocatedDate}</div>
                  <div className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded font-bold inline-block">
                    Fully Settled
                  </div>
                </div>
              ) : (
                <div className="text-slate-500 italic py-2">Awaiting consolidated bank transfer from UBL.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 13. COSTING & 14. AUDIT */}
      {(activeTab === 'all' || activeTab === 'costing' || activeTab === 'audit') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Section 13: Job Costing (Blueprint Section 31) */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <PieChart className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                13. Job Costing & Profitability (Estimated vs Actual)
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Estimated Cost</span>
                <div>Materials: PKR {costing.estimatedCost.material.toLocaleString()}</div>
                <div>Labour: PKR {costing.estimatedCost.labour.toLocaleString()}</div>
                <div>Travel & Other: PKR {(costing.estimatedCost.travel + costing.estimatedCost.other).toLocaleString()}</div>
                <div className="text-slate-200 font-bold border-t border-slate-800 pt-1">
                  Total: PKR {costing.estimatedCost.total.toLocaleString()}
                </div>
              </div>

              <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1">
                <span className="text-slate-400 text-[10px] uppercase font-bold block">Actual Cost</span>
                <div>Purchases: PKR {costing.actualCost.purchases.toLocaleString()}</div>
                <div>Staff Labour: PKR {costing.actualCost.staffLabour.toLocaleString()}</div>
                <div>Expenses/Travel: PKR {(costing.actualCost.fuelTravel + costing.actualCost.parkingFoodOther).toLocaleString()}</div>
                <div className="text-emerald-400 font-bold border-t border-slate-800 pt-1">
                  Total: PKR {costing.actualCost.total.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="p-3 bg-emerald-950/40 rounded-lg border border-emerald-800/80 flex justify-between items-center text-xs font-mono">
              <span className="font-bold text-white">Net Job Margin:</span>
              <span className="text-base font-black text-emerald-400">
                PKR {costing.jobMargin.toLocaleString()} ({costing.marginPercentage.toFixed(1)}%)
              </span>
            </div>
          </div>

          {/* Section 14: Audit Trail */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
              <History className="w-4 h-4 text-emerald-400" />
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                14. Audit Trail & Action History
              </h2>
            </div>

            <div className="max-h-60 overflow-y-auto space-y-2 text-xs">
              {jobAudits.length > 0 ? (
                jobAudits.map((a) => (
                  <div key={a.id} className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 text-[11px] space-y-0.5">
                    <div className="flex justify-between items-center text-slate-300">
                      <span className="font-semibold text-white">{a.action}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{a.timestamp}</span>
                    </div>
                    <div className="text-slate-400">By: {a.user} &bull; Module: {a.module}</div>
                    <div className="text-emerald-400 font-mono text-[10px]">{a.newValue}</div>
                  </div>
                ))
              ) : (
                <div className="text-slate-500 italic py-2">No audit events recorded for this job yet.</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
