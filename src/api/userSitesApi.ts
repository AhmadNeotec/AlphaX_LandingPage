import { withApiAuthHeaders } from './authHeaders';

// Fetch user sites for a specific user (POST with userId)
export const getUserSites = async (userId: string) => {
  try {
    const url = 'https://test.neotec.ai/api/method/alphax_erp.api.user_sites.get_user_site_by_userid';
    console.log('[userSitesApi] Calling:', url, 'with', { userid: userId });
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ userid: userId }),
      }
    );
    if (!response.ok) {
      throw new Error('Failed to fetch user sites');
    }
    const result = await response.json();
    console.log('[userSitesApi] Raw getUserSites response:', result);
    return result;
  } catch (error: any) {
    console.error('Error fetching user sites:', error);
    throw error;
  }
};

// Check subdomain availability
export const checkSubdomainAvailability = async (subdomain: string) => {
  try {
    const url = 'https://test.neotec.ai/api/method/alphax_erp.api.site_creation.check_subdomain_availability';
    console.log('[userSitesApi] Checking subdomain availability:', subdomain);
    
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: withApiAuthHeaders(),
        body: JSON.stringify({ subdomain: subdomain }),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to check subdomain availability: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('[userSitesApi] Subdomain availability response:', result);
    
    if (result.message && result.message.status === 'success') {
      return {
        available: result.message.available,
        message: result.message.message
      };
    } else {
      throw new Error(result.message?.message || 'Failed to check subdomain availability');
    }
  } catch (error: any) {
    console.error('[userSitesApi] Error checking subdomain availability:', error);
    throw error;
  }
};

// Get site status
export const getSiteStatus = async (siteUrl: string) => {
  try {
    const url = 'https://test.neotec.ai/api/method/alphax_erp.api.site_creation.get_site_status';
    console.log('[userSitesApi] Getting site status:', siteUrl);
    
    // For GET requests, we need to send data as query parameters, not in body
    const queryParams = new URLSearchParams({ site: siteUrl });
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    const response = await fetch(
      fullUrl,
      {
        method: 'GET',
        headers: withApiAuthHeaders(),
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to get site status: ${response.status}`);
    }
    
    const result = await response.json();
    console.log('[userSitesApi] Site status response:', result);
    
    if (result.message && result.message.status === 'success') {
      return {
        status: result.message.data.status,
        name: result.message.data.name,
        hostName: result.message.data.host_name,
        frappeVersion: result.message.data.latest_frappe_version
      };
    } else {
      throw new Error(result.message?.message || 'Failed to get site status');
    }
  } catch (error: any) {
    console.error('[userSitesApi] Error getting site status:', error);
    throw error;
  }
};

// Add user site information after successful site creation
export const addUserSite = async (userid: string, siteUrl: string, selectedModules: string[] = []) => {
  try {
    const url = 'https://test.neotec.ai/api/method/alphax_erp.api.user_sites.add_user_site';
    console.log('[userSitesApi] Adding user site:', { userid, siteUrl, selectedModules });
    console.log('[userSitesApi] Request URL:', url);
    
    // Ensure we have valid modules
    if (!selectedModules || selectedModules.length === 0) {
      console.warn('[userSitesApi] No modules provided, using default module');
      selectedModules = ['Basic'];
    }
    
    // Filter out any invalid module names
    const validModules = selectedModules.filter(module => 
      module && typeof module === 'string' && module.trim().length > 0
    );
    
    if (validModules.length === 0) {
      console.warn('[userSitesApi] No valid modules after filtering, using default module');
      validModules.push('Basic');
    }
    
    const requestBody = {
      userid: userid,
      sites: [{ site_url: siteUrl }],
      subscribe_modules: validModules.map(moduleName => ({ modules: moduleName.trim() }))
    };
    console.log('[userSitesApi] Request body:', requestBody);
    console.log('[userSitesApi] Request body JSON:', JSON.stringify(requestBody, null, 2));
    
    const headers = withApiAuthHeaders();
    console.log('[userSitesApi] Request headers:', headers);
    
    const response = await fetch(
      url,
      {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(requestBody),
      }
    );
    
    console.log('[userSitesApi] Response status:', response.status);
    console.log('[userSitesApi] Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('[userSitesApi] Response error text:', errorText);
      console.error('[userSitesApi] Response status:', response.status);
      console.error('[userSitesApi] Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try to parse error response as JSON for better error details
      try {
        const errorJson = JSON.parse(errorText);
        console.error('[userSitesApi] Parsed error response:', errorJson);
        throw new Error(`Failed to add user site: ${response.status} - ${errorJson.message || errorJson.error || errorText}`);
      } catch (parseError) {
        throw new Error(`Failed to add user site: ${response.status} - ${errorText}`);
      }
    }
    
    const result = await response.json();
    console.log('[userSitesApi] Add user site response:', result);
    
    // Check the nested success property from the API response
    if (result.message && result.message.success) {
      console.log('[userSitesApi] Successfully added user site with modules');
      return result;
    } else {
      console.error('[userSitesApi] API returned success: false');
      throw new Error(result.message?.error || result.error || 'Failed to add user site');
    }
  } catch (error: any) {
    console.error('[userSitesApi] Error adding user site:', error);
    console.error('[userSitesApi] Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    throw error;
  }
};
