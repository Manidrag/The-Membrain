import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuthInterceptor = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const originalFetch = window.fetch;

    window.fetch = async (...args) => {
      const response = await originalFetch(...args);

      if (response.status === 401) {
        // Token expired or unauthorized, redirect to login
        navigate('/login');
      }

      return response;
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, [navigate]);
};

export default useAuthInterceptor;