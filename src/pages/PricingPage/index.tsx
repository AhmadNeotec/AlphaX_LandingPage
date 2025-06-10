import React, { useState, useEffect } from 'react';

interface PricingPlan {
  name: string;
  price: string;
  features: string[];
}

const PricingPage = () => {
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([
    {
      name: "Basic",
      price: "99",
      features: ["Feature 1", "Feature 2", "Feature 3"]
    },
    {
      name: "Advanced",
      price: "199",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4"]
    },
    {
      name: "Premium",
      price: "299",
      features: ["Feature 1", "Feature 2", "Feature 3", "Feature 4", "Feature 5"]
    }
  ]);

  useEffect(() => {
    // Load pricing data from localStorage if available
    const savedPricing = localStorage.getItem('pricingPlans');
    if (savedPricing) {
      setPricingPlans(JSON.parse(savedPricing));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#774A67]/10 via-[#774A67]/20 to-[#774A67]/30 dark:from-[#774A67]/30 dark:via-[#774A67]/25 dark:to-[#774A67]/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Select the perfect plan for your business needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 transform hover:scale-105 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {plan.name}
              </h2>
              <div className="mb-6">
                <span className="text-4xl font-bold text-[#774A67]">${plan.price}</span>
                <span className="text-gray-600 dark:text-gray-400">/month</span>
              </div>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
                    <svg
                      className="h-5 w-5 text-[#774A67] mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <button className="w-full py-3 px-6 bg-[#774A67] text-white rounded-lg hover:bg-[#5e3752] transition-colors">
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PricingPage; 