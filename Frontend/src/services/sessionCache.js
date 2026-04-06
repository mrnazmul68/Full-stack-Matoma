const sessionCache = {
  user: undefined,
  admin: undefined,
  userRequest: null,
  adminRequest: null,
};

export const getCachedUserSession = () => sessionCache.user;

export const setCachedUserSession = (user) => {
  sessionCache.user = user;
};

export const getCachedAdminSession = () => sessionCache.admin;

export const setCachedAdminSession = (admin) => {
  sessionCache.admin = admin;
};

export const getUserSessionRequest = () => sessionCache.userRequest;

export const setUserSessionRequest = (request) => {
  sessionCache.userRequest = request;
};

export const clearUserSessionRequest = () => {
  sessionCache.userRequest = null;
};

export const getAdminSessionRequest = () => sessionCache.adminRequest;

export const setAdminSessionRequest = (request) => {
  sessionCache.adminRequest = request;
};

export const clearAdminSessionRequest = () => {
  sessionCache.adminRequest = null;
};
