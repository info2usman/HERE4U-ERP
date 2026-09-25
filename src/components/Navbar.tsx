import React, { useState } from 'react';
import {
  Search,
  Bell,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
  Shield,
  X,
  Globe,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { UserRole } from '../types/erp';

interface NavbarProps {
  onOpenNewJobModal: () => void;
  onOpenHostingerDeploy?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewJobModal, onOpenHostingerDeploy }) => {
  const {
    jobs,
    currentUserRole,
    setCurrentUserRole,
    openOneJobScreen,
    notifications,
    markNotificationRead,
    resetAllData,
  } = useERP();

  const [searchVal, setSearchVal] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const matchedJobs = searchVal.trim()
    ? jobs.filter(
        (j) =>
          j.id.toLowerCase().includes(searchVal.toLowerCase()) ||
          (j.ublTicketNo && j.ublTicketNo.toLowerCase().includes(searchVal.toLowerCase())) ||
          j.title.toLowerCase().includes(searchVal.toLowerCase())
      )
    : [];

  const handleSelectJob = (jobId: string) => {
    openOneJobScreen(jobId);
    setSearchVal('');
    setIsSearchFocused(false);
  };

  const roles: UserRole[] = [
    'Admin',
    'Management',
    'Operations Manager',
    'Site Supervisor',
    'Field Staff',
    'Purchase Officer',
    'Accounts',
    'Billing Officer',
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800 text-white shadow-md">
      <div className="flex items-center justify-between px-4 py-2.5">
        {/* Brand / Logo: Company = Naeem Builder, Client = HERE4U */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2.5">
            <div className="h-9 w-9 rounded-lg bg-emerald-600 flex items-center justify-center font-black tracking-tight text-base shadow-sm border border-emerald-400">
              NB
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-base tracking-wide text-white">
                  NAEEM BUILDER
                </span>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-medium px-1.5 py-0.5 rounded border border-slate-700">
                  Company
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-1.5 py-0.5 rounded border border-emerald-700/60 uppercase">
                  Client: HERE4U
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                UBL Maintenance, Field Operations, Consolidated Billing & Payment Allocation
              </p>
            </div>
          </div>
        </div>

        {/* Global Quick Search for Job ID or Ticket */}
        <div className="relative w-72 sm:w-96">
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search Job ID (NB-...) or UBL Ticket #..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-8 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition"
            />
            {searchVal && (
              <button
                onClick={() => setSearchVal('')}
                className="absolute right-2.5 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Search Dropdown */}
          {isSearchFocused && matchedJobs.length > 0 && (
            <div className="absolute left-0 right-0 mt-1.5 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl overflow-hidden z-50 max-h-80 overflow-y-auto">
              <div className="px-3 py-1.5 bg-slate-900/80 text-[10px] uppercase tracking-wider text-slate-400 font-bold border-b border-slate-700 flex justify-between items-center">
                <span>Matching Jobs ({matchedJobs.length})</span>
                <span className="text-[9px] text-emerald-400">Click to open One-Job Screen</span>
              </div>
              {matchedJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => handleSelectJob(job.id)}
                  className="px-3 py-2 hover:bg-slate-700 cursor-pointer border-b border-slate-700/50 flex items-center justify-between transition"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-400">{job.id}</span>
                      {job.ublTicketNo ? (
                        <span className="text-[11px] bg-blue-900/60 text-blue-300 px-1.5 py-0.2 rounded border border-blue-700">
                          {job.ublTicketNo}
                        </span>
                      ) : (
                        <span className="text-[10px] bg-amber-900/60 text-amber-300 px-1.5 py-0.2 rounded border border-amber-700">
                          Ticket Pending
                        </span>
                      )}
                      <span className="text-[10px] bg-slate-700 text-slate-200 px-1.5 rounded">
                        Status {job.statusCode}
                      </span>
                    </div>
                    <div className="text-xs text-slate-300 truncate max-w-xs mt-0.5">{job.title}</div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Role Switcher */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Hostinger Subdomain Deploy Guide Button */}
          {onOpenHostingerDeploy && (
            <button
              onClick={onOpenHostingerDeploy}
              className="flex items-center space-x-1.5 bg-purple-950/80 hover:bg-purple-900 border border-purple-700/70 text-purple-200 text-xs font-semibold px-2.5 py-1.5 rounded-lg shadow-sm transition active:scale-95"
              title="Step-by-step Guide to Deploy on Hostinger Subdomain"
            >
              <Globe className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Hostinger Deploy</span>
            </button>
          )}

          {/* Quick Create Job Button */}
          <button
            onClick={onOpenNewJobModal}
            className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span className="hidden md:inline">New UBL Job</span>
          </button>

          {/* Role Switcher */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-1 text-xs">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-400 text-[11px]">Role:</span>
            <select
              value={currentUserRole}
              onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
            >
              {roles.map((r) => (
                <option key={r} value={r} className="bg-slate-800 text-white">
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 bg-rose-500 text-white text-[9px] font-bold h-4 w-4 rounded-full flex items-center justify-center border-2 border-slate-900">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-700 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs text-white">System Alerts</span>
                    <span className="text-[10px] bg-emerald-900 text-emerald-300 px-1.5 py-0.5 rounded font-bold">
                      {unreadCount} Unread
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-700/50">
                  {notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => {
                        markNotificationRead(n.id);
                        if (n.jobId) handleSelectJob(n.jobId);
                      }}
                      className={`p-3 text-xs cursor-pointer hover:bg-slate-700/70 transition ${
                        !n.read ? 'bg-slate-750' : 'opacity-75'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="font-semibold text-emerald-300">{n.title}</span>
                        <span className="text-[10px] text-slate-400 flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {n.timestamp.slice(11, 16)}
                        </span>
                      </div>
                      <p className="text-slate-300 mt-1 text-[11px] leading-relaxed">{n.message}</p>
                      {n.jobId && (
                        <div className="mt-1.5 inline-block text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          {n.jobId}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => {
              if (window.confirm('Reset all ERP data to default demo state?')) {
                resetAllData();
              }
            }}
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
            title="Reset to Blueprint Sample Data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
