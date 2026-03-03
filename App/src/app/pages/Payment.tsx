import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { ChevronRight, MapPin, Clock } from 'lucide-react';
import { clsx } from 'clsx';

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cost = "2.50", duration = 1800 } = location.state || {};
  const [isProcessing, setIsProcessing] = useState(false);

  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      navigate('/receipt', { state: { cost, duration } });
    }, 2000);
  };

  return (
    <div className="h-full bg-[#f0f4f2] flex flex-col relative overflow-hidden">
      <header className="pt-16 px-6 pb-4 z-10 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Session Summary</h1>
        <p className="text-gray-400 text-sm mt-1">Review and pay for your parking</p>
      </header>

      <main className="flex-1 px-5 z-10 overflow-y-auto pb-6">
        {/* Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-lg shadow-black/5 overflow-hidden mb-5"
        >
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-gray-100">
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                <MapPin size={18} className="text-emerald-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-[15px]">Zone #8492</p>
                <p className="text-gray-400 text-xs">Downtown Area</p>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Duration</span>
              <div className="flex items-center gap-1.5">
                <Clock size={14} className="text-gray-300" />
                <span className="font-medium text-gray-900 text-sm">{formatDuration(duration)}</span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Rate</span>
              <span className="font-medium text-gray-900 text-sm">$2.50/hr</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">Date</span>
              <span className="font-medium text-gray-900 text-sm">{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div className="bg-emerald-50/60 px-5 py-4 border-t border-emerald-100 flex justify-between items-center">
            <span className="text-gray-500 font-medium">Total</span>
            <span className="text-2xl font-bold text-gray-900">${cost}</span>
          </div>
        </motion.div>

        {/* Payment Method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-11 h-7 rounded-md bg-gradient-to-br from-emerald-500 to-teal-600 shadow-sm" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-400 font-medium">Payment Method</span>
              <span className="text-sm font-semibold text-gray-900">Apple Pay •••• 4242</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-300" />
        </motion.div>
      </main>

      <footer className="p-6 pb-12 z-10 shrink-0 space-y-3">
        <button
          onClick={handlePay}
          disabled={isProcessing}
          className={clsx(
            "w-full py-4 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2 transition-all shadow-lg",
            isProcessing
              ? "bg-gray-300 text-gray-500 scale-[0.98]"
              : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-emerald-500/20"
          )}
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <div className="text-xl pb-0.5"></div>
              Pay ${cost} with Face ID
            </>
          )}
        </button>

        <div className="flex justify-center">
          <p className="text-gray-400 text-xs font-medium">Double Click Side Button to Confirm</p>
        </div>
      </footer>
    </div>
  );
}
