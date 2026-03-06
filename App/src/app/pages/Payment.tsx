import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, MapPin, Clock, CheckCircle, XCircle, CreditCard } from 'lucide-react';
import { clsx } from 'clsx';
import { useWebSocket } from '../hooks/useWebSocket';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sendMessage } = useWebSocket();
  const { cost = "2.50", duration = 1800 } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const formatDuration = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (hrs > 0) return `${hrs}h ${mins}m`;
    return `${mins}m`;
  };

  // Request payment methods on mount
  useEffect(() => {
    sendMessage({ event: 'GET_PAYMENT_METHODS' });
  }, []);

  // Listen for payment methods updates
  useEffect(() => {
    const handlePaymentMethodsUpdate = ((event: CustomEvent) => {
      const methods = event.detail.paymentMethods as PaymentMethod[];
      const defaultMethod = methods.find(pm => pm.isDefault) || methods[0] || null;
      setPaymentMethod(defaultMethod);
    }) as EventListener;

    window.addEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
    return () => window.removeEventListener('paymentMethodsUpdated', handlePaymentMethodsUpdate);
  }, []);

  // Listen for payment result
  useEffect(() => {
    const handlePaymentResult = ((event: CustomEvent) => {
      const { success, message } = event.detail;

      if (success) {
        setPaymentStatus('success');
        setTimeout(() => {
          navigate('/receipt', { state: { cost, duration } });
        }, 1500);
      } else {
        setPaymentStatus('failed');
        setErrorMessage(message || 'Payment declined');
        setIsProcessing(false);
      }
    }) as EventListener;

    window.addEventListener('paymentResult', handlePaymentResult);
    return () => window.removeEventListener('paymentResult', handlePaymentResult);
  }, [navigate, cost, duration]);

  const handlePay = () => {
    if (!paymentMethod) {
      navigate('/payment-methods');
      return;
    }

    setIsProcessing(true);
    setPaymentStatus('processing');
    setErrorMessage('');

    // Send payment request to backend
    sendMessage({
      event: 'PROCESS_PAYMENT',
      paymentMethodId: paymentMethod.id,
      amount: parseFloat(cost),
      description: `Parking for ${formatDuration(duration)}`
    });
  };

  const getBrandColor = (brand: string) => {
    switch (brand) {
      case 'visa': return 'from-blue-500 to-blue-600';
      case 'mastercard': return 'from-red-500 to-orange-500';
      case 'amex': return 'from-blue-600 to-cyan-600';
      case 'discover': return 'from-orange-500 to-amber-500';
      default: return 'from-gray-500 to-gray-600';
    }
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
                <p className="text-gray-400 text-xs">Main St, Zone A</p>
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
        >
          {paymentMethod ? (
            <button
              onClick={() => navigate('/payment-methods')}
              disabled={isProcessing}
              className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <div className={`w-11 h-7 rounded-md bg-gradient-to-br ${getBrandColor(paymentMethod.brand)} shadow-sm`} />
                <div className="flex flex-col items-start">
                  <span className="text-xs text-gray-400 font-medium">Payment Method</span>
                  <span className="text-sm font-semibold text-gray-900">•••• {paymentMethod.last4}</span>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ) : (
            <button
              onClick={() => navigate('/payment-methods')}
              className="w-full bg-white rounded-2xl shadow-sm border-2 border-dashed border-gray-300 p-4 flex items-center justify-center gap-2 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all"
            >
              <CreditCard size={18} className="text-gray-500" />
              <span className="text-sm font-semibold text-gray-600">Add Payment Method</span>
            </button>
          )}
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {paymentStatus === 'failed' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4"
            >
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-start gap-3">
                <XCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-800 text-sm">Payment Failed</p>
                  <p className="text-xs text-red-600 mt-0.5">{errorMessage}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="p-6 pb-12 z-10 shrink-0 space-y-3">
        <button
          onClick={handlePay}
          disabled={isProcessing || !paymentMethod}
          className={clsx(
            "w-full py-4 rounded-2xl font-bold text-[17px] flex items-center justify-center gap-2 transition-all shadow-lg",
            paymentStatus === 'success'
              ? "bg-green-500 text-white"
              : isProcessing
              ? "bg-gray-300 text-gray-500 scale-[0.98]"
              : !paymentMethod
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98] shadow-emerald-500/20"
          )}
        >
          {paymentStatus === 'success' ? (
            <>
              <CheckCircle size={20} />
              Payment Successful!
            </>
          ) : isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing Payment...
            </>
          ) : !paymentMethod ? (
            'Add Payment Method First'
          ) : (
            `Pay $${cost}`
          )}
        </button>

        {paymentStatus === 'failed' && (
          <button
            onClick={() => {
              setPaymentStatus('idle');
              setErrorMessage('');
            }}
            className="w-full py-3 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Try Again
          </button>
        )}

        {!paymentMethod && (
          <div className="flex justify-center">
            <p className="text-gray-400 text-xs font-medium">Add a payment method to continue</p>
          </div>
        )}
      </footer>
    </div>
  );
}
