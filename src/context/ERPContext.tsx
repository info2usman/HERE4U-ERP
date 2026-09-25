import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Job,
  Branch,
  Staff,
  Vendor,
  Vehicle,
  TravelRecord,
  GmailThread,
  SiteVisit,
  Estimate,
  UblApproval,
  PurchaseRequest,
  PurchaseOrder,
  StaffAssignment,
  StaffAttendance,
  GpsEvent,
  JobExpense,
  StaffAdvance,
  WorkOrder,
  WorkExecution,
  DeliveryNote,
  WorkCompletion,
  TicketClosure,
  IndividualInvoice,
  ConsolidatedBilling,
  TaxDeduction,
  PhysicalBillingSet,
  UblAccountSubmission,
  BankReceipt,
  PaymentAllocation,
  JobCosting,
  DocumentItem,
  NotificationItem,
  AuditLogItem,
  UserRole,
  JobStatusCode,
  MASTER_JOB_STATUSES,
} from '../types/erp';
import {
  INITIAL_BRANCHES,
  INITIAL_STAFF,
  INITIAL_VENDORS,
  INITIAL_VEHICLES,
  INITIAL_JOBS,
  INITIAL_GMAIL_THREADS,
  INITIAL_SITE_VISITS,
  INITIAL_ESTIMATES,
  INITIAL_APPROVALS,
  INITIAL_PURCHASE_REQUESTS,
  INITIAL_PURCHASE_ORDERS,
  INITIAL_STAFF_ASSIGNMENTS,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_GPS_EVENTS,
  INITIAL_TRAVEL_RECORDS,
  INITIAL_JOB_EXPENSES,
  INITIAL_STAFF_ADVANCES,
  INITIAL_WORK_ORDERS,
  INITIAL_WORK_EXECUTIONS,
  INITIAL_DELIVERY_NOTES,
  INITIAL_WORK_COMPLETIONS,
  INITIAL_TICKET_CLOSURES,
  INITIAL_INVOICES,
  INITIAL_CONSOLIDATED_BILLINGS,
  INITIAL_TAX_DEDUCTIONS,
  INITIAL_PHYSICAL_BILLING_SETS,
  INITIAL_ACCOUNT_SUBMISSIONS,
  INITIAL_BANK_RECEIPTS,
  INITIAL_PAYMENT_ALLOCATIONS,
  INITIAL_DOCUMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

interface ERPContextType {
  // Master data & operational tables
  branches: Branch[];
  staff: Staff[];
  vendors: Vendor[];
  vehicles: Vehicle[];
  travelRecords: TravelRecord[];
  jobs: Job[];
  gmailThreads: GmailThread[];
  siteVisits: SiteVisit[];
  estimates: Estimate[];
  approvals: UblApproval[];
  purchaseRequests: PurchaseRequest[];
  purchaseOrders: PurchaseOrder[];
  staffAssignments: StaffAssignment[];
  staffAttendance: StaffAttendance[];
  gpsEvents: GpsEvent[];
  jobExpenses: JobExpense[];
  staffAdvances: StaffAdvance[];
  workOrders: WorkOrder[];
  workExecutions: WorkExecution[];
  deliveryNotes: DeliveryNote[];
  workCompletions: WorkCompletion[];
  ticketClosures: TicketClosure[];
  invoices: IndividualInvoice[];
  consolidatedBillings: ConsolidatedBilling[];
  taxDeductions: TaxDeduction[];
  physicalBillingSets: PhysicalBillingSet[];
  accountSubmissions: UblAccountSubmission[];
  bankReceipts: BankReceipt[];
  paymentAllocations: PaymentAllocation[];
  documents: DocumentItem[];
  notifications: NotificationItem[];
  auditLogs: AuditLogItem[];

  // App UI State
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  activeView: string;
  setActiveView: (view: string) => void;
  selectedJobId: string | null;
  setSelectedJobId: (id: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Actions
  createJob: (jobData: Partial<Job>) => Job;
  linkUblTicket: (jobId: string, ublTicketNo: string) => void;
  updateJobStatus: (jobId: string, statusCode: JobStatusCode, remarks?: string) => void;
  addSiteVisit: (visit: Omit<SiteVisit, 'id'>) => SiteVisit;
  addEstimate: (estimate: Omit<Estimate, 'id'>) => Estimate;
  addApproval: (approval: Omit<UblApproval, 'id'>) => UblApproval;
  addPurchaseRequest: (pr: Omit<PurchaseRequest, 'id'>) => PurchaseRequest;
  addPurchaseOrder: (po: Omit<PurchaseOrder, 'id'>) => PurchaseOrder;
  addStaffAssignment: (assignment: Omit<StaffAssignment, 'id'>) => StaffAssignment;
  addStaffAttendance: (att: Omit<StaffAttendance, 'id'>) => StaffAttendance;
  addGpsEvent: (evt: Omit<GpsEvent, 'id'>) => GpsEvent;
  addJobExpense: (exp: Omit<JobExpense, 'id'>) => JobExpense;
  updateExpenseStatus: (id: string, status: JobExpense['approvalStatus']) => void;
  addDeliveryNote: (dn: Omit<DeliveryNote, 'id'>) => DeliveryNote;
  createInvoice: (inv: Omit<IndividualInvoice, 'id'>) => IndividualInvoice;
  createConsolidatedBilling: (data: { invoiceIds: string[]; ublAccount: string; billingPeriod: string }) => ConsolidatedBilling;
  recordPhysicalBillingSet: (pbs: Omit<PhysicalBillingSet, 'id'>) => void;
  submitToUblAccount: (sub: Omit<UblAccountSubmission, 'id'>) => void;
  recordBankReceipt: (rcp: Omit<BankReceipt, 'id'>, invoiceIdsToSettle?: string[]) => void;
  calculateJobCosting: (jobId: string) => JobCosting;
  addDocument: (doc: Omit<DocumentItem, 'id'>) => void;
  markNotificationRead: (id: string) => void;
  addNotification: (notif: Omit<NotificationItem, 'id'>) => void;
  resetAllData: () => void;
  openOneJobScreen: (jobId: string) => void;
}

const ERPContext = createContext<ERPContextType | undefined>(undefined);

export const ERPProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Helper for localStorage
  const loadState = <T,>(key: string, initial: T): T => {
    try {
      const stored = localStorage.getItem(`here4u_erp_${key}`);
      return stored ? JSON.parse(stored) : initial;
    } catch {
      return initial;
    }
  };

  const [branches, setBranches] = useState<Branch[]>(() => loadState('branches', INITIAL_BRANCHES));
  const [staff, setStaff] = useState<Staff[]>(() => loadState('staff', INITIAL_STAFF));
  const [vendors, setVendors] = useState<Vendor[]>(() => loadState('vendors', INITIAL_VENDORS));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => loadState('vehicles', INITIAL_VEHICLES));
  const [travelRecords, setTravelRecords] = useState<TravelRecord[]>(() => loadState('travel', INITIAL_TRAVEL_RECORDS));
  const [jobs, setJobs] = useState<Job[]>(() => loadState('jobs', INITIAL_JOBS));
  const [gmailThreads, setGmailThreads] = useState<GmailThread[]>(() => loadState('gmail', INITIAL_GMAIL_THREADS));
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(() => loadState('site_visits', INITIAL_SITE_VISITS));
  const [estimates, setEstimates] = useState<Estimate[]>(() => loadState('estimates', INITIAL_ESTIMATES));
  const [approvals, setApprovals] = useState<UblApproval[]>(() => loadState('approvals', INITIAL_APPROVALS));
  const [purchaseRequests, setPurchaseRequests] = useState<PurchaseRequest[]>(() => loadState('pr', INITIAL_PURCHASE_REQUESTS));
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(() => loadState('po', INITIAL_PURCHASE_ORDERS));
  const [staffAssignments, setStaffAssignments] = useState<StaffAssignment[]>(() => loadState('assignments', INITIAL_STAFF_ASSIGNMENTS));
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendance[]>(() => loadState('attendance', INITIAL_STAFF_ATTENDANCE));
  const [gpsEvents, setGpsEvents] = useState<GpsEvent[]>(() => loadState('gps', INITIAL_GPS_EVENTS));
  const [jobExpenses, setJobExpenses] = useState<JobExpense[]>(() => loadState('expenses', INITIAL_JOB_EXPENSES));
  const [staffAdvances, setStaffAdvances] = useState<StaffAdvance[]>(() => loadState('advances', INITIAL_STAFF_ADVANCES));
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() => loadState('work_orders', INITIAL_WORK_ORDERS));
  const [workExecutions, setWorkExecutions] = useState<WorkExecution[]>(() => loadState('work_exec', INITIAL_WORK_EXECUTIONS));
  const [deliveryNotes, setDeliveryNotes] = useState<DeliveryNote[]>(() => loadState('delivery_notes', INITIAL_DELIVERY_NOTES));
  const [workCompletions, setWorkCompletions] = useState<WorkCompletion[]>(() => loadState('completions', INITIAL_WORK_COMPLETIONS));
  const [ticketClosures, setTicketClosures] = useState<TicketClosure[]>(() => loadState('closures', INITIAL_TICKET_CLOSURES));
  const [invoices, setInvoices] = useState<IndividualInvoice[]>(() => loadState('invoices', INITIAL_INVOICES));
  const [consolidatedBillings, setConsolidatedBillings] = useState<ConsolidatedBilling[]>(() => loadState('consolidated', INITIAL_CONSOLIDATED_BILLINGS));
  const [taxDeductions, setTaxDeductions] = useState<TaxDeduction[]>(() => loadState('tax', INITIAL_TAX_DEDUCTIONS));
  const [physicalBillingSets, setPhysicalBillingSets] = useState<PhysicalBillingSet[]>(() => loadState('billing_sets', INITIAL_PHYSICAL_BILLING_SETS));
  const [accountSubmissions, setAccountSubmissions] = useState<UblAccountSubmission[]>(() => loadState('submissions', INITIAL_ACCOUNT_SUBMISSIONS));
  const [bankReceipts, setBankReceipts] = useState<BankReceipt[]>(() => loadState('receipts', INITIAL_BANK_RECEIPTS));
  const [paymentAllocations, setPaymentAllocations] = useState<PaymentAllocation[]>(() => loadState('allocations', INITIAL_PAYMENT_ALLOCATIONS));
  const [documents, setDocuments] = useState<DocumentItem[]>(() => loadState('documents', INITIAL_DOCUMENTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => loadState('notifications', INITIAL_NOTIFICATIONS));
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(() => loadState('audit', INITIAL_AUDIT_LOGS));

  // Navigation and UI state
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Admin');
  const [activeView, setActiveView] = useState<string>('dashboard');
  const [selectedJobId, setSelectedJobId] = useState<string | null>('NB-H4U-2026-001');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Persist to local storage
  useEffect(() => {
    try {
      localStorage.setItem('here4u_erp_jobs', JSON.stringify(jobs));
      localStorage.setItem('here4u_erp_invoices', JSON.stringify(invoices));
      localStorage.setItem('here4u_erp_consolidated', JSON.stringify(consolidatedBillings));
      localStorage.setItem('here4u_erp_receipts', JSON.stringify(bankReceipts));
      localStorage.setItem('here4u_erp_expenses', JSON.stringify(jobExpenses));
      localStorage.setItem('here4u_erp_site_visits', JSON.stringify(siteVisits));
      localStorage.setItem('here4u_erp_estimates', JSON.stringify(estimates));
      localStorage.setItem('here4u_erp_delivery_notes', JSON.stringify(deliveryNotes));
      localStorage.setItem('here4u_erp_audit', JSON.stringify(auditLogs));
      localStorage.setItem('here4u_erp_notifications', JSON.stringify(notifications));
    } catch (e) {
      console.warn('Storage persist limit or error', e);
    }
  }, [jobs, invoices, consolidatedBillings, bankReceipts, jobExpenses, siteVisits, estimates, deliveryNotes, auditLogs, notifications]);

  const logAudit = (action: string, module: string, recordId: string, oldValue: string, newValue: string) => {
    const entry: AuditLogItem = {
      id: `AUD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      user: `${currentUserRole} User`,
      role: currentUserRole,
      action,
      module,
      recordId,
      oldValue,
      newValue,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
    };
    setAuditLogs((prev) => [entry, ...prev]);
  };

  const addNotification = (notif: Omit<NotificationItem, 'id'>) => {
    const item: NotificationItem = {
      ...notif,
      id: `NOTIF-${Date.now()}`,
    };
    setNotifications((prev) => [item, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const openOneJobScreen = (jobId: string) => {
    setSelectedJobId(jobId);
    setActiveView('one-job-screen');
  };

  // 1. Create Job (Strict adherence to Section 2 & 4: Permanent Job ID, Ticket can be pending)
  const createJob = (jobData: Partial<Job>): Job => {
    const nextNum = jobs.length + 1;
    const formattedId = `NB-H4U-2026-${String(nextNum).padStart(3, '0')}`;
    const hasTicket = Boolean(jobData.ublTicketNo && jobData.ublTicketNo.trim() !== '');

    const newJob: Job = {
      id: formattedId,
      ublTicketNo: hasTicket ? jobData.ublTicketNo?.trim() : undefined,
      ticketStatus: hasTicket ? 'Linked' : 'Pending',
      requestType: jobData.requestType || (hasTicket ? 'A: UBL Ticket Received' : 'B: Estimation / Site Visit Request — Ticket Not Available'),
      branchId: jobData.branchId || branches[0]?.id || 'BR-001',
      title: jobData.title || 'General Maintenance Request',
      description: jobData.description || 'Details pending preliminary survey',
      workCategory: jobData.workCategory || 'HVAC / AC Repair',
      priority: jobData.priority || 'Normal',
      statusCode: '01', // NEW REQUEST
      supervisorId: jobData.supervisorId || staff[0]?.id || 'STF-001',
      createdAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      targetCompletionDate: jobData.targetCompletionDate || new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10),
      estimatedCost: 0,
      actualCost: 0,
      grossBilling: 0,
      netReceipt: 0,
      physicalBillingSetReady: false,
      notes: jobData.notes,
    };

    setJobs((prev) => [newJob, ...prev]);
    logAudit('Create Job', '02 UBL Requests', newJob.id, '-', `Job ${newJob.id} created (${newJob.ticketStatus === 'Pending' ? 'Ticket Pending' : newJob.ublTicketNo})`);

    addNotification({
      jobId: newJob.id,
      type: 'New Request',
      title: `New Job Created: ${newJob.id}`,
      message: `${newJob.title} at ${branches.find(b => b.id === newJob.branchId)?.name || 'Branch'}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      priority: 'high',
    });

    if (newJob.ticketStatus === 'Pending') {
      addNotification({
        jobId: newJob.id,
        type: 'Ticket Missing',
        title: `UBL Ticket Missing for ${newJob.id}`,
        message: 'Job was created without UBL Ticket. Remember to link UBL ticket number when received from bank.',
        timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
        read: false,
        priority: 'medium',
      });
    }

    return newJob;
  };

  // 2. Link UBL Ticket to existing Job (Blueprint rule: DO NOT DUPLICATE JOB)
  const linkUblTicket = (jobId: string, ublTicketNo: string) => {
    const cleanTicket = ublTicketNo.trim();
    if (!cleanTicket) return;

    setJobs((prev) =>
      prev.map((job) => {
        if (job.id === jobId) {
          const oldTicket = job.ublTicketNo || 'Pending';
          logAudit('Link UBL Ticket', '02 UBL Requests', job.id, oldTicket, cleanTicket);
          return {
            ...job,
            ublTicketNo: cleanTicket,
            ticketStatus: 'Linked',
          };
        }
        return job;
      })
    );

    addNotification({
      jobId,
      type: 'Ticket Received',
      title: `Ticket Linked to ${jobId}`,
      message: `UBL Ticket #${cleanTicket} successfully linked to Job ${jobId}.`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      priority: 'medium',
    });
  };

  // 3. Update Master Job Status (Code 01 to 22)
  const updateJobStatus = (jobId: string, statusCode: JobStatusCode, remarks?: string) => {
    const statusDef = MASTER_JOB_STATUSES.find((s) => s.code === statusCode);
    const label = statusDef ? statusDef.label : statusCode;

    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          const oldStatus = j.statusCode;
          logAudit('Status Update', 'Master Job Status', j.id, `Status: ${oldStatus}`, `Status: ${statusCode} - ${label} ${remarks ? `(${remarks})` : ''}`);
          return {
            ...j,
            statusCode,
          };
        }
        return j;
      })
    );
  };

  // 4. Site Visit
  const addSiteVisit = (visitData: Omit<SiteVisit, 'id'>): SiteVisit => {
    const newVisit: SiteVisit = {
      ...visitData,
      id: `SV-${String(siteVisits.length + 1).padStart(3, '0')}`,
    };
    setSiteVisits((prev) => [newVisit, ...prev]);

    // Advance job to 03 SITE VISITED if currently at 01 or 02
    const targetJob = jobs.find((j) => j.id === newVisit.jobId);
    if (targetJob && (targetJob.statusCode === '01' || targetJob.statusCode === '02')) {
      updateJobStatus(targetJob.id, '03', 'Site visit completed');
    }

    logAudit('Add Site Visit', '05 Site Visits / Survey', newVisit.id, '-', `Visit logged for ${newVisit.jobId} by ${newVisit.assignedStaffId}`);
    return newVisit;
  };

  // 5. Estimates (Version Control V1, V2, V3, Final, Approved - Never Overwrite)
  const addEstimate = (estData: Omit<Estimate, 'id'>): Estimate => {
    const newEst: Estimate = {
      ...estData,
      id: `EST-${Date.now()}`,
    };
    setEstimates((prev) => [newEst, ...prev]);

    // Update job estimated cost
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === newEst.jobId) {
          return {
            ...j,
            estimatedCost: newEst.total,
            statusCode: newEst.status === 'Submitted to UBL' ? '05' : j.statusCode === '03' ? '04' : j.statusCode,
          };
        }
        return j;
      })
    );

    logAudit('Create Estimate Version', '06 Estimates / Quotations', newEst.estimateNo, '-', `Version ${newEst.version} generated: PKR ${newEst.total.toLocaleString()}`);
    return newEst;
  };

  // 6. UBL Approvals
  const addApproval = (appData: Omit<UblApproval, 'id'>): UblApproval => {
    const newApp: UblApproval = {
      ...appData,
      id: `APP-${Date.now()}`,
    };
    setApprovals((prev) => [newApp, ...prev]);

    if (newApp.status === 'Approved') {
      updateJobStatus(newApp.jobId, '07', `Approved by ${newApp.ublApprover}`);
      setJobs((prev) =>
        prev.map((j) => (j.id === newApp.jobId ? { ...j, approvedAmount: newApp.approvedAmount } : j))
      );
    }

    logAudit('Log UBL Approval', '07 UBL Approvals', newApp.id, '-', `Status: ${newApp.status} (PKR ${newApp.approvedAmount.toLocaleString()})`);
    return newApp;
  };

  // 7. Purchase Requests & Orders
  const addPurchaseRequest = (prData: Omit<PurchaseRequest, 'id'>): PurchaseRequest => {
    const newPr: PurchaseRequest = {
      ...prData,
      id: `PR-${String(purchaseRequests.length + 1).padStart(3, '0')}`,
    };
    setPurchaseRequests((prev) => [newPr, ...prev]);
    logAudit('New Purchase Request', '08 Purchase Requests', newPr.id, '-', `${newPr.material} (Qty: ${newPr.quantity})`);
    return newPr;
  };

  const addPurchaseOrder = (poData: Omit<PurchaseOrder, 'id'>): PurchaseOrder => {
    const newPo: PurchaseOrder = {
      ...poData,
      id: `PO-${Date.now()}`,
    };
    setPurchaseOrders((prev) => [newPo, ...prev]);

    // Recalculate job actual cost
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === newPo.jobId) {
          return {
            ...j,
            actualCost: (j.actualCost || 0) + newPo.amount,
          };
        }
        return j;
      })
    );

    logAudit('Issued PO', '10 Procurement / Purchase', newPo.poNo, '-', `PO issued to vendor for PKR ${newPo.amount.toLocaleString()}`);
    return newPo;
  };

  // 8. Staff Assignment & Attendance
  const addStaffAssignment = (data: Omit<StaffAssignment, 'id'>): StaffAssignment => {
    const newAssign: StaffAssignment = {
      ...data,
      id: `ASN-${Date.now()}`,
    };
    setStaffAssignments((prev) => [newAssign, ...prev]);
    updateJobStatus(newAssign.jobId, '09', `Assigned staff ${newAssign.staffId}`);
    return newAssign;
  };

  const addStaffAttendance = (attData: Omit<StaffAttendance, 'id'>): StaffAttendance => {
    const newAtt: StaffAttendance = {
      ...attData,
      id: `ATT-${Date.now()}`,
    };
    setStaffAttendance((prev) => [newAtt, ...prev]);
    logAudit('Attendance Recorded', '13 Staff Attendance', newAtt.id, '-', `${newAtt.type} Attendance for ${newAtt.staffId} (${newAtt.hours} hrs)`);
    return newAtt;
  };

  // 9. GPS Events
  const addGpsEvent = (evtData: Omit<GpsEvent, 'id'>): GpsEvent => {
    const newEvt: GpsEvent = {
      ...evtData,
      id: `GPS-${Date.now()}`,
    };
    setGpsEvents((prev) => [newEvt, ...prev]);
    logAudit('GPS Event', '14 GPS / Field Operations', newEvt.id, '-', `${newEvt.eventType} - ${newEvt.status} (${newEvt.distanceFromBranchMeters}m from branch)`);
    return newEvt;
  };

  // 10. Expenses
  const addJobExpense = (expData: Omit<JobExpense, 'id'>): JobExpense => {
    const newExp: JobExpense = {
      ...expData,
      id: `EXP-${Date.now()}`,
    };
    setJobExpenses((prev) => [newExp, ...prev]);

    // Add to job actual cost
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === newExp.jobId) {
          return { ...j, actualCost: (j.actualCost || 0) + newExp.amount };
        }
        return j;
      })
    );

    logAudit('Submitted Job Expense', '16 Job Expenses', newExp.id, '-', `${newExp.category}: PKR ${newExp.amount.toLocaleString()}`);
    return newExp;
  };

  const updateExpenseStatus = (id: string, status: JobExpense['approvalStatus']) => {
    setJobExpenses((prev) =>
      prev.map((e) => (e.id === id ? { ...e, approvalStatus: status } : e))
    );
  };

  // 11. Delivery Notes (Signed & Stamped)
  const addDeliveryNote = (dnData: Omit<DeliveryNote, 'id'>): DeliveryNote => {
    const newDn: DeliveryNote = {
      ...dnData,
      id: `DN-${Date.now()}`,
    };
    setDeliveryNotes((prev) => [newDn, ...prev]);

    if (newDn.ublStampReceived) {
      updateJobStatus(newDn.jobId, '13', `Delivery note signed & stamped by ${newDn.ublRepresentative}`);
    } else {
      updateJobStatus(newDn.jobId, '12', 'Delivery note generated, pending stamp');
    }

    logAudit('Created Delivery Note', '21 Delivery Notes', newDn.dnNo, '-', `Signed by ${newDn.ublRepresentative} (${newDn.designation})`);
    return newDn;
  };

  // 12. Individual Invoicing
  const createInvoice = (invData: Omit<IndividualInvoice, 'id'>): IndividualInvoice => {
    const newInv: IndividualInvoice = {
      ...invData,
      id: `INV-${Date.now()}`,
    };
    setInvoices((prev) => [newInv, ...prev]);

    updateJobStatus(newInv.jobId, '17', 'Billing Set Ready with Invoice');
    setJobs((prev) =>
      prev.map((j) => (j.id === newInv.jobId ? { ...j, grossBilling: newInv.grossInvoice, physicalBillingSetReady: true } : j))
    );

    logAudit('Created Invoice', '24 Individual Invoices', newInv.invoiceNo, '-', `Gross: PKR ${newInv.grossInvoice.toLocaleString()} (Net: PKR ${newInv.netReceivable.toLocaleString()})`);

    addNotification({
      jobId: newInv.jobId,
      type: 'Consolidated Billing Ready',
      title: `Invoice ${newInv.invoiceNo} Ready for Consolidation`,
      message: `Job ${newInv.jobId} is ready to be batched into Consolidated Billing.`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      priority: 'high',
    });

    return newInv;
  };

  // 13. Consolidated Billing (Batch multiple invoices -> e.g. CI-2026-001)
  const createConsolidatedBilling = (data: { invoiceIds: string[]; ublAccount: string; billingPeriod: string }): ConsolidatedBilling => {
    const selectedInvs = invoices.filter((inv) => data.invoiceIds.includes(inv.id));
    const grossTotal = selectedInvs.reduce((acc, curr) => acc + curr.grossInvoice, 0);
    const salesTaxTotal = selectedInvs.reduce((acc, curr) => acc + curr.salesTaxAmount, 0);
    const incomeTaxTotal = selectedInvs.reduce((acc, curr) => acc + curr.incomeTaxAmount, 0);
    const otherDeductionsTotal = selectedInvs.reduce((acc, curr) => acc + curr.otherDeductions, 0);
    const netAmount = grossTotal - (salesTaxTotal + incomeTaxTotal + otherDeductionsTotal);

    const nextCiNum = consolidatedBillings.length + 1;
    const ciNo = `CI-2026-${String(nextCiNum).padStart(3, '0')}`;

    const newCi: ConsolidatedBilling = {
      id: ciNo,
      consolidatedNo: ciNo,
      date: new Date().toISOString().slice(0, 10),
      ublAccount: data.ublAccount,
      billingPeriod: data.billingPeriod,
      invoiceIds: data.invoiceIds,
      numberOfInvoices: selectedInvs.length,
      grossTotal,
      salesTaxTotal,
      incomeTaxTotal,
      otherDeductionsTotal,
      netAmount,
      status: 'Physical Set Prepared',
    };

    setConsolidatedBillings((prev) => [newCi, ...prev]);

    // Mark individual invoices as consolidated
    setInvoices((prev) =>
      prev.map((inv) =>
        data.invoiceIds.includes(inv.id)
          ? { ...inv, consolidatedBillingId: ciNo, status: 'Consolidated' }
          : inv
      )
    );

    // Create tax deduction line records for each invoice
    const newTaxRecords: TaxDeduction[] = selectedInvs.map((inv) => ({
      id: `TAX-${Date.now()}-${inv.id}`,
      consolidatedBillingId: ciNo,
      invoiceId: inv.id,
      jobId: inv.jobId,
      grossAmount: inv.grossInvoice,
      taxableAmount: inv.serviceAmount,
      salesTaxRate: inv.salesTaxPercent,
      salesTaxAmount: inv.salesTaxAmount,
      incomeTaxRate: inv.incomeTaxPercent,
      incomeTaxAmount: inv.incomeTaxAmount,
      otherDeduction: inv.otherDeductions,
      totalDeduction: inv.totalDeduction,
      netAmount: inv.netReceivable,
      status: 'Pending Certificate',
    }));
    setTaxDeductions((prev) => [...newTaxRecords, ...prev]);

    logAudit('Consolidated Billing Created', '25 Consolidated Billing', ciNo, '-', `Consolidated ${selectedInvs.length} invoices. Total Net: PKR ${netAmount.toLocaleString()}`);

    return newCi;
  };

  // 14. Physical Billing Set Checklist
  const recordPhysicalBillingSet = (pbsData: Omit<PhysicalBillingSet, 'id'>) => {
    const newPbs: PhysicalBillingSet = {
      ...pbsData,
      id: `PBS-${Date.now()}`,
    };
    setPhysicalBillingSets((prev) => [newPbs, ...prev]);
    logAudit('Billing Set Checked', '27 Physical Billing Set', newPbs.consolidatedBillingId, '-', `Status: ${newPbs.status}`);
  };

  // 15. UBL Account Submission
  const submitToUblAccount = (subData: Omit<UblAccountSubmission, 'id'>) => {
    const newSub: UblAccountSubmission = {
      ...subData,
      id: `SUB-${Date.now()}`,
    };
    setAccountSubmissions((prev) => [newSub, ...prev]);

    // Update consolidated billing status
    setConsolidatedBillings((prev) =>
      prev.map((c) =>
        c.consolidatedNo === newSub.consolidatedBillingNo
          ? {
              ...c,
              status: 'Submitted to UBL Account',
              submissionDate: newSub.submissionDate,
              receivingPerson: newSub.receivingPerson,
            }
          : c
      )
    );

    // Update jobs to 18 SUBMITTED TO UBL ACCOUNT
    const ci = consolidatedBillings.find((c) => c.consolidatedNo === newSub.consolidatedBillingNo);
    if (ci) {
      const linkedInvoices = invoices.filter((i) => ci.invoiceIds.includes(i.id));
      linkedInvoices.forEach((inv) => {
        updateJobStatus(inv.jobId, '18', `Consolidated bill ${ci.consolidatedNo} submitted to ${newSub.receivingPerson}`);
      });
    }

    logAudit('Submitted to UBL Account', '28 UBL Account Submission', newSub.consolidatedBillingNo, 'Billing Set Ready', `Submitted to ${newSub.receivingPerson}`);
  };

  // 16. Bank Receipt & Payment Allocation (Blueprint: one UBL bank transfer can settle multiple invoices)
  const recordBankReceipt = (rcpData: Omit<BankReceipt, 'id'>, invoiceIdsToSettle?: string[]) => {
    const newRcp: BankReceipt = {
      ...rcpData,
      id: `RCP-${Date.now()}`,
    };
    setBankReceipts((prev) => [newRcp, ...prev]);

    const ci = consolidatedBillings.find((c) => c.consolidatedNo === newRcp.consolidatedBillingNo);
    const targetInvoiceIds = invoiceIdsToSettle || ci?.invoiceIds || [];

    // Allocate payment
    const newAllocations: PaymentAllocation[] = targetInvoiceIds.map((invId) => {
      const inv = invoices.find((i) => i.id === invId);
      return {
        id: `ALC-${Date.now()}-${invId}`,
        paymentId: newRcp.paymentId,
        consolidatedBillingNo: newRcp.consolidatedBillingNo,
        invoiceId: invId,
        jobId: inv?.jobId || '',
        grossAmount: inv?.grossInvoice || 0,
        taxDeduction: inv?.totalDeduction || 0,
        netAllocated: inv?.netReceivable || 0,
        allocatedDate: newRcp.transferDate,
        status: 'Settled',
      };
    });

    setPaymentAllocations((prev) => [...newAllocations, ...prev]);

    // Update invoices status to Paid
    setInvoices((prev) =>
      prev.map((inv) =>
        targetInvoiceIds.includes(inv.id) ? { ...inv, status: 'Paid' } : inv
      )
    );

    // Update consolidated billing status to Paid
    setConsolidatedBillings((prev) =>
      prev.map((c) =>
        c.consolidatedNo === newRcp.consolidatedBillingNo ? { ...c, status: 'Paid' } : c
      )
    );

    // Update jobs to 21 PAID
    targetInvoiceIds.forEach((invId) => {
      const inv = invoices.find((i) => i.id === invId);
      if (inv) {
        updateJobStatus(inv.jobId, '21', `Bank receipt settled via ${newRcp.bankReference}`);
        setJobs((prev) =>
          prev.map((j) => (j.id === inv.jobId ? { ...j, netReceipt: inv.netReceivable } : j))
        );
      }
    });

    logAudit('Bank Payment Received', '29 Bank Receipt / Payment', newRcp.paymentId, 'Payment Pending', `Bank deposit: PKR ${newRcp.netBankReceipt.toLocaleString()} (Ref: ${newRcp.bankReference})`);

    addNotification({
      type: 'Payment Received',
      title: `Bank Payment Received for ${newRcp.consolidatedBillingNo}`,
      message: `PKR ${newRcp.netBankReceipt.toLocaleString()} deposited in ${newRcp.bankName}. Invoices settled.`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      read: false,
      priority: 'high',
    });
  };

  // 17. Job Costing & Profitability
  const calculateJobCosting = (jobId: string): JobCosting => {
    const job = jobs.find((j) => j.id === jobId);
    const est = estimates.find((e) => e.jobId === jobId);
    const pos = purchaseOrders.filter((p) => p.jobId === jobId);
    const jobExpensesList = jobExpenses.filter((e) => e.jobId === jobId);
    const travels = travelRecords.filter((t) => t.jobId === jobId);
    const jobAtt = staffAttendance.filter((a) => a.jobId === jobId);
    const inv = invoices.find((i) => i.jobId === jobId);

    // Estimated breakdown
    let estMat = 0, estLab = 0, estTrv = 0, estOth = 0;
    if (est) {
      est.items.forEach((item) => {
        if (item.category === 'Material') estMat += item.amount;
        else if (item.category === 'Labour') estLab += item.amount;
        else if (item.category === 'Transport') estTrv += item.amount;
        else estOth += item.amount;
      });
    }

    // Actual breakdown
    const actPurchases = pos.reduce((acc, p) => acc + p.amount, 0);
    const actStaffLabour = jobAtt.reduce((acc, a) => {
      const s = staff.find((st) => st.id === a.staffId);
      const rate = s ? s.hourlyInternalCost : 300;
      return acc + (a.hours * rate);
    }, 0);
    const actFuel = travels.reduce((acc, t) => acc + t.fuelCost + t.expense, 0);
    const actExpenses = jobExpensesList.reduce((acc, e) => acc + e.amount, 0);

    const actualTotal = actPurchases + actStaffLabour + actFuel + actExpenses;
    const grossBilling = inv?.grossInvoice || job?.grossBilling || job?.approvedAmount || est?.total || 0;
    const taxDeductionsTotal = inv?.totalDeduction || 0;
    const netReceipt = inv?.netReceivable || (grossBilling - taxDeductionsTotal);
    const jobMargin = netReceipt - actualTotal;
    const marginPercentage = netReceipt > 0 ? (jobMargin / netReceipt) * 100 : 0;

    return {
      jobId,
      estimatedCost: {
        material: estMat,
        labour: estLab,
        travel: estTrv,
        other: estOth,
        total: estMat + estLab + estTrv + estOth,
      },
      actualCost: {
        purchases: actPurchases,
        staffLabour: actStaffLabour,
        fuelTravel: actFuel,
        parkingFoodOther: actExpenses,
        total: actualTotal,
      },
      grossBilling,
      taxDeductions: taxDeductionsTotal,
      netReceipt,
      jobMargin,
      marginPercentage,
    };
  };

  const addDocument = (docData: Omit<DocumentItem, 'id'>) => {
    const newDoc: DocumentItem = {
      ...docData,
      id: `DOC-${Date.now()}`,
    };
    setDocuments((prev) => [newDoc, ...prev]);
    logAudit('Uploaded Document', '32 Documents', newDoc.id, '-', `${newDoc.name} (${newDoc.category})`);
  };

  const resetAllData = () => {
    setBranches(INITIAL_BRANCHES);
    setStaff(INITIAL_STAFF);
    setVendors(INITIAL_VENDORS);
    setVehicles(INITIAL_VEHICLES);
    setTravelRecords(INITIAL_TRAVEL_RECORDS);
    setJobs(INITIAL_JOBS);
    setGmailThreads(INITIAL_GMAIL_THREADS);
    setSiteVisits(INITIAL_SITE_VISITS);
    setEstimates(INITIAL_ESTIMATES);
    setApprovals(INITIAL_APPROVALS);
    setPurchaseRequests(INITIAL_PURCHASE_REQUESTS);
    setPurchaseOrders(INITIAL_PURCHASE_ORDERS);
    setStaffAssignments(INITIAL_STAFF_ASSIGNMENTS);
    setStaffAttendance(INITIAL_STAFF_ATTENDANCE);
    setGpsEvents(INITIAL_GPS_EVENTS);
    setJobExpenses(INITIAL_JOB_EXPENSES);
    setStaffAdvances(INITIAL_STAFF_ADVANCES);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setWorkExecutions(INITIAL_WORK_EXECUTIONS);
    setDeliveryNotes(INITIAL_DELIVERY_NOTES);
    setWorkCompletions(INITIAL_WORK_COMPLETIONS);
    setTicketClosures(INITIAL_TICKET_CLOSURES);
    setInvoices(INITIAL_INVOICES);
    setConsolidatedBillings(INITIAL_CONSOLIDATED_BILLINGS);
    setTaxDeductions(INITIAL_TAX_DEDUCTIONS);
    setPhysicalBillingSets(INITIAL_PHYSICAL_BILLING_SETS);
    setAccountSubmissions(INITIAL_ACCOUNT_SUBMISSIONS);
    setBankReceipts(INITIAL_BANK_RECEIPTS);
    setPaymentAllocations(INITIAL_PAYMENT_ALLOCATIONS);
    setDocuments(INITIAL_DOCUMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    localStorage.clear();
  };

  return (
    <ERPContext.Provider
      value={{
        branches,
        staff,
        vendors,
        vehicles,
        travelRecords,
        jobs,
        gmailThreads,
        siteVisits,
        estimates,
        approvals,
        purchaseRequests,
        purchaseOrders,
        staffAssignments,
        staffAttendance,
        gpsEvents,
        jobExpenses,
        staffAdvances,
        workOrders,
        workExecutions,
        deliveryNotes,
        workCompletions,
        ticketClosures,
        invoices,
        consolidatedBillings,
        taxDeductions,
        physicalBillingSets,
        accountSubmissions,
        bankReceipts,
        paymentAllocations,
        documents,
        notifications,
        auditLogs,
        currentUserRole,
        setCurrentUserRole,
        activeView,
        setActiveView,
        selectedJobId,
        setSelectedJobId,
        searchQuery,
        setSearchQuery,
        createJob,
        linkUblTicket,
        updateJobStatus,
        addSiteVisit,
        addEstimate,
        addApproval,
        addPurchaseRequest,
        addPurchaseOrder,
        addStaffAssignment,
        addStaffAttendance,
        addGpsEvent,
        addJobExpense,
        updateExpenseStatus,
        addDeliveryNote,
        createInvoice,
        createConsolidatedBilling,
        recordPhysicalBillingSet,
        submitToUblAccount,
        recordBankReceipt,
        calculateJobCosting,
        addDocument,
        markNotificationRead,
        addNotification,
        resetAllData,
        openOneJobScreen,
      }}
    >
      {children}
    </ERPContext.Provider>
  );
};

export const useERP = () => {
  const context = useContext(ERPContext);
  if (!context) {
    throw new Error('useERP must be used within an ERPProvider');
  }
  return context;
};
