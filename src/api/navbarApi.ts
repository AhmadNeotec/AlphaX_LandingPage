import { API_CONFIG } from '../config/api';

const BASE_URL = 'https://newhrms.muftaah.com/api/method/alphax_erp.api.NavbarCMS';

export interface NavbarLink {
  label: string;
  url: string;
  has_dropdown?: boolean;
  position?: string;
  order?: number;
}

export interface NavbarConfig {
  nav_links: NavbarLink[];
  button_colors: {
    login_color: string;
    get_started_color: string;
  };
  logo_settings: {
    logo_url: string;
    company_name: string;
  };
  language_settings: string[];
  default_language: string;
}

export interface ButtonColors {
  login_color: string;
  get_started_color: string;
}

export interface LogoSettings {
  logo_url: string;
  company_name: string;
}

export interface LanguageSettings {
  languages: string[];
  default_language: string;
}

// Get complete navbar configuration
export const getNavbarConfig = async (): Promise<NavbarConfig> => {
  try {
    const response = await fetch(`${BASE_URL}.get_navbar_config`, {
      method: 'GET',
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch navbar config');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch navbar config');
    }

    return data;
  } catch (error) {
    console.error('Error fetching navbar config:', error);
    // Return default values if API fails
    return {
      nav_links: [
        { label: 'MODULES', url: '#modules' },
        { label: 'INDUSTRIES', url: '#industries' },
        { label: 'PRICING', url: '#pricing', has_dropdown: true },
        { label: 'CONTACT US', url: '/contact' },
      ],
      button_colors: {
        login_color: '#774A67',
        get_started_color: '#40B93C'
      },
      logo_settings: {
        logo_url: 'src/images/alpha-Photoroom.png',
        company_name: 'ALPHA X'
      },
      language_settings: ['EN', 'ARB'],
      default_language: 'EN'
    };
  }
};

// Get only navigation links
export const getNavbarLinks = async (): Promise<NavbarLink[]> => {
  try {
    const response = await fetch(`${BASE_URL}.get_navbar_links`, {
      method: 'GET',
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch navbar links');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch navbar links');
    }

    return data.links;
  } catch (error) {
    console.error('Error fetching navbar links:', error);
    return [
      { label: 'MODULES', url: '#modules' },
      { label: 'INDUSTRIES', url: '#industries' },
      { label: 'PRICING', url: '#pricing', has_dropdown: true },
      { label: 'CONTACT US', url: '/contact' },
    ];
  }
};

// Get button colors
export const getButtonColors = async (): Promise<ButtonColors> => {
  try {
    const response = await fetch(`${BASE_URL}.get_button_colors`, {
      method: 'GET',
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch button colors');
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch button colors');
    }

    return {
      login_color: data.login_color,
      get_started_color: data.get_started_color
    };
  } catch (error) {
    console.error('Error fetching button colors:', error);
    return {
      login_color: '#774A67',
      get_started_color: '#40B93C'
    };
  }
};

// Update navbar settings
export const updateNavbarSettings = async (settings: Partial<NavbarConfig>): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.update_navbar_settings`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error('Failed to update navbar settings');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating navbar settings:', error);
    return false;
  }
};

// Update navigation links
export const updateNavLinks = async (navLinks: NavbarLink[]): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.update_nav_links`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify(navLinks),
    });

    if (!response.ok) {
      throw new Error('Failed to update navigation links');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating navigation links:', error);
    return false;
  }
};

// Update button colors
export const updateButtonColors = async (loginColor?: string, getStartedColor?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.update_button_colors`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        login_color: loginColor,
        get_started_color: getStartedColor
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update button colors');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating button colors:', error);
    return false;
  }
};

// Update logo settings
export const updateLogoSettings = async (logoUrl?: string, companyName?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.update_logo_settings`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        logo_url: logoUrl,
        company_name: companyName
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update logo settings');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating logo settings:', error);
    return false;
  }
};

// Update language settings
export const updateLanguageSettings = async (languages?: string[], defaultLanguage?: string): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.update_language_settings`, {
      method: 'POST',
      headers: API_CONFIG.headers,
      body: JSON.stringify({
        languages,
        default_language: defaultLanguage
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to update language settings');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error updating language settings:', error);
    return false;
  }
};

// Initialize navbar settings
export const initializeNavbarSettings = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${BASE_URL}.initialize_navbar_settings`, {
      method: 'POST',
      headers: API_CONFIG.headers,
    });

    if (!response.ok) {
      throw new Error('Failed to initialize navbar settings');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error('Error initializing navbar settings:', error);
    return false;
  }
}; 