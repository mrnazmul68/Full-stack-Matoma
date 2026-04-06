import { apiRequest } from './api';

export const siteContentService = {
  async getSiteContent() {
    const data = await apiRequest('/site-content');
    return data.content || {};
  },

  async saveSiteContent(content) {
    const data = await apiRequest('/site-content', {
      method: 'PUT',
      body: { content },
    });

    return data.content || {};
  },
};
