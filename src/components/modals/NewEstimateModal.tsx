import React, { useState } from 'react';
import { X, Plus, Trash2, Calculator, Check } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { EstimateLineItem } from '../../types/erp';

interface NewEstimateModalProps {
  isOpen: boolean;
  jobId: string | null;
  onClose: () => void;
}

export const NewEstimateModal: React.FC<NewEstimateModalProps> = ({
  isOpen,
  jobId,
  onClose,
}) => {
  const { jobs, branches, estimates, addEstimate } = useERP();

  const job = jobs.find((j) => j.id === jobId);
  const branch = branches.find((b) => b.id === job?.branchId);

  // Existing estimates for this job to determine version
  const jobEstimates = estimates.filter((e) => e.jobId === jobId);
  const nextVersionNum = jobEstimates.length + 1;
  const initialVersion = (nextVersionNum === 1 ? 'V1' : nextVersionNum === 2 ? 'V2' : 'V3') as any;

  const [version, setVersion] = useState<'V1' | 'V2' | 'V3' | 'Final Version' | 'Approved Version'>(initialVersion);
  const [preparedBy, setPreparedBy] = useState('Engr. Haroon Rasheed (Naeem Builder)');
  const [validityDays, setValidityDays] = useState(15);
  const [scopeOfWork, setScopeOfWork] = useState(job?.description || '');
  const [taxPercent, setTaxPercent] = useState(13); // Default standard sales tax %

  const [items, setItems] = useState<EstimateLineItem[]>([
    {
      id: '1',
      description: 'Main Replacement Part / Compressor / Equipment',
      category: 'Material',
      quantity: 1,
      unit: 'Unit',
      materialRate: 45000,
      labourRate: 0,
      otherCost: 0,
      amount: 45000,
    },
    {
      id: '2',
      description: 'Dismantling, technical fitting, brazing & commissioning labor',
      category: 'Labour',
      quantity: 1,
      unit: 'Job',
      materialRate: 0,
      labourRate: 15000,
      otherCost: 0,
      amount: 15000,
    },
  ]);

  if (!isOpen || !jobId) return null;

  const handleItemChange = (id: string, field: keyof EstimateLineItem, val: any) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const updated = { ...item, [field]: val };
          const qty = Number(updated.quantity) || 0;
          const mat = Number(updated.materialRate) || 0;
          const lab = Number(updated.labourRate) || 0;
          const oth = Number(updated.otherCost) || 0;
          updated.amount = (mat + lab + oth) * qty;
          return updated;
        }
        return item;
      })
    );
  };

  const handleAddItem = () => {
    const newItem: EstimateLineItem = {
      id: String(Date.now()),
      description: '',
      category: 'Material',
      quantity: 1,
      unit: 'Unit',
      materialRate: 0,
      labourRate: 0,
      otherCost: 0,
      amount: 0,
    };
    setItems((prev) => [...prev, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    if (items.length > 1) {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }
  };

  const subtotal = items.reduce((acc, i) => acc + (i.amount || 0), 0);
  const taxAmount = (subtotal * taxPercent) / 100;
  const total = subtotal + taxAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!job) return;

    const estNo = `EST-2026-${branch?.code?.replace('UBL-', '') || '0101'}-${version}`;

    addEstimate({
      estimateNo: estNo,
      jobId: job.id,
      branchId: job.branchId,
      version,
      date: new Date().toISOString().slice(0, 10),
      validityDays,
      preparedBy,
      scopeOfWork,
      items,
      subtotal,
      taxPercent,
      taxAmount,
      total,
      status: 'Submitted to UBL',
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <Calculator className="w-4 h-4 text-emerald-400" />
              <span>Create Quotation / Estimate — Naeem Builder &bull; Client: HERE4U</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Rule: Versions (V1, V2, V3, Final) are preserved and never overwritten.
            </p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <div>
              <div className="text-[10px] text-slate-400">Target Job ID</div>
              <div className="font-mono font-bold text-emerald-400 text-xs mt-0.5">{job?.id}</div>
              <div className="text-[10px] text-slate-400">
                Ticket: <span className="text-slate-300">{job?.ublTicketNo || 'Pending'}</span>
              </div>
            </div>

            <div>
              <div className="text-[10px] text-slate-400">Branch</div>
              <div className="font-semibold text-white text-xs mt-0.5">{branch?.name}</div>
              <div className="text-[10px] text-slate-400">{branch?.code}</div>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Version</label>
              <select
                value={version}
                onChange={(e) => setVersion(e.target.value as any)}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs w-full focus:ring-1 focus:ring-emerald-500 font-semibold"
              >
                <option value="V1">V1 (Initial Draft)</option>
                <option value="V2">V2 (Revised)</option>
                <option value="V3">V3 (Negotiated)</option>
                <option value="Final Version">Final Version</option>
                <option value="Approved Version">Approved Version</option>
              </select>
            </div>

            <div>
              <label className="text-[10px] text-slate-400 block mb-0.5">Validity (Days)</label>
              <input
                type="number"
                value={validityDays}
                onChange={(e) => setValidityDays(Number(e.target.value))}
                className="bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs w-full focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Scope of Work</label>
            <input
              type="text"
              value={scopeOfWork}
              onChange={(e) => setScopeOfWork(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 text-xs"
            />
          </div>

          {/* Line Items Table */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <span className="font-bold text-slate-200 uppercase tracking-wider text-[11px]">
                Estimate Line Items
              </span>
              <button
                type="button"
                onClick={handleAddItem}
                className="flex items-center space-x-1 text-emerald-400 hover:text-emerald-300 font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="overflow-x-auto border border-slate-700 rounded-lg">
              <table className="w-full text-left text-slate-300">
                <thead className="bg-slate-800 text-[10px] text-slate-400 uppercase border-b border-slate-700">
                  <tr>
                    <th className="py-2 px-3">Description</th>
                    <th className="py-2 px-2 w-24">Category</th>
                    <th className="py-2 px-2 w-16">Qty</th>
                    <th className="py-2 px-2 w-16">Unit</th>
                    <th className="py-2 px-2 w-24">Mat. Rate</th>
                    <th className="py-2 px-2 w-24">Lab. Rate</th>
                    <th className="py-2 px-2 w-24">Amount</th>
                    <th className="py-2 px-2 w-8"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-xs">
                  {items.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/50">
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                          placeholder="Item or service description"
                          required
                          className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1 text-white text-xs"
                        />
                      </td>
                      <td className="p-2">
                        <select
                          value={item.category}
                          onChange={(e) => handleItemChange(item.id, 'category', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-xs"
                        >
                          <option value="Material">Material</option>
                          <option value="Labour">Labour</option>
                          <option value="Transport">Transport</option>
                          <option value="Other">Other</option>
                        </select>
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.quantity}
                          min="1"
                          onChange={(e) => handleItemChange(item.id, 'quantity', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-xs text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          value={item.unit}
                          onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-xs text-center"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.materialRate}
                          onChange={(e) => handleItemChange(item.id, 'materialRate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-xs text-right font-mono"
                        />
                      </td>
                      <td className="p-2">
                        <input
                          type="number"
                          value={item.labourRate}
                          onChange={(e) => handleItemChange(item.id, 'labourRate', Number(e.target.value))}
                          className="w-full bg-slate-800 border border-slate-700 rounded px-1.5 py-1 text-white text-xs text-right font-mono"
                        />
                      </td>
                      <td className="p-2 text-right font-mono font-semibold text-emerald-400">
                        PKR {item.amount.toLocaleString()}
                      </td>
                      <td className="p-2 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals & Tax Configuration */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <span className="text-slate-400 font-medium">Configurable Sales Tax:</span>
              <input
                type="number"
                step="0.1"
                value={taxPercent}
                onChange={(e) => setTaxPercent(Number(e.target.value))}
                className="w-16 bg-slate-700 border border-slate-600 rounded px-2 py-1 text-white text-xs font-mono text-center"
              />
              <span className="text-slate-400">%</span>
            </div>

            <div className="space-y-1 text-right w-full sm:w-auto font-mono text-xs">
              <div className="text-slate-400">
                Subtotal: <span className="text-white">PKR {subtotal.toLocaleString()}</span>
              </div>
              <div className="text-slate-400">
                Tax Amount: <span className="text-amber-400">PKR {Math.round(taxAmount).toLocaleString()}</span>
              </div>
              <div className="text-sm font-bold text-emerald-400 border-t border-slate-700 pt-1">
                Grand Total: PKR {Math.round(total).toLocaleString()}
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex justify-end space-x-2">
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
              <span>Save & Submit to UBL</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
