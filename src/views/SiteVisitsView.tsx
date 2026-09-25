import React, { useState } from 'react';
import {
  MapPin,
  Plus,
  Camera,
  CheckCircle2,
  Navigation,
  FileText,
  Calendar,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const SiteVisitsView: React.FC = () => {
  const { siteVisits, jobs, branches, staff, addSiteVisit, openOneJobScreen } = useERP();

  const [showModal, setShowModal] = useState(false);
  const [jobId, setJobId] = useState(jobs[0]?.id || '');
  const [visitType, setVisitType] = useState<any>('Inspection');
  const [assignedStaffId, setAssignedStaffId] = useState(staff[0]?.id || '');
  const [siteContact, setSiteContact] = useState('Kamran Siddiqui (BOM)');
  const [problemDescription, setProblemDescription] = useState('Detailed site inspection of breakdown');
  const [measurements, setMeasurements] = useState('22 meters pipe length, 410V 3-phase');
  const [requiredWork, setRequiredWork] = useState('Compressor de-brazing, chemical flushing and new replacement');
  const [requiredMaterial, setRequiredMaterial] = useState('Copeland Scroll Compressor, R410A gas, filter drier');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === jobId);
    const branch = branches.find((b) => b.id === job?.branchId);

    addSiteVisit({
      jobId,
      visitType,
      visitDate: new Date().toISOString().replace('T', ' ').slice(0, 16),
      assignedStaffId,
      siteContact,
      problemDescription,
      measurements,
      requiredWork,
      requiredMaterial,
      requiredManpower: 2,
      estimatedQuantity: '1 complete unit',
      photos: [
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=600&auto=format&fit=crop&q=60',
      ],
      remarks: 'Verified on-site with branch operations manager.',
      gpsCheckIn: {
        lat: branch ? branch.latitude : 24.8532,
        lng: branch ? branch.longitude : 67.0099,
        time: new Date().toISOString().slice(11, 16),
        distanceMeters: 20,
        status: 'Location Verified',
      },
      jobVerificationCertificateNo: `JVC-${branch?.code?.replace('UBL-', '') || '0101'}-2026`,
      status: 'Completed',
    });

    setShowModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">05. Site Visits & Survey Management</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Visit Types: Estimation Visit, Inspection, Work Visit, Re-Visit, Completion Verification. Stores measurements, required manpower/materials & GPS check-in.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Site Visit</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {siteVisits.map((v) => {
          const emp = staff.find((s) => s.id === v.assignedStaffId);
          const job = jobs.find((j) => j.id === v.jobId);
          const branch = branches.find((b) => b.id === job?.branchId);

          return (
            <div key={v.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-white text-sm">{v.id}</span>
                    <span className="font-mono text-emerald-400 font-bold">Job: {v.jobId}</span>
                    <span className="text-[10px] bg-slate-800 text-slate-200 px-2 py-0.5 rounded font-semibold">
                      {v.visitType}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{branch?.name} ({branch?.code})</div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-bold">
                  {v.gpsCheckIn.status}
                </span>
              </div>

              <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-2 text-[11px]">
                <div>
                  <span className="text-slate-500 uppercase font-bold text-[10px] block">Problem Description</span>
                  <p className="text-slate-300 mt-0.5">{v.problemDescription}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-bold text-[10px] block">Site Measurements</span>
                  <p className="text-white font-mono mt-0.5">{v.measurements}</p>
                </div>
                <div>
                  <span className="text-slate-500 uppercase font-bold text-[10px] block">Required Work & Materials</span>
                  <p className="text-slate-300 mt-0.5">{v.requiredWork} &bull; {v.requiredMaterial}</p>
                </div>
              </div>

              {v.photos.length > 0 && (
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Inspection Photos</span>
                  <div className="flex space-x-2 overflow-x-auto">
                    {v.photos.map((p, idx) => (
                      <img
                        key={idx}
                        src={p}
                        alt="Survey"
                        className="h-20 w-28 object-cover rounded-md border border-slate-800"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                <span>Staff: {emp?.name} &bull; Date: {v.visitDate}</span>
                <button
                  onClick={() => openOneJobScreen(v.jobId)}
                  className="text-emerald-400 hover:underline font-semibold"
                >
                  View Job &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <h2 className="text-sm font-bold text-white">Log Site Visit & Survey (Module 05)</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target Job ID</label>
                  <select
                    value={jobId}
                    onChange={(e) => setJobId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>{j.id} - {j.title.slice(0, 30)}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Visit Type</label>
                  <select
                    value={visitType}
                    onChange={(e) => setVisitType(e.target.value as any)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    <option value="Estimation Visit">Estimation Visit</option>
                    <option value="Inspection">Inspection</option>
                    <option value="Work Visit">Work Visit</option>
                    <option value="Re-Visit">Re-Visit</option>
                    <option value="Completion Verification">Completion Verification</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Assigned Staff</label>
                  <select
                    value={assignedStaffId}
                    onChange={(e) => setAssignedStaffId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  >
                    {staff.map((s) => (
                      <option key={s.id} value={s.id}>{s.name} ({s.designation})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Site Contact Person</label>
                  <input
                    type="text"
                    value={siteContact}
                    onChange={(e) => setSiteContact(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Problem Description</label>
                <textarea
                  rows={2}
                  value={problemDescription}
                  onChange={(e) => setProblemDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Measurements Taken</label>
                <input
                  type="text"
                  value={measurements}
                  onChange={(e) => setMeasurements(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Required Work & Materials</label>
                <input
                  type="text"
                  value={requiredWork}
                  onChange={(e) => setRequiredWork(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Save Survey
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
