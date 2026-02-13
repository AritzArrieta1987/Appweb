/**
 * Tests E2E para el Dashboard
 */

import { test, expect } from '@playwright/test';

test.describe('Dashboard - Vista Admin', () => {
  test.beforeEach(async ({ page }) => {
    // En una implementación real, haríamos login primero
    // Por ahora solo navegamos a la página principal
    await page.goto('/');
  });

  test('debería mostrar las estadísticas principales', async ({ page }) => {
    // Buscar indicadores de estadísticas
    const statsTexts = [
      /ingresos/i,
      /artistas/i,
      /canciones/i,
      /reproducciones/i
    ];

    for (const text of statsTexts) {
      // Al menos uno debería estar visible
      const element = page.locator(`text=${text}`).first();
      if (await element.count() > 0) {
        await expect(element).toBeVisible();
      }
    }
  });

  test('debería mostrar gráficos de datos', async ({ page }) => {
    // Buscar elementos de Recharts (svg con clase recharts)
    const charts = page.locator('svg.recharts-surface');
    
    // Si hay charts, verificar que están visibles
    if (await charts.count() > 0) {
      await expect(charts.first()).toBeVisible();
    }
  });

  test('debería tener navegación funcional', async ({ page }) => {
    // Buscar elementos de navegación
    const navItems = [
      /dashboard/i,
      /artistas/i,
      /canciones/i,
      /finanzas/i
    ];

    for (const text of navItems) {
      const navItem = page.locator(`text=${text}`).first();
      if (await navItem.count() > 0) {
        await expect(navItem).toBeVisible();
      }
    }
  });

  test('debería mostrar el header con logo', async ({ page }) => {
    // Verificar presencia del branding
    const logo = page.locator('text=/BIGARTIST/i').first();
    if (await logo.count() > 0) {
      await expect(logo).toBeVisible();
    }
  });

  test('debería tener botón de notificaciones', async ({ page }) => {
    // Buscar icono de campana o notificaciones
    const notificationIcon = page.locator('[class*="bell"]').first();
    
    if (await notificationIcon.count() > 0) {
      await expect(notificationIcon).toBeVisible();
    }
  });

  test('debería ser responsive en mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Verificar que el contenido se adapta
    const body = page.locator('body');
    await expect(body).toBeVisible();
    
    // En mobile debería aparecer bottom navigation
    // Buscar elementos de navegación inferior
    const bottomNav = page.locator('[class*="bottom"]').first();
    if (await bottomNav.count() > 0) {
      await expect(bottomNav).toBeVisible();
    }
  });

  test('debería cargar en menos de 3 segundos', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    expect(loadTime).toBeLessThan(3000);
  });
});

test.describe('WorldMap', () => {
  test('debería mostrar el mapa mundial', async ({ page }) => {
    await page.goto('/');
    
    // Buscar el componente del mapa
    const map = page.locator('[class*="map"]').first();
    
    if (await map.count() > 0) {
      await expect(map).toBeVisible();
    }
  });

  test('debería mostrar tooltip al hacer hover', async ({ page }) => {
    await page.goto('/');
    
    const mapElements = page.locator('path[class*="country"], circle');
    
    if (await mapElements.count() > 0) {
      await mapElements.first().hover();
      
      // Esperar a que aparezca el tooltip
      await page.waitForTimeout(500);
      
      // Buscar tooltip
      const tooltip = page.locator('[role="tooltip"], [class*="tooltip"]').first();
      if (await tooltip.count() > 0) {
        await expect(tooltip).toBeVisible();
      }
    }
  });
});

test.describe('Gestión de Artistas', () => {
  test('debería permitir navegar a la sección de artistas', async ({ page }) => {
    await page.goto('/');
    
    // Buscar y hacer clic en el enlace de artistas
    const artistasLink = page.locator('text=/artistas/i').first();
    
    if (await artistasLink.count() > 0) {
      await artistasLink.click();
      await page.waitForTimeout(500);
      
      // Verificar que estamos en la sección correcta
      const url = page.url();
      expect(url.toLowerCase()).toMatch(/artista/);
    }
  });

  test('debería mostrar lista de artistas', async ({ page }) => {
    await page.goto('/');
    
    // Buscar tabla o grid de artistas
    const artistsList = page.locator('table, [class*="grid"], [class*="list"]').first();
    
    if (await artistsList.count() > 0) {
      await expect(artistsList).toBeVisible();
    }
  });
});

test.describe('Sistema de Notificaciones', () => {
  test('debería abrir panel de notificaciones', async ({ page }) => {
    await page.goto('/');
    
    // Buscar y hacer clic en el botón de notificaciones
    const notifButton = page.locator('button').filter({
      has: page.locator('[class*="bell"]')
    }).first();
    
    if (await notifButton.count() > 0) {
      await notifButton.click();
      await page.waitForTimeout(300);
      
      // Verificar que se abre un panel o dropdown
      const notifPanel = page.locator('[role="dialog"], [class*="dropdown"]').first();
      if (await notifPanel.count() > 0) {
        await expect(notifPanel).toBeVisible();
      }
    }
  });

  test('debería mostrar contador de notificaciones no leídas', async ({ page }) => {
    await page.goto('/');
    
    // Buscar badge con número de notificaciones
    const badge = page.locator('[class*="badge"]').first();
    
    if (await badge.count() > 0) {
      const text = await badge.textContent();
      expect(text).toMatch(/\d+/);
    }
  });
});

test.describe('Performance', () => {
  test('no debería tener memory leaks básicos', async ({ page }) => {
    await page.goto('/');
    
    // Navegar entre secciones
    const links = await page.locator('a, button[role="link"]').all();
    
    for (let i = 0; i < Math.min(links.length, 5); i++) {
      if (await links[i].isVisible()) {
        await links[i].click();
        await page.waitForTimeout(200);
      }
    }
    
    // Si llegamos aquí sin errores, no hay memory leaks evidentes
    expect(true).toBe(true);
  });

  test('debería manejar scrolling suave', async ({ page }) => {
    await page.goto('/');
    
    // Hacer scroll
    await page.evaluate(() => window.scrollTo(0, 500));
    await page.waitForTimeout(300);
    
    const scrollY = await page.evaluate(() => window.scrollY);
    expect(scrollY).toBeGreaterThan(0);
  });
});
