import React from 'react';
import { PieChart, TrendingUp, DollarSign, Layers, ArrowRight } from 'lucide-react';
import { useERP } from '../context/ERPContext';

export const JobCostingView: React.FC = () => {
  const { jobs, calculateJobCosting, openOneJobScreen } = useERP();

  const allCostings = jobs.map((j) => calculateJobCosting(j.id));
  const totalEstimated = allCostings.reduce((acc, c) => acc + c.estimatedCost.total, 0);
  const totalActual = allCostings.reduce((acc, c) => acc + c.actualCost.total, 0);
  const totalBilling = allCostings.reduce((acc, c) => acc + c.grossBilling, 0);
  const totalMargin = allCostings.reduce((acc, c) => acc + c.jobMargin, 0);

  return (
    <div className="space-y-4 animate-in fade-in duration-150">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm">
        <div>
          <div className="flex items-center space-x-2">
            <PieChart className="w-5 h-5 text-emerald-400" />
            <h1 className="text-base font-bold text-white">31. Job Costing & Profitability Analysis</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Blueprint Rule: Estimated Cost (Material + Labour + Travel + Other) vs Actual Cost (Purchases + Staff Labour + Fuel + Travel + Parking + Food + Expenses). Shows Net Margin & Profitability %.
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Quotations / Billing</span>
          <span className="text-lg font-bold text-white mt-1 block">PKR {totalBilling.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Estimated Cost</span>
          <span className="text-lg font-bold text-slate-300 mt-1 block">PKR {totalEstimated.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Actual Cost Spent</span>
          <span className="text-lg font-bold text-amber-400 mt-1 block">PKR {totalActual.toLocaleString()}</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm">
          <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Net Margin</span>
          <span className="text-lg font-bold text-emerald-400 mt-1 block">PKR {totalMargin.toLocaleString()}</span>
        </div>
      </div>

      {/* Breakdown per Job */}
      <div className="space-y-3">
        {allCostings.map((c) => {
          const job = jobs.find((j) => j.id === c.jobId);

          return (
            <div
              key={c.jobId}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-sm space-y-3 text-xs"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-slate-800 pb-2.5">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-sm font-bold text-emerald-400">{c.jobId}</span>
                    <span className="text-white font-semibold">{job?.title}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Ticket: {job?.ublTicketNo || 'Pending'} &bull; Status: {job?.statusCode}
                  </span>
                </div>

                <div className="flex items-center space-x-3 font-mono">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 block uppercase">Net Profit Margin</span>
                    <span className="text-emerald-400 font-bold text-sm">
                      PKR {c.jobMargin.toLocaleString()} ({c.marginPercentage.toFixed(1)}%)
                    </span>
                  </div>
                  <button
                    onClick={() => openOneJobScreen(c.jobId)}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Side-by-Side Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-[11px]">
                {/* Estimated */}
                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px]">
                    <span>Estimated Cost Breakdown</span>
                    <span>PKR {c.estimatedCost.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Materials:</span>
                    <span>PKR {c.estimatedCost.material.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Labour / Manpower:</span>
                    <span>PKR {c.estimatedCost.labour.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Travel, Tools & Consumables:</span>
                    <span>PKR {(c.estimatedCost.travel + c.estimatedCost.other).toLocaleString()}</span>
                  </div>
                </div>

                {/* Actual */}
                <div className="p-3 bg-slate-950/70 rounded-lg border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center text-slate-400 font-bold uppercase text-[10px]">
                    <span>Actual Cost Incurred</span>
                    <span className="text-amber-400">PKR {c.actualCost.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Actual PO Purchases:</span>
                    <span>PKR {c.actualCost.purchases.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Staff Internal Hourly Labour:</span>
                    <span>PKR {c.actualCost.staffLabour.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Fuel, Travel, Parking & Food:</span>
                    <span>PKR {(c.actualCost.fuelTravel + c.actualCost.parkingFoodOther).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
