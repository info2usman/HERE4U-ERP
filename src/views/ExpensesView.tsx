import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  CheckCircle2,
  Clock,
  DollarSign,
  AlertCircle,
  FileText,
  UserCheck,
  Check,
  XCircle,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { ExpenseCategory, JobExpense } from '../types/erp';

export const ExpensesView: React.FC = () => {
  const {
    jobExpenses,
    staffAdvances,
    staff,
    jobs,
    addJobExpense,
    updateExpenseStatus,
    currentUserRole,
    openOneJobScreen,
  } = useERP();

  const [activeTab, setActiveTab] = useState<'expenses' | 'advances'>('expenses');
  const [showNewExpense, setShowNewExpense] = useState(false);

  // New Expense State
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [staffId, setStaffId] = useState(staff[0]?.id || '');
  const [category, setCategory] = useState<ExpenseCategory>('Material Purchase');
  const [amount, setAmount] = useState(2500);
  const [paymentMethod, setPaymentMethod] = useState<'Cash Advance' | 'Personal Cash' | 'Company Card'>('Cash Advance');
  const [description, setDescription] = useState('');

  const categories: ExpenseCategory[] = [
    'Fuel',
    'Parking',
    'Toll',
    'Local Transport',
    'Food',
    'Material Purchase',
    'Loading/Unloading',
    'Courier',
    'Printing',
    'Tools',
    'Emergency Purchase',
    'Other',
  ];

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addJobExpense({
      jobId,
      staffId,
      date: new Date().toISOString().slice(0, 10),
      category,
      amount,
      paymentMethod,
      description: description || `${category} for job site execution`,
      receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=60',
      approvalStatus: 'Submitted',
    });

    setShowNewExpense(false);
    setDescription('');
  };

  const totalExpenseAmount = jobExpenses.reduce((acc, e) => acc + e.amount, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Receipt className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">16–18. Job Expenses, Advances & Approvals</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Approval Workflow: Staff Submits &rarr; Supervisor Verifies &rarr; Approve/Reject &rarr; Accounts Settlement. All expenses link to Job & Staff.
          </p>
        </div>

        <button
          onClick={() => setShowNewExpense(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Submit Job Expense</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('expenses')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'expenses'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          16. Job Expenses ({jobExpenses.length}) &bull; PKR {totalExpenseAmount.toLocaleString()}
        </button>
        <button
          onClick={() => setActiveTab('advances')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'advances'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          17. Staff Advances ({staffAdvances.length})
        </button>
      </div>

      {/* TAB 1: Expenses List with Multi-Level Verification */}
      {activeTab === 'expenses' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Date</th>
                  <th className="py-3 px-3">Job ID</th>
                  <th className="py-3 px-3">Staff</th>
                  <th className="py-3 px-3">Category</th>
                  <th className="py-3 px-3">Description</th>
                  <th className="py-3 px-3 text-right">Amount (PKR)</th>
                  <th className="py-3 px-3">Approval Stage</th>
                  <th className="py-3 px-3 text-center">Supervisor / Accounts Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {jobExpenses.map((exp) => {
                  const s = staff.find((st) => st.id === exp.staffId);

                  return (
                    <tr key={exp.id} className="hover:bg-slate-800/40 font-mono">
                      <td className="p-3 text-slate-400">{exp.date}</td>
                      <td
                        className="p-3 text-emerald-400 font-bold cursor-pointer hover:underline"
                        onClick={() => openOneJobScreen(exp.jobId)}
                      >
                        {exp.jobId}
                      </td>
                      <td className="p-3 font-sans text-white">{s?.name}</td>
                      <td className="p-3 font-sans">
                        <span className="bg-slate-800 text-slate-200 px-2 py-0.5 rounded text-[11px]">
                          {exp.category}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-300 max-w-xs truncate">{exp.description}</td>
                      <td className="p-3 text-right font-bold text-white">
                        PKR {exp.amount.toLocaleString()}
                      </td>
                      <td className="p-3 font-sans">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            exp.approvalStatus === 'Settled'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                              : exp.approvalStatus === 'Accounts Approved'
                              ? 'bg-blue-950 text-blue-300 border-blue-800'
                              : exp.approvalStatus === 'Supervisor Verified'
                              ? 'bg-amber-950 text-amber-300 border-amber-800'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          {exp.approvalStatus}
                        </span>
                      </td>

                      {/* Approval pipeline actions */}
                      <td className="p-3 text-center font-sans">
                        <div className="flex items-center justify-center space-x-1">
                          {exp.approvalStatus === 'Submitted' && (
                            <button
                              onClick={() => updateExpenseStatus(exp.id, 'Supervisor Verified')}
                              className="px-2 py-1 bg-amber-600 hover:bg-amber-500 text-slate-950 rounded text-[10px] font-bold transition"
                            >
                              Verify
                            </button>
                          )}
                          {exp.approvalStatus === 'Supervisor Verified' && (
                            <button
                              onClick={() => updateExpenseStatus(exp.id, 'Accounts Approved')}
                              className="px-2 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[10px] font-bold transition"
                            >
                              Approve
                            </button>
                          )}
                          {exp.approvalStatus === 'Accounts Approved' && (
                            <button
                              onClick={() => updateExpenseStatus(exp.id, 'Settled')}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-[10px] font-bold transition"
                            >
                              Settle
                            </button>
                          )}
                          {exp.approvalStatus === 'Settled' && (
                            <span className="text-[10px] text-emerald-400 font-bold flex items-center justify-center">
                              <Check className="w-3.5 h-3.5 mr-0.5" /> Settled
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Staff Advances */}
      {activeTab === 'advances' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {staffAdvances.map((adv) => {
            const s = staff.find((st) => st.id === adv.staffId);
            const remaining = adv.advanceAmount - adv.expensesLogged - adv.returnedAmount;

            return (
              <div key={adv.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm">{s?.name}</h3>
                    <div className="font-mono text-[11px] text-emerald-400">{adv.id}</div>
                    <div className="text-[11px] text-slate-400">Date Issued: {adv.dateIssued}</div>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                    {adv.status}
                  </span>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 font-mono space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Issued Advance:</span>
                    <span className="text-white font-bold">PKR {adv.advanceAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Expenses Logged:</span>
                    <span>PKR {adv.expensesLogged.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Returned Amount:</span>
                    <span>PKR {adv.returnedAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-bold border-t border-slate-800 pt-1">
                    <span>Net Balance Remaining:</span>
                    <span>PKR {remaining.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* New Expense Modal */}
      {showNewExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>Submit Job Expense Voucher (Module 16)</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Enters multi-level approval pipeline
                </p>
              </div>
              <button onClick={() => setShowNewExpense(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleExpenseSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target HERE4U Job ID</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} - {j.ublTicketNo || 'Pending'} ({j.title.slice(0, 30)})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Staff Member</label>
                <select
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Expense Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    required
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Cash Advance">Cash Advance</option>
                  <option value="Personal Cash">Personal Cash</option>
                  <option value="Company Card">Company Card</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Description / Bill Memo</label>
                <input
                  type="text"
                  placeholder="e.g. Copper flared fittings and emergency brazing flux"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewExpense(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Submit Expense Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
