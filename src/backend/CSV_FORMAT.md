# 📋 FORMATO CSV ESPERADO

El backend procesa archivos CSV con formato **The Orchard**. Aquí está la especificación:

## Columnas Requeridas/Reconocidas

El sistema es flexible y reconoce múltiples nombres de columnas:

### 1. **Artista**
- `Artist Name`
- `Artist`

### 2. **Canción/Track**
- `Track Name`
- `Track`

### 3. **Códigos**
- `ISRC` (opcional)
- `UPC` (opcional)

### 4. **Plataforma/Tienda**
- `DMS`
- `DSP`
- `Platform`
- `Store`

### 5. **Revenue/Ingresos**
- `Label Share Net Receipts`
- `Revenue`
- `Earnings`

Formatos aceptados:
- `$1,234.56` (con símbolo de moneda)
- `1234.56` (decimal simple)
- `1.234,56` (formato europeo)
- `1,234.56` (formato americano con comas)

### 6. **Streams/Cantidad**
- `Quantity`
- `Streams`
- `Units`

### 7. **Periodo**
- `Sale Month`
- `Period`
- `Month`

Ejemplos: `"October 2024"`, `"Octubre 2024"`, `"Nov 2024"`

### 8. **Otros (opcionales)**
- `Sale Date` - Fecha específica
- `Territory` - País/territorio
- `Country`

## 📄 Ejemplo de CSV (The Orchard)

```csv
Artist Name,Track Name,ISRC,UPC,DMS,Sale Month,Quantity,Label Share Net Receipts,Territory
Bad Bunny,MONACO,USRC12345678,00123456789,Spotify,October 2024,125430,$4523.45,US
Bad Bunny,MONACO,USRC12345678,00123456789,Apple Music,October 2024,85230,$3124.56,US
Bad Bunny,WHERE SHE GOES,USRC12345679,00123456789,Spotify,October 2024,95430,$3421.23,ES
Karol G,Si Antes Te Hubiera Conocido,USRC98765432,00987654321,YouTube Music,October 2024,156230,$1234.56,MX
Karol G,Si Antes Te Hubiera Conocido,USRC98765432,00987654321,Spotify,November 2024,185430,$6734.21,US
Bad Bunny,MONACO,USRC12345678,00123456789,Spotify,November 2024,145230,$5234.67,US
```

## 📊 Ejemplo de CSV Alternativo (formato europeo)

```csv
Artist,Track,ISRC,Platform,Period,Streams,Revenue,Country
Rosalía,DESPECHÁ,ES5701234567,Spotify,Octubre 2024,234500,"4.523,45",ES
Rosalía,DESPECHÁ,ES5701234567,Apple Music,Octubre 2024,145230,"3.124,56",ES
C. Tangana,Tú Me Dejaste De Querer,ES5701234568,Spotify,Octubre 2024,185430,"5.421,23",ES
```

## ⚙️ Procesamiento

Cuando subes un CSV, el backend:

1. ✅ **Lee todas las líneas** del archivo
2. ✅ **Por cada línea**:
   - Busca o crea el **artista**
   - Busca o crea el **track**
   - Busca o crea la **plataforma**
   - Inserta el **royalty** con revenue y streams
3. ✅ **Calcula totales**:
   - Actualiza `total_revenue` y `total_streams` de cada artista
   - Actualiza `total_revenue` y `total_streams` de cada track
   - Crea estadísticas mensuales
   - Crea estadísticas por plataforma
4. ✅ **Registra el upload** en `csv_uploads`
5. ✅ **Retorna estadísticas**:
   ```json
   {
     "success": true,
     "message": "CSV procesado correctamente",
     "data": {
       "filename": "octubre_2024.csv",
       "rows_processed": 1523,
       "total_revenue": 42500.20,
       "total_streams": 2850000,
       "unique_artists": 34,
       "unique_tracks": 156,
       "monthly_breakdown": {...},
       "platform_breakdown": {...}
     }
   }
   ```

## 🔄 Dashboard se actualiza automáticamente

Después de subir el CSV:
1. El frontend llama a `loadData()` del DataContext
2. Se recarga `/api/dashboard/stats`
3. Se actualiza el dashboard con los nuevos datos
4. Se muestran los artistas y tracks en las listas

## 🚨 Manejo de Duplicados

El sistema es inteligente:
- **No duplica artistas**: Si "Bad Bunny" ya existe, usa ese registro
- **No duplica tracks**: Si "MONACO" de "Bad Bunny" ya existe, usa ese registro
- **Acumula royalties**: Cada línea del CSV se guarda como un royalty individual
- **Actualiza totales**: Los totales se recalculan sumando todos los royalties

## 📝 Notas Importantes

1. **Encoding**: El CSV debe estar en UTF-8
2. **Separador**: Comas (`,`)
3. **Headers**: Primera línea debe contener los nombres de columnas
4. **Comillas**: Si un campo contiene comas, debe ir entre comillas: `"Artist, The"`
5. **Tamaño máximo**: 50MB por archivo
6. **Múltiples archivos**: Puedes subir varios CSVs, se procesarán todos

## ✅ Validación

El sistema es tolerante a errores:
- Si falta un campo opcional, continúa con la siguiente línea
- Si falta el artista o track, salta esa línea
- Si el revenue no se puede parsear, usa 0
- Todos los errores se registran en los logs

## 🧪 Probar con CSV de Ejemplo

Puedes crear un CSV de prueba con estos datos:

```csv
Artist Name,Track Name,ISRC,DMS,Sale Month,Quantity,Label Share Net Receipts
Test Artist,Test Song,TEST123,Spotify,December 2024,1000,$50.00
Test Artist,Test Song,TEST123,Apple Music,December 2024,500,$25.00
Test Artist,Another Song,TEST456,Spotify,December 2024,2000,$100.00
```

Guárdalo como `test.csv` y súbelo desde el frontend!
