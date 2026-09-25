export type JobStatusCode =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22';

export interface JobStatusDefinition {
  code: JobStatusCode;
  label: string;
  category: 'Request' | 'Estimation' | 'Approval' | 'Operations' | 'Handover' | 'Billing' | 'Settlement';
  color: string;
}

export const MASTER_JOB_STATUSES: JobStatusDefinition[] = [
  { code: '01', label: 'NEW REQUEST', category: 'Request', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { code: '02', label: 'SITE VISIT PENDING', category: 'Request', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { code: '03', label: 'SITE VISITED', category: 'Request', color: 'bg-cyan-100 text-cyan-800 border-cyan-300' },
  { code: '04', label: 'ESTIMATE PREPARING', category: 'Estimation', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { code: '05', label: 'ESTIMATE SUBMITTED', category: 'Estimation', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { code: '06', label: 'UBL APPROVAL PENDING', category: 'Approval', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { code: '07', label: 'APPROVED', category: 'Approval', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { code: '08', label: 'PURCHASE PENDING', category: 'Operations', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { code: '09', label: 'STAFF ASSIGNED', category: 'Operations', color: 'bg-teal-100 text-teal-800 border-teal-300' },
  { code: '10', label: 'WORK IN PROGRESS', category: 'Operations', color: 'bg-sky-100 text-sky-800 border-sky-300' },
  { code: '11', label: 'WORK COMPLETED', category: 'Operations', color: 'bg-green-100 text-green-800 border-green-300' },
  { code: '12', label: 'DELIVERY NOTE PENDING', category: 'Handover', color: 'bg-amber-100 text-amber-800 border-amber-300' },
  { code: '13', label: 'DELIVERY NOTE SIGNED', category: 'Handover', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
  { code: '14', label: 'COMPLETION EMAIL SENT', category: 'Handover', color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { code: '15', label: 'TICKET CLOSED', category: 'Handover', color: 'bg-violet-100 text-violet-800 border-violet-300' },
  { code: '16', label: 'INVOICE PREPARING', category: 'Billing', color: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
  { code: '17', label: 'BILLING SET READY', category: 'Billing', color: 'bg-purple-100 text-purple-800 border-purple-300' },
  { code: '18', label: 'SUBMITTED TO UBL ACCOUNT', category: 'Billing', color: 'bg-rose-100 text-rose-800 border-rose-300' },
  { code: '19', label: 'PAYMENT PENDING', category: 'Settlement', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { code: '20', label: 'PARTIAL PAYMENT', category: 'Settlement', color: 'bg-orange-100 text-orange-800 border-orange-300' },
  { code: '21', label: 'PAID', category: 'Settlement', color: 'bg-green-100 text-green-800 border-green-300' },
  { code: '22', label: 'JOB CLOSED', category: 'Settlement', color: 'bg-slate-200 text-slate-800 border-slate-400' },
];

export type RequestType = 
  | 'A: UBL Ticket Received'
  | 'B: Estimation / Site Visit Request — Ticket Not Available'
  | 'C: Other UBL Instruction';

export type UserRole =
  | 'Admin'
  | 'Management'
  | 'Operations Manager'
  | 'Site Supervisor'
  | 'Field Staff'
  | 'Purchase Officer'
  | 'Accounts'
  | 'Billing Officer';

export interface Branch {
  id: string;
  code: string;
  name: string;
  region: string;
  city: string;
  address: string;
  contactPerson: string;
  phone: string;
  bomName: string; // Branch Operations Manager
  latitude: number;
  longitude: number;
  gpsRadiusMeters: number;
  status: 'Active' | 'Inactive';
}

export interface Job {
  id: string; // permanent Job ID, e.g. NB-H4U-2026-001
  companyName?: string; // Company: Naeem Builder
  clientName?: string; // Client: HERE4U
  ublTicketNo?: string; // Optional initially, linkable later
  ticketStatus: 'Linked' | 'Pending';
  requestType: RequestType;
  branchId: string;
  title: string;
  description: string;
  workCategory: 'HVAC / AC Repair' | 'Electrical' | 'Plumbing' | 'Civil & Painting' | 'Generator / UPS' | 'IT & Security' | 'Signage / ATM';
  priority: 'Emergency' | 'High' | 'Normal' | 'Low';
  statusCode: JobStatusCode;
  supervisorId: string;
  createdAt: string;
  targetCompletionDate: string;
  estimatedCost: number;
  actualCost: number;
  approvedAmount?: number;
  grossBilling?: number;
  netReceipt?: number;
  gmailThreadId?: string;
  physicalBillingSetReady: boolean;
  notes?: string;
}

export interface GmailThread {
  id: string;
  jobId: string;
  ticketNo?: string;
  subject: string;
  sender: string;
  senderDesignation: string;
  recipient: string;
  date: string;
  bodySnippet: string;
  fullBody: string;
  attachments: { name: string; size: string; type: string }[];
}

export interface SiteVisit {
  id: string;
  jobId: string;
  visitType: 'Estimation Visit' | 'Inspection' | 'Work Visit' | 'Re-Visit' | 'Completion Verification';
  visitDate: string;
  assignedStaffId: string;
  siteContact: string;
  problemDescription: string;
  measurements: string;
  requiredWork: string;
  requiredMaterial: string;
  requiredManpower: number;
  estimatedQuantity: string;
  photos: string[];
  remarks: string;
  gpsCheckIn: {
    lat: number;
    lng: number;
    time: string;
    distanceMeters: number;
    status: 'Location Verified' | 'Location Not Verified — Review Required';
  };
  gpsCheckOut?: {
    lat: number;
    lng: number;
    time: string;
  };
  jobVerificationCertificateNo?: string;
  status: 'Completed' | 'Scheduled' | 'Pending Verification';
}

export interface EstimateLineItem {
  id: string;
  description: string;
  category: 'Material' | 'Labour' | 'Transport' | 'Other';
  quantity: number;
  unit: string;
  materialRate: number;
  labourRate: number;
  otherCost: number;
  amount: number;
}

export interface Estimate {
  id: string;
  estimateNo: string;
  jobId: string;
  branchId: string;
  version: 'V1' | 'V2' | 'V3' | 'Final Version' | 'Approved Version';
  date: string;
  validityDays: number;
  preparedBy: string;
  scopeOfWork: string;
  items: EstimateLineItem[];
  subtotal: number;
  taxPercent: number;
  taxAmount: number;
  total: number;
  status: 'Draft' | 'Submitted to UBL' | 'Approved' | 'Revision Required' | 'Rejected';
  notes?: string;
}

export interface UblApproval {
  id: string;
  jobId: string;
  estimateNo: string;
  submittedDate: string;
  submittedBy: string;
  ublApprover: string;
  designation: string;
  approvalDate: string;
  approvedAmount: number;
  approvalEmail: string;
  attachmentName: string;
  remarks: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Revision Required';
}

export interface PurchaseRequest {
  id: string;
  jobId: string;
  material: string;
  quantity: number;
  unit: string;
  requiredDate: string;
  estimatedRate: number;
  vendorId?: string;
  status: 'Pending' | 'Approved' | 'PO Issued' | 'Delivered';
}

export interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  mobile: string;
  email: string;
  address: string;
  ntnCnic: string;
  category: 'Hardware & Materials' | 'Electrical Supplies' | 'HVAC & Refrigeration' | 'Sanitary' | 'Paint & Chemical' | 'Tools & Equipment';
  productsServices: string;
  bankName: string;
  accountNo: string;
  iban: string;
  rateRating: number;
  status: 'Active' | 'Blacklisted';
}

export interface PurchaseOrder {
  id: string;
  poNo: string;
  requestId: string;
  jobId: string;
  vendorId: string;
  item: string;
  quantity: number;
  rate: number;
  amount: number;
  purchaseInvoiceNo?: string;
  deliveryStatus: 'Pending' | 'In Transit' | 'Received at Branch' | 'Received at Warehouse';
  paymentStatus: 'Unpaid' | 'Paid';
  deliveryDate?: string;
  documents: string[];
}

export interface Staff {
  id: string;
  employeeId: string;
  name: string;
  cnic: string;
  mobile: string;
  designation: string;
  department: 'Operations' | 'HVAC' | 'Electrical' | 'Plumbing' | 'Civil' | 'Management';
  skill: string[];
  joiningDate: string;
  salary: number;
  dailyInternalCost: number;
  hourlyInternalCost: number;
  emergencyContact: string;
  status: 'Active' | 'On Leave' | 'Inactive';
}

export interface StaffAssignment {
  id: string;
  jobId: string;
  staffId: string;
  requiredSkill: string;
  supervisorId: string;
  assignmentDate: string;
  startDate: string;
  expectedCompletion: string;
  role: 'Lead Technician' | 'Assistant' | 'Specialist' | 'Surveyor';
  status: 'Assigned' | 'In Progress' | 'Completed';
}

export interface StaffAttendance {
  id: string;
  type: 'Office' | 'Job';
  staffId: string;
  date: string;
  checkIn: string;
  checkOut?: string;
  hours: number;
  // If type === 'Job'
  jobId?: string;
  workType?: string;
  location?: string;
  remarks?: string;
}

export interface GpsEvent {
  id: string;
  jobId: string;
  employeeId: string;
  eventType: 'Site Visit Check-In' | 'Site Visit Check-Out' | 'Work Check-In' | 'Work Check-Out';
  dateTime: string;
  latitude: number;
  longitude: number;
  distanceFromBranchMeters: number;
  status: 'Location Verified' | 'Location Not Verified — Review Required';
  photoUrl?: string;
  remarks?: string;
}

export interface Vehicle {
  id: string;
  vehicleNo: string;
  type: 'Motorcycle' | 'Pickup Van' | 'Service Truck';
  driverId: string;
  startingKm: number;
  endingKm: number;
  fuelType: 'Petrol' | 'Diesel' | 'CNG';
  maintenanceStatus: 'Good' | 'Service Due';
}

export interface TravelRecord {
  id: string;
  jobId: string;
  vehicleId: string;
  driverId: string;
  origin: string;
  destination: string;
  km: number;
  purpose: string;
  fuelCost: number;
  expense: number;
  date: string;
}

export type ExpenseCategory =
  | 'Fuel'
  | 'Parking'
  | 'Toll'
  | 'Local Transport'
  | 'Food'
  | 'Material Purchase'
  | 'Loading/Unloading'
  | 'Courier'
  | 'Printing'
  | 'Tools'
  | 'Emergency Purchase'
  | 'Other';

export interface JobExpense {
  id: string;
  jobId: string;
  staffId: string;
  date: string;
  category: ExpenseCategory;
  amount: number;
  paymentMethod: 'Cash Advance' | 'Personal Cash' | 'Company Card';
  description: string;
  receiptUrl?: string;
  gpsLocation?: string;
  approvalStatus: 'Submitted' | 'Supervisor Verified' | 'Accounts Approved' | 'Settled' | 'Rejected';
  verifiedBy?: string;
  settledDate?: string;
}

export interface StaffAdvance {
  id: string;
  staffId: string;
  jobId?: string;
  dateIssued: string;
  advanceAmount: number;
  expensesLogged: number;
  returnedAmount: number;
  additionalPayable: number;
  settlementDate?: string;
  status: 'Open' | 'Partially Settled' | 'Settled';
}

export interface WorkOrder {
  id: string;
  workOrderNo: string;
  jobId: string;
  ticketNo?: string;
  estimateNo: string;
  branchId: string;
  scopeOfWork: string;
  materialSummary: string;
  assignedStaffIds: string[];
  supervisorId: string;
  startDate: string;
  expectedCompletion: string;
  instructions: string;
  status: 'Issued' | 'In Progress' | 'Completed' | 'On Hold';
}

export interface WorkExecution {
  id: string;
  jobId: string;
  workOrderId: string;
  date: string;
  staffId: string;
  workPerformed: string;
  materialUsed: string;
  quantity: string;
  beforePhoto?: string;
  duringPhoto?: string;
  afterPhoto?: string;
  progressPercentage: number;
  status: 'In Progress' | 'Satisfactory' | 'Rework Needed' | 'Completed';
  remarks: string;
}

export interface DeliveryNote {
  id: string;
  dnNo: string;
  jobId: string;
  ticketNo?: string;
  branchId: string;
  workDescription: string;
  completionDate: string;
  ublRepresentative: string;
  designation: string; // e.g. Branch Manager, BOM
  signature: string;
  ublStampReceived: boolean;
  dateSigned: string;
  scanDocUrl: string;
  status: 'Draft' | 'Signed & Stamped' | 'Rejected';
}

export interface WorkCompletion {
  id: string;
  jobId: string;
  completionDate: string;
  reportSummary: string;
  beforePhotos: string[];
  afterPhotos: string[];
  signedDnId: string;
  staffWorkDetails: string;
  ublConfirmationRef: string;
  completionEmailSentDate: string;
  status: 'Verified & Completed';
}

export interface TicketClosure {
  id: string;
  jobId: string;
  ublTicketNo: string;
  completionEmailRef: string;
  ublResponse: string;
  resolvedDate: string;
  closedDate: string;
  closedBy: string;
  remarks: string;
}

export interface IndividualInvoice {
  id: string;
  invoiceNo: string;
  invoiceDate: string;
  jobId: string;
  company?: string; // Naeem Builder
  client?: string; // HERE4U (for UBL Maintenance)
  ublTicketNo?: string;
  branchId: string;
  customer: string; // HERE4U (Client: UBL Projects)
  description: string;
  serviceAmount: number;
  salesTaxPercent: number; // configurable
  salesTaxAmount: number;
  incomeTaxPercent: number; // configurable
  incomeTaxAmount: number;
  otherDeductions: number;
  grossInvoice: number;
  totalDeduction: number;
  netReceivable: number;
  consolidatedBillingId?: string | null;
  status: 'Draft' | 'Billing Set Ready' | 'Consolidated' | 'Submitted to UBL' | 'Paid' | 'Partially Paid';
}

export interface ConsolidatedBilling {
  id: string;
  consolidatedNo: string; // e.g. CI-2026-001
  date: string;
  ublAccount: string;
  billingPeriod: string;
  invoiceIds: string[];
  numberOfInvoices: number;
  grossTotal: number;
  salesTaxTotal: number;
  incomeTaxTotal: number;
  otherDeductionsTotal: number;
  netAmount: number;
  submissionDate?: string;
  receivingPerson?: string;
  receivingEvidenceDoc?: string;
  status: 'Draft' | 'Physical Set Prepared' | 'Submitted to UBL Account' | 'Payment Pending' | 'Partially Paid' | 'Paid' | 'Cancelled';
}

export interface TaxDeduction {
  id: string;
  consolidatedBillingId: string;
  invoiceId: string;
  jobId: string;
  grossAmount: number;
  taxableAmount: number;
  salesTaxRate: number;
  salesTaxAmount: number;
  incomeTaxRate: number;
  incomeTaxAmount: number;
  otherDeduction: number;
  totalDeduction: number;
  netAmount: number;
  certificateNo?: string;
  certificateDate?: string;
  taxEvidenceUrl?: string;
  withholdingCertUrl?: string;
  ublDeductionDocUrl?: string;
  status: 'Pending Certificate' | 'Certificate Received' | 'Verified';
}

export interface PhysicalBillingSet {
  id: string;
  consolidatedBillingId: string;
  invoiceChecked: boolean;
  signedDeliveryNoteChecked: boolean;
  estimateChecked: boolean;
  ublApprovalChecked: boolean;
  completionEvidenceChecked: boolean;
  taxDocumentsChecked: boolean;
  status: 'Complete' | 'Missing Documents';
  checkedBy: string;
  checklistDate: string;
}

export interface UblAccountSubmission {
  id: string;
  consolidatedBillingNo: string;
  invoiceCount: number;
  totalAmount: number;
  submissionDate: string;
  submittedBy: string;
  ublDepartment: string; // e.g. UBL Central Accounts / Facilities Management Division
  receivingPerson: string;
  receivingDate: string;
  stampSignatureReceived: boolean;
  receivingCopyUrl: string;
  remarks: string;
}

export interface BankReceipt {
  id: string;
  paymentId: string;
  consolidatedBillingNo: string;
  bankName: string;
  accountNo: string;
  transferDate: string;
  grossBilling: number;
  salesTaxDeduction: number;
  incomeTaxDeduction: number;
  otherDeduction: number;
  netBankReceipt: number;
  bankReference: string;
  bankStatementUrl?: string;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  consolidatedBillingNo: string;
  invoiceId: string;
  jobId: string;
  grossAmount: number;
  taxDeduction: number;
  netAllocated: number;
  allocatedDate: string;
  status: 'Settled' | 'Partially Settled';
}

export interface JobCosting {
  jobId: string;
  estimatedCost: {
    material: number;
    labour: number;
    travel: number;
    other: number;
    total: number;
  };
  actualCost: {
    purchases: number;
    staffLabour: number;
    fuelTravel: number;
    parkingFoodOther: number;
    total: number;
  };
  grossBilling: number;
  taxDeductions: number;
  netReceipt: number;
  jobMargin: number;
  marginPercentage: number;
}

export interface DocumentItem {
  id: string;
  jobId?: string;
  ticketNo?: string;
  invoiceNo?: string;
  consolidatedNo?: string;
  name: string;
  category:
    | 'Gmail Email / Thread'
    | 'Quotation / Estimate'
    | 'UBL Approval'
    | 'Purchase Invoice'
    | 'Site Photo'
    | 'Work Photo'
    | 'Delivery Note'
    | 'Completion Report'
    | 'Individual Invoice'
    | 'Billing Set'
    | 'Receiving Copy'
    | 'Tax Certificate'
    | 'Bank Receipt / Payment Evidence';
  uploadedAt: string;
  uploadedBy: string;
  fileSize: string;
  fileUrl: string;
}

export interface NotificationItem {
  id: string;
  jobId?: string;
  type:
    | 'New Request'
    | 'Ticket Received'
    | 'Ticket Missing'
    | 'Site Visit Required/Overdue'
    | 'Estimate Pending/Submitted'
    | 'Approval Pending/Received'
    | 'Purchase Pending'
    | 'Work Starting/Overdue'
    | 'Delivery Note Pending'
    | 'Completion Pending'
    | 'Invoice Pending'
    | 'Consolidated Billing Ready'
    | 'Billing Submitted'
    | 'Payment Pending'
    | 'Tax Certificate Pending'
    | 'Payment Received';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface AuditLogItem {
  id: string;
  user: string;
  role: string;
  action: string;
  module: string;
  recordId: string;
  oldValue: string;
  newValue: string;
  timestamp: string;
}
