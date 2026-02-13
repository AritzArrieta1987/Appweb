/**
 * Tests para el hook useNotifications
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useNotifications } from '../../hooks/useNotifications';
import * as api from '../../config/api';

// Mock del módulo API
vi.mock('../../config/api', () => ({
  getNotifications: vi.fn(),
  markNotificationAsRead: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
  deleteNotification: vi.fn()
}));

describe('useNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debería inicializar con estado vacío', () => {
    vi.mocked(api.getNotifications).mockResolvedValue([]);
    
    const { result } = renderHook(() => useNotifications());
    
    expect(result.current.notifications).toEqual([]);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.loading).toBe(false);
  });

  it('debería cargar notificaciones desde la API', async () => {
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Test 1',
        message: 'Mensaje de prueba 1',
        created_at: new Date().toISOString(),
        is_read: false
      },
      {
        id: 2,
        type: 'info',
        title: 'Test 2',
        message: 'Mensaje de prueba 2',
        created_at: new Date().toISOString(),
        is_read: true
      }
    ];

    vi.mocked(api.getNotifications).mockResolvedValue(mockNotifications);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.notifications.length).toBe(2);
    });

    expect(result.current.unreadCount).toBe(1);
  });

  it('debería calcular correctamente el contador de no leídas', async () => {
    const mockNotifications = [
      { id: 1, type: 'success', title: 'T1', message: 'M1', created_at: new Date().toISOString(), is_read: false },
      { id: 2, type: 'info', title: 'T2', message: 'M2', created_at: new Date().toISOString(), is_read: false },
      { id: 3, type: 'warning', title: 'T3', message: 'M3', created_at: new Date().toISOString(), is_read: true }
    ];

    vi.mocked(api.getNotifications).mockResolvedValue(mockNotifications);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.unreadCount).toBe(2);
    });
  });

  it('debería manejar errores de API sin fallar', async () => {
    vi.mocked(api.getNotifications).mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.notifications).toEqual([]);
  });

  it('debería transformar correctamente el formato de la API', async () => {
    const mockDate = '2024-02-12T10:00:00Z';
    const mockNotifications = [
      {
        id: 1,
        type: 'success',
        title: 'Test Notification',
        message: 'Test Message',
        created_at: mockDate,
        is_read: false
      }
    ];

    vi.mocked(api.getNotifications).mockResolvedValue(mockNotifications);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.notifications.length).toBe(1);
    });

    const notification = result.current.notifications[0];
    expect(notification.id).toBe(1);
    expect(notification.type).toBe('success');
    expect(notification.title).toBe('Test Notification');
    expect(notification.message).toBe('Test Message');
    expect(notification.read).toBe(false);
    expect(notification.time).toBeDefined();
  });

  it('debería tener funciones de gestión de notificaciones', async () => {
    vi.mocked(api.getNotifications).mockResolvedValue([]);

    const { result } = renderHook(() => useNotifications());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(typeof result.current.markAsRead).toBe('function');
    expect(typeof result.current.markAllAsRead).toBe('function');
    expect(typeof result.current.deleteNotification).toBe('function');
    expect(typeof result.current.addNotification).toBe('function');
  });
});
