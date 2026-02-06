// API Configuration
const API_BASE_URL = 'http://94.143.141.241/api';

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Get auth token
export const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Set auth token
export const setToken = (token: string): void => {
  localStorage.setItem('token', token);
};

// Remove auth token
export const removeToken = (): void => {
  localStorage.removeItem('token');
};

// Get current user
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

// Set current user
export const setCurrentUser = (user: any): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Remove current user
export const removeCurrentUser = (): void => {
  localStorage.removeItem('user');
};

// API Call wrapper
async function apiCall<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: data.message || 'Error en la petición',
      };
    }

    return {
      success: true,
      data: data.data || data,
      message: data.message,
    };
  } catch (error) {
    console.error('API Error:', error);
    return {
      success: false,
      error: 'Error de conexión con el servidor',
    };
  }
}

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  register: async (userData: any) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  logout: () => {
    removeToken();
    removeCurrentUser();
  },
};

// Artists API
export const artistsAPI = {
  getAll: () => apiCall('/artists'),
  getById: (id: number) => apiCall(`/artists/${id}`),
  create: (data: FormData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/artists`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
    }).then(res => res.json());
  },
  update: (id: number, data: any) => apiCall(`/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/artists/${id}`, { method: 'DELETE' }),
};

// Catalog API
export const catalogAPI = {
  getAll: () => apiCall('/catalog'),
  getById: (id: number) => apiCall(`/catalog/${id}`),
  create: (data: FormData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/catalog`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
    }).then(res => res.json());
  },
  update: (id: number, data: any) => apiCall(`/catalog/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/catalog/${id}`, { method: 'DELETE' }),
};

// Contracts API
export const contractsAPI = {
  getAll: () => apiCall('/contracts'),
  getById: (id: number) => apiCall(`/contracts/${id}`),
  create: (data: any) => apiCall('/contracts', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  update: (id: number, data: any) => apiCall(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  delete: (id: number) => apiCall(`/contracts/${id}`, { method: 'DELETE' }),
};

// Royalties API
export const royaltiesAPI = {
  getAll: () => apiCall('/royalties'),
  getByArtist: (artistId: number) => apiCall(`/royalties/artist/${artistId}`),
  calculate: () => apiCall('/royalties/calculate', { method: 'POST' }),
  upload: (data: FormData) => {
    const token = getToken();
    return fetch(`${API_BASE_URL}/royalties/upload`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: data,
    }).then(res => res.json());
  },
};

// Stats API
export const statsAPI = {
  getDashboard: () => apiCall('/stats/dashboard'),
  getArtistStats: (artistId: number) => apiCall(`/stats/artist/${artistId}`),
};
