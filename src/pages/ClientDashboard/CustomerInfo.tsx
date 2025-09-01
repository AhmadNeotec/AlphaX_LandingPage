import { withApiAuthHeaders } from '@api/authHeaders';

// Types for the API request
interface CustomerDetails {
  first_name: string;
  last_name: string;
  company: string;
  email: string;
  contact_no: string;
  address: string;
}

interface SiteDetails {
  site_name: string;
  site_url: string;
  creation_date: string;
  creation_status: string;
  created_by: string;
}

interface Subscription {
  plan_name: string;
  billing_period: string;
  max_users: number;
  start_date: string;
  expiry_date: string;
  modules: Module[];
}

interface Module {
  module: string;
}

interface PaymentDetails {
  payment_method: string;
  transaction_id: string;
  amount: number;
  currency: string;
  payment_status: string;
}

interface CustomerAccountRequest {
  validated_data: {
    customer_details: CustomerDetails;
    site_details: SiteDetails;
    subscription: Subscription;
    payment_details: PaymentDetails;
  };
}

// User info response interface
interface UserInfoResponse {
  message: {
    status: string;
    data: {
      name: string;
      creation: string;
      first_name: string;
      last_name: string;
      email: string;
      current_datetime: string;
    };
  };
}

// Function to get user info
const getUserInfo = async (userEmail: string): Promise<{ first_name: string; last_name: string } | null> => {
  try {
    console.log('👤 [CustomerInfo] Getting user info for:', userEmail);
    
    const response = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.user_info.get_user_creation_info', {
      method: 'POST',
      headers: {
        ...withApiAuthHeaders(),
        //'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userEmail
      })
    });
    
    if (!response.ok) {
      console.error('❌ [CustomerInfo] User info API failed with status:', response.status);
      return null;
    }
    
    const result: UserInfoResponse = await response.json();
    console.log('📥 [CustomerInfo] User info response:', result);
    
    if (result.message?.status === 'success' && result.message?.data) {
      return {
        first_name: result.message.data.first_name || 'Admin',
        last_name: result.message.data.last_name || 'User'
      };
    }
    
    return null;
  } catch (error) {
    console.error('💥 [CustomerInfo] Error getting user info:', error);
    return null;
  }
};

// Function to create customer account document
export const createCustomerAccountDocument = async (
  siteData: {
    name: string;
    domain: string;
    adminPassword: string;
  },
  selectedPlan: any,
  selectedModules: string[],
  selectedCard: {
    card_name: string;
    card_number: string;
    expiry: string;
  } | null,
  billingPeriod: 'monthly' | 'yearly',
  planName?: string
): Promise<{ success: boolean; message: string; data?: any }> => {
  console.log('🏢 [CustomerInfo] ===== CUSTOMER SITE CREATION STARTED =====');
  console.log('📥 [CustomerInfo] Input parameters:');
  console.log('   - siteData:', siteData);
  console.log('   - selectedPlan:', selectedPlan);
  console.log('   - selectedModules:', selectedModules);
  console.log('   - selectedCard:', selectedCard);
  console.log('   - billingPeriod:', billingPeriod);
  
  try {
    console.log('📅 [CustomerInfo] Calculating dates...');
    
    // Get current date
    const currentDate = new Date();
    const creationDate = currentDate.toISOString().split('T')[0];
    console.log('   - creationDate:', creationDate);
    
    // Get user email from localStorage
    const userEmail = localStorage.getItem('user') || 'admin@neotec.ai';
    console.log('   - userEmail:', userEmail);
    
    // Get user info for first_name and last_name
    console.log('👤 [CustomerInfo] Fetching user info...');
    const userInfo = await getUserInfo(userEmail);
    const firstName = userInfo?.first_name || "Admin";
    const lastName = userInfo?.last_name || "User";
    console.log('👤 [CustomerInfo] User info result:', { firstName, lastName });
    
    // Generate transaction ID
    const transactionId = `TXN${Date.now()}`;
    console.log('   - transactionId:', transactionId);
    
    // Calculate amount based on plan and billing period
    const planPrice = parseFloat(selectedPlan?.price?.[billingPeriod] || '0');
    const modulePrice = selectedModules.length * 50; // Assuming 50 per module
    const totalAmount = planPrice + modulePrice;
    console.log('💰 [CustomerInfo] Price calculations:');
    console.log('   - planPrice:', planPrice);
    console.log('   - modulePrice:', modulePrice);
    console.log('   - totalAmount:', totalAmount);
    
    // Calculate users based on plan
    const users = selectedPlan?.name === 'Premium' ? 50 : 
                  selectedPlan?.name === 'Business' ? 100 : 
                  selectedPlan?.name === 'Enterprise' ? 500 : 10;
    
    // Prepare the request payload according to the new API structure
    console.log('📝 [CustomerInfo] Building request payload...');
    const requestPayload = {
      site_name: siteData.name,
      site_url: `https://${siteData.domain}.neotec.ai`,
      creation_date: creationDate,
      creation_status: "Active",
      created_by: userEmail,
      users: users,
      billing_cycle: billingPeriod === 'monthly' ? 'Monthly' : 'Yearly',
      plan_name: planName || selectedPlan?.name || 'Basic',
      modules: selectedModules.map(module => ({ module })),
      payment_details: [
        {
          payment_method: "Credit Card",
          transaction_id: transactionId,
          amount: totalAmount,
          currency: "SAR",
          status: "Paid"
        }
      ]
    };
    
    console.log('📦 [CustomerInfo] Final request payload:');
    console.log(JSON.stringify(requestPayload, null, 2));
    
    // Make the API call to the new endpoint
    console.log('🌐 [CustomerInfo] Making API call to add site...');
    console.log('🔗 [CustomerInfo] API URL: https://test.neotec.ai/api/method/alphax_erp.api.customer_site_info.add_site');
    
    const response = await fetch('https://test.neotec.ai/api/method/alphax_erp.api.customer_site_info.add_site', {
      method: 'POST',
      headers: {
        ...withApiAuthHeaders(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestPayload)
    });
    
    console.log('📡 [CustomerInfo] API Response status:', response.status);
    console.log('📡 [CustomerInfo] API Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      console.error('❌ [CustomerInfo] API call failed with status:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('📥 [CustomerInfo] API Response body:');
    console.log(JSON.stringify(result, null, 2));
    
    if (result.message && result.message.success === true) {
      console.log('✅ [CustomerInfo] API call successful!');
      console.log('📊 [CustomerInfo] Success response data:', result.message);
      return {
        success: true,
        message: 'Customer site created successfully',
        data: result.message
      };
    } else {
      console.error('❌ [CustomerInfo] API returned error:', result.message);
      throw new Error(result.message?.message || 'Failed to create customer site');
    }
    
  } catch (error: any) {
    console.error('💥 [CustomerInfo] Error creating customer site:', error);
    console.error('💥 [CustomerInfo] Error stack:', error.stack);
    return {
      success: false,
      message: error.message || 'Unknown error occurred'
    };
  } finally {
    console.log('🏁 [CustomerInfo] ===== CUSTOMER SITE CREATION ENDED =====');
  }
};

// Function to validate customer account creation
export const validateCustomerAccountCreation = (
  siteData: any,
  selectedPlan: any,
  selectedModules: string[],
  selectedCard: any
): { isValid: boolean; errors: string[] } => {
  console.log('🔍 [CustomerInfo] ===== VALIDATION STARTED =====');
  console.log('🔍 [CustomerInfo] Validating inputs:');
  console.log('   - siteData:', siteData);
  console.log('   - selectedPlan:', selectedPlan);
  console.log('   - selectedModules:', selectedModules);
  console.log('   - selectedCard:', selectedCard);
  
  const errors: string[] = [];
  
  if (!siteData?.name) {
    errors.push('Site name is required');
    console.log('❌ [CustomerInfo] Validation failed: Site name is missing');
  } else {
    console.log('✅ [CustomerInfo] Site name validation passed');
  }
  
  if (!siteData?.domain) {
    errors.push('Site domain is required');
    console.log('❌ [CustomerInfo] Validation failed: Site domain is missing');
  } else {
    console.log('✅ [CustomerInfo] Site domain validation passed');
  }
  
  if (!selectedPlan?.name) {
    errors.push('Plan selection is required');
    console.log('❌ [CustomerInfo] Validation failed: Plan selection is missing');
  } else {
    console.log('✅ [CustomerInfo] Plan selection validation passed');
  }
  
  if (!selectedModules || selectedModules.length === 0) {
    errors.push('At least one module must be selected');
    console.log('❌ [CustomerInfo] Validation failed: No modules selected');
  } else {
    console.log('✅ [CustomerInfo] Modules validation passed');
  }
  
  if (!selectedCard?.card_name) {
    errors.push('Payment card selection is required');
    console.log('❌ [CustomerInfo] Validation failed: Payment card is missing');
  } else {
    console.log('✅ [CustomerInfo] Payment card validation passed');
  }
  
  const result = {
    isValid: errors.length === 0,
    errors
  };
  
  console.log('📊 [CustomerInfo] Validation result:', result);
  console.log('🏁 [CustomerInfo] ===== VALIDATION ENDED =====');
  
  return result;
};

export default {
  createCustomerAccountDocument,
  validateCustomerAccountCreation
};
