import React, { useState } from 'react';
import { FolderOpen, FileText, Download, Filter, Search, ExternalLink } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const DocumentsView: React.FC = () => {
  const { documents, openOneJobScreen } = useERP();
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  const filteredDocs = documents.filter((d) => {
    if (filterCategory === 'ALL') return true;
    return d.category === filterCategory;
  });

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <FolderOpen className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-bold text-white">32. Central Documents Repository</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Central Job-linked document repository: Quotations, Approvals, Purchase Invoices, Site Photos, Delivery Notes, Invoices, Billing Sets, Tax Certificates & Bank Receipts.
        </p>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs overflow-x-auto">
        {[
          'ALL',
          'Delivery Note',
          'UBL Approval',
          'Purchase Invoice',
          'Site Photo',
          'Work Photo',
          'Bank Receipt / Payment Evidence',
        ].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition ${
              filterCategory === cat
                ? 'bg-emerald-600 text-white font-bold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {cat === 'ALL' ? `All Files (${documents.length})` : cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div className="flex items-start space-x-2.5">
                <div className="h-9 w-9 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-white truncate max-w-xs" title={doc.name}>
                    {doc.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-mono block mt-0.5">
                    {doc.category} &bull; {doc.fileSize}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1 font-mono text-[11px]">
              {doc.jobId && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Linked Job ID:</span>
                  <span
                    className="text-emerald-400 font-bold cursor-pointer hover:underline"
                    onClick={() => openOneJobScreen(doc.jobId!)}
                  >
                    {doc.jobId}
                  </span>
                </div>
              )}
              {doc.ticketNo && (
                <div className="flex justify-between">
                  <span className="text-slate-500">UBL Ticket:</span>
                  <span className="text-slate-300">{doc.ticketNo}</span>
                </div>
              )}
              {doc.consolidatedNo && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Consolidated Bill:</span>
                  <span className="text-blue-300">{doc.consolidatedNo}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/80">
                <span>By: {doc.uploadedBy}</span>
                <span>{doc.uploadedAt}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
