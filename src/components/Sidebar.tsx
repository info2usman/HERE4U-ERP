import React from 'react';
import {
  LayoutDashboard,
  Layers,
  FileText,
  Mail,
  MapPin,
  Calculator,
  CheckSquare,
  ShoppingBag,
  Users,
  CalendarCheck,
  Navigation,
  Truck,
  Receipt,
  Wrench,
  Camera,
  ClipboardCheck,
  CheckCircle2,
  FolderLock,
  DollarSign,
  FileSpreadsheet,
  Percent,
  CheckCheck,
  Send,
  Building2,
  PieChart,
  FolderOpen,
  BarChart3,
  Settings,
  Flame,
} from 'lucide-react';
import { useERP } from '../context/ERPContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
  alertBadge?: string;
  highlight?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC = () => {
  const { activeView, setActiveView, jobs, invoices, consolidatedBillings } = useERP();

  const pendingTicketsCount = jobs.filter((j) => j.ticketStatus === 'Pending').length;
  const readyForConsolidationCount = invoices.filter((i) => !i.consolidatedBillingId && i.status === 'Billing Set Ready').length;

  const navSections: NavSection[] = [
    {
      title: 'CORE OVERVIEW',
      items: [
        { id: 'dashboard', label: '01. Dashboard', icon: LayoutDashboard },
        { id: 'jobs', label: '02. Master Jobs Directory', icon: Layers, badge: jobs.length },
        { id: 'one-job-screen', label: '12. Management One-Job Screen', icon: Flame, highlight: true },
      ],
    },
    {
      title: 'REQUESTS & COMMERCIALS',
      items: [
        { id: 'ubl-requests', label: '02. UBL Requests / Tickets', icon: FileText, alertBadge: pendingTicketsCount > 0 ? `${pendingTicketsCount} Pending` : undefined },
        { id: 'gmail-threads', label: '03. Gmail / Email Threads', icon: Mail },
        { id: 'site-visits', label: '05. Site Visits & Survey', icon: MapPin },
        { id: 'estimates', label: '06. Estimates / Quotations', icon: Calculator },
        { id: 'approvals', label: '07. UBL Approvals', icon: CheckSquare },
      ],
    },
    {
      title: 'FIELD OPERATIONS & EXECUTION',
      items: [
        { id: 'work-orders', label: '19. Work Orders', icon: Wrench },
        { id: 'work-execution', label: '20. Daily Work & Photos', icon: Camera },
        { id: 'gps-operations', label: '14. GPS Verification', icon: Navigation },
        { id: 'staff', label: '11-12. Staff & Assignments', icon: Users },
        { id: 'attendance', label: '13. Staff Attendance', icon: CalendarCheck },
        { id: 'vehicles-travel', label: '15. Vehicles & Travel', icon: Truck },
        { id: 'expenses', label: '16-18. Expenses & Advances', icon: Receipt },
      ],
    },
    {
      title: 'PROCUREMENT & VENDORS',
      items: [
        { id: 'procurement', label: '08-10. Procurement & POs', icon: ShoppingBag },
      ],
    },
    {
      title: 'HANDOVER & COMPLETION',
      items: [
        { id: 'delivery-notes', label: '21. Delivery Notes (Signed)', icon: ClipboardCheck },
        { id: 'work-completion', label: '22. Work Completion', icon: CheckCircle2 },
        { id: 'ticket-closure', label: '23. Ticket Closure', icon: FolderLock },
      ],
    },
    {
      title: 'BILLING & BANK SETTLEMENTS',
      items: [
        { id: 'invoicing', label: '24. Individual Invoices', icon: DollarSign, alertBadge: readyForConsolidationCount > 0 ? `${readyForConsolidationCount} Ready` : undefined },
        { id: 'consolidated-billing', label: '25. Consolidated Billing', icon: FileSpreadsheet, badge: consolidatedBillings.length },
        { id: 'tax-deduction', label: '26. Tax Deduction & WHT', icon: Percent },
        { id: 'billing-set', label: '27. Physical Billing Set', icon: CheckCheck },
        { id: 'ubl-submission', label: '28. UBL Account Submission', icon: Send },
        { id: 'bank-receipts', label: '29-30. Bank Receipt & Allocations', icon: DollarSign },
      ],
    },
    {
      title: 'COSTING, REPOSITORIES & ADMIN',
      items: [
        { id: 'job-costing', label: '31. Job Costing & Profitability', icon: PieChart },
        { id: 'documents', label: '32. Central Documents', icon: FolderOpen },
        { id: 'reports', label: '34. Reports & Analytics', icon: BarChart3 },
        { id: 'branch-master', label: '04. Branch Master', icon: Building2 },
        { id: 'admin', label: '35. Admin & Audit Logs', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-[calc(100vh-53px)] overflow-y-auto shrink-0 select-none">
      {/* Blueprint Subtitle Banner */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-wider">
          <span className="font-bold text-white">Naeem Builder</span>
          <span className="bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800 font-bold">
            Client: HERE4U
          </span>
        </div>
        <div className="text-[11px] text-slate-400 font-medium mt-1">
          Job ID &rarr; Delivery Note &rarr; Consolidated Billing &rarr; Bank Payment
        </div>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-4">
        {navSections.map((sec, idx) => (
          <div key={idx}>
            <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              {sec.title}
            </div>
            <div className="space-y-0.5">
              {sec.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      isActive
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : item.highlight
                        ? 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/50 border border-emerald-800/50'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 truncate">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : item.highlight ? 'text-emerald-400' : 'text-slate-400'}`} />
                      <span className="truncate">{item.label}</span>
                    </div>

                    <div className="flex items-center space-x-1 shrink-0">
                      {item.alertBadge && (
                        <span className="text-[9px] font-bold bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full animate-pulse">
                          {item.alertBadge}
                        </span>
                      )}
                      {item.badge !== undefined && (
                        <span
                          className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                            isActive ? 'bg-emerald-700 text-emerald-100' : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Info */}
      <div className="p-3 border-t border-slate-800 text-[11px] text-slate-500 bg-slate-950/40">
        <div className="flex justify-between items-center text-slate-400 font-mono">
          <span>Naeem Builder</span>
          <span className="text-emerald-400">Client: HERE4U</span>
        </div>
      </div>
    </aside>
  );
};
