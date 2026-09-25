import React, { useState } from 'react';
import {
  ShoppingBag,
  Plus,
  Users,
  FileText,
  DollarSign,
  Truck,
  CheckCircle2,
  Building2,
  Calendar,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const ProcurementView: React.FC = () => {
  const { purchaseRequests, purchaseOrders, vendors, jobs, addPurchaseOrder, openOneJobScreen } = useERP();

  const [activeTab, setActiveTab] = useState<'pos' | 'requests' | 'vendors'>('pos');
  const [showPoModal, setShowPoModal] = useState(false);

  // New PO State
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [vendorId, setVendorId] = useState(vendors[0]?.id || '');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [rate, setRate] = useState(15000);

  const handlePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const poNo = `PO-NB-H4U-2026-${String(purchaseOrders.length + 80).padStart(3, '0')}`;
    const amount = quantity * rate;

    addPurchaseOrder({
      poNo,
      requestId: 'PR-MANUAL',
      jobId,
      vendorId,
      item,
      quantity,
      rate,
      amount,
      deliveryStatus: 'Pending',
      paymentStatus: 'Unpaid',
      documents: [`${poNo}.pdf`],
    });

    setShowPoModal(false);
    setItem('');
  };

  const totalPoSpend = purchaseOrders.reduce((acc, p) => acc + p.amount, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">08–10. Procurement, Purchase Orders & Vendors</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Module 08: Material Requirements &bull; Module 09: Vendor Master & Rates &bull; Module 10: POs, Delivery & Purchase Cost.
          </p>
        </div>

        <button
          onClick={() => setShowPoModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Issue New PO</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('pos')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'pos'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          10. Purchase Orders ({purchaseOrders.length}) &bull; PKR {totalPoSpend.toLocaleString()}
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'requests'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          08. Purchase Requests ({purchaseRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('vendors')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'vendors'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          09. Vendor Master ({vendors.length})
        </button>
      </div>

      {/* TAB 1: POs */}
      {activeTab === 'pos' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">PO Number</th>
                  <th className="py-3 px-3">Job ID</th>
                  <th className="py-3 px-3">Vendor</th>
                  <th className="py-3 px-3">Item / Material</th>
                  <th className="py-3 px-2 text-center">Qty</th>
                  <th className="py-3 px-3 text-right">Amount (PKR)</th>
                  <th className="py-3 px-3">Delivery</th>
                  <th className="py-3 px-3">Payment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {purchaseOrders.map((po) => {
                  const vnd = vendors.find((v) => v.id === po.vendorId);
                  return (
                    <tr
                      key={po.id}
                      className="hover:bg-slate-800/40 cursor-pointer"
                      onClick={() => openOneJobScreen(po.jobId)}
                    >
                      <td className="p-3 font-bold text-emerald-400">{po.poNo}</td>
                      <td className="p-3 text-white font-bold">{po.jobId}</td>
                      <td className="p-3 font-sans text-slate-200">{vnd?.name}</td>
                      <td className="p-3 font-sans text-slate-300">{po.item}</td>
                      <td className="p-3 text-center">{po.quantity}</td>
                      <td className="p-3 text-right font-bold text-white">PKR {po.amount.toLocaleString()}</td>
                      <td className="p-3 font-sans">
                        <span className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-semibold">
                          {po.deliveryStatus}
                        </span>
                      </td>
                      <td className="p-3 font-sans text-slate-400">{po.paymentStatus}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: Purchase Requests */}
      {activeTab === 'requests' && (
        <div className="space-y-3">
          {purchaseRequests.map((pr) => (
            <div key={pr.id} className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm flex justify-between items-center text-xs">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-mono font-bold text-emerald-400">{pr.id}</span>
                  <span className="font-mono text-white font-bold">Job: {pr.jobId}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded">{pr.status}</span>
                </div>
                <div className="text-white font-semibold mt-1">{pr.material}</div>
                <div className="text-slate-400 text-[11px]">
                  Qty: {pr.quantity} {pr.unit} &bull; Required By: {pr.requiredDate}
                </div>
              </div>
              <div className="text-right font-mono">
                <span className="text-[10px] text-slate-500 block uppercase font-bold">Estimated Cost</span>
                <span className="font-bold text-white">PKR {pr.estimatedRate.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: Vendors Master */}
      {activeTab === 'vendors' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {vendors.map((v) => (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-2 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">{v.name}</h3>
                  <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">{v.id}</span>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                  {v.status}
                </span>
              </div>
              <div className="text-[11px] text-slate-400">{v.category}</div>
              <div className="text-[11px] text-slate-300">{v.productsServices}</div>
              <div className="p-2 bg-slate-950/70 rounded border border-slate-800 font-mono text-[10px] space-y-0.5 text-slate-400">
                <div>NTN: <span className="text-slate-200">{v.ntnCnic}</span></div>
                <div>Bank: <span className="text-slate-200">{v.bankName}</span></div>
                <div>IBAN: <span className="text-slate-300">{v.iban}</span></div>
              </div>
              <div className="text-[11px] text-slate-400">
                Contact: <span className="text-slate-200">{v.contactPerson}</span> ({v.mobile})
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New PO Modal */}
      {showPoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white">Create Purchase Order (Module 10)</h2>
              <button onClick={() => setShowPoModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handlePoSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Job ID</label>
                <select
                  value={jobId}
                  onChange={(e) => setJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>{j.id} - {j.title.slice(0, 30)}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Vendor</label>
                <select
                  value={vendorId}
                  onChange={(e) => setVendorId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {vendors.map((v) => (
                    <option key={v.id} value={v.id}>{v.name} ({v.category})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Item / Description</label>
                <input
                  type="text"
                  placeholder="e.g. 4-Ton Copeland Scroll Compressor (ZR48KC)"
                  value={item}
                  onChange={(e) => setItem(e.target.value)}
                  required
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Unit Rate (PKR)</label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white font-mono"
                  />
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex justify-between items-center font-mono">
                <span className="text-slate-400">Total PO Amount:</span>
                <span className="font-bold text-emerald-400 text-sm">PKR {(quantity * rate).toLocaleString()}</span>
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Issue Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
