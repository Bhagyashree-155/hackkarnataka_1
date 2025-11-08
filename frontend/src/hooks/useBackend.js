import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook for backend integration
 */
export const useBackend = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check backend connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    try {
      await api.healthCheck();
      setIsConnected(true);
      setError(null);
    } catch (err) {
      setIsConnected(false);
      setError('Backend not connected');
      console.warn('Backend not available:', err.message);
    }
  };

  return {
    isConnected,
    loading,
    error,
    api,
    checkConnection,
  };
};

