import React, { useState, useEffect } from 'react';
import { enqueueSnackbar } from 'notistack';
import { FiSave, FiEdit2, FiLoader } from 'react-icons/fi';
import { frappeApi } from '../../services/frappeApi';

const PLAN_NAMES = ['Basic', 'Advanced', 'Premium'];

interface PricingAmounts {
  [plan: string]: {
    monthly: number;
    yearly: number;
    yearlyTotal: number;
  };
}

const defaultPricing: PricingAmounts = {
  Basic: { monthly: 14.95, yearly: 9.99, yearlyTotal: 120 },
  Advanced: { monthly: 24.99, yearly: 19.95, yearlyTotal: 239 },
  Premium: { monthly: 49.95, yearly: 40.0, yearlyTotal: 480 },
};

const PricingManagement = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [pricing, setPricing] = useState<PricingAmounts>(defaultPricing);
  const [originalPricing, setOriginalPricing] = useState<PricingAmounts>(defaultPricing);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadPricing();
  }, []);

  const loadPricing = async () => {
    setLoading(true);
    try {
      const pricingData = await frappeApi.getPricing();
      
      // Merge with default pricing to ensure all fields exist
      const mergedPricing = {
        ...defaultPricing,
        ...pricingData,
      };
      
      setPricing(mergedPricing);
      setOriginalPricing(mergedPricing);
    } catch (error) {
      console.error('Failed to load pricing from Frappe:', error);
      enqueueSnackbar("Failed to load pricing data", { variant: "error" });
      // Keep default pricing on error
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Calculate changes for audit trail
      type PlanField = keyof typeof defaultPricing[typeof PLAN_NAMES[number]];
      const fields: PlanField[] = ['monthly', 'yearly', 'yearlyTotal'];
      const changes = PLAN_NAMES.flatMap(plan => {
        const oldPlan = originalPricing[plan];
        const newPlan = pricing[plan];
        return fields.flatMap(field => {
          if (oldPlan[field] !== newPlan[field]) {
            return [{
              plan,
              field,
              oldPrice: oldPlan[field],
              newPrice: newPlan[field],
              timestamp: new Date().toISOString(),
            }];
          }
          return [];
        });
      });

      // Save pricing to Frappe
      const updatedPricing = await frappeApi.updatePricing(pricing);
      
      // Log price changes if any
      if (changes.length > 0) {
        try {
          await frappeApi.logPriceChanges(changes);
        } catch (logError) {
          console.warn('Failed to log price changes:', logError);
          // Don't fail the entire operation if logging fails
        }
      }

      setPricing(updatedPricing);
      setOriginalPricing(updatedPricing);
      setIsEditing(false);
      enqueueSnackbar("Pricing updated successfully!", { variant: "success" });
    } catch (error) {
      console.error('Failed to save pricing to Frappe:', error);
      enqueueSnackbar("Failed to save pricing", { variant: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (plan: string, field: keyof PricingAmounts["Basic"], value: string) => {
    setPricing(prev => ({
      ...prev,
      [plan]: {
        ...prev[plan],
        [field]: parseFloat(value) || 0,
      },
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Pricing Management</h2>
          <div className="flex gap-4">
            {isEditing ? (
              <button 
                onClick={handleSave} 
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? <FiLoader className="animate-spin" /> : <FiSave />} 
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            ) : (
              <button 
                onClick={() => setIsEditing(true)} 
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors disabled:opacity-50"
              >
                <FiEdit2 /> Edit Pricing
              </button>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <FiLoader className="animate-spin text-4xl text-[#774A67]" />
            <span className="ml-2 text-lg">Loading pricing data...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PLAN_NAMES.map(plan => (
              <div key={plan} className="border rounded-lg p-6 bg-white shadow-sm">
                <h3 className="text-xl font-semibold mb-4">{plan}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].monthly}
                      onChange={e => handleChange(plan, 'monthly', e.target.value)}
                      disabled={!isEditing || saving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].yearly}
                      onChange={e => handleChange(plan, 'yearly', e.target.value)}
                      disabled={!isEditing || saving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Yearly Total</label>
                    <input
                      type="number"
                      step="0.01"
                      value={pricing[plan].yearlyTotal}
                      onChange={e => handleChange(plan, 'yearlyTotal', e.target.value)}
                      disabled={!isEditing || saving}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#774A67] focus:ring-[#774A67] disabled:bg-gray-100"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PricingManagement; 