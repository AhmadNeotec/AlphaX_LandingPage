import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentDetailsPage: React.FC = () => {
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const navigate = useNavigate();

  const validate = () => {
    const errs: { [key: string]: string } = {};
    if (!cardName) errs.cardName = 'Cardholder name is required test';
    if (!cardNumber || !/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) errs.cardNumber = 'Valid card number is required';
    if (!expiry || !/^\d{2}\/\d{2}$/.test(expiry)) errs.expiry = 'Expiry must be MM/YY';
    if (!cvv || !/^\d{3,4}$/.test(cvv)) errs.cvv = 'Valid CVV is required';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setSubmitting(true);
      // Simulate payment processing
      setTimeout(() => {
        console.log('Payment details submitted:', { cardName, cardNumber, expiry, cvv });
        setSubmitting(false);
        // Redirect or show success message here
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c] p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white/90 dark:bg-gray-800/90 rounded-2xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-[#774A67] mb-6">Payment Details</h2>
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-1">Cardholder Name</label>
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
            onChange={e => setCardNumber(e.target.value.replace(/[^\d]/g, ''))}
            placeholder="1234 5678 9012 3456"
            maxLength={16}
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
              onChange={e => setExpiry(e.target.value.replace(/[^\d/]/g, '').slice(0, 5))}
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
      </form>
    </div>
  );
};

export default PaymentDetailsPage; 