import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, Plus, Trash2, CheckCircle, ArrowLeft } from 'lucide-react';
import { CardInput } from '../components/CardInput';
import { useWebSocket } from '../hooks/useWebSocket';

interface PaymentMethod {
  id: string;
  last4: string;
  brand: string;
  expMonth: string;
  expYear: string;
  isDefault: boolean;
}

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { sendMessage } = useWebSocket();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [showAddCard, setShowAddCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load payment methods from backend
  useEffect(() => {
    // Request payment methods from backend
    sendMessage({ event: 'GET_PAYMENT_METHODS' });

    // Listen for payment methods response
    const handlePaymentMethods = ((event: CustomEvent) => {
      if (event.detail?.paymentMethods) {
        setPaymentMethods(event.detail.paymentMethods);
      }
      setIsLoading(false);
    }) as EventListener;

    window.addEventListener('paymentMethodsUpdated', handlePaymentMethods);

    // Simulate loading
    setTimeout(() => setIsLoading(false), 500);

    return () => window.removeEventListener('paymentMethodsUpdated', handlePaymentMethods);
  }, []);

  const handleCardSave = (card: { last4: string; brand: string; expMonth: string; expYear: string }) => {
    const newCard: PaymentMethod = {
      id: `pm_${Date.now()}`,
      ...card,
      isDefault: paymentMethods.length === 0,
    };

    // Send to backend
    sendMessage({
      event: 'ADD_PAYMENT_METHOD',
      paymentMethod: newCard,
    });

    setPaymentMethods([...paymentMethods, newCard]);
    setShowAddCard(false);
  };

  const handleRemoveCard = (id: string) => {
    const updatedMethods = paymentMethods.filter(pm => pm.id !== id);

    // If removed card was default and there are other cards, make first one default
    if (updatedMethods.length > 0) {
      const removedCard = paymentMethods.find(pm => pm.id === id);
      if (removedCard?.isDefault) {
        updatedMethods[0].isDefault = true;
      }
    }

    sendMessage({
      event: 'REMOVE_PAYMENT_METHOD',
      paymentMethodId: id,
    });

    setPaymentMethods(updatedMethods);
  };

  const handleSetDefault = (id: string) => {
    const updatedMethods = paymentMethods.map(pm => ({
      ...pm,
      isDefault: pm.id === id,
    }));

    sendMessage({
      event: 'SET_DEFAULT_PAYMENT_METHOD',
      paymentMethodId: id,
    });

    setPaymentMethods(updatedMethods);
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

  const getBrandName = (brand: string) => {
    return brand.charAt(0).toUpperCase() + brand.slice(1);
  };

  if (showAddCard) {
    return (
      <div className="h-full flex flex-col bg-[#f0f4f2]">
        {/* Header */}
        <header className="bg-gradient-to-b from-emerald-50 to-[#f0f4f2] pt-14 pb-4 px-6 shrink-0">
          <button
            onClick={() => setShowAddCard(false)}
            className="flex items-center gap-2 text-gray-600 mb-3"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-semibold">Back</span>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Add Payment Method</h1>
        </header>

        {/* Card Input Form */}
        <main className="flex-1 px-5 py-4 overflow-y-auto">
          <div className="bg-white rounded-3xl shadow-lg p-6">
            <CardInput onCardSave={handleCardSave} />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-[#f0f4f2]">
      {/* Header */}
      <header className="bg-gradient-to-b from-emerald-50 to-[#f0f4f2] pt-14 pb-4 px-6 shrink-0">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-gray-600 mb-3"
        >
          <ArrowLeft size={18} />
          <span className="text-sm font-semibold">Home</span>
        </button>
        <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your saved cards</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-5 py-4 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* Saved Cards */}
            <AnimatePresence>
              {paymentMethods.map((card) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden"
                >
                  {/* Card Visual */}
                  <div className={`bg-gradient-to-br ${getBrandColor(card.brand)} p-5 relative`}>
                    <div className="flex justify-between items-start mb-8">
                      <div className="text-white text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                        {getBrandName(card.brand)}
                      </div>
                      {card.isDefault && (
                        <div className="flex items-center gap-1 text-white text-xs font-semibold bg-white/20 px-2 py-1 rounded">
                          <CheckCircle size={12} />
                          Default
                        </div>
                      )}
                    </div>
                    <div className="text-white text-xl font-mono tracking-wider mb-3">
                      •••• •••• •••• {card.last4}
                    </div>
                    <div className="flex justify-between text-white/80 text-xs">
                      <span>Expires {card.expMonth}/{card.expYear.slice(-2)}</span>
                      <CreditCard size={16} />
                    </div>
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 flex gap-2">
                    {!card.isDefault && (
                      <button
                        onClick={() => handleSetDefault(card.id)}
                        className="flex-1 bg-emerald-50 text-emerald-600 py-2 rounded-lg font-semibold text-sm hover:bg-emerald-100 transition-colors"
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      onClick={() => handleRemoveCard(card.id)}
                      className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-100 transition-colors"
                    >
                      <Trash2 size={14} />
                      Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Add Card Button */}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddCard(true)}
              className="w-full bg-white border-2 border-dashed border-gray-300 rounded-2xl p-6 flex flex-col items-center gap-3 hover:border-emerald-500 hover:bg-emerald-50/30 transition-all"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                <Plus size={24} className="text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900 text-[15px]">Add New Card</p>
                <p className="text-xs text-gray-500 mt-0.5">Visa, Mastercard, Amex</p>
              </div>
            </motion.button>

            {/* Empty State */}
            {paymentMethods.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-1">No Cards Added</h3>
                <p className="text-sm text-gray-500">Add a payment method to start parking</p>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
