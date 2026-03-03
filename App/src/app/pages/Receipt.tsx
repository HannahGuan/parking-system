import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Check, ArrowRight, Download } from 'lucide-react';
import { motion } from 'motion/react';

export default function Receipt() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cost, duration } = location.state || { cost: "2.50", duration: 3600 };

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  return (
    <div className="h-full bg-[#f0f4f2] flex flex-col relative overflow-y-auto">
      <header className="bg-emerald-500 min-h-[280px] flex flex-col items-center justify-center pt-12 pb-20 relative overflow-hidden shrink-0 rounded-b-[2.5rem]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/15 to-transparent" />
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-emerald-500 mb-6 shadow-xl z-10"
        >
          <Check size={40} strokeWidth={3} />
        </motion.div>
        <h1 className="text-3xl font-bold z-10 tracking-tight text-white">Payment Successful</h1>
      </header>

      <main className="flex-1 px-6 -mt-16 relative z-20 pb-12">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl shadow-lg shadow-black/5 overflow-hidden"
        >
          <div className="p-6 border-b border-gray-100 border-dashed">
            <div className="flex justify-between items-center mb-8">
              <span className="text-gray-400 text-sm">Amount Paid</span>
              <span className="text-3xl font-bold text-gray-900">${cost}</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Duration</span>
                <span className="font-medium text-gray-900">{formatTime(duration)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Zone</span>
                <span className="font-medium text-gray-900">#8492 Downtown</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Date</span>
                <span className="font-medium text-gray-900">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Payment Method</span>
                <span className="font-medium text-gray-900 flex items-center gap-1">
                  Apple Pay <span className="text-xs bg-gray-100 px-1 py-0.5 rounded">4242</span>
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-emerald-50/40 p-4 flex justify-between items-center cursor-pointer hover:bg-emerald-50 transition-colors">
            <div className="flex items-center gap-3 text-gray-500">
              <Download size={18} />
              <span className="text-sm font-medium">Download Invoice</span>
            </div>
            <ArrowRight size={16} className="text-gray-300" />
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-6">A confirmation email has been sent to you.</p>
          <button 
            onClick={() => navigate('/')}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            Done
          </button>
        </div>
      </main>
    </div>
  );
}
