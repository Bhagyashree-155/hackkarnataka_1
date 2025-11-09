// API service for connecting to BlockGenix backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Generic API request function
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
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

  /**
   * Approve or reject loan (Admin only)
   */
  approveRejectLoan: async (id, status, remarks = '', interestRate = null) => {
    const body = { status, remarks };
    if (interestRate !== null) {
      body.interestRate = interestRate;
    }
    return apiRequest(`/api/loans/${id}/approve`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  },

  /**
   * Make repayment
   */
  makeRepayment: async (loanId, data) => {
    // data can be { emiNumber, amount } or just emiNumber and amount as separate params
    const body = typeof data === 'object' ? data : { emiNumber: data, amount: arguments[2] };
    return apiRequest(`/api/loans/${loanId}/repay`, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  },
};

// ============ Loan Types API ============

export const loanTypesAPI = {
  /**
   * Get all active loan types
   */
  getAllLoanTypes: async () => {
    return apiRequest('/api/loan-types');
  },

  /**
   * Get loan type by ID
   */
  getLoanType: async (id) => {
    return apiRequest(`/api/loan-types/${id}`);
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

// ============ Notifications API ============

export const notificationsAPI = {
  /**
   * Get all notifications for current user
   */
  getAllNotifications: async () => {
    return apiRequest('/api/notifications');
  },

  /**
   * Mark notification as read
   */
  markAsRead: async (notificationId) => {
    return apiRequest(`/api/notifications/${notificationId}/read`, {
      method: 'PATCH',
    });
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async () => {
    return apiRequest('/api/notifications/read-all', {
      method: 'PATCH',
    });
  },

  /**
   * Delete notification
   */
  deleteNotification: async (notificationId) => {
    return apiRequest(`/api/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },
};

// Export default API object
export default {
  analytics: analyticsAPI,
  loans: loansAPI,
  loanTypes: loanTypesAPI,
  activity: activityAPI,
  user: userAPI,
  notifications: notificationsAPI,
  healthCheck,
};

