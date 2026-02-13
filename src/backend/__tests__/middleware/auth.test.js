/**
 * Tests para middleware de autenticación
 */

import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock de jsonwebtoken
jest.unstable_mockModule('jsonwebtoken', () => ({
  default: {
    verify: jest.fn()
  }
}));

describe('Middleware de Autenticación', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      header: jest.fn()
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('authenticateToken', () => {
    it('debería rechazar peticiones sin token', async () => {
      mockReq.header.mockReturnValue(null);
      
      const { authenticateToken } = await import('../../middleware/auth.js');
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: 'Token de autenticación no proporcionado' })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería rechazar tokens inválidos', async () => {
      mockReq.header.mockReturnValue('Bearer invalid_token');
      jwt.verify.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      const { authenticateToken } = await import('../../middleware/auth.js');
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería aceptar tokens válidos y llamar next()', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockReq.header.mockReturnValue('Bearer valid_token');
      jwt.verify.mockReturnValue(mockUser);

      const { authenticateToken } = await import('../../middleware/auth.js');
      authenticateToken(mockReq, mockRes, mockNext);

      expect(mockReq.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('debería extraer el token del header Authorization', async () => {
      const mockUser = { id: 1, email: 'test@example.com' };
      mockReq.header.mockReturnValue('Bearer my_secret_token');
      jwt.verify.mockReturnValue(mockUser);

      const { authenticateToken } = await import('../../middleware/auth.js');
      authenticateToken(mockReq, mockRes, mockNext);

      expect(jwt.verify).toHaveBeenCalledWith(
        'my_secret_token',
        expect.any(String)
      );
    });
  });

  describe('Validación de roles', () => {
    it('debería rechazar usuarios sin rol de admin', async () => {
      mockReq.user = { id: 1, role: 'artist' };

      const { requireAdmin } = await import('../../middleware/auth.js');
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ error: expect.stringContaining('Acceso denegado') })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('debería permitir usuarios con rol de admin', async () => {
      mockReq.user = { id: 1, role: 'admin' };

      const { requireAdmin } = await import('../../middleware/auth.js');
      requireAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });
  });
});
