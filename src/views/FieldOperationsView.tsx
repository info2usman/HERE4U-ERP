import React, { useState } from 'react';
import {
  Navigation,
  Truck,
  Plus,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Camera,
  Calendar,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { GpsEvent } from '../types/erp';

export const FieldOperationsView: React.FC = () => {
  const { gpsEvents, travelRecords, vehicles, branches, staff, jobs, addGpsEvent, openOneJobScreen } = useERP();

  const [activeTab, setActiveTab] = useState<'gps' | 'vehicles'>('gps');
  const [showGpsModal, setShowGpsModal] = useState(false);

  // New GPS Event State
  const [selectedJobId, setSelectedJobId] = useState(jobs[0]?.id || '');
  const [selectedStaffId, setSelectedStaffId] = useState(staff[0]?.id || '');
  const [eventType, setEventType] = useState<GpsEvent['eventType']>('Work Check-In');
  const [simulatedDistance, setSimulatedDistance] = useState(18); // meters from branch
  const [remarks, setRemarks] = useState('Arrived at branch site. Geofence radius checked.');

  const handleGpsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const job = jobs.find((j) => j.id === selectedJobId);
    const branch = branches.find((b) => b.id === job?.branchId);

    const isVerified = branch ? simulatedDistance <= branch.gpsRadiusMeters : true;

    addGpsEvent({
      jobId: selectedJobId,
      employeeId: selectedStaffId,
      eventType,
      dateTime: new Date().toISOString().replace('T', ' ').slice(0, 16),
      latitude: branch ? branch.latitude + (Math.random() - 0.5) * 0.0005 : 24.8532,
      longitude: branch ? branch.longitude + (Math.random() - 0.5) * 0.0005 : 67.0099,
      distanceFromBranchMeters: simulatedDistance,
      status: isVerified ? 'Location Verified' : 'Location Not Verified — Review Required',
      photoUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=600&auto=format&fit=crop&q=60',
      remarks,
    });

    setShowGpsModal(false);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Navigation className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">14–15. GPS Geofence & Vehicles / Travel</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Use GPS for Job/site verification (Check-In/Out) rather than continuous personal tracking. Store distance from branch geofence.
          </p>
        </div>

        <button
          onClick={() => setShowGpsModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold shadow flex items-center space-x-1.5 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Simulate GPS Check-In</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('gps')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'gps'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          14. GPS Verification Events ({gpsEvents.length})
        </button>
        <button
          onClick={() => setActiveTab('vehicles')}
          className={`px-3 py-1.5 rounded-lg font-medium transition ${
            activeTab === 'vehicles'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          15. Vehicles & Travel Logs ({travelRecords.length})
        </button>
      </div>

      {/* TAB 1: GPS Events */}
      {activeTab === 'gps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {gpsEvents.map((evt) => {
            const emp = staff.find((s) => s.id === evt.employeeId);
            const job = jobs.find((j) => j.id === evt.jobId);
            const branch = branches.find((b) => b.id === job?.branchId);
            const isVerified = evt.status === 'Location Verified';

            return (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-white text-sm">{evt.eventType}</span>
                    <div className="font-mono text-emerald-400 font-bold mt-0.5">{evt.jobId}</div>
                    <div className="text-[11px] text-slate-300">{branch?.name}</div>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                      isVerified
                        ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                        : 'bg-rose-950 text-rose-300 border-rose-800'
                    }`}
                  >
                    {evt.status}
                  </span>
                </div>

                <div className="space-y-1 font-mono text-[11px] text-slate-400">
                  <div>Staff: <span className="text-white font-sans">{emp?.name}</span></div>
                  <div>Coords: <span className="text-slate-300">{evt.latitude.toFixed(4)}, {evt.longitude.toFixed(4)}</span></div>
                  <div>
                    Distance to Branch:{' '}
                    <span className={isVerified ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      {evt.distanceFromBranchMeters} meters
                    </span>
                    <span className="text-slate-500 font-sans ml-1">(Radius: {branch?.gpsRadiusMeters}m)</span>
                  </div>
                  <div>Timestamp: <span className="text-slate-300">{evt.dateTime}</span></div>
                </div>

                {evt.photoUrl && (
                  <div>
                    <span className="text-[10px] uppercase text-slate-500 font-bold block mb-1">On-Site Selfie / Unit Photo</span>
                    <img
                      src={evt.photoUrl}
                      alt="GPS proof"
                      className="h-28 w-full object-cover rounded-lg border border-slate-800"
                    />
                  </div>
                )}

                {evt.remarks && (
                  <div className="text-[11px] text-slate-400 italic">"{evt.remarks}"</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: Vehicles & Travel Records */}
      {activeTab === 'vehicles' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Vehicle Fleet */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <Truck className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Assigned Operational Vehicles
                </h2>
              </div>
              <div className="space-y-2">
                {vehicles.map((v) => {
                  const driver = staff.find((s) => s.id === v.driverId);
                  return (
                    <div key={v.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 flex justify-between items-center text-xs">
                      <div>
                        <div className="font-mono font-bold text-white text-sm">{v.vehicleNo}</div>
                        <div className="text-[11px] text-slate-400">
                          {v.type} &bull; Driver: {driver?.name} &bull; Fuel: {v.fuelType}
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-emerald-400 font-bold text-xs">{v.endingKm} KM</span>
                        <div className="text-[10px] text-slate-500 font-sans">{v.maintenanceStatus}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Travel Logs */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center space-x-2 border-b border-slate-800 pb-2">
                <MapPin className="w-4 h-4 text-emerald-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
                  Job-Linked Travel Logs
                </h2>
              </div>
              <div className="space-y-2">
                {travelRecords.map((t) => (
                  <div key={t.id} className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 space-y-1 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-mono font-bold text-emerald-400">Job: {t.jobId}</span>
                      <span className="font-mono text-white font-bold">{t.km} KM</span>
                    </div>
                    <div className="text-slate-300 text-[11px]">{t.purpose}</div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      From: {t.origin} &rarr; To: {t.destination}
                    </div>
                    <div className="flex justify-between items-center font-mono text-[10px] text-slate-400 pt-1 border-t border-slate-800">
                      <span>Fuel Cost: PKR {t.fuelCost.toLocaleString()}</span>
                      <span>Date: {t.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GPS Simulation Modal */}
      {showGpsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex justify-between items-center">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center space-x-2">
                  <Navigation className="w-4 h-4 text-emerald-400" />
                  <span>Log GPS Geofence Verification (Module 14)</span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Compares GPS coordinates with UBL branch geofence
                </p>
              </div>
              <button onClick={() => setShowGpsModal(false)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>

            <form onSubmit={handleGpsSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Target Job</label>
                <select
                  value={selectedJobId}
                  onChange={(e) => setSelectedJobId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                >
                  {jobs.map((j) => (
                    <option key={j.id} value={j.id}>
                      {j.id} - {j.title.slice(0, 35)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Field Staff Member</label>
                <select
                  value={selectedStaffId}
                  onChange={(e) => setSelectedStaffId(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.designation})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Type</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                >
                  <option value="Site Visit Check-In">Site Visit Check-In</option>
                  <option value="Site Visit Check-Out">Site Visit Check-Out</option>
                  <option value="Work Check-In">Work Check-In</option>
                  <option value="Work Check-Out">Work Check-Out</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Simulated Distance from Branch (meters)
                </label>
                <input
                  type="number"
                  value={simulatedDistance}
                  onChange={(e) => setSimulatedDistance(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white font-mono"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Values &le; Branch Geofence Radius will be marked "Location Verified".
                </span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Remarks</label>
                <input
                  type="text"
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowGpsModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold shadow"
                >
                  Record GPS Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
