/**
 * API Configuration for BIGARTIST ROYALTIES
 * 
 * Este archivo contiene toda la configuración y funciones
 * para conectar el frontend con el backend Node.js/Express
 */

// ===============================================
// CONFIGURACIÓN
// ===============================================

// URL del backend - usa variable de entorno o fallback a producción
const API_BASE_URL = 'http://94.143.141.241/api';

// ===============================================
// HELPER PARA HEADERS
// ===============================================

const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// ===============================================
// AUTENTICACIÓN
// ===============================================

export const login = async (email: string, password: string) => {
  try {
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
  } catch (error) {
    // Backend no disponible, usar modo local
    throw error;
  }
};

export const logout = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

export const isAuthenticated = (): boolean => {
  return !!localStorage.getItem('authToken');
};

// ===============================================
// ARTISTAS
// ===============================================

export const getArtists = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener artistas');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getArtist = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener artista');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createArtist = async (artistData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(artistData)
    });
    
    if (!response.ok) {
      throw new Error('Error al crear artista');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateArtist = async (id: number, artistData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(artistData)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar artista');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteArtist = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/artists/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar artista');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// TRACKS (CANCIONES)
// ===============================================

export const getTracks = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener canciones');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const getTracksByArtist = async (artistId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/tracks?artistId=${artistId}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener canciones del artista');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// ROYALTIES
// ===============================================

export const getRoyalties = async (params?: {
  artistId?: number;
  startDate?: string;
  endDate?: string;
}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params?.artistId) queryParams.append('artistId', params.artistId.toString());
    if (params?.startDate) queryParams.append('startDate', params.startDate);
    if (params?.endDate) queryParams.append('endDate', params.endDate);
    
    const response = await fetch(`${API_BASE_URL}/royalties?${queryParams}`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener royalties');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// DASHBOARD STATS
// ===============================================

export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/dashboard/stats`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener estadísticas');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// CONTRATOS
// ===============================================

export const getContracts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener contratos');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createContract = async (contractData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });
    
    if (!response.ok) {
      throw new Error('Error al crear contrato');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updateContract = async (id: number, contractData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(contractData)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar contrato');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const deleteContract = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/contracts/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar contrato');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// PAGOS
// ===============================================

export const getPayments = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener pagos');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createPayment = async (paymentData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(paymentData)
    });
    
    if (!response.ok) {
      throw new Error('Error al crear pago');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const updatePaymentStatus = async (id: number, status: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/${id}`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status })
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar estado del pago');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// CSV UPLOAD
// ===============================================

export const uploadCSV = async (file: File) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('authToken');
    const headers: any = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/csv/upload`, {
      method: 'POST',
      headers,
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Error al subir archivo CSV');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

// ===============================================
// NOTIFICACIONES
// ===============================================

export const getNotifications = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener notificaciones');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const markNotificationAsRead = async (id: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al marcar notificación como leída');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const markAllNotificationsAsRead = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Error al marcar todas las notificaciones como leídas');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const createNotification = async (notificationData: any) => {
  try {
    const response = await fetch(`${API_BASE_URL}/notifications`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(notificationData)
    });
    
    if (!response.ok) {
      throw new Error('Error al crear notificación');
    }
    
    return await response.json();
  } catch (error) {
    throw error;
  }
};