import React, { useRef, useState, useEffect } from 'react';
import { 
  PenTool, 
  Eraser, 
  RotateCcw, 
  Download, 
  Trash2, 
  Smile,
  Sparkles,
  Highlighter
} from 'lucide-react';

const PRESET_COLORS = [
  '#1a1a1e', // Pencil Black
  '#475569', // Slate Gray
  '#dc2626', // Crayon Red
  '#ea580c', // Orange
  '#ca8a04', // Mustard Gold
  '#16a34a', // Grass Green
  '#0284c7', // Sky Blue
  '#7c3aed', // Purple Crayon
  '#db2777', // Marker Pink
  '#854d0e', // Brown Pastel
  '#ffffff', // Chalk White
];

const STICKERS = ['🐸', '🚀', '🐕', '🌙', '💎', '🔥', '👑', '💰', '⚡', '🥑', '🎯', '🍌'];

export const DrawingCanvas = ({ onImageExport, previewUrl }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, eraser, stamp
  const [color, setColor] = useState('#1a1a1e');
  const [brushSize, setBrushSize] = useState(5);
  const [activeSticker, setActiveSticker] = useState('🐸');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear with clean canvas background
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
      ctx.font = `${brushSize * 6}px "Apple Color Emoji", "Segoe UI Emoji", sans-serif`;
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
    ctx.lineWidth = tool === 'eraser' ? brushSize * 4 : brushSize;
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
    link.download = 'hand-drawn-coin.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div style={styles.container} className="sketch-card sketch-card-tilted-left">
      {/* Tape decoration at top */}
      <div style={styles.tape}>
        <span>📌 SKETCHPAD CANVASS</span>
      </div>

      <div style={styles.header}>
        <div style={styles.badge}>
          <PenTool size={18} color="#1a1a1e" />
          <span>Draw Your Coin PFP ✍️</span>
        </div>
        <div style={styles.actions}>
          <button 
            type="button"
            onClick={undo} 
            disabled={historyStep <= 0}
            style={styles.actionBtn}
            title="Undo"
          >
            <RotateCcw size={16} /> Undo
          </button>
          <button 
            type="button"
            onClick={clearCanvas} 
            style={styles.actionBtn}
            title="Clear Canvas"
          >
            <Trash2 size={16} /> Clear
          </button>
          <button 
            type="button"
            onClick={downloadDrawing} 
            style={styles.actionBtn}
            title="Save PNG"
          >
            <Download size={16} /> Save
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div style={styles.canvasOuter}>
        <div style={styles.canvasInner}>
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
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        {/* Tool Mode Selection */}
        <div style={styles.toolModeGroup}>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'brush' ? 'var(--marker-yellow)' : '#ffffff',
              boxShadow: tool === 'brush' ? '2px 2px 0px #1a1a1e' : 'none'
            }}
            onClick={() => setTool('brush')}
          >
            <PenTool size={16} /> Pencil / Brush
          </button>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'eraser' ? 'var(--marker-pink)' : '#ffffff',
              boxShadow: tool === 'eraser' ? '2px 2px 0px #1a1a1e' : 'none'
            }}
            onClick={() => setTool('eraser')}
          >
            <Eraser size={16} /> Eraser
          </button>
          <button
            type="button"
            style={{
              ...styles.toolBtn,
              background: tool === 'stamp' ? 'var(--marker-cyan)' : '#ffffff',
              boxShadow: tool === 'stamp' ? '2px 2px 0px #1a1a1e' : 'none'
            }}
            onClick={() => setTool('stamp')}
          >
            <Smile size={16} /> Stickers
          </button>
        </div>

        {/* Brush Size Slider */}
        <div style={styles.sliderGroup}>
          <span style={styles.sliderLabel}>Stroke Size: <strong>{brushSize}px</strong></span>
          <input
            type="range"
            min="2"
            max="36"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            style={styles.slider}
          />
        </div>

        {/* Color Palette / Sticker Tray */}
        {tool === 'stamp' ? (
          <div style={styles.stickerTray}>
            {STICKERS.map((stk) => (
              <button
                key={stk}
                type="button"
                style={{
                  ...styles.stickerBtn,
                  background: activeSticker === stk ? 'var(--marker-yellow)' : '#ffffff',
                  transform: activeSticker === stk ? 'scale(1.15) rotate(-3deg)' : 'scale(1)'
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
                  outline: color === c && tool === 'brush' ? '3px solid #1a1a1e' : '1.5px solid #94a3b8'
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
    maxWidth: '540px',
    width: '100%',
    position: 'relative',
  },
  tape: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%) rotate(-1deg)',
    background: '#fef08a',
    border: '2px dashed #1a1a1e',
    padding: '2px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#1a1a1e',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '6px',
    flexWrap: 'wrap',
    gap: '8px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  actions: {
    display: 'flex',
    gap: '6px',
  },
  actionBtn: {
    background: '#ffffff',
    border: '2px solid #1a1a1e',
    color: '#1a1a1e',
    borderRadius: '8px',
    padding: '4px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-handwriting)',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    transition: 'all 0.1s',
  },
  canvasOuter: {
    padding: '10px',
    background: '#f8fafc',
    border: '2.5px solid #1a1a1e',
    borderRadius: '12px',
    boxShadow: 'inset 2px 2px 0px rgba(0,0,0,0.05)',
  },
  canvasInner: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1 / 1',
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1.5px dashed #64748b',
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
    gap: '12px',
    marginTop: '4px',
  },
  toolModeGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  toolBtn: {
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '8px 10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: '700',
    fontSize: '16px',
    fontFamily: 'var(--font-handwriting)',
    transition: 'all 0.12s',
  },
  sliderGroup: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  },
  sliderLabel: {
    fontSize: '16px',
    color: '#1a1a1e',
    minWidth: '130px',
  },
  slider: {
    flex: 1,
    accentColor: '#1a1a1e',
    cursor: 'pointer',
  },
  paletteRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '6px',
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
  },
  colorCircle: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  customColorPicker: {
    width: '28px',
    height: '28px',
    borderRadius: '6px',
    border: '2px solid #1a1a1e',
    cursor: 'pointer',
    background: 'none',
    padding: 0,
  },
  stickerTray: {
    display: 'grid',
    gridTemplateColumns: 'repeat(6, 1fr)',
    gap: '8px',
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
    padding: '8px',
  },
  stickerBtn: {
    fontSize: '22px',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '4px',
    cursor: 'pointer',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    transition: 'all 0.1s ease',
  }
};
