import React, { useState } from 'react';
import {
  Users,
  CalendarCheck,
  Building,
  Briefcase,
  Clock,
  Plus,
  Shield,
  Phone,
  CheckCircle2,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { StaffAttendance } from '../types/erp';

export const StaffView: React.FC = () => {
  const { staff, staffAssignments, staffAttendance, jobs, addStaffAttendance } = useERP();

  const [activeTab, setActiveTab] = useState<'master' | 'assignments' | 'attendance'>('master');
  const [attendanceType, setAttendanceType] = useState<'Office' | 'Job'>('Job');

  // New Attendance Form State
  const [showLogAttendance, setShowLogAttendance] = useState(false);
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [attDate, setAttDate] = useState(new Date().toISOString().slice(0, 10));
  const [checkInTime, setCheckInTime] = useState('09:00');
  const [checkOutTime, setCheckOutTime] = useState('17:30');
  const [workType, setWorkType] = useState('AC Compressor Overhaul & Fitting');
  const [location, setLocation] = useState('UBL I.I. Chundrigar Road');
  const [remarks, setRemarks] = useState('Completed on-site work and nitrogen testing');

  const officeAttendance = staffAttendance.filter((a) => a.type === 'Office');
  const jobAttendance = staffAttendance.filter((a) => a.type === 'Job');

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // calculate hours approx
    const [inH, inM] = checkInTime.split(':').map(Number);
    const [outH, outM] = checkOutTime.split(':').map(Number);
    const hours = Math.max(1, Math.round(((outH + outM / 60) - (inH + inM / 60)) * 10) / 10);

    addStaffAttendance({
      type: attendanceType,
      staffId: selectedStaffId,
      date: attDate,
      checkIn: checkInTime,
      checkOut: checkOutTime,
      hours,
      jobId: attendanceType === 'Job' ? selectedJobId : undefined,
      workType: attendanceType === 'Job' ? workType : undefined,
      location: attendanceType === 'Job' ? location : 'Central Office / Workshop',
      remarks,
    });

    setShowLogAttendance(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">11–13. Staff Master, Assignments & Attendance</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Office Attendance and Job Attendance must remain separate for accurate job costing and internal labor allocation.
          </p>
        </div>

        <button
          onClick={() => setShowLogAttendance(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Staff Attendance</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('master')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'master'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          11. Staff Master ({staff.length})
        </button>
        <button
          onClick={() => setActiveTab('assignments')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'assignments'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          12. Staff Assignments ({staffAssignments.length})
        </button>
        <button
          onClick={() => setActiveTab('attendance')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'attendance'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          13. Attendance ({staffAttendance.length})
        </button>
      </div>

      {/* TAB 1: Staff Master */}
      {activeTab === 'master' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {staff.map((s) => (
            <div key={s.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-white text-sm">{s.name}</h3>
                  <div className="font-mono text-[11px] text-emerald-400 font-bold">{s.employeeId}</div>
                  <div className="text-[11px] text-slate-300 mt-0.5">{s.designation}</div>
                </div>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                  {s.status}
                </span>
              </div>

              <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                <div>CNIC: <span className="text-slate-200">{s.cnic}</span></div>
                <div>Mobile: <span className="text-slate-200">{s.mobile}</span></div>
                <div>Emergency: <span className="text-slate-300">{s.emergencyContact}</span></div>
                <div>Department: <span className="text-slate-200">{s.department}</span></div>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] flex justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Daily Cost</span>
                  <span className="text-white font-bold">PKR {s.dailyInternalCost.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 block uppercase">Hourly Rate</span>
                  <span className="text-emerald-400 font-bold">PKR {s.hourlyInternalCost}/hr</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Certified Skills</span>
                <div className="flex flex-wrap gap-1">
                  {s.skill.map((sk, idx) => (
                    <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 2: Staff Assignments */}
      {activeTab === 'assignments' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Job ID</th>
                <th className="py-3 px-3">Assigned Staff</th>
                <th className="py-3 px-3">Role</th>
                <th className="py-3 px-3">Required Skill</th>
                <th className="py-3 px-3">Start Date</th>
                <th className="py-3 px-3">Expected End</th>
                <th className="py-3 px-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {staffAssignments.map((a) => {
                const s = staff.find((st) => st.id === a.staffId);
                return (
                  <tr key={a.id} className="hover:bg-slate-800/40 font-mono text-xs">
                    <td className="p-3 font-bold text-emerald-400">{a.jobId}</td>
                    <td className="p-3 font-sans">
                      <div className="font-semibold text-white">{s?.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{s?.employeeId}</div>
                    </td>
                    <td className="p-3 font-sans text-slate-300">{a.role}</td>
                    <td className="p-3 font-sans text-slate-400">{a.requiredSkill}</td>
                    <td className="p-3 text-slate-300">{a.startDate}</td>
                    <td className="p-3 text-slate-300">{a.expectedCompletion}</td>
                    <td className="p-3 font-sans">
                      <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded border border-emerald-800 font-semibold">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: Attendance (Office vs Job Attendance Separated) */}
      {activeTab === 'attendance' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Office Attendance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Building className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Office Attendance ({officeAttendance.length})
                </h2>
              </div>
              <div className="space-y-2">
                {officeAttendance.map((att) => {
                  const s = staff.find((st) => st.id === att.staffId);
                  return (
                    <div key={att.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-semibold text-white">{s?.name} ({s?.employeeId})</div>
                        <div className="text-[11px] text-slate-400 font-mono">
                          Date: {att.date} &bull; {att.checkIn} to {att.checkOut}
                        </div>
                      </div>
                      <div className="text-right font-mono font-bold text-emerald-400">
                        {att.hours} Hours
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Job Attendance */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Briefcase className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Job-Linked Attendance ({jobAttendance.length})
                </h2>
              </div>
              <div className="space-y-2">
                {jobAttendance.map((att) => {
                  const s = staff.find((st) => st.id === att.staffId);
                  return (
                    <div key={att.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1.5 text-xs">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-semibold text-white">{s?.name}</span>
                          <span className="font-mono text-emerald-400 font-bold ml-2">Job: {att.jobId}</span>
                        </div>
                        <span className="font-mono font-bold text-emerald-400">{att.hours} Hours</span>
                      </div>
                      <div className="text-[11px] text-slate-300">{att.workType}</div>
                      <div className="text-[10px] text-slate-400 font-mono">
                        Location: {att.location} &bull; {att.checkIn} - {att.checkOut} ({att.date})
                      </div>
                      {att.remarks && (
                        <div className="text-[10px] text-slate-400 italic">"{att.remarks}"</div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Attendance Modal */}
      {showLogAttendance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  <span>Log Staff Attendance (Module 13)</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Separates Office vs Job Attendance as mandated by system rules
                </p>
              </div>
              <button onClick={() => setShowLogAttendance(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleAttendanceSubmit} className="p-5 space-y-4 text-xs">
              {/* Type Switcher */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setAttendanceType('Job')}
                  className={`p-2.5 rounded-lg border text-center font-bold transition ${
                    attendanceType === 'Job'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Job Site Attendance
                </button>
                <button
                  type="button"
                  onClick={() => setAttendanceType('Office')}
                  className={`p-2.5 rounded-lg border text-center font-bold transition ${
                    attendanceType === 'Office'
                      ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                      : 'bg-slate-800 border-slate-700 text-slate-400'
                  }`}
                >
                  Office Attendance
                </button>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Select Employee</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.employeeId}) &bull; {s.designation}
                    </option>
                  ))}
                </select>
              </div>

              {attendanceType === 'Job' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Target HERE4U Job ID</label>
                  <select
                    value={selectedJobId}
                    onChange={(e) => setSelectedJobId(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                  >
                    {jobs.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} - {j.ublTicketNo || 'Pending'} ({j.title.slice(0, 35)})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Date</label>
                  <input
                    type="date"
                    value={attDate}
                    onChange={(e) => setAttDate(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Check-In</label>
                  <input
                    type="time"
                    value={checkInTime}
                    onChange={(e) => setCheckInTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Check-Out</label>
                  <input
                    type="time"
                    value={checkOutTime}
                    onChange={(e) => setCheckOutTime(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white"
                  />
                </div>
              </div>

              {attendanceType === 'Job' && (
                <>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Work Type / Nature of Task</label>
                    <input
                      type="text"
                      value={workType}
                      onChange={(e) => setWorkType(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Site Location</label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                    />
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowLogAttendance(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Save Attendance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
