function normalizeApiBaseUrl(baseUrl) {
  return baseUrl.replace(/\/+$/, '');
}

function getApiBaseUrl() {
  if (import.meta.env.VITE_API_BASE_URL) {
    return normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL);
  }

  if (import.meta.env.DEV) {
    return '/api';
  }

  return normalizeApiBaseUrl(`${window.location.origin}/api`);
}

function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${getApiBaseUrl()}${normalizedPath}`;
}

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  let response;

  try {
    response = await fetch(buildApiUrl(path), {
      method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: typeof body === 'undefined' ? undefined : JSON.stringify(body),
    });
  } catch (error) {
    throw new Error('Unable to connect to the backend. Please start the backend server and try again.');
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}
