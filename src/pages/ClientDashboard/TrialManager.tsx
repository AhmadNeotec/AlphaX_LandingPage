import React, { useEffect, useState } from 'react';

interface TrialManagerProps {
  userId: string;
}

const TRIAL_DAYS = 14;

const TrialManager: React.FC<TrialManagerProps> = ({ userId }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trialInfo, setTrialInfo] = useState<{
    creation: string;
    current_datetime: string;
    daysSinceCreation: number;
  } | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchTrialInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.user_info.get_user_creation_info', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          credentials: 'include',
          body: JSON.stringify({ userId }),
        });
        if (!res.ok) throw new Error('Failed to fetch user info');
        const data = await res.json();
        const creation = data.message?.data?.creation;
        const current_datetime = data.message?.data?.current_datetime;
        if (!creation || !current_datetime) throw new Error('Invalid API response');
        
        const createdDate = new Date(creation);
        const nowDate = new Date(current_datetime);
        const diffTime = nowDate.getTime() - createdDate.getTime();
        const daysSinceCreation = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        
        console.log('[TrialManager] Created date:', createdDate);
        console.log('[TrialManager] Current date:', nowDate);
        console.log('[TrialManager] Days since creation:', daysSinceCreation);
        console.log('[TrialManager] Trial days limit:', TRIAL_DAYS);
        
        setTrialInfo({ creation, current_datetime, daysSinceCreation });
        
        // If trial has expired (14 days or more), show modal and redirect
        if (daysSinceCreation >= TRIAL_DAYS) {
          setShowModal(true);
          // Redirect to billing management after 3 seconds
          setTimeout(() => {
            window.location.href = '/clientLogin/billing-management';
          }, 3000);
        }
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchTrialInfo();
  }, [userId]);

  if (loading) return null;
  if (error) return <div className="text-red-600 text-center my-4">{error}</div>;

  return (
    <>
      {/* Trial Progress Indicator */}
      {trialInfo && trialInfo.daysSinceCreation < TRIAL_DAYS && (
        <div className="w-full flex justify-center my-4">
          <div className="bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white px-6 py-3 rounded-xl shadow-lg font-semibold text-lg">
            Trial: {trialInfo.daysSinceCreation} / {TRIAL_DAYS} days used
          </div>
        </div>
      )}
      {/* Modal for expired trial */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] bg-black/50 flex items-center justify-center">
          <div className="bg-white dark:bg-[#23232a] rounded-2xl p-8 max-w-md mx-4 shadow-2xl text-center">
            <h2 className="text-2xl font-bold mb-4 text-[#774A67]">Trial Expired</h2>
            <p className="mb-6 text-gray-700 dark:text-gray-200">Your 14-day trial period has ended. Please subscribe to continue using the platform.</p>
            <button
              className="px-6 py-3 bg-gradient-to-r from-[#774A67] to-[#8b5cf6] text-white rounded-xl shadow-lg hover:shadow-xl hover:from-[#8b5cf6] hover:to-[#774A67] transition-all duration-300 font-semibold text-lg"
              onClick={() => window.location.assign('/subscription-plan')}
            >
              Go to Subscription
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TrialManager; 