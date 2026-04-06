import { apiRequest } from './api';

export const adminUserService = {
  async getUsers() {
    const data = await apiRequest('/admin/users');
    return data.users || [];
  },

  async updateBlockStatus(userId, isBlocked) {
    const data = await apiRequest(`/admin/users/${userId}/block`, {
      method: 'PATCH',
      body: { isBlocked },
    });

    return data.user || null;
  },

  async deleteUser(userId) {
    const data = await apiRequest(`/admin/users/${userId}`, {
      method: 'DELETE',
    });

    return data.user || null;
  },
};
