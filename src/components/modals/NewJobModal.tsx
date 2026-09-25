import React, { useState } from 'react';
import { X, Check, AlertCircle, Building2, User, Calendar, Tag } from 'lucide-react';
import { useERP } from '../../context/ERPContext';
import { RequestType } from '../../types/erp';

interface NewJobModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NewJobModal: React.FC<NewJobModalProps> = ({ isOpen, onClose }) => {
  const { branches, staff, createJob, openOneJobScreen } = useERP();

  const [requestType, setRequestType] = useState<RequestType>('A: UBL Ticket Received');
  const [ublTicketNo, setUblTicketNo] = useState('');
  const [branchId, setBranchId] = useState(branches[0]?.id || 'BR-001');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [workCategory, setWorkCategory] = useState<any>('HVAC / AC Repair');
  const [priority, setPriority] = useState<any>('Normal');
  const [supervisorId, setSupervisorId] = useState(staff[0]?.id || 'STF-001');
  const [targetDate, setTargetDate] = useState(
    new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10)
  );

  if (!isOpen) return null;

  const isTicketRequired = requestType === 'A: UBL Ticket Received';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newJob = createJob({
      requestType,
      ublTicketNo: isTicketRequired ? ublTicketNo : (ublTicketNo || undefined),
      branchId,
      title: title.trim(),
      description: description.trim() || 'Work details pending survey',
      workCategory,
      priority,
      supervisorId,
      targetCompletionDate: targetDate,
    });

    onClose();
    openOneJobScreen(newJob.id);
  };

  const selectedBranch = branches.find((b) => b.id === branchId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center space-x-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Create New Job — Company: Naeem Builder &bull; Client: HERE4U</span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Rule: Assigns a permanent Job ID (NB-H4U-...). UBL Ticket can be linked now or later.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white rounded-lg p-1 hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* 1. Request Type Selector (Blueprint Section 4) */}
          <div className="bg-slate-800/80 p-3 rounded-lg border border-slate-700">
            <label className="block text-[11px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
              UBL Request Workflow Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                {
                  id: 'A: UBL Ticket Received',
                  label: 'Type A: Ticket Received',
                  desc: 'UBL Helpdesk Ticket already provided',
                },
                {
                  id: 'B: Estimation / Site Visit Request — Ticket Not Available',
                  label: 'Type B: Survey / No Ticket',
                  desc: 'Survey requested first; Ticket Pending',
                },
                {
                  id: 'C: Other UBL Instruction',
                  label: 'Type C: Other Instruction',
                  desc: 'Direct instruction or verbal request',
                },
              ].map((t) => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setRequestType(t.id as RequestType)}
                  className={`text-left p-2.5 rounded-lg border transition ${
                    requestType === t.id
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                      : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-750 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold text-xs text-white">{t.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-80">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. UBL Ticket & Branch Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">
                UBL Ticket Number{' '}
                {isTicketRequired ? (
                  <span className="text-emerald-400">* (Provided by UBL)</span>
                ) : (
                  <span className="text-amber-400 font-normal">(Optional — Set to Pending)</span>
                )}
              </label>
              <input
                type="text"
                placeholder={isTicketRequired ? 'e.g. UBL-HD-99285' : 'Leave empty to mark Ticket = Pending'}
                value={ublTicketNo}
                onChange={(e) => setUblTicketNo(e.target.value)}
                required={isTicketRequired}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              {!ublTicketNo && (
                <div className="mt-1 text-[11px] text-amber-400 flex items-center">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Ticket status will be marked as "Pending" until linked.
                </div>
              )}
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1 flex items-center space-x-1">
                <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Target UBL Branch</span>
              </label>
              <select
                value={branchId}
                onChange={(e) => setBranchId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.code} - {b.name} ({b.city})
                  </option>
                ))}
              </select>
              {selectedBranch && (
                <div className="mt-1 text-[10px] text-slate-400">
                  BOM: <span className="text-slate-300">{selectedBranch.bomName}</span> | GPS Radius: {selectedBranch.gpsRadiusMeters}m
                </div>
              )}
            </div>
          </div>

          {/* 3. Job Title & Scope */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Job Title / Brief Subject <span className="text-emerald-400">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Main Banking Hall 4-Ton Cabinet AC Overhaul & Gas Top-up"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">
              Detailed Work Description / Problem Statement
            </label>
            <textarea
              rows={3}
              placeholder="Describe the problem, complaint notes, equipment model or instructions received from UBL..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* 4. Category, Priority, Supervisor & Target Date */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Work Category</label>
              <select
                value={workCategory}
                onChange={(e) => setWorkCategory(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="HVAC / AC Repair">HVAC / AC Repair</option>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Civil & Painting">Civil & Painting</option>
                <option value="Generator / UPS">Generator / UPS</option>
                <option value="IT & Security">IT & Security</option>
                <option value="Signage / ATM">Signage / ATM</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Emergency">Emergency</option>
                <option value="High">High</option>
                <option value="Normal">Normal</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Supervisor</label>
              <select
                value={supervisorId}
                onChange={(e) => setSupervisorId(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
              >
                {staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Target Date</label>
              <input
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
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
              <span>Create Job & Open</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
