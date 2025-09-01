import React, { useState } from 'react';
import { withApiAuthHeaders } from '@api/authHeaders';
import { useNavigate } from "react-router-dom";

interface PaymentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const PaymentDetailsModal: React.FC<PaymentDetailsModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  if (!isOpen) return null;

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!cardName) errs.cardName = 'Cardholder name is required';
    if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) errs.cardNumber = 'Valid card number is required';
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) {
      errs.expiry = 'Expiry must be MM/YY';
    } else {
      const [mm, yy] = expiry.split('/').map(Number);
      const now = new Date();
      const currentYear = now.getFullYear() % 100; // last two digits
      const currentMonth = now.getMonth() + 1; // 1-based
      if (mm < 1 || mm > 12) {
        errs.expiry = 'Month must be between 01 and 12';
      } else if (yy < currentYear || (yy === currentYear && mm < currentMonth)) {
        errs.expiry = 'Expiry date cannot be in the past';
      }
    }
    if (!cvv || !/^\d{3,4}$/.test(cvv)) errs.cvv = 'Valid CVV is required';
    return errs;
  };

  const formatCardNumber = (value: string) => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, "");
    // Add a space after every 4 digits
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    const userId = localStorage.getItem("user");
    console.log('[PaymentModal] Submitting payment form with:', { userId, cardName, cardNumber, expiry, cvv });
    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      try {
        console.log('[PaymentModal] Sending POST request to Frappe API...');
        const res = await fetch(" https://test.neotec.ai/api/method/alphax_erp.api.payment.save_payment_details", {
          method: "POST",
          headers: withApiAuthHeaders(),
          credentials: "include",
          body: JSON.stringify({
            userId,
            cardName,
            cardNumber: cardNumber.replace(/\s/g, ''),
            expiry,
            cvv,
          }),
        });

        console.log('[PaymentModal] Response status:', res.status);
        if (!res.ok) {
          const err = await res.json();
          console.error('[PaymentModal] API error response:', err);
          const errorMsg = err.message || "Failed to save payment details";
          throw new Error(errorMsg);
        }

        const result = await res.json();
        console.log('[PaymentModal] Payment details saved successfully:', result);
        // Optionally show a success message here
        if (onSuccess) onSuccess();
      } catch (error) {
        console.error('[PaymentModal] Error during payment submission:', error);
        setErrors({ api: (error as Error).message });
      } finally {
        setSubmitting(false);
        console.log('[PaymentModal] Submission finished.');
      }
    } else {
      console.warn('[PaymentModal] Validation errors:', errs);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] bg-black/40 flex items-center justify-center">
      <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full mx-4 my-8 p-8">
        <button
          className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 z-10"
          onClick={onClose}
          aria-label="Close Payment Modal"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold text-center text-[#774A67] mb-6">Payment Details</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Card holder Name</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:border-gray-700 focus:outline-none focus:border-[#774A67] text-sm"
              value={cardName}
              onChange={e => setCardName(e.target.value)}
              placeholder="Name on card"
              disabled={submitting}
            />
            {errors.cardName && <p className="text-xs text-red-600 mt-1">{errors.cardName}</p>}
          </div>
          <div>
            <label className="block text-gray-700 dark:text-gray-200 mb-1">Card Number</label>
            <input
              type="text"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:border-gray-700 focus:outline-none focus:border-[#774A67] text-sm"
              value={cardNumber}
              onChange={e => setCardNumber(formatCardNumber(e.target.value))}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              disabled={submitting}
            />
            {errors.cardNumber && <p className="text-xs text-red-600 mt-1">{errors.cardNumber}</p>}
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:border-gray-700 focus:outline-none focus:border-[#774A67] text-sm"
                value={expiry}
                onChange={e => {
                  let val = e.target.value.replace(/[^\d]/g, '');
                  if (val.length > 2) {
                    val = val.slice(0, 2) + '/' + val.slice(2, 4);
                  }
                  setExpiry(val.slice(0, 5));
                }}
                placeholder="MM/YY"
                maxLength={5}
                disabled={submitting}
              />
              {errors.expiry && <p className="text-xs text-red-600 mt-1">{errors.expiry}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-gray-700 dark:text-gray-200 mb-1">CVV</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white dark:bg-slate-900 dark:border-gray-700 focus:outline-none focus:border-[#774A67] text-sm"
                value={cvv}
                onChange={e => setCvv(e.target.value.replace(/[^\d]/g, '').slice(0, 4))}
                placeholder="123"
                maxLength={4}
                disabled={submitting}
              />
              {errors.cvv && <p className="text-xs text-red-600 mt-1">{errors.cvv}</p>}
            </div>
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3 px-4 rounded-xl text-white font-medium bg-gradient-to-r from-[#774A67] to-[#5e3752] hover:from-[#5e3752] hover:to-[#774A67] shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-[#774A67] focus:ring-offset-2"
          >
            {submitting ? 'Processing...' : 'Submit Payment'}
          </button>
          {errors.api && <p className="text-xs text-red-600 mt-1">{errors.api}</p>}
        </form>
      </div>
    </div>
  );
};

export default PaymentDetailsModal; 