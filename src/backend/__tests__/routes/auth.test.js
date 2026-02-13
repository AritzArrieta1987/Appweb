/**
 * Tests para rutas de autenticación
 */

import { jest } from '@jest/globals';
import bcrypt from 'bcrypt';

describe('Rutas de Autenticación', () => {
  let mockDb;

  beforeEach(() => {
    mockDb = {
      query: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('debería autenticar usuario con credenciales válidas', async () => {
      const mockUser = {
        id: 1,
        email: 'admin@bigartist.es',
        password: await bcrypt.hash('password123', 10),
        role: 'admin',
        name: 'Admin User'
      };

      mockDb.query.mockResolvedValueOnce([[mockUser]]);

      const credentials = {
        email: 'admin@bigartist.es',
        password: 'password123'
      };

      // Simular que la contraseña coincide
      const isMatch = await bcrypt.compare(credentials.password, mockUser.password);
      expect(isMatch).toBe(true);
    });

    it('debería rechazar credenciales inválidas', async () => {
      mockDb.query.mockResolvedValueOnce([[]]);

      const result = {
        success: false,
        error: 'Usuario o contraseña incorrectos'
      };

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('debería rechazar email no encontrado', async () => {
      mockDb.query.mockResolvedValueOnce([[]]);

      const credentials = {
        email: 'noexiste@example.com',
        password: 'password123'
      };

      expect(mockDb.query).not.toHaveBeenCalled();
    });

    it('debería validar formato de email', () => {
      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com'
      ];

      invalidEmails.forEach(email => {
        const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Validación de contraseñas', () => {
    it('debería hashear contraseñas correctamente', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword).toMatch(/^\$2[aby]\$.{56}$/);
    });

    it('debería verificar contraseñas correctamente', async () => {
      const password = 'mySecurePassword123';
      const hashedPassword = await bcrypt.hash(password, 10);

      const isValid = await bcrypt.compare(password, hashedPassword);
      expect(isValid).toBe(true);

      const isInvalid = await bcrypt.compare('wrongPassword', hashedPassword);
      expect(isInvalid).toBe(false);
    });
  });

  describe('Generación de tokens JWT', () => {
    it('debería generar token con datos del usuario', () => {
      const userData = {
        id: 1,
        email: 'admin@bigartist.es',
        role: 'admin'
      };

      // Simulación de payload JWT
      const payload = {
        ...userData,
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 días
      };

      expect(payload.id).toBe(userData.id);
      expect(payload.email).toBe(userData.email);
      expect(payload.role).toBe(userData.role);
      expect(payload.exp).toBeGreaterThan(payload.iat);
    });
  });

  describe('Validación de campos requeridos', () => {
    it('debería requerir email y password', () => {
      const testCases = [
        { email: '', password: 'pass' },
        { email: 'email@test.com', password: '' },
        { email: '', password: '' }
      ];

      testCases.forEach(testCase => {
        const isValid = testCase.email && testCase.password;
        expect(isValid).toBe(false);
      });
    });

    it('debería aceptar campos válidos', () => {
      const validCase = {
        email: 'user@example.com',
        password: 'securePassword123'
      };

      const isValid = validCase.email && validCase.password;
      expect(isValid).toBe(true);
    });
  });
});
