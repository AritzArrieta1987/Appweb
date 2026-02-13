/**
 * Tests para utilidades de validación
 */

import { describe, it, expect } from 'vitest';
import {
  validateIBAN,
  formatIBAN,
  validateEmail,
  validatePhone,
  validateAmount,
  validateRequired,
  validatePercentage,
  validateDate,
  validateDateRange
} from '../../utils/validation';

describe('Validación IBAN', () => {
  it('debería validar un IBAN español correcto', () => {
    const result = validateIBAN('ES91 2100 0418 4502 0005 1332');
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('debería validar un IBAN sin espacios', () => {
    const result = validateIBAN('ES9121000418450200051332');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar un IBAN con formato incorrecto', () => {
    const result = validateIBAN('ES123');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Formato IBAN español inválido');
  });

  it('debería rechazar un IBAN con checksum inválido', () => {
    const result = validateIBAN('ES00 1234 5678 9012 3456 7890');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('código de control');
  });

  it('debería rechazar un IBAN que no sea español', () => {
    const result = validateIBAN('FR14 2004 1010 0505 0001 3M02 606');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Formato IBAN español inválido');
  });

  it('debería rechazar un IBAN vacío', () => {
    const result = validateIBAN('');
    expect(result.valid).toBe(false);
  });
});

describe('Formato IBAN', () => {
  it('debería formatear un IBAN sin espacios', () => {
    const formatted = formatIBAN('ES9121000418450200051332');
    expect(formatted).toBe('ES91 2100 0418 4502 0005 1332');
  });

  it('debería mantener el formato de un IBAN ya formateado', () => {
    const formatted = formatIBAN('ES91 2100 0418 4502 0005 1332');
    expect(formatted).toBe('ES91 2100 0418 4502 0005 1332');
  });

  it('debería convertir a mayúsculas', () => {
    const formatted = formatIBAN('es9121000418450200051332');
    expect(formatted).toBe('ES91 2100 0418 4502 0005 1332');
  });
});

describe('Validación Email', () => {
  it('debería validar un email correcto', () => {
    const result = validateEmail('usuario@example.com');
    expect(result.valid).toBe(true);
  });

  it('debería validar emails con subdominios', () => {
    const result = validateEmail('admin@app.bigartist.es');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar un email sin @', () => {
    const result = validateEmail('usuarioexample.com');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Email inválido');
  });

  it('debería rechazar un email sin dominio', () => {
    const result = validateEmail('usuario@');
    expect(result.valid).toBe(false);
  });

  it('debería rechazar un email vacío', () => {
    const result = validateEmail('');
    expect(result.valid).toBe(false);
  });
});

describe('Validación Teléfono', () => {
  it('debería validar un teléfono móvil español', () => {
    const result = validatePhone('600123456');
    expect(result.valid).toBe(true);
  });

  it('debería validar teléfonos con +34', () => {
    const result = validatePhone('+34 600 123 456');
    expect(result.valid).toBe(true);
  });

  it('debería validar teléfonos con espacios y guiones', () => {
    const result = validatePhone('600-123-456');
    expect(result.valid).toBe(true);
  });

  it('debería validar teléfonos que empiecen por 6, 7, 8, 9', () => {
    expect(validatePhone('600000000').valid).toBe(true);
    expect(validatePhone('700000000').valid).toBe(true);
    expect(validatePhone('800000000').valid).toBe(true);
    expect(validatePhone('900000000').valid).toBe(true);
  });

  it('debería rechazar teléfonos que no empiecen por 6, 7, 8, 9', () => {
    const result = validatePhone('500000000');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Debe comenzar por 6, 7, 8 o 9');
  });

  it('debería rechazar teléfonos con menos de 9 dígitos', () => {
    const result = validatePhone('60012345');
    expect(result.valid).toBe(false);
  });
});

describe('Validación Monto', () => {
  it('debería validar un monto válido como número', () => {
    const result = validateAmount(100.50);
    expect(result.valid).toBe(true);
  });

  it('debería validar un monto válido como string', () => {
    const result = validateAmount('100.50');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar montos negativos', () => {
    const result = validateAmount(-50);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('mayor que 0');
  });

  it('debería rechazar monto cero', () => {
    const result = validateAmount(0);
    expect(result.valid).toBe(false);
  });

  it('debería rechazar montos mayores a 1 millón', () => {
    const result = validateAmount(1000001);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('demasiado alto');
  });

  it('debería aceptar el monto máximo de 1 millón', () => {
    const result = validateAmount(1000000);
    expect(result.valid).toBe(true);
  });

  it('debería rechazar valores no numéricos', () => {
    const result = validateAmount('abc');
    expect(result.valid).toBe(false);
  });
});

describe('Validación Campo Requerido', () => {
  it('debería validar un campo con valor', () => {
    const result = validateRequired('texto');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar un campo vacío', () => {
    const result = validateRequired('');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('obligatorio');
  });

  it('debería rechazar un campo con solo espacios', () => {
    const result = validateRequired('   ');
    expect(result.valid).toBe(false);
  });
});

describe('Validación Porcentaje', () => {
  it('debería validar un porcentaje válido', () => {
    const result = validatePercentage(50);
    expect(result.valid).toBe(true);
  });

  it('debería validar 0%', () => {
    const result = validatePercentage(0);
    expect(result.valid).toBe(true);
  });

  it('debería validar 100%', () => {
    const result = validatePercentage(100);
    expect(result.valid).toBe(true);
  });

  it('debería rechazar porcentajes negativos', () => {
    const result = validatePercentage(-1);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('entre 0 y 100');
  });

  it('debería rechazar porcentajes mayores a 100', () => {
    const result = validatePercentage(101);
    expect(result.valid).toBe(false);
  });
});

describe('Validación Fecha', () => {
  it('debería validar una fecha en formato ISO', () => {
    const result = validateDate('2024-01-15');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar formato de fecha incorrecto', () => {
    const result = validateDate('15/01/2024');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Formato de fecha inválido');
  });

  it('debería rechazar fecha inválida', () => {
    const result = validateDate('2024-13-45');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Fecha inválida');
  });

  it('debería rechazar fecha vacía', () => {
    const result = validateDate('');
    expect(result.valid).toBe(false);
  });
});

describe('Validación Rango de Fechas', () => {
  it('debería validar un rango válido', () => {
    const result = validateDateRange('2024-01-01', '2024-12-31');
    expect(result.valid).toBe(true);
  });

  it('debería rechazar cuando fecha fin es anterior a fecha inicio', () => {
    const result = validateDateRange('2024-12-31', '2024-01-01');
    expect(result.valid).toBe(false);
    expect(result.error).toContain('debe ser posterior');
  });

  it('debería rechazar cuando las fechas son iguales', () => {
    const result = validateDateRange('2024-01-01', '2024-01-01');
    expect(result.valid).toBe(false);
  });
});
