import React from 'react';
import { Mail, Paperclip, ExternalLink, Calendar, User, FileText } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const GmailThreadsView: React.FC = () => {
  const { gmailThreads, openOneJobScreen } = useERP();

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Mail className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-bold text-white">03. Gmail & Email Communication Threads</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Full communication thread history and original UBL email requests linked to HERE4U Job IDs.
        </p>
      </div>

      <div className="space-y-3">
        {gmailThreads.map((thread) => (
          <div key={thread.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-white text-sm">{thread.subject}</span>
                  <span className="font-mono text-emerald-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {thread.jobId}
                  </span>
                  {thread.ticketNo && (
                    <span className="font-mono text-blue-300 text-[11px] bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                      {thread.ticketNo}
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-400 mt-1">
                  From: <span className="text-slate-200 font-semibold">{thread.sender}</span> ({thread.senderDesignation}) &bull; To: {thread.recipient}
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <span className="text-slate-500 font-mono text-[11px]">{thread.date}</span>
                <button
                  onClick={() => openOneJobScreen(thread.jobId)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-[11px] font-semibold transition"
                >
                  Open Job
                </button>
              </div>
            </div>

            <p className="text-slate-300 text-xs bg-slate-950/70 p-3.5 rounded-lg border border-slate-800 whitespace-pre-line font-mono text-[11px] leading-relaxed">
              {thread.fullBody}
            </p>

            {thread.attachments.length > 0 && (
              <div className="flex items-center space-x-2 pt-1">
                <span className="text-slate-400 text-[11px] font-bold flex items-center">
                  <Paperclip className="w-3.5 h-3.5 mr-1 text-slate-500" /> Attachments:
                </span>
                {thread.attachments.map((att, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center text-[10px] bg-slate-800 text-emerald-300 px-2 py-0.5 rounded border border-slate-700 font-mono"
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    {att.name} ({att.size})
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
