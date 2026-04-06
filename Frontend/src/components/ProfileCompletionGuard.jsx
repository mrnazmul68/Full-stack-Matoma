import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';
import { isProfileComplete } from '../utils/profileCompletion';

const ProfileCompletionGuard = ({ children }) => {
  const location = useLocation();
  const cachedUser = authService.getCachedSession();
  const [sessionState, setSessionState] = useState(() => ({
    isLoading: typeof cachedUser === 'undefined',
    user: typeof cachedUser === 'undefined' ? null : cachedUser,
  }));

  useEffect(() => {
    let isActive = true;

    const syncUser = async ({ forceRefresh = false } = {}) => {
      const user = await authService.getSession({ forceRefresh });

      if (!isActive) {
        return;
      }

      setSessionState({
        isLoading: false,
        user,
      });
    };

    if (typeof authService.getCachedSession() === 'undefined') {
      syncUser();
    }

    const handleFocus = () => syncUser({ forceRefresh: true });
    const handleAuthChanged = () => syncUser();

    window.addEventListener('focus', handleFocus);
    window.addEventListener('user-auth-changed', handleAuthChanged);

    return () => {
      isActive = false;
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('user-auth-changed', handleAuthChanged);
    };
  }, []);

  if (sessionState.isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-4 text-white">
        <p className="text-center text-[14px] uppercase tracking-[0.28em] text-[#bdbdbd]">
          Loading profile...
        </p>
      </div>
    );
  }

  if (
    sessionState.user &&
    !isProfileComplete(sessionState.user) &&
    location.pathname !== '/profile'
  ) {
    return <Navigate to="/profile" replace />;
  }

  return children;
};

export default ProfileCompletionGuard;
