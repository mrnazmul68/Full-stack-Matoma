import { apiRequest } from './api';

export const donorService = {
  async searchDonors(bloodGroup, upozila) {
    const query = new URLSearchParams();

    if (bloodGroup) {
      query.set('bloodGroup', bloodGroup);
    }

    if (upozila) {
      query.set('upozila', upozila);
    }

    const suffix = query.toString() ? `?${query.toString()}` : '';
    const data = await apiRequest(`/donors${suffix}`);
    return data.donors || [];
  },

  async getProfile(userId) {
    const data = await apiRequest(`/users/${userId}`);
    return data.user;
  },

  async saveProfile(userId, profile) {
    const data = await apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: profile,
    });

    return data.user;
  },
};
