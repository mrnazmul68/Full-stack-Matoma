import { apiRequest } from './api';
import {
  clearAdminSessionRequest,
  getAdminSessionRequest,
  getCachedAdminSession,
  setAdminSessionRequest,
  setCachedAdminSession,
  setCachedUserSession,
} from './sessionCache';

const dispatchAdminAuthChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin-auth-changed'));
  }
};

export const adminAuthService = {
  getCachedSession() {
    return getCachedAdminSession();
  },

  async getSession({ forceRefresh = false } = {}) {
    const cachedAdmin = getCachedAdminSession();

    if (!forceRefresh && typeof cachedAdmin !== 'undefined') {
      return cachedAdmin;
    }

    const existingRequest = getAdminSessionRequest();

    if (!forceRefresh && existingRequest) {
      return existingRequest;
    }

    const sessionRequest = apiRequest('/admin/session')
      .then((data) => {
        const admin = data.admin || null;
        setCachedAdminSession(admin);
        return admin;
      })
      .catch(() => {
        const fallbackAdmin = getCachedAdminSession();

        if (typeof fallbackAdmin === 'undefined') {
          setCachedAdminSession(null);
          return null;
        }

        return fallbackAdmin;
      })
      .finally(() => {
        clearAdminSessionRequest();
      });

    setAdminSessionRequest(sessionRequest);

    try {
      return await sessionRequest;
    } catch (error) {
      return getCachedAdminSession() || null;
    }
  },

  async isAuthenticated() {
    const session = await this.getSession();
    return !!session;
  },

  async login({ email, password }) {
    const data = await apiRequest('/admin/login', {
      method: 'POST',
      body: {
        email,
        password,
      },
    });

    setCachedAdminSession(data.admin || null);
    setCachedUserSession(null);
    dispatchAdminAuthChanged();

    return data.admin || null;
  },

  async logout() {
    try {
      await apiRequest('/admin/logout', {
        method: 'POST',
      });
    } finally {
      setCachedAdminSession(null);
      dispatchAdminAuthChanged();
    }
  },
};
