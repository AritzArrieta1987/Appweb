/**
 * Custom Hook para gestión de notificaciones
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../config/api';

export interface Notification {
  id: number;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const useNotifications = (autoRefresh = false, refreshInterval = 30000) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  // Cargar notificaciones desde la API
  const loadNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.getNotifications();
      
      // Transformar datos de API a formato del frontend
      const transformed: Notification[] = data.map(n => ({
        id: n.id,
        type: n.type as 'success' | 'info' | 'warning' | 'error',
        title: n.title,
        message: n.message,
        time: formatTime(n.created_at),
        read: n.is_read
      }));
      
      setNotifications(transformed);
      setUnreadCount(transformed.filter(n => !n.read).length);
    } catch (error) {
      console.log('No se pudieron cargar notificaciones desde la API');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar notificaciones al montar
  useEffect(() => {
    loadNotifications();
  }, [loadNotifications]);

  // Auto-refresh si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadNotifications();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, loadNotifications]);

  // Marcar como leída
  const markAsRead = useCallback(async (id: number) => {
    try {
      await api.markNotificationAsRead(id);
      
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.log('Error marcando notificación como leída');
    }
  }, []);

  // Marcar todas como leídas
  const markAllAsRead = useCallback(async () => {
    try {
      await api.markAllNotificationsAsRead();
      
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      
      setUnreadCount(0);
    } catch (error) {
      console.log('Error marcando todas las notificaciones como leídas');
    }
  }, []);

  // Agregar notificación local (optimistic update)
  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: 'Ahora',
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setUnreadCount(prev => prev + 1);
    
    // Intentar sincronizar con backend
    api.createNotification({
      title: notification.title,
      message: notification.message,
      type: notification.type === 'error' ? 'warning' : notification.type
    });
  }, []);

  // Eliminar notificación
  const removeNotification = useCallback((id: number) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification && !notification.read) {
        setUnreadCount(c => Math.max(0, c - 1));
      }
      return prev.filter(n => n.id !== id);
    });
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    loadNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    removeNotification
  };
};

// Helper para formatear tiempo relativo
const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Ahora';
  if (diffMins < 60) return `Hace ${diffMins} min`;
  if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
  if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
  
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
};
