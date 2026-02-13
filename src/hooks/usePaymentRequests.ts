/**
 * Custom Hook para gestión de solicitudes de pago
 */

import { useState, useCallback } from 'react';
import { validateIBAN, validateAmount } from '../utils/validation';

export interface PaymentRequest {
  id: number;
  artistId: number;
  artistName: string;
  artistPhoto?: string;
  firstName: string;
  lastName: string;
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  method: string;
  accountNumber: string;
}

export const usePaymentRequests = (initialRequests: PaymentRequest[] = []) => {
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(initialRequests);

  // Crear nueva solicitud de pago
  const createPaymentRequest = useCallback((request: Omit<PaymentRequest, 'id' | 'date' | 'status'>) => {
    // Validar IBAN
    const ibanValidation = validateIBAN(request.accountNumber);
    if (!ibanValidation.valid) {
      return { 
        success: false, 
        error: ibanValidation.error || 'IBAN inválido' 
      };
    }

    // Validar importe
    const amountValidation = validateAmount(request.amount);
    if (!amountValidation.valid) {
      return { 
        success: false, 
        error: amountValidation.error || 'Importe inválido' 
      };
    }

    // Validar campos obligatorios
    if (!request.firstName || !request.lastName) {
      return { 
        success: false, 
        error: 'Nombre y apellidos son obligatorios' 
      };
    }

    const newRequest: PaymentRequest = {
      ...request,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      status: 'pending'
    };

    setPaymentRequests(prev => [newRequest, ...prev]);

    return { success: true, data: newRequest };
  }, []);

  // Actualizar estado de solicitud
  const updatePaymentStatus = useCallback((id: number, status: 'pending' | 'completed' | 'rejected') => {
    setPaymentRequests(prev =>
      prev.map(req => req.id === id ? { ...req, status } : req)
    );
  }, []);

  // Completar pago
  const completePayment = useCallback((id: number) => {
    updatePaymentStatus(id, 'completed');
  }, [updatePaymentStatus]);

  // Rechazar pago
  const rejectPayment = useCallback((id: number) => {
    updatePaymentStatus(id, 'rejected');
  }, [updatePaymentStatus]);

  // Eliminar solicitud
  const deletePaymentRequest = useCallback((id: number) => {
    setPaymentRequests(prev => prev.filter(req => req.id !== id));
  }, []);

  // Obtener solicitudes por artista
  const getRequestsByArtist = useCallback((artistId: number) => {
    return paymentRequests.filter(req => req.artistId === artistId);
  }, [paymentRequests]);

  // Obtener solicitudes pendientes
  const getPendingRequests = useCallback(() => {
    return paymentRequests.filter(req => req.status === 'pending');
  }, [paymentRequests]);

  // Calcular total pendiente
  const getTotalPending = useCallback(() => {
    return paymentRequests
      .filter(req => req.status === 'pending')
      .reduce((sum, req) => sum + req.amount, 0);
  }, [paymentRequests]);

  // Calcular total completado
  const getTotalCompleted = useCallback(() => {
    return paymentRequests
      .filter(req => req.status === 'completed')
      .reduce((sum, req) => sum + req.amount, 0);
  }, [paymentRequests]);

  return {
    paymentRequests,
    createPaymentRequest,
    updatePaymentStatus,
    completePayment,
    rejectPayment,
    deletePaymentRequest,
    getRequestsByArtist,
    getPendingRequests,
    getTotalPending,
    getTotalCompleted,
    setPaymentRequests
  };
};
