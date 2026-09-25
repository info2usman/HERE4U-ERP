import React from 'react';
import { Building2, MapPin, Phone, User, Shield, Navigation } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const BranchMasterView: React.FC = () => {
  const { branches } = useERP();

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-emerald-400" />
          <h1 className="text-base font-bold text-white">04. UBL Branch Master</h1>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Branch master, contacts, Branch Operations Managers (BOM), GPS coordinates & geofence radius.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {branches.map((b) => (
          <div key={b.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-mono text-emerald-400 font-bold text-sm bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                  {b.code}
                </span>
                <h3 className="font-bold text-white text-sm mt-1">{b.name}</h3>
                <div className="text-[11px] text-slate-400">{b.region} &bull; {b.city}</div>
              </div>
              <span className="text-[10px] bg-emerald-950 text-emerald-400 font-bold px-2 py-0.5 rounded border border-emerald-800">
                {b.status}
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] text-slate-300">
              <div className="flex items-start space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                <span className="text-slate-400">{b.address}</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>BOM: <strong className="text-white">{b.bomName}</strong></span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span className="font-mono text-slate-400">{b.phone}</span>
              </div>
            </div>

            <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1">
              <div className="flex justify-between text-slate-400">
                <span>GPS Coords:</span>
                <span className="text-slate-200">{b.latitude.toFixed(4)}, {b.longitude.toFixed(4)}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Geofence Radius:</span>
                <span className="text-emerald-400 font-bold">{b.gpsRadiusMeters} meters</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
