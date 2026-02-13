/**
 * Custom Hook para gestión de contratos
 */

import { useState, useEffect, useCallback } from 'react';
import * as api from '../config/api';

export interface Contract {
  id: number;
  artistId: number;
  artistName: string;
  artistPhoto?: string;
  percentage: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'expired' | 'pending';
  type?: string;
  serviceType: string;
  territory?: string;
  advancePayment?: number;
  terms?: string;
  createdAt?: string;
}

export const useContracts = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cargar contratos desde la API
  const loadContracts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.getContracts();
      
      // Transformar datos de API a formato del frontend
      const transformed: Contract[] = response.data.map((c: any) => ({
        id: c.id,
        artistId: c.artist_id,
        artistName: c.artist_name,
        artistPhoto: c.artist_photo,
        percentage: c.percentage,
        startDate: c.start_date,
        endDate: c.end_date,
        status: c.status,
        type: c.contract_type,
        serviceType: c.service_type,
        territory: c.territory,
        advancePayment: c.advance_payment,
        terms: c.terms,
        createdAt: c.created_at
      }));
      
      setContracts(transformed);
    } catch (error: any) {
      setError(error.message || 'Error cargando contratos');
      console.log('No se pudieron cargar contratos desde la API, usando mock data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar contratos al montar
  useEffect(() => {
    loadContracts();
  }, [loadContracts]);

  // Crear nuevo contrato
  const createContract = useCallback(async (contractData: Omit<Contract, 'id' | 'createdAt'>) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.createContract({
        artist_id: contractData.artistId,
        percentage: contractData.percentage,
        start_date: contractData.startDate,
        end_date: contractData.endDate,
        service_type: contractData.serviceType,
        contract_type: contractData.type,
        territory: contractData.territory,
        advance_payment: contractData.advancePayment,
        terms: contractData.terms,
        status: contractData.status
      });
      
      // Recargar contratos
      await loadContracts();
      
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Error creando contrato');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, [loadContracts]);

  // Actualizar contrato
  const updateContract = useCallback(async (id: number, updates: Partial<Contract>) => {
    try {
      setLoading(true);
      setError(null);
      
      await api.updateContract(id, {
        percentage: updates.percentage,
        start_date: updates.startDate,
        end_date: updates.endDate,
        service_type: updates.serviceType,
        contract_type: updates.type,
        territory: updates.territory,
        advance_payment: updates.advancePayment,
        terms: updates.terms,
        status: updates.status
      });
      
      // Actualizar localmente
      setContracts(prev => 
        prev.map(c => c.id === id ? { ...c, ...updates } : c)
      );
      
      return { success: true };
    } catch (error: any) {
      setError(error.message || 'Error actualizando contrato');
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // Obtener contratos por artista
  const getContractsByArtist = useCallback((artistId: number) => {
    return contracts.filter(c => c.artistId === artistId);
  }, [contracts]);

  // Obtener contratos activos
  const getActiveContracts = useCallback(() => {
    return contracts.filter(c => c.status === 'active');
  }, [contracts]);

  // Verificar si un artista tiene contratos
  const hasActiveContract = useCallback((artistId: number) => {
    return contracts.some(c => c.artistId === artistId && c.status === 'active');
  }, [contracts]);

  return {
    contracts,
    loading,
    error,
    loadContracts,
    createContract,
    updateContract,
    getContractsByArtist,
    getActiveContracts,
    hasActiveContract
  };
};
