import React, { useState } from 'react';
import {
  Settings,
  Shield,
  History,
  Users,
  Key,
  RotateCcw,
  Check,
  Globe,
  Server,
  Terminal,
  Copy,
  FileCode,
  ShieldCheck,
  AlertTriangle,
  UploadCloud,
  ExternalLink,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';
import { UserRole } from '../types/erp';

export const AdminView: React.FC = () => {
  const { auditLogs, currentUserRole, setCurrentUserRole, resetAllData } = useERP();
  const [activeTab, setActiveTab] = useState<'roles' | 'audit' | 'hostinger'>('roles');

  // Hostinger Subdomain Tool states
  const [hostingerSubdomain, setHostingerSubdomain] = useState('erp');
  const [hostingerDomain, setHostingerDomain] = useState('yourcompany.com');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const cleanSubdomain = hostingerSubdomain.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'erp';
  const cleanDomain = hostingerDomain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'yourcompany.com';
  const targetSubdomainUrl = `https://${cleanSubdomain}.${cleanDomain}`;
  const targetFolder = `public_html/${cleanSubdomain}`;

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const htaccessCode = `<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /

  # Ensure HTTPS (Hostinger Free SSL)
  RewriteCond %{HTTPS} off
  RewriteCond %{HTTP_HOST} ^(.+)$ [NC]
  RewriteRule ^ https://%1%{REQUEST_URI} [L,R=301]

  # If file or folder exists, serve directly
  RewriteCond %{REQUEST_FILENAME} -f [OR]
  RewriteCond %{REQUEST_FILENAME} -d
  RewriteRule ^ - [L]

  # Fallback all routes to index.html for React SPA
  RewriteRule ^ index.html [L]
</IfModule>

# Browser Caching for Vite hashed static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresDefault "access plus 1 month"
  ExpiresByType text/html "access plus 0 seconds"
  ExpiresByType text/css "access plus 1 year"
  ExpiresByType application/javascript "access plus 1 year"
</IfModule>`;

  const rolesList: { role: UserRole; desc: string; permissions: string[] }[] = [
    {
      role: 'Admin',
      desc: 'Complete system access, user management, configuration and override authority',
      permissions: ['View', 'Create', 'Edit', 'Delete', 'Approve', 'Submit', 'Close', 'Export', 'Financial Data', 'Staff Data'],
    },
    {
      role: 'Management',
      desc: 'High-level executive cockpit, profitability review and corporate reporting',
      permissions: ['View', 'Approve', 'Export', 'Financial Data', 'Staff Data'],
    },
    {
      role: 'Operations Manager',
      desc: 'Oversees ticket linking, site visits, crew assignment and execution progress',
      permissions: ['View', 'Create', 'Edit', 'Approve', 'Submit', 'Staff Data'],
    },
    {
      role: 'Site Supervisor',
      desc: 'Manages field technicians, GPS verifications, work execution and expense vouchers',
      permissions: ['View', 'Create', 'Edit', 'Approve (Vouchers)', 'Submit'],
    },
    {
      role: 'Field Staff',
      desc: 'Mobile technician app: check-in, job attendance, work photos and delivery note sign-off',
      permissions: ['View (Assigned)', 'Submit Photos', 'Job Attendance', 'Check-In'],
    },
    {
      role: 'Purchase Officer',
      desc: 'Vendor management, rate procurement, purchase requests and issuing POs',
      permissions: ['View', 'Create (PO)', 'Edit (Vendors)', 'Financial (Purchases)'],
    },
    {
      role: 'Accounts',
      desc: 'Tax deductions, withholding certificates, expense settlement and bank deposits',
      permissions: ['View', 'Approve', 'Financial Data', 'Tax Config', 'Bank Reconciliation'],
    },
    {
      role: 'Billing Officer',
      desc: 'Consolidated Billing preparation, physical billing sets & UBL submission',
      permissions: ['View', 'Create (Invoices)', 'Consolidate', 'Submit to UBL'],
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">35. Administration, Roles & Audit Trails</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Module 35: Users, Role-Based Access Control (RBAC), Permissions & immutable System Audit Trail.
          </p>
        </div>

        <button
          onClick={() => {
            if (window.confirm('Reset all demo state to fresh mock data?')) {
              resetAllData();
            }
          }}
          className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 rounded-lg text-xs font-semibold border border-slate-700 flex items-center space-x-1.5 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Demo Data</span>
        </button>
      </div>

      <div className="flex items-center space-x-2 bg-slate-900 p-2 rounded-xl border border-slate-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('roles')}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'roles'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Users & Role Permissions ({rolesList.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-emerald-600 text-white font-bold'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
        >
          Audit Log History ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveTab('hostinger')}
          className={`px-3 py-1.5 rounded-lg font-medium transition whitespace-nowrap flex items-center space-x-1.5 ${
            activeTab === 'hostinger'
              ? 'bg-purple-600 text-white font-bold'
              : 'text-purple-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Globe className="w-3.5 h-3.5 text-purple-400" />
          <span>Hostinger Subdomain Deployment</span>
        </button>
      </div>

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rolesList.map((r) => {
            const isCurrent = currentUserRole === r.role;
            return (
              <div
                key={r.role}
                className={`bg-slate-900 border rounded-xl p-4 shadow-sm space-y-3 text-xs transition ${
                  isCurrent ? 'border-emerald-500 bg-slate-850/80 ring-1 ring-emerald-500/50' : 'border-slate-800'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                      <span>{r.role}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-emerald-950 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-800">
                          Active User Role
                        </span>
                      )}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</p>
                  </div>
                  {!isCurrent && (
                    <button
                      onClick={() => setCurrentUserRole(r.role)}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded text-[11px] font-semibold transition shrink-0"
                    >
                      Switch To
                    </button>
                  )}
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Assigned Permissions</span>
                  <div className="flex flex-wrap gap-1">
                    {r.permissions.map((p, idx) => (
                      <span key={idx} className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700 font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300 font-mono">
              <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-800 font-sans">
                <tr>
                  <th className="py-3 px-3">Timestamp</th>
                  <th className="py-3 px-3">User & Role</th>
                  <th className="py-3 px-3">Action</th>
                  <th className="py-3 px-3">Module</th>
                  <th className="py-3 px-3">Record ID</th>
                  <th className="py-3 px-3">Previous Value</th>
                  <th className="py-3 px-3">New Value Logged</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-xs">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/40">
                    <td className="p-3 text-slate-400">{log.timestamp}</td>
                    <td className="p-3 font-sans text-white font-semibold">
                      {log.user} <span className="text-[10px] text-slate-400 font-mono">({log.role})</span>
                    </td>
                    <td className="p-3 font-sans text-emerald-400 font-bold">{log.action}</td>
                    <td className="p-3 font-sans text-slate-300">{log.module}</td>
                    <td className="p-3 text-blue-300 font-bold">{log.recordId}</td>
                    <td className="p-3 text-slate-500 truncate max-w-xs">{log.oldValue}</td>
                    <td className="p-3 text-emerald-300 font-bold truncate max-w-xs">{log.newValue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'hostinger' && (
        <div className="space-y-4">
          {/* Subdomain interactive tool header */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center space-x-2">
                  <Globe className="w-5 h-5 text-purple-400" />
                  <span>Hostinger Subdomain Configuration & Deployment</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Step-by-step setup for running HERE4U ERP on a custom Hostinger subdomain (LiteSpeed / Apache)
                </p>
              </div>

              <span className="px-2.5 py-1 bg-purple-950 text-purple-300 font-mono text-xs font-semibold rounded-lg border border-purple-800">
                Single-Page Application (SPA)
              </span>
            </div>

            {/* Inputs & live computed paths */}
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center pt-1">
              <div className="sm:col-span-4">
                <label className="text-[11px] text-slate-400 block mb-1">Subdomain Prefix</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                  <input
                    type="text"
                    value={hostingerSubdomain}
                    onChange={(e) => setHostingerSubdomain(e.target.value)}
                    placeholder="erp"
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-5">
                <label className="text-[11px] text-slate-400 block mb-1">Your Main Domain (in Hostinger)</label>
                <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-purple-500">
                  <input
                    type="text"
                    value={hostingerDomain}
                    onChange={(e) => setHostingerDomain(e.target.value)}
                    placeholder="yourcompany.com"
                    className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="text-[11px] text-slate-400 block mb-1">Live Target URL</label>
                <a
                  href={targetSubdomainUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-purple-950/70 hover:bg-purple-900/80 border border-purple-700/60 rounded-lg px-3 py-1.5 text-xs font-mono text-purple-200 truncate font-semibold flex items-center justify-between transition"
                >
                  <span className="truncate">{targetSubdomainUrl}</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1 shrink-0 text-purple-400" />
                </a>
              </div>
            </div>

            {/* Quick reference badges */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono pt-1">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Hostinger Folder:</span>
                <span className="text-emerald-400 font-bold">{targetFolder}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">DNS Record:</span>
                <span className="text-cyan-400 font-bold">A &rarr; {cleanSubdomain}</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 flex items-center justify-between">
                <span className="text-slate-400">Vite Config:</span>
                <span className="text-amber-400 font-bold">base: '/' (Root)</span>
              </div>
            </div>
          </div>

          {/* 5 Step Guided Deployment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Step 1 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <span className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  1
                </span>
                <span>Create Subdomain in Hostinger hPanel</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Log into <strong>Hostinger hPanel</strong> &rarr; Select your Domain &rarr; Click <strong>Domains</strong> &rarr; <strong>Subdomains</strong>.
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-[11px] space-y-1 text-slate-300">
                <div>Subdomain: <strong className="text-emerald-400">{cleanSubdomain}</strong></div>
                <div>Custom folder: <strong className="text-amber-400">Checked</strong></div>
                <div>Folder Path: <strong className="text-purple-300">{targetFolder}</strong></div>
              </div>
              <p className="text-[11px] text-slate-500">
                Click <strong>Create</strong>. Hostinger automatically updates your DNS zone.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <span className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  2
                </span>
                <span>Build the Vite Project</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Compile the production JavaScript, CSS bundle, and static assets:
              </p>
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-2.5 font-mono text-emerald-400 flex items-center justify-between">
                <code>npm run build</code>
                <button
                  onClick={() => copyText('npm run build', 'admin-build')}
                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans flex items-center space-x-1"
                >
                  {copiedCode === 'admin-build' ? (
                    <span className="text-emerald-400 flex items-center space-x-1">
                      <Check className="w-3 h-3 mr-1" /> Copied
                    </span>
                  ) : (
                    <span className="flex items-center space-x-1">
                      <Copy className="w-3 h-3 mr-1" /> Copy
                    </span>
                  )}
                </button>
              </div>
              <p className="text-[11px] text-slate-500">
                Generates a clean <code className="text-white">dist/</code> folder containing <code className="text-emerald-400">index.html</code>, <code className="text-emerald-400">assets/</code>, and <code className="text-emerald-400">.htaccess</code>.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <span className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  3
                </span>
                <span>Upload to Hostinger File Manager</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed pl-0.5">
                <li>Zip the files inside <strong className="text-white">dist/</strong> (not the folder itself).</li>
                <li>In Hostinger hPanel, go to <strong>Files</strong> &rarr; <strong>File Manager</strong>.</li>
                <li>Open your subdomain folder: <strong className="text-purple-300 font-mono">{targetFolder}</strong>.</li>
                <li>Delete any default placeholder file (<code className="text-slate-500">default.php</code>).</li>
                <li>Upload the zip file and click <strong>Extract</strong>.</li>
              </ol>
            </div>

            {/* Step 4 */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 font-bold text-white text-sm">
                <span className="h-6 w-6 rounded-full bg-purple-600 text-white flex items-center justify-center text-xs">
                  4
                </span>
                <span>Install Free SSL & Force HTTPS</span>
              </div>
              <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed pl-0.5">
                <li>In Hostinger hPanel, navigate to <strong>Security</strong> &rarr; <strong>SSL</strong>.</li>
                <li>Find <strong className="text-purple-300 font-mono">{cleanSubdomain}.{cleanDomain}</strong>.</li>
                <li>Click <strong>Install SSL</strong> (Free Let's Encrypt with auto-renewal).</li>
                <li>Turn ON <strong>Force HTTPS</strong>.</li>
                <li>Your ERP application is live and secure!</li>
              </ol>
            </div>
          </div>

          {/* Step 5 / .htaccess Details */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <FileCode className="w-4 h-4 text-emerald-400" />
                  <span>Configured .htaccess (Prevents 404 on Page Refresh)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Hostinger runs LiteSpeed/Apache. This file is already created in <code className="text-emerald-400">/public/.htaccess</code> and included in your build!
                </p>
              </div>

              <button
                onClick={() => copyText(htaccessCode, 'admin-htaccess')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition"
              >
                {copiedCode === 'admin-htaccess' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied .htaccess!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy .htaccess</span>
                  </>
                )}
              </button>
            </div>

            <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3.5 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-56">
              <pre>{htaccessCode}</pre>
            </div>
          </div>

          {/* Troubleshooting Checklist */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
            <h3 className="text-xs font-bold text-amber-400 flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <span>Hostinger Subdomain Troubleshooting Checklist</span>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-white block">404 Error on Reload</span>
                <p className="text-slate-400 text-[11px]">
                  Ensure <code className="text-emerald-400">.htaccess</code> is in <code className="text-purple-300">{targetFolder}</code>. Enable <strong>"Show Hidden Files"</strong> in Hostinger File Manager settings.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-white block">SSL Pending</span>
                <p className="text-slate-400 text-[11px]">
                  If the domain was just created, wait 5-10 minutes for DNS propagation, then click <strong>Reinstall SSL</strong> in hPanel.
                </p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 space-y-1">
                <span className="font-semibold text-white block">LiteSpeed Cache</span>
                <p className="text-slate-400 text-[11px]">
                  If new code changes don't appear, go to hPanel &rarr; <strong>LiteSpeed</strong> &rarr; <strong>Purge All Cache</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
