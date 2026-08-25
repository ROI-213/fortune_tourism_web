import React, { useState } from "react";
import {
  IndianRupee,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Zap,
  Info,
  Sparkles,
} from "lucide-react";
import { formatCurrency } from "@/lib/booking-utils";
import { FareCalculationResult } from "@/lib/fare-engine";

interface LiveFareSummaryCardProps {
  fareResult: FareCalculationResult;
  serviceType: "CAB" | "TRAIN" | "BUS" | "FLIGHT" | "TOUR";
  advanceOption: 100 | 0;
  onAdvanceOptionChange: (option: 100 | 0) => void;
  isLoading?: boolean;
}

export function LiveFareSummaryCard({
  fareResult,
  serviceType,
  advanceOption,
  onAdvanceOptionChange,
  isLoading,
}: LiveFareSummaryCardProps) {
  const [showBreakdown, setShowBreakdown] = useState(true);

  const isEstimatedQuote = serviceType === "TRAIN" || serviceType === "BUS" || serviceType === "FLIGHT";

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-5 shadow-2xl backdrop-blur-xl space-y-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-black text-slate-100 text-sm sm:text-base">
              {isEstimatedQuote ? "Estimated Fare & Payment" : "Live Fare Calculation"}
            </h3>
            <p className="text-[11px] text-slate-400">
              {isEstimatedQuote
                ? "Official ticket fare confirmed upon search"
                : "Transparent pricing with no hidden charges"}
            </p>
          </div>
        </div>

        {!isEstimatedQuote && (
          <button
            type="button"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700 transition-colors"
          >
            {showBreakdown ? (
              <>
                Hide Details <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                View Details <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Itemized Fare Breakdown */}
      {!isEstimatedQuote && showBreakdown && (
        <div className="space-y-2 bg-slate-950/60 rounded-2xl p-3.5 border border-slate-800/80 text-xs">
          <div className="font-bold text-slate-300 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-800/60">
            Itemized Fare Breakdown
          </div>

          {fareResult.breakdown.map((item, idx) => {
            if (item.isTotal) return null; // rendered in main total block

            return (
              <div
                key={idx}
                className={`flex items-center justify-between py-1 ${
                  item.isSubtotal
                    ? "border-t border-slate-800 pt-2 font-bold text-slate-200"
                    : item.isTax
                    ? "text-slate-300 font-semibold"
                    : item.isDiscount
                    ? "text-emerald-400 font-bold"
                    : "text-slate-400"
                }`}
              >
                <span>{item.label}</span>
                <span className={item.isDiscount ? "text-emerald-400" : "text-slate-200"}>
                  {item.isDiscount ? "-" : ""}
                  {formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Fare Display */}
      <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-700/60 rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            {isEstimatedQuote ? "Booking Deposit / Base" : "Total Booking Fare"}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            {isEstimatedQuote ? "Fare on Request" : formatCurrency(fareResult.totalFare)}
          </span>
        </div>

        {/* Advance vs Zero Advance Selection */}
        <div className="pt-2 border-t border-slate-800/80 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Choose Payment Option Now:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAdvanceOptionChange(100)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                advanceOption === 100
                  ? "bg-amber-500/10 border-amber-500/80 ring-1 ring-amber-500/40"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> ₹100 Advance
                </span>
                {advanceOption === 100 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </div>
              <p className="text-[10px] text-amber-400/90 font-medium mt-1">
                Priority Confirmation
              </p>
            </button>

            <button
              type="button"
              onClick={() => onAdvanceOptionChange(0)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                advanceOption === 0
                  ? "bg-emerald-500/10 border-emerald-500/80 ring-1 ring-emerald-500/40"
                  : "bg-slate-900/80 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Zero Advance</span>
                {advanceOption === 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium mt-1">
                Pay ₹0 Today / Pay Later
              </p>
            </button>
          </div>
        </div>

        {/* Due Now & Balance Summary */}
        <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Payable Today:</span>
            <span className="font-bold text-slate-100">
              {advanceOption === 100 ? "₹100 (Token Advance)" : "₹0 (Zero Advance)"}
            </span>
          </div>

          {!isEstimatedQuote && (
            <div className="flex items-center justify-between text-slate-300">
              <span>Balance on Travel:</span>
              <span className="font-black text-amber-300">
                {formatCurrency(
                  advanceOption === 100
                    ? Math.max(0, fareResult.totalFare - 100)
                    : fareResult.totalFare
                )}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Critical Business Disclaimer */}
      <div className="flex items-start gap-2 bg-amber-500/5 border border-amber-500/20 rounded-2xl p-3 text-[11px] text-amber-200/90 leading-relaxed">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Important:</strong> The ₹100 Token Advance is
          an instant reservation deposit deducted from your total journey cost. It is{" "}
          <strong>NOT the full trip price</strong>.
        </div>
      </div>

      {/* Trust guarantees */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 100% Refundable
        </span>
        <span className="flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Best Price Guarantee
        </span>
      </div>
    </div>
  );
}
