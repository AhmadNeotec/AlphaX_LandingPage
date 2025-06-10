interface PricingAmounts {
  [plan: string]: {
    monthly: number;
    yearly: number;
    yearlyTotal: number;
  };
}

interface PriceChangeHistory {
  plan: string;
  field: string;
  oldPrice: number;
  newPrice: number;
  timestamp: string;
}

const FRAPPE_BASE_URL = process.env.REACT_APP_FRAPPE_URL || 'http://localhost:8000';

export class FrappeApiService {
  private async frappeRequest(endpoint: string, options?: RequestInit) {
    const url = `${FRAPPE_BASE_URL}${endpoint}`;
    
    const response = await fetch(url, {
      credentials: 'include', // Important for Frappe session auth
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
      ...options,
    });
    
    if (!response.ok) {
      throw new Error(`Frappe API Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  }

  async getPricing(): Promise<PricingAmounts> {
    try {
      // Method 1: Using Frappe custom method
      const response = await this.frappeRequest('/api/method/your_app.api.get_pricing');
      return response.message || {};
    } catch (error) {
      // Method 2: Direct DocType access (if you have a Pricing doctype)
      try {
        const response = await this.frappeRequest('/api/resource/Pricing');
        if (response.data && response.data.length > 0) {
          // Transform Frappe doc to your format
          return this.transformFrappePricing(response.data[0]);
        }
      } catch (e) {
        console.error('Failed to load pricing from Frappe:', error);
      }
      return {};
    }
  }

  async updatePricing(pricing: PricingAmounts): Promise<PricingAmounts> {
    try {
      // Method 1: Using custom method
      const response = await this.frappeRequest('/api/method/your_app.api.update_pricing', {
        method: 'POST',
        body: JSON.stringify({ pricing }),
      });
      return response.message || pricing;
    } catch (error) {
      // Method 2: Update via DocType
      const response = await this.frappeRequest('/api/resource/Pricing/pricing-settings', {
        method: 'PUT',
        body: JSON.stringify(this.transformToFrappeDoc(pricing)),
      });
      return this.transformFrappePricing(response.data);
    }
  }

  async logPriceChanges(changes: PriceChangeHistory[]): Promise<void> {
    // Log each change as a separate document
    for (const change of changes) {
      await this.frappeRequest('/api/resource/Price Change Log', {
        method: 'POST',
        body: JSON.stringify({
          plan: change.plan,
          field: change.field,
          old_price: change.oldPrice,
          new_price: change.newPrice,
          change_timestamp: change.timestamp,
        }),
      });
    }
  }

  private transformFrappePricing(doc: any): PricingAmounts {
    // Transform Frappe document structure to your format
    return {
      Basic: {
        monthly: doc.basic_monthly || 14.95,
        yearly: doc.basic_yearly || 9.99,
        yearlyTotal: doc.basic_yearly_total || 120,
      },
      Advanced: {
        monthly: doc.advanced_monthly || 24.99,
        yearly: doc.advanced_yearly || 19.95,
        yearlyTotal: doc.advanced_yearly_total || 239,
      },
      Premium: {
        monthly: doc.premium_monthly || 49.95,
        yearly: doc.premium_yearly || 40.0,
        yearlyTotal: doc.premium_yearly_total || 480,
      },
    };
  }

  private transformToFrappeDoc(pricing: PricingAmounts): any {
    // Transform your format to Frappe document structure
    return {
      basic_monthly: pricing.Basic.monthly,
      basic_yearly: pricing.Basic.yearly,
      basic_yearly_total: pricing.Basic.yearlyTotal,
      advanced_monthly: pricing.Advanced.monthly,
      advanced_yearly: pricing.Advanced.yearly,
      advanced_yearly_total: pricing.Advanced.yearlyTotal,
      premium_monthly: pricing.Premium.monthly,
      premium_yearly: pricing.Premium.yearly,
      premium_yearly_total: pricing.Premium.yearlyTotal,
    };
  }
}

export const frappeApi = new FrappeApiService(); 