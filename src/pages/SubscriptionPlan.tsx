import React from 'react';
import { useNavigate } from 'react-router-dom';

const SubscriptionPlan: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f8fa] via-[#f3f4f8] to-[#e9eaf3] dark:from-[#1a1a1f] dark:via-[#23232a] dark:to-[#18181c]">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 max-w-lg w-full text-center">
        <h1 className="text-3xl font-bold mb-6 text-[#774A67]">Subscription Plan</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Here you can view and manage your subscription plan. (Coming soon)</p>
        <button
          className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#5e3752] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#5e3752] hover:to-[#774A67] transition-all duration-300 transform hover:scale-105 font-semibold"
          onClick={() => navigate('/clientLogin')}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlan; 