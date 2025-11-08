// API service for connecting to BlockGenix backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// ============ Analytics API ============

export const analyticsAPI = {
  /**
   * Get dashboard statistics
   */
  getAnalytics: async () => {
    return apiRequest('/api/analytics');
  },

  /**
   * Update analytics
   */
  updateAnalytics: async (data) => {
    return apiRequest('/api/analytics', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

// ============ Loans API ============

export const loansAPI = {
  /**
   * Get all loans
   * @param {Object} filters - { borrower, lender, status }
   */
  getAllLoans: async (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    
    const queryString = queryParams.toString();
    return apiRequest(`/api/loans${queryString ? `?${queryString}` : ''}`);
  },

  /**
   * Get loan by ID
   */
  getLoan: async (id) => {
    return apiRequest(`/api/loans/${id}`);
  },

  /**
   * Create a new loan (off-chain record)
   */
  createLoan: async (loanData) => {
    return apiRequest('/api/loans', {
      method: 'POST',
      body: JSON.stringify(loanData),
    });
  },

  /**
   * Update loan
   */
  updateLoan: async (id, updates) => {
    return apiRequest(`/api/loans/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  /**
   * Delete loan
   */
  deleteLoan: async (id) => {
    return apiRequest(`/api/loans/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ Activity API ============

export const activityAPI = {
  /**
   * Get recent activity
   * @param {number} limit - Number of activities to return
   */
  getRecentActivity: async (limit = 10) => {
    return apiRequest(`/api/activity?limit=${limit}`);
  },
};

// ============ User API ============

export const userAPI = {
  /**
   * Get user's loans
   * @param {string} address - User's wallet address
   * @param {string} type - 'borrower' or 'lender'
   */
  getUserLoans: async (address, type = 'borrower') => {
    return apiRequest(`/api/users/${address}/loans?type=${type}`);
  },
};

// ============ Health Check ============

export const healthCheck = async () => {
  return apiRequest('/health');
};

// Export default API object
export default {
  analytics: analyticsAPI,
  loans: loansAPI,
  activity: activityAPI,
  user: userAPI,
  healthCheck,
};

