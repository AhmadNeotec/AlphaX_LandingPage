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
    return await response.json();
  } catch (error) {
    console.error('Error fetching user sites:', error);
    throw error;
  }
};
