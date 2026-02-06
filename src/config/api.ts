/**
 * API Configuration for BIGARTIST ROYALTIES
 * 
 * Este archivo contiene toda la configuración y funciones
 * para conectar el frontend con el backend Node.js/Express
 */

// ===============================================
// CONFIGURACIÓN
// ===============================================

// Cambiar esta URL cuando despliegues en producción
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://app.bigartist.es/api'  // URL de producción
  : 'http://localhost:3000/api';     // URL de desarrollo

// ===============================================
// TIPOS DE DATOS
// ===============================================

export interface Artist {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  photo_url?: string;
  total_revenue: number;
  total_streams: number;
  track_count?: number;
}

export interface Track {
  id: number;
  title: string;
  artist_name: string;
  artist_id: number;
  isrc?: string;
  upc?: string;
  total_revenue: number;
  total_streams: number;
  platforms: string[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalStreams: number;
  artistCount: number;
  trackCount: number;
  platformBreakdown: { [key: string]: number };
  monthlyData: { month: string; revenue: number; streams: number }[];
}

export interface CSVUploadResponse {
  success: boolean;
  message: string;
  data: {
    filename: string;
    rows_processed: number;
    total_revenue: number;
    total_streams: number;
    unique_artists: number;
    unique_tracks: number;
    upload_id: number;
  };
}

// ===============================================
// FUNCIONES DE API
// ===============================================

/**
 * Helper para hacer fetch con token de autenticación
 */
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('authToken');
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(error.message || 'Error en la petición');
  }
  
  return response.json();
};

// ===============================================
// AUTENTICACIÓN
// ===============================================

export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  
  if (!response.ok) {
    throw new Error('Credenciales incorrectas');
  }
  
  const data = await response.json();
  
  // Guardar token en localStorage
  if (data.token) {
    localStorage.setItem('authToken', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }
  
  return data;
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// ===============================================
// DASHBOARD
// ===============================================

export const getDashboardStats = async (): Promise<DashboardStats> => {
  return fetchWithAuth('/dashboard/stats');
};

// ===============================================
// ARTISTAS
// ===============================================

export const getArtists = async (): Promise<Artist[]> => {
  const response = await fetchWithAuth('/artists');
  return response.data || [];
};

export const getArtist = async (id: number): Promise<Artist> => {
  const response = await fetchWithAuth(`/artists/${id}`);
  return response.data;
};

export const createArtist = async (artist: Partial<Artist>): Promise<Artist> => {
  const response = await fetchWithAuth('/artists', {
    method: 'POST',
    body: JSON.stringify(artist),
  });
  return response.data;
};

export const updateArtist = async (id: number, artist: Partial<Artist>): Promise<Artist> => {
  const response = await fetchWithAuth(`/artists/${id}`, {
    method: 'PUT',
    body: JSON.stringify(artist),
  });
  return response.data;
};

export const deleteArtist = async (id: number): Promise<void> => {
  await fetchWithAuth(`/artists/${id}`, {
    method: 'DELETE',
  });
};

// ===============================================
// TRACKS / CATÁLOGO
// ===============================================

export const getTracks = async (): Promise<Track[]> => {
  const response = await fetchWithAuth('/tracks');
  return response.data || [];
};

export const getTrack = async (id: number): Promise<Track> => {
  const response = await fetchWithAuth(`/tracks/${id}`);
  return response.data;
};

// ===============================================
// CSV UPLOAD
// ===============================================

export const uploadCSV = async (file: File): Promise<CSVUploadResponse> => {
  const token = localStorage.getItem('authToken');
  const formData = new FormData();
  formData.append('csvFile', file);
  
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}/csv/upload`, {
    method: 'POST',
    headers,
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error subiendo CSV' }));
    throw new Error(error.message || 'Error subiendo CSV');
  }
  
  return response.json();
};

export const getCSVHistory = async () => {
  return fetchWithAuth('/csv/history');
};

// ===============================================
// ROYALTIES
// ===============================================

export const getRoyalties = async (filters?: {
  artist_id?: number;
  track_id?: number;
  platform_id?: number;
  month?: string;
  year?: number;
  limit?: number;
  offset?: number;
}) => {
  const params = new URLSearchParams();
  
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
  }
  
  const queryString = params.toString();
  return fetchWithAuth(`/royalties${queryString ? `?${queryString}` : ''}`);
};

export const getRoyaltiesByMonth = async () => {
  return fetchWithAuth('/royalties/by-month');
};

export const getRoyaltiesByPlatform = async () => {
  return fetchWithAuth('/royalties/by-platform');
};

// ===============================================
// PLATAFORMAS
// ===============================================

export const getPlatforms = async () => {
  return fetchWithAuth('/platforms');
};

// ===============================================
// CONTRATOS
// ===============================================

export const getContracts = async () => {
  return fetchWithAuth('/contracts');
};

export const createContract = async (contract: any) => {
  return fetchWithAuth('/contracts', {
    method: 'POST',
    body: JSON.stringify(contract),
  });
};

export const updateContract = async (id: number, contract: any) => {
  return fetchWithAuth(`/contracts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(contract),
  });
};

// ===============================================
// UTILIDADES
// ===============================================

/**
 * Formatear importes en formato europeo
 */
export const formatEuro = (amount: number): string => {
  return amount.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }) + '€';
};

/**
 * Formatear números grandes (streams)
 */
export const formatNumber = (num: number): string => {
  return num.toLocaleString('es-ES');
};
