const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiRequest(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options;

  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
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
