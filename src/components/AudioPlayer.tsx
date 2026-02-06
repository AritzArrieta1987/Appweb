import { Play, Pause, UploadCloud } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface AudioPlayerProps {
  trackId: number;
  audioUrl?: string;
  onUpload: (trackId: number, file: File) => void;
  isPlaying: boolean;
  onPlayPause: (trackId: number) => void;
}

export default function AudioPlayer({ trackId, audioUrl, onUpload, isPlaying, onPlayPause }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log('Playback prevented:', error);
        });
      }
    } else {
      audio.pause();
    }
  }, [isPlaying]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (audioRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      audioRef.current.currentTime = percent * duration;
    }
  };

  const formatTime = (time: number) => {
    if (!isFinite(time) || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(trackId, file);
    }
  };

  if (!audioUrl) {
    return (
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '8px 16px',
        background: 'rgba(201, 165, 116, 0.1)',
        border: '1px solid rgba(201, 165, 116, 0.3)',
        borderRadius: '10px',
        color: '#c9a574',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.2)';
        e.currentTarget.style.transform = 'scale(1.02)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(201, 165, 116, 0.1)';
        e.currentTarget.style.transform = 'scale(1)';
      }}
      onClick={(e) => e.stopPropagation()}
      >
        <UploadCloud size={16} />
        Subir Audio
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </label>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }} onClick={(e) => e.stopPropagation()}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => onPlayPause(trackId)}
      />

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {/* Play/Pause Button */}
        <button
          onClick={() => onPlayPause(trackId)}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #c9a574 0%, #b8956a 100%)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.1)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(201, 165, 116, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isPlaying ? <Pause size={18} fill="#ffffff" /> : <Play size={18} fill="#ffffff" />}
        </button>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Progress Bar */}
          <div
            onClick={handleSeek}
            style={{
              width: '100%',
              height: '6px',
              background: 'rgba(201, 165, 116, 0.2)',
              borderRadius: '3px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <div style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              height: '100%',
              background: 'linear-gradient(90deg, #c9a574 0%, #d4b886 100%)',
              borderRadius: '3px',
              transition: 'width 0.1s linear'
            }} />
          </div>

          {/* Time Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '11px',
            color: '#AFB3B7'
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
