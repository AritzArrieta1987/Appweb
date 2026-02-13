# Flujo de Solicitudes de Pago - BIGARTIST ROYALTIES

## Descripción General

El sistema de solicitudes de pago permite a los artistas solicitar pagos de sus royalties acumulados y al administrador aprobar o rechazar estas solicitudes. Una vez aprobadas, las solicitudes aparecen automáticamente en el portal del artista.

## Flujo Completo

### 1. Artista Solicita Pago

**Ubicación:** ArtistPortal → Tab "Royalties"

El artista puede:
- Ver su saldo disponible
- Ver pagos pendientes de aprobación
- Ver historial de pagos completados
- Solicitar un nuevo pago completando:
  - Monto solicitado
  - IBAN (validado)
  - Nombre completo
  - Método de pago (solo transferencia bancaria)

**Código relevante:**
```tsx
// components/ArtistPortal.tsx
const paymentRequests = globalPaymentRequests 
  ? globalPaymentRequests.filter(req => req.artistId === artistData?.id)
  : [];
```

### 2. Administrador Revisa Solicitudes

**Ubicación:** Dashboard Admin → Tab "Finanzas" → Sub-tab "Solicitudes"

El administrador puede ver:
- Total de solicitudes pendientes (badge en el tab)
- Total de solicitudes completadas
- Detalles completos de cada solicitud:
  - Foto y nombre del artista
  - Monto solicitado
  - Fecha de solicitud
  - IBAN del artista
  - Estado actual

**Formato de cajas individuales premium:**
- Diseño corporativo con colores #2a3f3f y #c9a574
- Información completa del artista y pago
- Botones de Aprobar/Rechazar para solicitudes pendientes
- Estados visuales diferenciados (Pendiente/Completada)

### 3. Aprobación de Solicitud

**Acción:** El administrador hace clic en "Aprobar"

**Efectos:**
1. Cambio de estado: `status: 'pending'` → `status: 'completed'`
2. Actualización global del array `paymentRequests`
3. Creación de notificación para el administrador
4. Toast de confirmación visual
5. **Actualización automática** en el ArtistPortal del artista

**Código relevante:**
```tsx
// components/FinancesPanel.tsx - líneas 1783-1813
onClick={() => {
  if (setPaymentRequests) {
    setPaymentRequests(
      paymentRequests.map(r => 
        r.id === request.id 
          ? { ...r, status: 'completed' }
          : r
      )
    );
    // Notificación
    if (setNotifications) {
      setNotifications([{
        id: Date.now(),
        type: 'success',
        title: 'Pago Aprobado',
        message: `Pago de €${request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} a ${request.artistName} aprobado`,
        time: 'Ahora',
        read: false
      }]);
    }
    // Toast visual
    toast.success('Pago Aprobado', {
      description: `El pago de €${request.amount.toLocaleString('es-ES', { minimumFractionDigits: 2 })} a ${request.artistName} ha sido aprobado exitosamente.`,
      duration: 5000,
    });
  }
}}
```

### 4. Artista Recibe Notificación

**Ubicación:** ArtistPortal (automático)

El artista verá:

1. **Dashboard (si el pago fue aprobado en las últimas 48h):**
   - Alerta destacada con mensaje de aprobación
   - Monto total aprobado
   - Botón "Ver detalles" que lleva al tab Royalties

2. **Tab Royalties:**
   - Saldo disponible actualizado (reducido por el pago completado)
   - Pagos pendientes actualizados
   - **Historial de Pagos:**
     - Badge con número de pagos completados
     - Pagos completados recientemente (<24h) destacados con:
       - Fondo resaltado en dorado
       - Borde izquierdo dorado de 3px
       - Badge "OK" en color dorado
       - Monto con prefijo "-" indicando salida

## Estado Compartido

El estado de las solicitudes de pago es **global y compartido** entre el Dashboard Admin y todos los ArtistPortal:

```tsx
// App.tsx - AuthenticatedApp
const [paymentRequests, setPaymentRequests] = useState<any[]>([...]);

// Para Admin
<DashboardSimple 
  onLogout={onLogout}
  sharedPaymentRequests={paymentRequests}
  setSharedPaymentRequests={setPaymentRequests}
  sharedNotifications={notifications}
  setSharedNotifications={setNotifications}
/>

// Para Artista
<ArtistPortal 
  onLogout={onLogout} 
  artistData={artistData}
  globalPaymentRequests={paymentRequests}
  setGlobalPaymentRequests={setPaymentRequests}
  setNotifications={setNotifications}
/>
```

## Filtrado por Artista

Cada artista solo ve sus propias solicitudes:

```tsx
// components/ArtistPortal.tsx
const paymentRequests = globalPaymentRequests 
  ? globalPaymentRequests.filter(req => req.artistId === artistData?.id)
  : [];
```

## Estructura de Datos

```typescript
interface PaymentRequest {
  id: number;
  artistId: number;
  artistName: string;
  artistPhoto: string;
  firstName: string;
  lastName: string;
  amount: number;
  status: 'pending' | 'completed';
  date: string; // ISO format
  method: string; // 'Transferencia Bancaria'
  accountNumber: string; // IBAN validado
}
```

## Validaciones

1. **Solicitud de Pago:**
   - Monto debe ser > 0 y <= saldo disponible
   - IBAN debe ser válido (formato español)
   - Nombre y apellido obligatorios
   - Solo transferencia bancaria permitida

2. **Cálculo de Saldo:**
   ```tsx
   const availableBalance = totalRevenue - 
     paymentRequests
       .filter(r => r.status === 'completed')
       .reduce((sum, r) => sum + r.amount, 0);
   ```

## Notificaciones Visuales

### Admin
- Badge en tab "Solicitudes" con número de pendientes
- Toast de confirmación al aprobar
- Notificación en panel de notificaciones

### Artista
- Alerta destacada en Dashboard (pagos <48h)
- Historial visual en tab Royalties
- Pagos recientes (<24h) resaltados
- Badge de pagos completados en historial

## Colores Corporativos

- Fondo oscuro: `#2a3f3f`
- Acento dorado: `#c9a574`
- Variantes:
  - `rgba(201, 165, 116, 0.15)` - Fondos sutiles
  - `rgba(201, 165, 116, 0.3)` - Bordes
  - `rgba(201, 165, 116, 0.5)` - Bordes destacados

## Responsive Design

- Desktop: Vista completa con todos los detalles
- Mobile (<768px): Bottom navigation automática
- Diseño adaptable en todas las secciones

## Próximas Mejoras

1. Persistencia en backend (MySQL)
2. Notificaciones en tiempo real (WebSockets)
3. Email de confirmación al aprobar
4. Exportar historial de pagos (PDF/CSV)
5. Filtros y búsqueda en solicitudes
6. Estadísticas de pagos por período
