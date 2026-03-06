import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, MapPin, ShieldCheck, Timer, DollarSign } from 'lucide-react';
import { clsx } from 'clsx';

const INITIAL_MINUTES = 30;
const EXTEND_MINUTES = 30;
const RATE_PER_HOUR = 2.50;

export default function ActiveSession() {
  const navigate = useNavigate();
  const [totalSeconds, setTotalSeconds] = useState(INITIAL_MINUTES * 60);
  const [elapsed, setElapsed] = useState(0);
  const [extensions, setExtensions] = useState(0);
  const [initialDuration, setInitialDuration] = useState(INITIAL_MINUTES);
  const [showSafeToLeave, setShowSafeToLeave] = useState(false);
  const [showExtendConfirm, setShowExtendConfirm] = useState(false);

  // Listen for session duration from WebSocket
  useEffect(() => {
    const handleSessionActive = ((event: CustomEvent) => {
      if (event.detail?.duration) {
        const minutes = event.detail.duration;
        setInitialDuration(minutes);
        setTotalSeconds(minutes * 60);
        setElapsed(0);
        setExtensions(0);
        console.log('Session started with duration:', minutes, 'minutes');
      }
    }) as EventListener;

    window.addEventListener('sessionActive', handleSessionActive);
    return () => window.removeEventListener('sessionActive', handleSessionActive);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTotalSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
      setElapsed(prev => prev + 1);
    }, 1000);

    const safeTimer = setTimeout(() => {
      setShowSafeToLeave(true);
    }, 1500);

    return () => {
      clearInterval(interval);
      clearTimeout(safeTimer);
    };
  }, []);

  const formatCountdown = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const totalParkedMinutes = initialDuration + extensions * EXTEND_MINUTES;
  const progressRatio = totalSeconds / (totalParkedMinutes * 60);

  const handleExtend = () => {
    setTotalSeconds(prev => prev + EXTEND_MINUTES * 60);
    setExtensions(prev => prev + 1);
    setShowExtendConfirm(true);
    setTimeout(() => setShowExtendConfirm(false), 2000);
  };

  const handleEndSession = () => {
    const totalParkedSeconds = elapsed;
    const cost = ((totalParkedSeconds / 3600) * RATE_PER_HOUR).toFixed(2);
    navigate('/payment', { state: { cost, duration: totalParkedSeconds } });
  };

  const isLowTime = totalSeconds <= 300 && totalSeconds > 0;
  const isExpired = totalSeconds <= 0;
  const cumulativeCost = ((elapsed / 3600) * RATE_PER_HOUR).toFixed(2);

  return (
    <div className="h-full bg-[#f0f4f2] flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="pt-14 px-6 pb-3 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2 text-gray-500">
          <MapPin size={15} />
          <span className="text-sm font-medium">Zone #8492</span>
        </div>
        <div className={clsx(
          "px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5",
          isExpired ? "bg-red-100 text-red-500" : "bg-emerald-100 text-emerald-600"
        )}>
          <div className={clsx(
            "w-1.5 h-1.5 rounded-full animate-pulse",
            isExpired ? "bg-red-500" : "bg-emerald-500"
          )} />
          {isExpired ? "EXPIRED" : "ACTIVE"}
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex flex-col px-5 min-h-0">
        {/* Countdown Card */}
        <div className="bg-white rounded-3xl shadow-sm p-6 flex flex-col items-center">
          <div className="w-44 h-44 rounded-full flex flex-col items-center justify-center relative mb-4">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 176 176">
              <circle cx="88" cy="88" r="80" stroke="currentColor" strokeWidth="5" fill="transparent" className="text-gray-100" />
              <circle
                cx="88" cy="88" r="80"
                stroke="currentColor" strokeWidth="5" fill="transparent"
                className={clsx(
                  "transition-all duration-1000",
                  isExpired ? "text-red-400" : isLowTime ? "text-amber-400" : "text-emerald-500"
                )}
                strokeDasharray={2 * Math.PI * 80}
                strokeDashoffset={(2 * Math.PI * 80) * (1 - progressRatio)}
                strokeLinecap="round"
              />
            </svg>
            <span className="text-gray-400 text-[10px] font-semibold mb-0.5 tracking-[0.15em] uppercase">
              {isExpired ? "Time's Up" : "Remaining"}
            </span>
            <span className={clsx(
              "text-[34px] font-mono font-bold tracking-tight tabular-nums",
              isExpired ? "text-red-500" : isLowTime ? "text-amber-500" : "text-gray-900"
            )}>
              {formatCountdown(totalSeconds)}
            </span>
          </div>
          <p className="text-gray-400 text-[13px]">$2.50/hr</p>
        </div>

        {/* Extend Button */}
        <div className="flex justify-center py-4">
          <button
            onClick={handleExtend}
            className="flex items-center gap-2 bg-white hover:bg-emerald-50 active:scale-[0.97] transition-all px-5 py-2.5 rounded-xl border border-gray-200 shadow-sm"
          >
            <Plus size={16} className="text-emerald-500" />
            <span className="font-semibold text-[14px] text-gray-700">Extend +30 min</span>
          </button>
        </div>

        {/* Info tiles */}
        <div className="space-y-2.5 flex-1">
          {/* Safe to leave */}
          <AnimatePresence>
            {showSafeToLeave && !isExpired && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-3.5 shadow-sm"
              >
                <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <ShieldCheck size={19} />
                </div>
                <div>
                  <h3 className="font-bold text-emerald-600 text-[13px]">You can leave now</h3>
                  <p className="text-gray-400 text-[11px] leading-snug mt-0.5">
                    Session active. We'll notify you 15 min before expiry.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cost & Location */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-sm"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                  <DollarSign size={15} className="text-emerald-500" />
                </div>
                <span className="text-[13px] text-gray-500">Current Cost</span>
              </div>
              <span className="font-bold text-gray-900 text-[16px] tabular-nums">${cumulativeCost}</span>
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={15} className="text-emerald-500" />
                </div>
                <span className="text-[13px] text-gray-500">Location</span>
              </div>
              <span className="font-semibold text-gray-900 text-[13px]">Main St, Zone A</span>
            </div>
          </motion.div>
        </div>

        {/* End Session Button */}
        <div className="pt-4 pb-10 shrink-0">
          <button
            onClick={handleEndSession}
            className="w-full bg-emerald-500 text-white py-4 rounded-2xl font-bold text-[17px] shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 active:scale-[0.98] transition-all"
          >
            End Session
          </button>
        </div>
      </div>

      {/* Extension toast overlay */}
      <AnimatePresence>
        {showExtendConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.95 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 shadow-lg"
          >
            <Timer size={16} />
            Extended by 30 minutes
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
