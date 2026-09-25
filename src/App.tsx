import React, { useState } from 'react';
import { ERPProvider, useERP } from './context/ERPContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './views/DashboardView';
import { JobsListView } from './views/JobsListView';
import { OneJobScreenView } from './views/OneJobScreenView';
import { UBLRequestsView } from './views/UBLRequestsView';
import { GmailThreadsView } from './views/GmailThreadsView';
import { SiteVisitsView } from './views/SiteVisitsView';
import { EstimatesView } from './views/EstimatesView';
import { ApprovalsView } from './views/ApprovalsView';
import { ProcurementView } from './views/ProcurementView';
import { StaffView } from './views/StaffView';
import { FieldOperationsView } from './views/FieldOperationsView';
import { ExpensesView } from './views/ExpensesView';
import { WorkExecutionView } from './views/WorkExecutionView';
import { ClosureView } from './views/ClosureView';
import { InvoicingView } from './views/InvoicingView';
import { ConsolidatedBillingView } from './views/ConsolidatedBillingView';
import { BankReceiptsView } from './views/BankReceiptsView';
import { TaxDeductionView } from './views/TaxDeductionView';
import { JobCostingView } from './views/JobCostingView';
import { BranchMasterView } from './views/BranchMasterView';
import { DocumentsView } from './views/DocumentsView';
import { ReportsView } from './views/ReportsView';
import { AdminView } from './views/AdminView';

// Modals
import { NewJobModal } from './components/modals/NewJobModal';
import { LinkTicketModal } from './components/modals/LinkTicketModal';
import { NewEstimateModal } from './components/modals/NewEstimateModal';
import { NewConsolidatedBillingModal } from './components/modals/NewConsolidatedBillingModal';
import { RecordPaymentModal } from './components/modals/RecordPaymentModal';
import { HostingerDeployModal } from './components/modals/HostingerDeployModal';

const AppContent: React.FC = () => {
  const { activeView } = useERP();

  // Modals state
  const [isNewJobOpen, setIsNewJobOpen] = useState(false);
  const [linkTicketJobId, setLinkTicketJobId] = useState<string | null>(null);
  const [estimateJobId, setEstimateJobId] = useState<string | null>(null);
  const [isConsolidateOpen, setIsConsolidateOpen] = useState(false);
  const [recordPaymentCbNo, setRecordPaymentCbNo] = useState<string | null>(null);
  const [isHostingerDeployOpen, setIsHostingerDeployOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            onOpenNewJob={() => setIsNewJobOpen(true)}
            onOpenLinkTicket={(jobId) => setLinkTicketJobId(jobId)}
          />
        );
      case 'jobs':
        return (
          <JobsListView
            onOpenNewJob={() => setIsNewJobOpen(true)}
            onOpenLinkTicket={(jobId) => setLinkTicketJobId(jobId)}
          />
        );
      case 'one-job-screen':
        return (
          <OneJobScreenView
            onOpenLinkTicket={(jobId) => setLinkTicketJobId(jobId)}
            onOpenNewEstimate={(jobId) => setEstimateJobId(jobId)}
          />
        );
      case 'ubl-requests':
        return (
          <UBLRequestsView
            onOpenNewJob={() => setIsNewJobOpen(true)}
            onOpenLinkTicket={(jobId) => setLinkTicketJobId(jobId)}
          />
        );
      case 'gmail-threads':
        return <GmailThreadsView />;
      case 'site-visits':
        return <SiteVisitsView />;
      case 'estimates':
        return (
          <EstimatesView
            onOpenNewEstimate={(jobId) => setEstimateJobId(jobId)}
          />
        );
      case 'approvals':
        return <ApprovalsView />;
      case 'work-orders':
      case 'work-execution':
        return <WorkExecutionView />;
      case 'gps-operations':
      case 'vehicles-travel':
        return <FieldOperationsView />;
      case 'staff':
      case 'attendance':
        return <StaffView />;
      case 'expenses':
        return <ExpensesView />;
      case 'procurement':
        return <ProcurementView />;
      case 'delivery-notes':
      case 'work-completion':
      case 'ticket-closure':
        return <ClosureView />;
      case 'invoicing':
        return (
          <InvoicingView
            onOpenConsolidateModal={() => setIsConsolidateOpen(true)}
          />
        );
      case 'consolidated-billing':
      case 'billing-set':
      case 'ubl-submission':
        return (
          <ConsolidatedBillingView
            onOpenNewConsolidated={() => setIsConsolidateOpen(true)}
            onOpenRecordPayment={(cbNo) => setRecordPaymentCbNo(cbNo)}
          />
        );
      case 'bank-receipts':
        return (
          <BankReceiptsView
            onOpenRecordPayment={(cbNo) => setRecordPaymentCbNo(cbNo)}
          />
        );
      case 'tax-deduction':
        return <TaxDeductionView />;
      case 'job-costing':
        return <JobCostingView />;
      case 'documents':
        return <DocumentsView />;
      case 'reports':
        return <ReportsView />;
      case 'branch-master':
        return <BranchMasterView />;
      case 'admin':
        return <AdminView />;
      default:
        return (
          <DashboardView
            onOpenNewJob={() => setIsNewJobOpen(true)}
            onOpenLinkTicket={(jobId) => setLinkTicketJobId(jobId)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Navbar
        onOpenNewJobModal={() => setIsNewJobOpen(true)}
        onOpenHostingerDeploy={() => setIsHostingerDeployOpen(true)}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Viewport Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto h-[calc(100vh-53px)]">
          <div className="max-w-7xl mx-auto">{renderActiveView()}</div>
        </main>
      </div>

      {/* Global Modals */}
      <NewJobModal
        isOpen={isNewJobOpen}
        onClose={() => setIsNewJobOpen(false)}
      />

      <LinkTicketModal
        isOpen={Boolean(linkTicketJobId)}
        jobId={linkTicketJobId}
        onClose={() => setLinkTicketJobId(null)}
      />

      <NewEstimateModal
        isOpen={Boolean(estimateJobId)}
        jobId={estimateJobId}
        onClose={() => setEstimateJobId(null)}
      />

      <NewConsolidatedBillingModal
        isOpen={isConsolidateOpen}
        onClose={() => setIsConsolidateOpen(false)}
      />

      <RecordPaymentModal
        isOpen={Boolean(recordPaymentCbNo)}
        consolidatedNo={recordPaymentCbNo}
        onClose={() => setRecordPaymentCbNo(null)}
      />

      <HostingerDeployModal
        isOpen={isHostingerDeployOpen}
        onClose={() => setIsHostingerDeployOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ERPProvider>
      <AppContent />
    </ERPProvider>
  );
}
