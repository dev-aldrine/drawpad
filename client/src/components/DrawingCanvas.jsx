import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Download, 
  Trash2, 
  Palette, 
  Sparkles,
  Smile,
  Rocket,
  Flame,
  Zap,
  DollarSign,
  Crown
} from 'lucide-react';

const PRESET_COLORS = [
  '#000000', '#ffffff', '#ef4444', '#f97316', 
  '#f59e0b', '#10b981', '#06b6d4', '#3b82f6', 
  '#8b5cf6', '#ec4899', '#78350f', '#64748b'
];

const STICKERS = ['🚀', '💎', '🐸', '🐕', '🌙', '🔥', '👑', '💰', '⚡', '🛸', '🥑', '🎯'];

export const DrawingCanvas = ({ onImageExport, previewUrl }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, eraser, stamp
  const [color, setColor] = useState('#10b981');
  const [brushSize, setBrushSize] = useState(6);
  const [activeSticker, setActiveSticker] = useState('🐸');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Set white background by default for clean memecoin PFP
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Save initial state
    saveState();
  }, []);

  const saveState = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const snapshot = canvas.toDataURL('image/png');
    setHistory((prev) => {
      const nextHistory = prev.slice(0, historyStep + 1);
      return [...nextHistory, snapshot];
    });
    setHistoryStep((prev) => prev + 1);
    
    // Export data URL to parent
    if (onImageExport) {
      onImageExport(snapshot);
    }
  };

  const undo = () => {
    if (historyStep <= 0) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newStep = historyStep - 1;
    const img = new Image();
    img.src = history[newStep];
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHistoryStep(newStep);
      if (onImageExport) {
        onImageExport(history[newStep]);
      }
    };
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches && e.touches[0]) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDrawing = (e) => {
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (tool === 'stamp') {
      ctx.font = `${brushSize * 5}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(activeSticker, x, y);
      saveState();
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : color;
    ctx.lineWidth = tool === 'eraser' ? brushSize * 3 : brushSize;
  };

  const draw = (e) => {
    if (!isDrawing || tool === 'stamp') return;
    const { x, y } = getCoordinates(e);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.closePath();
      setIsDrawing(false);
      saveState();
    }
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    const link = document.createElement('a');
    link.download = 'drawpad-token-pfp.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <div style={styles.badge}>
          <PenTool size={16} color="#10b981" />
          <span>Draw Your Coin Logo</span>
        </div>
        <div style={styles.actions}>
          <button 
            type="button"
            onClick={undo} 
            disabled={historyStep <= 0}
            style={styles.actionBtn}
            title="Undo"
          >
            <RotateCcw size={16} />
          </button>
          <button 
            type="button"
            onClick={clearCanvas} 
            style={styles.actionBtn}
            title="Clear Canvas"
          >
            <Trash2 size={16} />
          </button>
          <button 
            type="button"
            onClick={downloadDrawing} 
            style={styles.actionBtn}
            title="Download PNG"
          >
            <Download size={16} />
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={styles.canvasWrapper}>
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          style={styles.canvas}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Tool Mode Selection */}
        <div style={styles.toolModeGroup}>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'brush' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
              borderColor: tool === 'brush' ? '#10b981' : 'rgba(255,255,255,0.1)',
              color: tool === 'brush' ? '#10b981' : '#94a3b8'
            }}
            onClick={() => setTool('brush')}
          >
            <PenTool size={16} /> Brush
          </button>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'eraser' ? 'rgba(239, 68, 68, 0.2)' : 'transparent',
              borderColor: tool === 'eraser' ? '#ef4444' : 'rgba(255,255,255,0.1)',
              color: tool === 'eraser' ? '#ef4444' : '#94a3b8'
            }}
            onClick={() => setTool('eraser')}
          >
            <Eraser size={16} /> Eraser
          </button>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'stamp' ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
              borderColor: tool === 'stamp' ? '#8b5cf6' : 'rgba(255,255,255,0.1)',
              color: tool === 'stamp' ? '#8b5cf6' : '#94a3b8'
            }}
            onClick={() => setTool('stamp')}
          >
            <Smile size={16} /> Stickers
          </button>
        </div>

        {/* Brush Size Slider */}
        <div style={styles.sliderGroup}>
          <span style={styles.sliderLabel}>Size: {brushSize}px</span>
          <input
            type="range"
            min="2"
            max="40"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        {/* Palette / Sticker Tray */}
        {tool === 'stamp' ? (
          <div style={styles.stickerTray}>
            {STICKERS.map((stk) => (
              <button
                key={stk}
                type="button"
                style={{
                  ...styles.stickerBtn,
                  background: activeSticker === stk ? 'rgba(139, 92, 246, 0.3)' : 'rgba(255,255,255,0.05)',
                  transform: activeSticker === stk ? 'scale(1.15)' : 'scale(1)'
                }}
                onClick={() => setActiveSticker(stk)}
              >
                {stk}
              </button>
            ))}
          </div>
        ) : (
          <div style={styles.paletteRow}>
            {PRESET_COLORS.map((c) => (
              <div
                key={c}
                onClick={() => {
                  setColor(c);
                  if (tool === 'eraser') setTool('brush');
                }}
                style={{
                  ...styles.colorCircle,
                  backgroundColor: c,
                  outline: color === c && tool === 'brush' ? '3px solid #38bdf8' : '1px solid rgba(255,255,255,0.2)'
                }}
              />
            ))}
            <input
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (tool === 'eraser') setTool('brush');
              }}
              style={styles.customColorPicker}
              title="Custom Color"
            />
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '560px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#cbd5e1',
    borderRadius: '8px',
    padding: '8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s',
  },
  canvasWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
    border: '2px dashed rgba(255, 255, 255, 0.15)',
    backgroundColor: '#ffffff',
  },
  canvas: {
    width: '100%',
    height: '100%',
    display: 'block',
    cursor: 'crosshair',
    touchAction: 'none',
  },
  toolbar: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },
  toolModeGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  toolBtn: {
    border: '1px solid',
    borderRadius: '10px',
    padding: '10px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all 0.2s',
  },
  sliderGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    padding: '0 4px',
  },
  sliderLabel: {
    fontSize: '13px',
    color: '#94a3b8',
    fontFamily: 'var(--font-mono)',
    minWidth: '90px',
  },
  slider: {
    flex: 1,
    accentColor: '#10b981',
    cursor: 'pointer',
  },
  paletteRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: '4px',
  },
  colorCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  customColorPicker: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    background: 'none',
  },
  stickerTray: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
  },
  stickerBtn: {
    fontSize: '22px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '6px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  }
};
