/**
 * Stub de toast para evitar dependencias problemáticas
 */

export const toast = {
  success: (message: string) => console.log('✓', message),
  error: (message: string) => console.error('✗', message),
  warning: (message: string) => console.warn('⚠', message),
  info: (message: string) => console.info('ℹ', message),
  loading: (message: string) => console.log('⏳', message),
  promise: (promise: Promise<any>, options: any) => promise,
  custom: (jsx: any) => console.log(jsx),
  dismiss: (id?: string) => {},
};
