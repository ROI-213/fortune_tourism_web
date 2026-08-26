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
    <div className="bg-white border border-slate-200/90 rounded-3xl p-5 shadow-lg space-y-5 sticky top-24">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
            <IndianRupee className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-sm sm:text-base">
              {isEstimatedQuote ? "Estimated Fare & Payment" : "Live Fare Calculation"}
            </h3>
            <p className="text-[11px] text-slate-500">
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
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 transition-colors"
          >
            {showBreakdown ? (
              <>
                Hide <ChevronUp className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Details <ChevronDown className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        )}
      </div>

      {/* Itemized Fare Breakdown */}
      {!isEstimatedQuote && showBreakdown && (
        <div className="space-y-2 bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 text-xs">
          <div className="font-bold text-slate-500 uppercase tracking-wider text-[10px] pb-1 border-b border-slate-200">
            Itemized Fare Breakdown
          </div>

          {fareResult.breakdown.map((item, idx) => {
            if (item.isTotal) return null;

            return (
              <div
                key={idx}
                className={`flex items-center justify-between py-0.5 ${
                  item.isSubtotal
                    ? "border-t border-slate-200 pt-1.5 font-bold text-slate-800"
                    : item.isTax
                    ? "text-slate-700 font-medium"
                    : item.isDiscount
                    ? "text-emerald-700 font-bold"
                    : "text-slate-600"
                }`}
              >
                <span>{item.label}</span>
                <span className={item.isDiscount ? "text-emerald-700 font-bold" : "text-slate-900 font-semibold"}>
                  {item.isDiscount ? "-" : ""}
                  {formatCurrency(Math.abs(item.amount))}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Total Fare Display Box */}
      <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-4 space-y-3 shadow-md">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            {isEstimatedQuote ? "Booking Deposit / Base" : "Total Booking Fare"}
          </span>
          <span className="text-xl sm:text-2xl font-black text-amber-400 tracking-tight">
            {isEstimatedQuote ? "Fare on Request" : formatCurrency(fareResult.totalFare)}
          </span>
        </div>

        {/* Advance vs Zero Advance Selection */}
        <div className="pt-2 border-t border-slate-800 space-y-2">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-300">
            Choose Payment Option Now:
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onAdvanceOptionChange(100)}
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                advanceOption === 100
                  ? "bg-amber-500/20 border-amber-400 ring-1 ring-amber-400"
                  : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-400" /> ₹100 Advance
                </span>
                {advanceOption === 100 && (
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                )}
              </div>
              <p className="text-[10px] text-amber-300 font-medium mt-0.5">
                Priority Confirmation
              </p>
            </button>

            <button
              type="button"
              onClick={() => onAdvanceOptionChange(0)}
              className={`p-2.5 rounded-xl border text-left transition-all relative ${
                advanceOption === 0
                  ? "bg-emerald-500/20 border-emerald-400 ring-1 ring-emerald-400"
                  : "bg-slate-800/80 border-slate-700 hover:border-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Zero Advance</span>
                {advanceOption === 0 && (
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                )}
              </div>
              <p className="text-[10px] text-slate-300 font-medium mt-0.5">
                Pay ₹0 Today / Later
              </p>
            </button>
          </div>
        </div>

        {/* Due Now & Balance Summary */}
        <div className="bg-slate-950/90 rounded-xl p-3 border border-slate-800 space-y-1 text-xs">
          <div className="flex items-center justify-between text-slate-300">
            <span>Payable Today:</span>
            <span className="font-bold text-white">
              {advanceOption === 100 ? "₹100 (Token Advance)" : "₹0 (Zero Advance)"}
            </span>
          </div>

          {!isEstimatedQuote && (
            <div className="flex items-center justify-between text-slate-300">
              <span>Balance on Travel:</span>
              <span className="font-black text-amber-400 text-sm">
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
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-2xl p-3 text-[11px] text-amber-900 leading-relaxed">
        <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-900 font-bold">Important:</strong> The ₹100 Token Advance is
          an instant reservation deposit deducted from your total journey cost. It is{" "}
          <strong>NOT the full trip price</strong>.
        </div>
      </div>

      {/* Trust guarantees */}
      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-1">
        <span className="flex items-center gap-1 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> 100% Refundable
        </span>
        <span className="flex items-center gap-1 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Best Price Guarantee
        </span>
      </div>
    </div>
  );
}
