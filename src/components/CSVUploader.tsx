import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, TrendingUp, DollarSign, Music, Download } from 'lucide-react';
import { useData } from './DataContext';

interface CSVData {
  fileName: string;
  rows: any[];
  totalRevenue: number;
  totalStreams: number;
  uniqueArtists: number;
  uniqueTracks: number;
  platformBreakdown: { [key: string]: number };
  artistBreakdown: { [key: string]: number };
  monthlyBreakdown: { [key: string]: { revenue: number; streams: number } };
}

export default function CSVUploader() {
  const { addCSVData } = useData();
  const [uploadedFiles, setUploadedFiles] = useState<CSVData[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para formatear importes en formato europeo
  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    // Detectar el delimitador: tabs, punto y coma o comas
    const firstLine = lines[0];
    let delimiter = ',';
    
    if (firstLine.includes('\t')) {
      delimiter = '\t';
    } else if (firstLine.includes(';')) {
      delimiter = ';';
    } else if (firstLine.includes(',')) {
      delimiter = ',';
    }
    
    console.log('Delimiter detected:', delimiter === '\t' ? 'TAB' : delimiter === ';' ? 'SEMICOLON' : 'COMMA');
    
    // Parse header line
    const headers = parseCSVLine(lines[0], delimiter);
    console.log('Headers found:', headers.length, headers.slice(0, 5));
    
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i], delimiter);
      if (values.length > 0 && values.some(v => v.trim())) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        rows.push(row);
      }
    }

    console.log('Total rows parsed:', rows.length);
    if (rows.length > 0) {
      console.log('First row sample:', rows[0]);
    }

    return rows;
  };

  const parseCSVLine = (line: string, delimiter: string): string[] => {
    // Si es tab, es más simple
    if (delimiter === '\t') {
      return line.split('\t').map(field => field.trim().replace(/^"|"$/g, ''));
    }
    
    // Para comas, manejar comillas
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          current += '"';
          i++; // Skip next quote
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === delimiter && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    result.push(current.trim());
    return result;
  };

  const processCSVData = (rows: any[]): Omit<CSVData, 'fileName'> => {
    let totalRevenue = 0;
    let totalStreams = 0;
    const artists = new Set<string>();
    const tracks = new Set<string>();
    const platformBreakdown: { [key: string]: number } = {};
    const artistBreakdown: { [key: string]: number } = {};
    const monthlyBreakdown: { [key: string]: { revenue: number; streams: number } } = {};

    rows.forEach(row => {
      // Extraer periodo - The Orchard puede usar diferentes columnas
      const periodStr = (
        row['Sale Month'] || 
        row['Period'] || 
        row['Report Period'] ||
        row['Month'] ||
        row['Sale Period'] ||
        row['Reporting Period'] ||
        ''
      ).toString().trim();

      // Procesar revenue - The Orchard usa "Label Share Net Receipts"
      const revenueStr = (
        row['Label Share Net Receipts'] || 
        row['Revenue'] || 
        row['Net Revenue'] || 
        row['Earnings'] || 
        row['Amount'] ||
        '0'
      ).toString().trim();
      
      // Normalizar el número: eliminar símbolos de moneda, puntos de miles, y convertir coma decimal a punto
      let normalizedRevenue = revenueStr
        .replace(/[$€]/g, '')           // Eliminar símbolos de moneda
        .replace(/\s/g, '')             // Eliminar espacios
        .trim();
      
      // Si tiene punto Y coma, el punto es separador de miles y la coma es decimal (formato europeo)
      if (normalizedRevenue.includes('.') && normalizedRevenue.includes(',')) {
        normalizedRevenue = normalizedRevenue.replace(/\./g, '').replace(',', '.');
      }
      // Si solo tiene coma, es decimal europeo
      else if (normalizedRevenue.includes(',')) {
        normalizedRevenue = normalizedRevenue.replace(',', '.');
      }
      // Si solo tiene punto, puede ser miles o decimal - asumimos decimal si hay 2 dígitos después
      
      const revenue = parseFloat(normalizedRevenue);
      if (!isNaN(revenue) && revenue !== 0) {
        totalRevenue += revenue;
        // Debug: mostrar los primeros 3 valores parseados
        if (totalRevenue < revenue * 4) {
          console.log('Revenue parsed:', revenueStr, '->', normalizedRevenue, '->', revenue);
        }
      }

      // Procesar streams - The Orchard usa "Quantity"
      const streamsStr = (
        row['Quantity'] || 
        row['Streams'] || 
        row['Units'] ||
        '0'
      ).toString().replace(/[,]/g, '').trim();
      
      const streams = parseInt(streamsStr);
      if (!isNaN(streams) && streams !== 0) {
        totalStreams += streams;
      }

      // Artistas únicos - The Orchard usa "Artist Name"
      const artist = row['Artist Name'] || row['Artist'] || row['Display Artist'];
      if (artist && artist.trim()) {
        artists.add(artist.trim());
        artistBreakdown[artist.trim()] = (artistBreakdown[artist.trim()] || 0) + revenue;
      }

      // Tracks únicos - The Orchard usa "Track Name"
      const track = row['Track Name'] || row['Track'] || row['Song'] || row['Title'];
      if (track && track.trim()) {
        tracks.add(track.trim());
      }

      // Plataformas - The Orchard usa "DMS"
      const platform = row['DMS'] || row['DSP'] || row['Platform'] || row['Store'] || row['Service'];
      if (platform && platform.trim()) {
        platformBreakdown[platform.trim()] = (platformBreakdown[platform.trim()] || 0) + revenue;
      }

      // Agregar a monthlyBreakdown si hay un periodo
      if (periodStr) {
        const period = periodStr.trim();
        if (!monthlyBreakdown[period]) {
          monthlyBreakdown[period] = { revenue: 0, streams: 0 };
        }
        monthlyBreakdown[period].revenue += revenue;
        monthlyBreakdown[period].streams += streams;
      }
    });

    return {
      rows,
      totalRevenue,
      totalStreams,
      uniqueArtists: artists.size,
      uniqueTracks: tracks.size,
      platformBreakdown,
      artistBreakdown,
      monthlyBreakdown
    };
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProcessing(true);
    setError(null);

    try {
      const newFiles: CSVData[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const text = await file.text();
        const rows = parseCSV(text);

        if (rows.length === 0) {
          throw new Error(`El archivo ${file.name} está vacío o tiene un formato inválido`);
        }

        const processedData = processCSVData(rows);
        
        newFiles.push({
          fileName: file.name,
          ...processedData
        });
      }

      setUploadedFiles(prev => [...prev, ...newFiles]);
      addCSVData(newFiles);
      
      // Notificación de éxito
      const totalProcessed = newFiles.reduce((sum, f) => sum + f.totalRevenue, 0);
      setTimeout(() => {
        alert(`✅ ${files.length} archivo(s) procesado(s) correctamente\n\nTotal procesado: ${formatEuro(totalProcessed)}`);
      }, 500);

    } catch (err: any) {
      setError(err.message || 'Error al procesar los archivos');
      console.error('Error processing CSV:', err);
    } finally {
      setProcessing(false);
    }
  };

  const getTotalStats = () => {
    return uploadedFiles.reduce((acc, file) => ({
      revenue: acc.revenue + file.totalRevenue,
      streams: acc.streams + file.totalStreams,
      artists: acc.artists + file.uniqueArtists,
      tracks: acc.tracks + file.uniqueTracks
    }), { revenue: 0, streams: 0, artists: 0, tracks: 0 });
  };

  const totalStats = getTotalStats();

  return (
    <div>
      <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '24px', color: '#ffffff' }}>
        Subir CSV - The Orchard Format
      </h1>

      {/* Upload Area */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
        border: '2px dashed rgba(201, 165, 116, 0.4)',
        borderRadius: '16px',
        padding: '48px',
        textAlign: 'center',
        marginBottom: '32px',
        position: 'relative'
      }}>
        <Upload size={48} color="#c9a574" style={{ margin: '0 auto 16px' }} />
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>
          Arrastra tus archivos CSV aquí
        </h3>
        <p style={{ fontSize: '14px', color: '#AFB3B7', marginBottom: '24px' }}>
          Formato The Orchard: Revenue, Artist, Track, DSP, Streams
        </p>
        
        <input
          type="file"
          accept=".csv"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
          id="csv-upload"
          disabled={processing}
        />
        
        <label htmlFor="csv-upload">
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 32px',
            background: processing 
              ? 'rgba(201, 165, 116, 0.5)' 
              : 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            fontWeight: '600',
            cursor: processing ? 'not-allowed' : 'pointer',
            opacity: processing ? 0.7 : 1
          }}>
            {processing ? 'Procesando...' : 'Seleccionar archivos'}
            <FileText size={18} />
          </div>
        </label>

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'rgba(248, 113, 113, 0.1)',
            border: '1px solid rgba(248, 113, 113, 0.3)',
            borderRadius: '8px',
            color: '#f87171',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            justifyContent: 'center'
          }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}
      </div>

      {/* Total Stats */}
      {uploadedFiles.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '20px',
          marginBottom: '32px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <DollarSign size={20} color="#c9a574" />
              <span style={{ fontSize: '13px', color: '#AFB3B7', fontWeight: '600' }}>Total Revenue</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#c9a574' }}>
              {formatEuro(totalStats.revenue)}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(74, 222, 128, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
            border: '1px solid rgba(74, 222, 128, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <TrendingUp size={20} color="#4ade80" />
              <span style={{ fontSize: '13px', color: '#AFB3B7', fontWeight: '600' }}>Total Streams</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#4ade80' }}>
              {totalStats.streams.toLocaleString()}
            </div>
          </div>

          <div style={{
            background: 'linear-gradient(135deg, rgba(96, 165, 250, 0.15) 0%, rgba(42, 63, 63, 0.4) 100%)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <Music size={20} color="#60a5fa" />
              <span style={{ fontSize: '13px', color: '#AFB3B7', fontWeight: '600' }}>Unique Tracks</span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#60a5fa' }}>
              {totalStats.tracks}
            </div>
          </div>
        </div>
      )}

      {/* Uploaded Files */}
      {uploadedFiles.map((file, fileIndex) => (
        <div key={fileIndex} style={{
          background: 'linear-gradient(135deg, rgba(42, 63, 63, 0.4) 0%, rgba(30, 47, 47, 0.6) 100%)',
          border: '1px solid rgba(201, 165, 116, 0.2)',
          borderRadius: '16px',
          padding: '32px',
          marginBottom: '24px'
        }}>
          {/* File Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px',
            paddingBottom: '16px',
            borderBottom: '1px solid rgba(201, 165, 116, 0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CheckCircle size={24} color="#4ade80" />
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                  {file.fileName}
                </h3>
                <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                  {file.rows.length} filas procesadas
                </p>
              </div>
            </div>
            <div style={{
              padding: '8px 16px',
              background: 'rgba(201, 165, 116, 0.1)',
              borderRadius: '8px',
              border: '1px solid rgba(201, 165, 116, 0.3)'
            }}>
              <span style={{ fontSize: '14px', fontWeight: '600', color: '#c9a574' }}>
                {formatEuro(file.totalRevenue)}
              </span>
            </div>
          </div>

          {/* File Stats */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Streams</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#4ade80' }}>
                {file.totalStreams.toLocaleString()}
              </div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Artistas</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#60a5fa' }}>
                {file.uniqueArtists}
              </div>
            </div>
            <div style={{
              padding: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}>
              <div style={{ fontSize: '12px', color: '#AFB3B7', marginBottom: '4px' }}>Canciones</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: '#c9a574' }}>
                {file.uniqueTracks}
              </div>
            </div>
          </div>

          {/* Platform Breakdown */}
          {Object.keys(file.platformBreakdown).length > 0 && (
            <div style={{ marginBottom: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Por Plataforma
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                {Object.entries(file.platformBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 6)
                  .map(([platform, revenue]) => (
                    <div key={platform} style={{
                      padding: '12px 16px',
                      background: 'rgba(201, 165, 116, 0.05)',
                      borderRadius: '8px',
                      border: '1px solid rgba(201, 165, 116, 0.15)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '13px', color: '#AFB3B7', fontWeight: '500' }}>
                        {platform}
                      </span>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        {formatEuro(revenue)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Top Artists */}
          {Object.keys(file.artistBreakdown).length > 0 && (
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Top Artistas
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {Object.entries(file.artistBreakdown)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([artist, revenue], index) => (
                    <div key={artist} style={{
                      padding: '12px 16px',
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px',
                          background: 'linear-gradient(135deg, rgba(201, 165, 116, 0.3) 0%, rgba(201, 165, 116, 0.1) 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '700',
                          color: '#c9a574'
                        }}>
                          {index + 1}
                        </div>
                        <span style={{ fontSize: '14px', color: '#ffffff', fontWeight: '500' }}>
                          {artist}
                        </span>
                      </div>
                      <span style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574' }}>
                        {formatEuro(revenue)}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Sample Data Preview */}
          {file.rows.length > 0 && (
            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#c9a574', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Vista Previa (primeras 5 filas)
              </h4>
              <div style={{
                overflowX: 'auto',
                background: 'rgba(0, 0, 0, 0.2)',
                borderRadius: '8px',
                padding: '16px'
              }}>
                <table style={{ width: '100%', fontSize: '12px', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {Object.keys(file.rows[0]).slice(0, 8).map(header => (
                        <th key={header} style={{
                          textAlign: 'left',
                          padding: '8px 12px',
                          color: '#c9a574',
                          fontWeight: '700',
                          borderBottom: '1px solid rgba(201, 165, 116, 0.2)',
                          whiteSpace: 'nowrap'
                        }}>
                          {header}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {file.rows.slice(0, 5).map((row, idx) => (
                      <tr key={idx}>
                        {Object.values(row).slice(0, 8).map((value: any, cellIdx) => (
                          <td key={cellIdx} style={{
                            padding: '8px 12px',
                            color: '#AFB3B7',
                            borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                            whiteSpace: 'nowrap'
                          }}>
                            {String(value).substring(0, 50)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ))}

      {uploadedFiles.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '48px',
          color: '#AFB3B7'
        }}>
          <FileText size={48} color="#c9a574" style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <p style={{ fontSize: '16px' }}>No hay archivos cargados aún</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            Sube un archivo CSV para comenzar el análisis
          </p>
        </div>
      )}
    </div>
  );
}