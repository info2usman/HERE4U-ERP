import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  CheckCircle2,
  DollarSign,
  Send,
  CheckSquare,
  FileCheck,
  Calendar,
  AlertCircle,
  Building2,
  ExternalLink,
  Receipt,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

interface ConsolidatedBillingViewProps {
  onOpenNewConsolidated: () => void;
  onOpenRecordPayment: (consolidatedNo: string) => void;
}

export const ConsolidatedBillingView: React.FC<ConsolidatedBillingViewProps> = ({
  onOpenNewConsolidated,
  onOpenRecordPayment,
}) => {
  const {
    consolidatedBillings,
    invoices,
    physicalBillingSets,
    accountSubmissions,
    bankReceipts,
    paymentAllocations,
    submitToUblAccount,
    recordPhysicalBillingSet,
    openOneJobScreen,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'bills' | 'physical-sets' | 'submissions'>('bills');
  const [selectedCbForSubmission, setSelectedCbForSubmission] = useState<string | null>(null);

  // Submission Form State
  const [receivingPerson, setReceivingPerson] = useState('Muhammad Tariq (Sr. Accounts Officer)');
  const [submittedBy, setSubmittedBy] = useState('Tanveer Hussain (Logistics Officer)');
  const [ublDepartment, setUblDepartment] = useState('Central Accounts & Vendor Payment Unit, UBL Head Office');

  const handleSubmissionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCbForSubmission) return;

    const cb = consolidatedBillings.find((c) => c.consolidatedNo === selectedCbForSubmission);
    if (!cb) return;

    submitToUblAccount({
      consolidatedBillingNo: cb.consolidatedNo,
      invoiceCount: cb.numberOfInvoices,
      totalAmount: cb.grossTotal,
      submissionDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      submittedBy,
      ublDepartment,
      receivingPerson,
      receivingDate: new Date().toISOString().slice(0, 10),
      stampSignatureReceived: true,
      receivingCopyUrl: 'https://images.unsplash.com/photo-1568667256549-094345857637?w=600&auto=format&fit=crop&q=60',
      remarks: 'Hard-copy billing set physically delivered and stamped by UBL Central Accounts desk.',
    });

    setSelectedCbForSubmission(null);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">25. Consolidated Billing & Handover</h1>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
              Naeem Builder &bull; Client: HERE4U
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Module 25 &bull; <strong className="text-white">Naeem Builder</strong> batches multiple individual invoices under one Consolidated Bill for client <strong className="text-white">HERE4U</strong> (UBL Accounts).
          </p>
        </div>

        <button
          onClick={onOpenNewConsolidated}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Consolidated Bill</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        {[
          { id: 'bills', label: `Consolidated Bills (${consolidatedBillings.length})`, icon: FileSpreadsheet },
          { id: 'physical-sets', label: `Physical Billing Sets (${physicalBillingSets.length})`, icon: CheckSquare },
          { id: 'submissions', label: `UBL Account Submissions (${accountSubmissions.length})`, icon: Send },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center space-x-1.5 ${
                activeTab === tab.id
                  ? 'bg-emerald-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Consolidated Bills Table */}
      {activeTab === 'bills' && (
        <div className="space-y-3">
          {consolidatedBillings.map((cb) => {
            const linkedInvs = invoices.filter((i) => cb.invoiceIds.includes(i.id));
            const hasSubmission = accountSubmissions.some((s) => s.consolidatedBillingNo === cb.consolidatedNo);
            const isPaid = cb.status === 'Paid';

            return (
              <div
                key={cb.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-sm font-bold text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
                        {cb.consolidatedNo}
                      </span>
                      <span className="text-xs text-slate-300 font-semibold">{cb.billingPeriod}</span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                          isPaid
                            ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                            : hasSubmission
                            ? 'bg-blue-950 text-blue-300 border border-blue-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}
                      >
                        {cb.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Target UBL Account: <span className="text-slate-200">{cb.ublAccount}</span> &bull; Date: {cb.date}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {!hasSubmission && (
                      <button
                        onClick={() => setSelectedCbForSubmission(cb.consolidatedNo)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 shadow transition"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Submit to UBL</span>
                      </button>
                    )}

                    {!isPaid && (
                      <button
                        onClick={() => onOpenRecordPayment(cb.consolidatedNo)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shadow transition"
                      >
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Record Bank Receipt</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Financial Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Gross Total</span>
                    <span className="text-white font-bold text-sm">PKR {cb.grossTotal.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 block font-sans">{cb.numberOfInvoices} Invoices</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Sales Tax Deducted</span>
                    <span className="text-rose-400 font-semibold">- PKR {cb.salesTaxTotal.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Income Tax Deducted (3%)</span>
                    <span className="text-rose-400 font-semibold">- PKR {cb.incomeTaxTotal.toLocaleString()}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block">Net Bank Deposit</span>
                    <span className="text-emerald-400 font-bold text-sm">PKR {cb.netAmount.toLocaleString()}</span>
                  </div>
                </div>

                {/* Sub-table: Linked Individual Invoices */}
                <div className="space-y-1">
                  <div className="text-[11px] font-bold uppercase text-slate-400 px-1">
                    Linked Individual Invoices ({linkedInvs.length})
                  </div>
                  <div className="overflow-x-auto border border-slate-800/80 rounded-lg">
                    <table className="w-full text-left text-xs text-slate-300">
                      <thead className="bg-slate-950 text-[10px] uppercase text-slate-500 font-bold border-b border-slate-800">
                        <tr>
                          <th className="py-2 px-3">Invoice No.</th>
                          <th className="py-2 px-3">Job ID</th>
                          <th className="py-2 px-3">Ticket</th>
                          <th className="py-2 px-3 text-right">Gross (PKR)</th>
                          <th className="py-2 px-3 text-right">Net (PKR)</th>
                          <th className="py-2 px-3">Invoice Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        {linkedInvs.map((inv) => (
                          <tr
                            key={inv.id}
                            className="hover:bg-slate-800/30 cursor-pointer"
                            onClick={() => openOneJobScreen(inv.jobId)}
                          >
                            <td className="p-2.5 font-bold text-white">{inv.invoiceNo}</td>
                            <td className="p-2.5 text-emerald-400 font-bold">{inv.jobId}</td>
                            <td className="p-2.5 text-slate-400">{inv.ublTicketNo || 'Pending'}</td>
                            <td className="p-2.5 text-right text-slate-200">
                              PKR {inv.grossInvoice.toLocaleString()}
                            </td>
                            <td className="p-2.5 text-right font-bold text-emerald-400">
                              PKR {inv.netReceivable.toLocaleString()}
                            </td>
                            <td className="p-2.5 font-sans">
                              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                {inv.status}
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
          })}
        </div>
      )}

      {/* TAB 2: Physical Billing Sets (Checklists) */}
      {activeTab === 'physical-sets' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center border-b border-slate-800 pb-2">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                27. Physical Hard-Copy Billing Set Checklist
              </h2>
              <p className="text-[11px] text-slate-400">
                Mandatory hard-copy dossier required by UBL Accounts prior to processing payment
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {physicalBillingSets.map((pbs) => (
              <div key={pbs.id} className="bg-slate-950/70 p-4 rounded-lg border border-slate-800 space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-bold text-white text-sm">{pbs.consolidatedBillingId}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    {pbs.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-b border-slate-800 py-2.5">
                  {[
                    { label: 'Original Invoices Attached', checked: pbs.invoiceChecked },
                    { label: 'Signed & Stamped Delivery Notes (BOM Stamp)', checked: pbs.signedDeliveryNoteChecked },
                    { label: 'Approved Estimates / Quotations Copies', checked: pbs.estimateChecked },
                    { label: 'UBL FM Email Approval Printouts', checked: pbs.ublApprovalChecked },
                    { label: 'Work Completion Before/After Photo Annexure', checked: pbs.completionEvidenceChecked },
                    { label: 'Tax Annexure / NTN Withholding Proofs', checked: pbs.taxDocumentsChecked },
                  ].map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-2 text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="text-[11px]">{item.label}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Checked By: {pbs.checkedBy}</span>
                  <span>Date: {pbs.checklistDate}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: UBL Account Submissions (Receiving Records) */}
      {activeTab === 'submissions' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
          <div className="border-b border-slate-800 pb-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              28. UBL Physical Account Submission & Receiving Records
            </h2>
            <p className="text-[11px] text-slate-400">
              Hard-copy receiving stamp evidence from UBL Central Accounts division
            </p>
          </div>

          <div className="divide-y divide-slate-800">
            {accountSubmissions.map((sub) => (
              <div key={sub.id} className="py-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-xs bg-slate-800 px-2 py-0.5 rounded">
                      {sub.consolidatedBillingNo}
                    </span>
                    <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold flex items-center space-x-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Official Receiving Stamp Logged</span>
                    </span>
                  </div>

                  <div className="text-xs text-slate-200 font-semibold">{sub.ublDepartment}</div>
                  <div className="text-[11px] text-slate-400">
                    Received By: <span className="text-white font-semibold">{sub.receivingPerson}</span> &bull; Submitted By: {sub.submittedBy}
                  </div>
                  <div className="text-[11px] text-slate-400 italic">"{sub.remarks}"</div>
                </div>

                <div className="text-right font-mono text-xs shrink-0">
                  <div className="text-white font-bold text-sm">PKR {sub.totalAmount.toLocaleString()}</div>
                  <div className="text-[10px] text-slate-400">Submitted: {sub.submissionDate}</div>
                  <div className="text-[10px] text-emerald-400">Receiving: {sub.receivingDate}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submission Modal */}
      {selectedCbForSubmission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Send className="w-4 h-4 text-emerald-400" />
                  <span>Submit Physical Billing Set to UBL (Module 28)</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  Record for {selectedCbForSubmission}
                </p>
              </div>
              <button
                onClick={() => setSelectedCbForSubmission(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmissionSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">UBL Receiving Department</label>
                <input
                  type="text"
                  value={ublDepartment}
                  onChange={(e) => setUblDepartment(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Receiving Person (UBL)</label>
                  <input
                    type="text"
                    value={receivingPerson}
                    onChange={(e) => setReceivingPerson(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Submitted By (HERE4U)</label>
                  <input
                    type="text"
                    value={submittedBy}
                    onChange={(e) => setSubmittedBy(e.target.value)}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                  />
                </div>
              </div>

              <div className="bg-emerald-950/40 p-3 rounded-lg border border-emerald-800/60 text-[11px] text-emerald-300">
                <span className="font-bold">Workflow Advancement:</span> Submitting this record will
                advance all linked jobs to stage <span className="font-bold">18 SUBMITTED TO UBL ACCOUNT</span> and log the physical hard-copy receiving stamp.
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedCbForSubmission(null)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Confirm Physical Submission
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
