import { apiRequest } from './api';
import {
  clearUserSessionRequest,
  getCachedUserSession,
  getUserSessionRequest,
  setCachedAdminSession,
  setCachedUserSession,
  setUserSessionRequest,
} from './sessionCache';

const dispatchUserAuthChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('user-auth-changed'));
  }
};

const dispatchAdminAuthChanged = () => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('admin-auth-changed'));
  }
};

export const authService = {
  async register(formData) {
    const data = await apiRequest('/auth/send-otp', {
      method: 'POST',
      body: {
        email: formData.email,
      },
    });

    return {
      message: data.message,
      email: data.email || formData.email,
    };
  },

  async verifyRegistration(formData) {
    const verificationResponse = await apiRequest('/auth/verify-otp', {
      method: 'POST',
      body: {
        email: formData.email,
        otp: formData.code,
      },
    });

    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: {
        name: formData.fullName || formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword || formData.password,
        verificationToken: verificationResponse.verificationToken,
        rememberMe: formData.rememberMe,
      },
    });

    setCachedUserSession(data.user || null);
    setCachedAdminSession(null);
    dispatchUserAuthChanged();
    dispatchAdminAuthChanged();

    return data.user;
  },

  async login(formData) {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: formData,
    });

    if (data.role === 'admin' || data.admin) {
      setCachedAdminSession(data.admin || null);
      setCachedUserSession(null);
    } else {
      setCachedUserSession(data.user || null);
      setCachedAdminSession(null);
    }

    dispatchUserAuthChanged();
    dispatchAdminAuthChanged();

    return {
      role: data.role || (data.admin ? 'admin' : 'user'),
      user: data.user || null,
      admin: data.admin || null,
    };
  },

  getCachedSession() {
    return getCachedUserSession();
  },

  setCachedSession(user, { notify = true } = {}) {
    setCachedUserSession(user || null);

    if (notify) {
      dispatchUserAuthChanged();
    }

    return user || null;
  },

  async getSession({ forceRefresh = false } = {}) {
    const cachedUser = getCachedUserSession();

    if (!forceRefresh && typeof cachedUser !== 'undefined') {
      return cachedUser;
    }

    const existingRequest = getUserSessionRequest();

    if (!forceRefresh && existingRequest) {
      return existingRequest;
    }

    const sessionRequest = apiRequest('/auth/session')
      .then((data) => {
        const user = data.user || null;
        setCachedUserSession(user);
        return user;
      })
      .catch(() => {
        const fallbackUser = getCachedUserSession();

        if (typeof fallbackUser === 'undefined') {
          setCachedUserSession(null);
          return null;
        }

        return fallbackUser;
      })
      .finally(() => {
        clearUserSessionRequest();
      });

    setUserSessionRequest(sessionRequest);

    try {
      return await sessionRequest;
    } catch (error) {
      return getCachedUserSession() || null;
    }
  },

  async logout() {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
      });
    } finally {
      setCachedUserSession(null);
      dispatchUserAuthChanged();
    }
  },

  async requestPasswordReset({ email }) {
    return apiRequest('/auth/forgot-password', {
      method: 'POST',
      body: { email },
    });
  },

  async resetPassword({ token, newPassword, rememberMe }) {
    const data = await apiRequest('/auth/reset-password', {
      method: 'POST',
      body: {
        token,
        newPassword,
        rememberMe,
      },
    });

    setCachedUserSession(data.user || null);
    setCachedAdminSession(null);
    dispatchUserAuthChanged();
    dispatchAdminAuthChanged();

    return data.user;
  },
};
