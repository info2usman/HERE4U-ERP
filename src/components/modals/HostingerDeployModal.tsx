import React, { useState } from 'react';
import {
  X,
  Globe,
  Server,
  FolderOpen,
  Copy,
  Check,
  FileCode,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Terminal,
  AlertTriangle,
  HelpCircle,
  UploadCloud,
  CheckCircle2,
} from 'lucide-react';

interface HostingerDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HostingerDeployModal: React.FC<HostingerDeployModalProps> = ({ isOpen, onClose }) => {
  const [subdomain, setSubdomain] = useState('erp');
  const [domain, setDomain] = useState('yourcompany.com');
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState<number>(1);

  if (!isOpen) return null;

  const cleanSubdomain = subdomain.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '') || 'erp';
  const cleanDomain = domain.trim().toLowerCase().replace(/^https?:\/\//, '').replace(/\/.*$/, '') || 'yourcompany.com';
  const fullSubdomainUrl = `https://${cleanSubdomain}.${cleanDomain}`;
  const targetFolder = `public_html/${cleanSubdomain}`;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const htaccessContent = `<IfModule mod_rewrite.c>
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-purple-600/20 border border-purple-500/40 text-purple-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center space-x-2">
                <span>Deploy HERE4U ERP to Hostinger Subdomain</span>
                <span className="text-[10px] bg-purple-950 text-purple-300 font-semibold px-2 py-0.5 rounded border border-purple-800 font-mono">
                  hPanel Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Complete configuration guide for Apache / LiteSpeed web servers on Hostinger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subdomain Calculator Banner */}
        <div className="p-4 bg-slate-850 border-b border-slate-800">
          <div className="text-xs font-semibold text-slate-300 mb-2 flex items-center space-x-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Customize Your Subdomain Settings:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-4">
              <label className="text-[11px] text-slate-400 block mb-1">Subdomain Prefix</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                <input
                  type="text"
                  value={subdomain}
                  onChange={(e) => setSubdomain(e.target.value)}
                  placeholder="erp"
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-5">
              <label className="text-[11px] text-slate-400 block mb-1">Your Primary Domain</label>
              <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent">
                <input
                  type="text"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="yourcompany.com"
                  className="w-full bg-transparent text-xs text-white font-mono focus:outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-3">
              <label className="text-[11px] text-slate-400 block mb-1">Target Live URL</label>
              <div className="bg-purple-950/60 border border-purple-700/60 rounded-lg px-2.5 py-1.5 text-xs font-mono text-purple-200 truncate font-semibold">
                {fullSubdomainUrl}
              </div>
            </div>
          </div>

          {/* Quick Computed Paths */}
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-mono">
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">hPanel Folder:</span>
              <span className="text-emerald-400 font-bold">{targetFolder}</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">DNS Type:</span>
              <span className="text-cyan-400 font-bold">A Record ({cleanSubdomain})</span>
            </div>
            <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800 flex items-center justify-between">
              <span className="text-slate-400">Server Type:</span>
              <span className="text-amber-400 font-bold">LiteSpeed / Apache</span>
            </div>
          </div>
        </div>

        {/* Step Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-4 overflow-x-auto text-xs">
          {[
            { num: 1, label: '1. Create Subdomain' },
            { num: 2, label: '2. Build Vite Project' },
            { num: 3, label: '3. Upload to Hostinger' },
            { num: 4, label: '4. .htaccess (SPA Routing)' },
            { num: 5, label: '5. SSL & Launch' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(s.num)}
              className={`py-2.5 px-3 font-medium border-b-2 whitespace-nowrap transition flex items-center space-x-1.5 ${
                activeStep === s.num
                  ? 'border-purple-500 text-purple-300 bg-slate-900/80 font-bold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {activeStep === 1 && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-2">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Step 1: Create the Subdomain in Hostinger hPanel</span>
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                  <li>
                    Log in to your <strong>Hostinger hPanel</strong> (
                    <a
                      href="https://hpanel.hostinger.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-400 hover:underline inline-flex items-center"
                    >
                      hpanel.hostinger.com <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    ).
                  </li>
                  <li>Go to <strong>Websites</strong> &rarr; Click <strong>Manage</strong> next to your domain (<code className="text-purple-300">{cleanDomain}</code>).</li>
                  <li>In the left sidebar, click <strong>Domains</strong> &rarr; <strong>Subdomains</strong>.</li>
                  <li>
                    In the <strong>"Create a New Subdomain"</strong> form:
                    <div className="mt-2 bg-slate-900 border border-slate-700/80 rounded-lg p-3 space-y-1.5 font-mono text-[11px]">
                      <div>Subdomain: <strong className="text-emerald-400">{cleanSubdomain}</strong></div>
                      <div>Domain: <strong className="text-white">.{cleanDomain}</strong></div>
                      <div>Custom folder for subdomain: <strong className="text-amber-400">Checked</strong></div>
                      <div>Folder: <strong className="text-purple-300">{targetFolder}</strong></div>
                    </div>
                  </li>
                  <li>Click the purple <strong>Create</strong> button.</li>
                </ol>
              </div>

              <div className="bg-emerald-950/40 border border-emerald-800/60 rounded-xl p-3.5 text-[11px] text-emerald-300">
                <strong>Hostinger DNS Note:</strong> Hostinger automatically adds the DNS record for this subdomain if your nameservers are pointed to Hostinger. If you use Cloudflare or an external registrar, add an <strong>A Record</strong> for <code className="bg-slate-900 px-1 py-0.5 rounded text-white font-mono">{cleanSubdomain}</code> pointing to your Hostinger server IP.
              </div>
            </div>
          )}

          {activeStep === 2 && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <Terminal className="w-4 h-4 text-purple-400" />
                  <span>Step 2: Build the Production Bundle</span>
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  In your project root directory (either locally or on your deployment workstation), run the standard Vite build command:
                </p>

                <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-emerald-400 text-xs flex items-center justify-between">
                  <code>npm run build</code>
                  <button
                    onClick={() => copyToClipboard('npm run build', 'build-cmd')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans flex items-center space-x-1 transition"
                  >
                    {copiedSection === 'build-cmd' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p>This command compiles your TypeScript and React components into the <strong className="text-white">dist/</strong> folder:</p>
                  <ul className="list-disc list-inside space-y-1 pl-1 text-slate-300">
                    <li><code className="text-emerald-400">dist/index.html</code> (Main SPA entry point)</li>
                    <li><code className="text-emerald-400">dist/assets/</code> (Production minified JavaScript and CSS files)</li>
                    <li><code className="text-emerald-400">dist/.htaccess</code> (Automatically copied from <code className="text-purple-300">public/.htaccess</code>)</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeStep === 3 && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <UploadCloud className="w-4 h-4 text-cyan-400" />
                  <span>Step 3: Upload Files to the Subdomain Folder</span>
                </h3>

                <div className="space-y-3 text-slate-300">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                    <span className="font-bold text-white text-xs block">
                      Recommended: Hostinger File Manager (2-Minute Upload)
                    </span>
                    <ol className="list-decimal list-inside space-y-1.5 pl-1 leading-relaxed">
                      <li>Go inside your local <strong className="text-white">dist/</strong> directory.</li>
                      <li>Select all items inside (<code className="text-emerald-300">index.html</code>, <code className="text-emerald-300">assets/</code>, <code className="text-emerald-300">.htaccess</code>).</li>
                      <li>Compress them into a <strong className="text-white">.zip</strong> archive (e.g., <code className="text-amber-300">dist-deploy.zip</code>).</li>
                      <li>In Hostinger hPanel, go to <strong>Files</strong> &rarr; <strong>File Manager</strong>.</li>
                      <li>Navigate into your subdomain directory: <strong className="text-purple-300 font-mono">{targetFolder}</strong>.</li>
                      <li>Delete any placeholder <code className="text-slate-400">default.php</code> file if present.</li>
                      <li>Click <strong>Upload</strong> &rarr; select <code className="text-amber-300">dist-deploy.zip</code>.</li>
                      <li>Right-click the zip file in File Manager &rarr; click <strong>Extract</strong> directly into <code className="text-purple-300 font-mono">{targetFolder}</code>.</li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeStep === 4 && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                    <FileCode className="w-4 h-4 text-emerald-400" />
                    <span>Step 4: .htaccess Single Page Application Configuration</span>
                  </h3>
                  <button
                    onClick={() => copyToClipboard(htaccessContent, 'htaccess-code')}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px] font-sans flex items-center space-x-1 transition"
                  >
                    {copiedSection === 'htaccess-code' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy .htaccess</span>
                      </>
                    )}
                  </button>
                </div>

                <p className="text-slate-300 leading-relaxed">
                  Hostinger runs LiteSpeed/Apache web servers. The <code className="text-emerald-300">.htaccess</code> file ensures that when users refresh any sub-page or visit direct URLs, the server routes the request to <code className="text-emerald-300">index.html</code> instead of throwing a <strong>404 Not Found</strong> error.
                </p>

                <div className="p-3 bg-emerald-950/40 border border-emerald-800/60 rounded-lg text-emerald-300 text-[11px]">
                  <strong>Good news:</strong> We have already created <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono">/public/.htaccess</code> in this project! When you run <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono">npm run build</code>, Vite automatically places it directly into <code className="text-white bg-slate-900 px-1 py-0.5 rounded font-mono">dist/.htaccess</code>.
                </div>

                <div className="relative bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 overflow-x-auto max-h-52">
                  <pre>{htaccessContent}</pre>
                </div>
              </div>
            </div>
          )}

          {activeStep === 5 && (
            <div className="space-y-4">
              <div className="bg-slate-800/70 border border-slate-700 rounded-xl p-4 space-y-3">
                <h3 className="font-bold text-white text-sm flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Step 5: Activate Free SSL & Launch</span>
                </h3>

                <ol className="list-decimal list-inside space-y-2 text-slate-300 leading-relaxed pl-1">
                  <li>In Hostinger hPanel, go to <strong>Security</strong> &rarr; <strong>SSL</strong>.</li>
                  <li>Find your subdomain (<code className="text-purple-300 font-mono">{cleanSubdomain}.{cleanDomain}</code>).</li>
                  <li>Click <strong>Install SSL</strong> (Hostinger includes free unlimited Let's Encrypt SSL certificates).</li>
                  <li>Toggle <strong>Force HTTPS</strong> to ON.</li>
                  <li>Open <a href={fullSubdomainUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 font-bold hover:underline inline-flex items-center ml-1">{fullSubdomainUrl} <ExternalLink className="w-3 h-3 ml-1" /></a> in your browser!</li>
                </ol>
              </div>

              {/* Troubleshooting Card */}
              <div className="bg-slate-800/50 border border-slate-700/80 rounded-xl p-4 space-y-2.5">
                <h4 className="font-bold text-white text-xs flex items-center space-x-1.5 text-amber-400">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Common Troubleshooting Tips</span>
                </h4>
                <div className="space-y-2 text-[11px] text-slate-300">
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block">404 Error on page refresh:</span>
                    <span>Make sure <code className="text-emerald-400">.htaccess</code> is in <code className="text-purple-300">{targetFolder}</code>. In Hostinger File Manager, click Settings (Gear icon) &rarr; enable <strong>"Show Hidden Files"</strong> so you can see dotfiles.</span>
                  </div>
                  <div className="p-2.5 bg-slate-900 rounded-lg border border-slate-800">
                    <span className="font-semibold text-white block">Changes not showing up:</span>
                    <span>Purge LiteSpeed Cache in Hostinger hPanel &rarr; Websites &rarr; LiteSpeed, or perform a hard refresh in Chrome (<code className="text-amber-300">Ctrl + Shift + R</code>).</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-950 border-t border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono">
            Target: <span className="text-emerald-400 font-bold">{fullSubdomainUrl}</span>
          </div>

          <div className="flex items-center space-x-2">
            {activeStep > 1 && (
              <button
                onClick={() => setActiveStep(activeStep - 1)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold transition"
              >
                Previous
              </button>
            )}
            {activeStep < 5 ? (
              <button
                onClick={() => setActiveStep(activeStep + 1)}
                className="px-3.5 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition"
              >
                <span>Next Step</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition"
              >
                Got It, Ready to Deploy!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
