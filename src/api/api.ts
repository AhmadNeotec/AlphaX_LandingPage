import axios from 'axios';
import { withApiAuthHeaders } from './authHeaders';

const API_BASE_URL = '/api/method/alphax_erp.api.navbar'; // Adjust the app name if needed

interface NavbarLink {
  name: string;
  label: string;
  url: string;
}

interface NavbarConfig {
  links: NavbarLink[];
  loginColor: string;
  getStartedColor: string;
}

interface ApiResponse<T> {
  message: {
    success: boolean;
    data?: T;
    error?: string;
  };
  _server_messages?: string;
}

export const getNavbarConfig = async (): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.get<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.get_navbar_config`);
    return response.data;
  } catch (error) {
    console.error('Error fetching navbar config:', error);
    throw error;
  }
};

export const addNavbarLink = async (label: string, url: string): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.post<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.add_navbar_link`, {
      label,
      url,
    });
    return response.data;
  } catch (error) {
    console.error('Error adding navbar link:', error);
    throw error;
  }
};

export const updateNavbarLink = async (name: string, label: string, url: string): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.post<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.update_navbar_link`, {
      name,
      label,
      url,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating navbar link:', error);
    throw error;
  }
};

export const deleteNavbarLink = async (name: string): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.post<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.delete_navbar_link`, {
      name,
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting navbar link:', error);
    throw error;
  }
};

export const updateNavbarColors = async (loginColor: string, getStartedColor: string): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.post<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.update_navbar_colors`, {
      login_color: loginColor,
      get_started_color: getStartedColor,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating navbar colors:', error);
    throw error;
  }
};

export const resetNavbarConfig = async (): Promise<ApiResponse<NavbarConfig>> => {
  try {
    const response = await axios.post<ApiResponse<NavbarConfig>>(`${API_BASE_URL}.reset_navbar_config`);
    return response.data;
  } catch (error) {
    console.error('Error resetting navbar config:', error);
    throw error;
  }
};