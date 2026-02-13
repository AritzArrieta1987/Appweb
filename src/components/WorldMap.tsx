interface WorldMapProps {
  territoryData?: { [key: string]: { revenue: number; streams: number } };
}

export default function WorldMap({ territoryData = {} }: WorldMapProps) {
  // Mapeo de códigos de país a posiciones en el mapa y nombres completos
  const countryPositions: { [key: string]: { x: number; y: number; label: string; country: string } } = {
    'US': { x: 200, y: 105, label: 'USA', country: 'United States' },
    'MX': { x: 160, y: 140, label: 'MX', country: 'Mexico' },
    'BR': { x: 260, y: 230, label: 'BR', country: 'Brazil' },
    'ES': { x: 433, y: 87, label: 'ES', country: 'Spain' },
    'UK': { x: 450, y: 75, label: 'UK', country: 'United Kingdom' },
    'GB': { x: 450, y: 75, label: 'UK', country: 'United Kingdom' },
    'DE': { x: 485, y: 82, label: 'DE', country: 'Germany' },
    'FR': { x: 462, y: 90, label: 'FR', country: 'France' },
    'IT': { x: 492, y: 98, label: 'IT', country: 'Italy' },
    'JP': { x: 713, y: 125, label: 'JP', country: 'Japan' },
    'CN': { x: 650, y: 120, label: 'CN', country: 'China' },
    'KR': { x: 695, y: 120, label: 'KR', country: 'South Korea' },
    'AU': { x: 760, y: 270, label: 'AU', country: 'Australia' },
    'CA': { x: 180, y: 80, label: 'CA', country: 'Canada' },
    'AR': { x: 240, y: 300, label: 'AR', country: 'Argentina' },
    'CO': { x: 210, y: 160, label: 'CO', country: 'Colombia' },
  };

  // Formatear números
  const formatRevenue = (revenue: number): string => {
    if (revenue >= 1000000) {
      return `€${(revenue / 1000000).toFixed(1)}M`;
    } else if (revenue >= 1000) {
      return `€${(revenue / 1000).toFixed(1)}K`;
    }
    return `€${revenue.toFixed(0)}`;
  };

  const formatStreams = (streams: number): string => {
    if (streams >= 1000000) {
      return `${(streams / 1000000).toFixed(1)}M`;
    } else if (streams >= 1000) {
      return `${(streams / 1000).toFixed(0)}K`;
    }
    return streams.toString();
  };

  // Generar marcadores basados en datos reales
  const markers = Object.entries(territoryData)
    .filter(([territory]) => countryPositions[territory]) // Solo países con posición definida
    .map(([territory, data]) => {
      const position = countryPositions[territory];
      return {
        ...position,
        amount: formatRevenue(data.revenue),
        streams: formatStreams(data.streams),
        rawRevenue: data.revenue,
        rawStreams: data.streams
      };
    })
    .sort((a, b) => b.rawRevenue - a.rawRevenue) // Ordenar por revenue descendente
    .slice(0, 8); // Mostrar máximo 8 países

  // Si no hay datos, usar datos de ejemplo
  const displayMarkers = markers.length > 0 ? markers : [
    { x: 200, y: 105, label: 'USA', country: 'United States', amount: '€0', streams: '0', rawRevenue: 0, rawStreams: 0 }
  ];

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      borderRadius: '16px',
      minHeight: '400px',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, #1a2332 0%, #0f1419 100%)',
      boxShadow: 'inset 0 0 100px rgba(0, 0, 0, 0.5)'
    }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 900 400" 
        preserveAspectRatio="xMidYMid meet"
        style={{ display: 'block', opacity: 0.3 }}
      >
        <defs>
          {/* Gradiente para continentes */}
          <linearGradient id="continentGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#c9a574', stopOpacity: 0.4 }} />
            <stop offset="100%" style={{ stopColor: '#c9a574', stopOpacity: 0.15 }} />
          </linearGradient>
          
          {/* Filtro de glow suave */}
          <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* América del Norte */}
        <path
          d="M 140,50 L 160,40 L 180,38 L 200,40 L 220,45 L 240,48 L 260,50 L 265,60 L 270,70 L 272,85 L 270,100 L 268,115 L 265,125 L 258,135 L 250,145 L 240,150 L 225,155 L 210,158 L 195,160 L 180,158 L 165,155 L 155,150 L 145,145 L 138,138 L 132,128 L 128,115 L 125,100 L 123,85 L 122,70 L 125,55 L 130,48 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* América del Sur */}
        <path
          d="M 200,185 L 220,190 L 240,195 L 255,200 L 268,210 L 272,225 L 270,240 L 265,255 L 258,268 L 248,280 L 238,290 L 228,298 L 218,305 L 210,315 L 205,325 L 208,310 L 212,295 L 215,280 L 217,265 L 218,250 L 218,235 L 216,220 L 212,205 L 205,195 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* Europa */}
        <path
          d="M 425,58 L 445,60 L 465,62 L 485,65 L 505,68 L 520,72 L 535,75 L 540,80 L 538,88 L 530,92 L 515,95 L 500,97 L 485,98 L 470,98 L 455,97 L 440,95 L 425,92 L 420,85 L 422,75 L 425,65 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* África */}
        <path
          d="M 420,125 L 445,128 L 470,132 L 495,135 L 510,142 L 518,155 L 520,175 L 518,195 L 515,215 L 510,235 L 502,250 L 490,265 L 475,273 L 460,275 L 445,273 L 435,265 L 428,250 L 423,230 L 420,210 L 418,190 L 418,170 L 418,150 L 420,135 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* Asia */}
        <path
          d="M 545,38 L 580,35 L 615,34 L 650,36 L 685,40 L 710,48 L 720,58 L 722,70 L 720,85 L 715,98 L 708,110 L 700,120 L 688,128 L 673,135 L 655,140 L 638,143 L 620,145 L 600,145 L 580,142 L 565,135 L 555,125 L 548,112 L 545,98 L 545,82 L 545,65 L 545,50 Z M 595,150 L 605,162 L 610,178 L 608,192 L 600,200 L 588,195 L 580,182 L 578,165 L 583,155 Z M 710,115 L 718,125 L 720,138 L 715,148 L 708,143 L 705,130 L 708,120 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* Oceanía (Australia) */}
        <path
          d="M 720,238 L 750,240 L 780,240 L 795,245 L 800,255 L 798,270 L 790,285 L 778,295 L 763,302 L 745,305 L 728,303 L 718,295 L 715,280 L 717,265 L 720,250 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
        
        {/* Nueva Zelanda */}
        <path
          d="M 812,288 L 817,298 L 816,308 L 810,303 L 809,293 Z"
          fill="url(#continentGradient)"
          stroke="#c9a574"
          strokeWidth="0.5"
          filter="url(#softGlow)"
        />
      </svg>
      
      {/* Grid de fondo sutil */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `
          linear-gradient(rgba(201, 165, 116, 0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201, 165, 116, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        pointerEvents: 'none'
      }} />
      
      {/* Marcadores de países con royalties */}
      {displayMarkers.map((marker, index) => (
        <div
          key={`marker-${index}`}
          style={{
            position: 'absolute',
            left: `${(marker.x / 900) * 100}%`,
            top: `${(marker.y / 400) * 100}%`,
            transform: 'translate(-50%, -50%)'
          }}
        >
          {/* Grupo de círculos pulsantes */}
          <div style={{ position: 'relative', width: '80px', height: '80px' }}>
            {/* Pulso exterior amplio */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(201, 165, 116, 0.3) 0%, transparent 70%)',
                animation: `pulse-outer-${index} 3s ease-out infinite`
              }}
            />
            
            {/* Anillo medio */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                border: '2px solid rgba(201, 165, 116, 0.5)',
                animation: `pulse-ring-${index} 2.5s ease-out infinite`
              }}
            />
            
            {/* Círculo principal dorado */}
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #c9a574 0%, #d4b589 100%)',
                boxShadow: `
                  0 0 20px rgba(201, 165, 116, 0.6),
                  0 0 40px rgba(201, 165, 116, 0.3),
                  inset 0 -2px 8px rgba(0, 0, 0, 0.3)
                `,
                animation: `glow-gold 2s ease-in-out infinite`,
                border: '2px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              {/* Punto central brillante */}
              <div
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: '#ffffff',
                  boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
                  animation: 'blink-bright 1.5s ease-in-out infinite'
                }}
              />
            </div>
          </div>
          
          {/* Tooltip moderno */}
          <div style={{
            position: 'absolute',
            top: '-70px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, rgba(26, 35, 50, 0.98) 0%, rgba(15, 20, 25, 0.98) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(201, 165, 116, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            minWidth: '140px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(201, 165, 116, 0.1)',
            pointerEvents: 'none',
            zIndex: 10
          }}>
            {/* País */}
            <div style={{
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              color: '#c9a574',
              marginBottom: '6px',
              fontWeight: '600'
            }}>
              {marker.country}
            </div>
            
            {/* Monto */}
            <div style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#ffffff',
              marginBottom: '4px'
            }}>
              {marker.amount}
            </div>
            
            {/* Streams */}
            <div style={{
              fontSize: '11px',
              color: 'rgba(255, 255, 255, 0.6)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: '#c9a574'
              }} />
              {marker.streams} streams
            </div>
            
            {/* Triángulo del tooltip */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '12px',
              height: '12px',
              background: 'rgba(26, 35, 50, 0.98)',
              border: '1px solid rgba(201, 165, 116, 0.3)',
              borderTop: 'none',
              borderLeft: 'none',
              transform: 'translateX(-50%) rotate(45deg)'
            }} />
          </div>
        </div>
      ))}
      
      {/* Estilos de animación */}
      <style>{`
        @keyframes pulse-outer-0 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-0 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-1 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-2 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-3 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-4 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-4 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-5 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-5 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-6 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-6 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes pulse-outer-7 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.3; }
        }
        @keyframes pulse-ring-7 {
          0%, 100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0; }
          50% { transform: translate(-50%, -50%) scale(1.4); opacity: 0.6; }
        }
        
        @keyframes glow-gold {
          0%, 100% { 
            box-shadow: 
              0 0 20px rgba(201, 165, 116, 0.6),
              0 0 40px rgba(201, 165, 116, 0.3),
              inset 0 -2px 8px rgba(0, 0, 0, 0.3);
          }
          50% { 
            box-shadow: 
              0 0 30px rgba(201, 165, 116, 0.8),
              0 0 60px rgba(201, 165, 116, 0.5),
              inset 0 -2px 8px rgba(0, 0, 0, 0.3);
          }
        }
        
        @keyframes blink-bright {
          0%, 100% { opacity: 0.7; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}