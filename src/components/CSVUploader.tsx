import { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Music, TrendingUp, DollarSign } from 'lucide-react';
import { uploadCSV, createNotification, getArtists } from '../config/api';
import { useData } from './DataContext';

export default function CSVUploader() {
  const { loadData, addUploadedFile } = useData();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<Array<{
    name: string;
    rows: number;
    revenue: number;
    streams: number;
    artists: number;
    tracks: number;
  }>>([]);

  const formatEuro = (amount: number): string => {
    return amount.toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }) + '€';
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setProcessing(true);
    setError(null);
    setSuccess(false);

    try {
      const results = [];

      // Procesar cada archivo
      for (const file of Array.from(files)) {
        console.log(`📤 Subiendo archivo: ${file.name}`);
        
        const response = await uploadCSV(file);
        
        if (response.success) {
          results.push({
            name: response.data.filename,
            rows: response.data.rows_processed,
            revenue: response.data.total_revenue,
            streams: response.data.total_streams,
            artists: response.data.unique_artists,
            tracks: response.data.unique_tracks
          });
          
          console.log(`✅ Archivo procesado: ${file.name}`, response.data);
        }
      }

      setUploadedFiles(prev => [...prev, ...results]);
      setSuccess(true);

      // Agregar archivos al contexto global con fecha de subida
      results.forEach(file => {
        addUploadedFile({
          ...file,
          uploadDate: new Date().toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        });
      });

      // Recargar datos del contexto desde la API
      console.log('🔄 Recargando datos desde API...');
      await loadData();

      // Crear notificaciones para todos los artistas
      try {
        const artists = await getArtists();
        const totalRevenue = results.reduce((sum, r) => sum + r.revenue, 0);
        const totalStreams = results.reduce((sum, r) => sum + r.streams, 0);
        
        // Crear una notificación para cada artista
        for (const artist of artists) {
          await createNotification({
            user_id: artist.id,
            title: '🎵 Nuevos Royalties Disponibles',
            message: `Se ha subido un nuevo informe de royalties con ${formatEuro(totalRevenue)} en ingresos y ${totalStreams.toLocaleString()} streams totales.`,
            type: 'csv_upload'
          });
        }
        
        console.log(`✅ Notificaciones creadas para ${artists.length} artistas`);
      } catch (notifErr) {
        console.error('⚠️ Error creando notificaciones:', notifErr);
        // No fallamos si las notificaciones fallan
      }

      // Limpiar input
      e.target.value = '';

    } catch (err: any) {
      console.error('❌ Error subiendo CSV:', err);
      setError(err.message || 'Error al procesar el archivo CSV');
    } finally {
      setProcessing(false);
    }
  };

  const getTotalStats = () => {
    return uploadedFiles.reduce((acc, file) => ({
      revenue: acc.revenue + file.revenue,
      streams: acc.streams + file.streams,
      artists: acc.artists + file.artists,
      tracks: acc.tracks + file.tracks
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
                  {file.name}
                </h3>
                <p style={{ fontSize: '13px', color: '#AFB3B7' }}>
                  {file.rows} filas procesadas
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
                {formatEuro(file.revenue)}
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
                {file.streams.toLocaleString()}
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
                {file.artists}
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
                {file.tracks}
              </div>
            </div>
          </div>
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