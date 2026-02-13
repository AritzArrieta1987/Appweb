/**
 * BIGARTIST ROYALTIES - Utilidades de Validación
 * 
 * Funciones de validación para formularios y datos
 */

/**
 * Valida un número IBAN español
 * Formato: ES + 2 dígitos de control + 20 dígitos
 * Ejemplo: ES91 2100 0418 4502 0005 1332
 */
export const validateIBAN = (iban: string): { valid: boolean; error?: string } => {
  // Eliminar espacios
  const cleanIBAN = iban.replace(/\s/g, '').toUpperCase();
  
  // Verificar formato básico español
  const ibanRegex = /^ES\d{22}$/;
  if (!ibanRegex.test(cleanIBAN)) {
    return {
      valid: false,
      error: 'Formato IBAN español inválido. Debe ser: ES + 22 dígitos (ej: ES91 2100 0418 4502 0005 1332)'
    };
  }
  
  // Algoritmo de validación IBAN (módulo 97)
  // 1. Mover los 4 primeros caracteres al final
  const rearranged = cleanIBAN.slice(4) + cleanIBAN.slice(0, 4);
  
  // 2. Reemplazar letras por números (A=10, B=11, ..., Z=35)
  const numericString = rearranged
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code >= 65 && code <= 90) {
        // Es una letra
        return (code - 55).toString();
      }
      return char;
    })
    .join('');
  
  // 3. Calcular módulo 97
  const mod97 = mod97String(numericString);
  
  if (mod97 !== 1) {
    return {
      valid: false,
      error: 'El código de control del IBAN no es válido'
    };
  }
  
  return { valid: true };
};

/**
 * Calcula módulo 97 de un string numérico largo
 * (necesario porque JavaScript no maneja números tan grandes)
 */
const mod97String = (numericString: string): number => {
  let remainder = 0;
  
  for (let i = 0; i < numericString.length; i++) {
    remainder = (remainder * 10 + parseInt(numericString[i], 10)) % 97;
  }
  
  return remainder;
};

/**
 * Formatea un IBAN para mostrarlo con espacios
 * ES9121000418450200051332 → ES91 2100 0418 4502 0005 1332
 */
export const formatIBAN = (iban: string): string => {
  const clean = iban.replace(/\s/g, '').toUpperCase();
  
  // Formato español: ES + grupos de 4 dígitos
  if (clean.startsWith('ES') && clean.length === 24) {
    return clean.match(/.{1,4}/g)?.join(' ') || clean;
  }
  
  return clean;
};

/**
 * Valida un email
 */
export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(email)) {
    return {
      valid: false,
      error: 'Email inválido'
    };
  }
  
  return { valid: true };
};

/**
 * Valida un teléfono español
 */
export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  // Eliminar espacios y caracteres especiales
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  
  // Formatos válidos:
  // +34 600 000 000
  // 600 000 000
  // +34600000000
  const phoneRegex = /^(\+34|0034)?[6789]\d{8}$/;
  
  if (!phoneRegex.test(cleanPhone)) {
    return {
      valid: false,
      error: 'Teléfono español inválido. Debe comenzar por 6, 7, 8 o 9 y tener 9 dígitos'
    };
  }
  
  return { valid: true };
};

/**
 * Valida un monto monetario
 */
export const validateAmount = (amount: string | number): { valid: boolean; error?: string } => {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      valid: false,
      error: 'El importe debe ser mayor que 0'
    };
  }
  
  if (numAmount > 1000000) {
    return {
      valid: false,
      error: 'El importe es demasiado alto (máximo: 1.000.000€)'
    };
  }
  
  return { valid: true };
};

/**
 * Valida que un campo no esté vacío
 */
export const validateRequired = (value: string): { valid: boolean; error?: string } => {
  if (!value || value.trim() === '') {
    return {
      valid: false,
      error: 'Este campo es obligatorio'
    };
  }
  
  return { valid: true };
};

/**
 * Valida un porcentaje (0-100)
 */
export const validatePercentage = (value: number): { valid: boolean; error?: string } => {
  if (isNaN(value) || value < 0 || value > 100) {
    return {
      valid: false,
      error: 'El porcentaje debe estar entre 0 y 100'
    };
  }
  
  return { valid: true };
};

/**
 * Valida una fecha en formato ISO (YYYY-MM-DD)
 */
export const validateDate = (date: string): { valid: boolean; error?: string } => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  
  if (!dateRegex.test(date)) {
    return {
      valid: false,
      error: 'Formato de fecha inválido (debe ser YYYY-MM-DD)'
    };
  }
  
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return {
      valid: false,
      error: 'Fecha inválida'
    };
  }
  
  return { valid: true };
};

/**
 * Valida que una fecha de fin sea posterior a una fecha de inicio
 */
export const validateDateRange = (
  startDate: string,
  endDate: string
): { valid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (end <= start) {
    return {
      valid: false,
      error: 'La fecha de fin debe ser posterior a la fecha de inicio'
    };
  }
  
  return { valid: true };
};
