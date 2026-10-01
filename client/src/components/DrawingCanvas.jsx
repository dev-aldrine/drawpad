import React, { useRef, useState, useEffect } from 'react';
import FuseButton from './FuseButton';
import { 
  Pen, 
  Eraser, 
  Undo, 
  Download, 
  Shapes,
  ArrowRight,
  ArrowLeft
} from '@sketchyicons/react';

const PRESET_COLORS = [
  '#1a1a1e', // Pencil Black
  '#475569', // Graphite Gray
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

const SKETCH_STAMPS = [
  { id: 'star', label: 'Star', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    for (let i = 0; i < 5; i++) {
      ctx.lineTo(Math.cos((18 + i * 72) * Math.PI / 180) * s + x, -Math.sin((18 + i * 72) * Math.PI / 180) * s + y);
      ctx.lineTo(Math.cos((54 + i * 72) * Math.PI / 180) * (s/2) + x, -Math.sin((54 + i * 72) * Math.PI / 180) * (s/2) + y);
    }
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.stroke();
  }},
  { id: 'heart', label: 'Heart', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    ctx.moveTo(x, y + s/4);
    ctx.bezierCurveTo(x, y, x - s/2, y - s/2, x - s/2, y + s/4);
    ctx.bezierCurveTo(x - s/2, y + s*0.7, x, y + s, x, y + s*1.2);
    ctx.bezierCurveTo(x, y + s, x + s/2, y + s*0.7, x + s/2, y + s/4);
    ctx.bezierCurveTo(x + s/2, y - s/2, x, y, x, y + s/4);
    ctx.lineWidth = 3;
    ctx.stroke();
  }},
  { id: 'moon', label: 'Moon', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    ctx.arc(x, y, s, 0.5 * Math.PI, 1.5 * Math.PI, true);
    ctx.arc(x - s * 0.3, y, s * 0.8, 1.5 * Math.PI, 0.5 * Math.PI, false);
    ctx.lineWidth = 3;
    ctx.stroke();
  }},
  { id: 'lightning', label: 'Bolt', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    ctx.moveTo(x + s*0.2, y - s);
    ctx.lineTo(x - s*0.4, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x - s*0.2, y + s);
    ctx.lineTo(x + s*0.5, y - s*0.1);
    ctx.lineTo(x + s*0.1, y - s*0.1);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.stroke();
  }},
  { id: 'cloud', label: 'Cloud', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    ctx.arc(x - s*0.4, y, s*0.4, Math.PI * 0.5, Math.PI * 1.5);
    ctx.arc(x, y - s*0.3, s*0.5, Math.PI * 1.0, Math.PI * 2.0);
    ctx.arc(x + s*0.4, y, s*0.4, Math.PI * 1.5, Math.PI * 0.5);
    ctx.closePath();
    ctx.lineWidth = 3;
    ctx.stroke();
  }},
  { id: 'circle-cross', label: 'Target', draw: (ctx, x, y, s) => {
    ctx.beginPath();
    ctx.arc(x, y, s*0.8, 0, 2 * Math.PI);
    ctx.moveTo(x - s, y);
    ctx.lineTo(x + s, y);
    ctx.moveTo(x, y - s);
    ctx.lineTo(x, y + s);
    ctx.lineWidth = 3;
    ctx.stroke();
  }}
];

export const DrawingCanvas = ({ onImageExport, onNext, onBack, initialImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState('brush'); // brush, eraser, stamp
  const [color, setColor] = useState('#1a1a1e');
  const [brushSize, setBrushSize] = useState(6);
  const [activeStamp, setActiveStamp] = useState('star');
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);
  const [hasDrawn, setHasDrawn] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    if (initialImage) {
      const img = new Image();
      img.src = initialImage;
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        saveState();
        setHasDrawn(true);
      };
    } else {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      saveState();
    }
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

  const preClearStateRef = useRef(null);

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
    if (!canvas) return;
    // Save current snapshot before clearing so "Undo Clear" can restore it
    preClearStateRef.current = canvas.toDataURL('image/png');

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
    saveState();
  };

  const undoClear = () => {
    if (!preClearStateRef.current) {
      undo();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = preClearStateRef.current;
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      setHasDrawn(true);
      saveState();
    };
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
    setHasDrawn(true);

    if (tool === 'stamp') {
      const stampObj = SKETCH_STAMPS.find(s => s.id === activeStamp);
      if (stampObj) {
        ctx.strokeStyle = color;
        stampObj.draw(ctx, x, y, brushSize * 4);
        saveState();
      }
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
    <div style={styles.container} className="sketch-card">
      <div style={styles.tape}>
        <span>STEP 1 OF 2 • ARTWORK STUDIO</span>
      </div>

      <div style={styles.header}>
        <div>
          <h2 style={styles.title}>Draw your Coin Artwork</h2>
          <p style={styles.subtitle}>Doodle your coin PFP below. When you're ready, proceed to add token info.</p>
        </div>
        <div style={styles.actions}>
          <button 
            type="button"
            onClick={undo} 
            disabled={historyStep <= 0}
            style={styles.actionBtn}
            title="Undo"
          >
            <Undo size={16} /> Undo
          </button>
          
          <FuseButton
            label="Clear"
            undoLabel="Undo Clear"
            doneLabel="Cleared"
            color="#1a1a1e"
            background="#fef2f2"
            fuseColor="#ef4444"
            size="sm"
            radius={8}
            undoWindow={4000}
            fuse="bottom"
            fuseThickness={2.5}
            commitOn="press"
            onCommit={clearCanvas}
            onUndo={undoClear}
          />

          <button 
            type="button"
            onClick={downloadDrawing} 
            style={styles.actionBtn}
            title="Save PNG"
          >
            <Download size={16} /> Save PNG
          </button>
        </div>
      </div>

      {/* Main Studio Centerpiece */}
      <div style={styles.studioLayout}>
        {/* Canvas */}
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

        {/* Studio Controls Column */}
        <div style={styles.controlsCol}>
          {/* Tool Mode Selection */}
          <div style={styles.sectionBox}>
            <span style={styles.sectionLabel}>Drawing Tool</span>
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
                <Pen size={18} /> Pencil
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
                <Eraser size={18} /> Eraser
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
                <Shapes size={18} /> Stamps
              </button>
            </div>
          </div>

          {/* Stroke Size Slider */}
          <div style={styles.sectionBox}>
            <div style={styles.sliderHeader}>
              <span style={styles.sectionLabel}>Stroke Width</span>
              <span style={styles.sliderValue}>{brushSize}px</span>
            </div>
            <input
              type="range"
              min="2"
              max="36"
              value={brushSize}
              onChange={(e) => setBrushSize(Number(e.target.value))}
              style={styles.slider}
            />
          </div>

          {/* Color Palette or Stamp Tray */}
          <div style={styles.sectionBox}>
            <span style={styles.sectionLabel}>
              {tool === 'stamp' ? 'Select Stamp Shape' : 'Pencil Colors'}
            </span>
            {tool === 'stamp' ? (
              <div style={styles.stampTray}>
                {SKETCH_STAMPS.map((stk) => (
                  <button
                    key={stk.id}
                    type="button"
                    style={{
                      ...styles.stampBtn,
                      background: activeStamp === stk.id ? 'var(--marker-yellow)' : '#ffffff',
                      transform: activeStamp === stk.id ? 'scale(1.05)' : 'scale(1)',
                      fontWeight: activeStamp === stk.id ? '700' : '500'
                    }}
                    onClick={() => setActiveStamp(stk.id)}
                  >
                    {stk.label}
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
      </div>

      {/* Navigation Footer */}
      <div style={styles.navFooter}>
        <button
          type="button"
          onClick={onBack}
          className="sketch-btn"
          style={styles.backBtn}
        >
          <ArrowLeft size={18} />
          <span>Back to Intro</span>
        </button>

        <button
          type="button"
          onClick={onNext}
          className="sketch-btn sketch-btn-green"
          style={styles.nextBtn}
        >
          <span>Next: Token Details</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '32px 28px 24px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  tape: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%) rotate(-0.5deg)',
    background: '#fef08a',
    border: '2px dashed #1a1a1e',
    padding: '2px 16px',
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
    flexWrap: 'wrap',
    gap: '12px',
  },
  title: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  subtitle: {
    fontSize: '16px',
    color: '#64748b',
  },
  actions: {
    display: 'flex',
    gap: '8px',
  },
  actionBtn: {
    background: '#ffffff',
    border: '2px solid #1a1a1e',
    color: '#1a1a1e',
    borderRadius: '8px',
    padding: '6px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-handwriting)',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  studioLayout: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '24px',
    alignItems: 'start',
  },
  canvasOuter: {
    padding: '12px',
    background: '#f8fafc',
    border: '2.5px solid #1a1a1e',
    borderRadius: '14px',
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
  controlsCol: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  sectionBox: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '12px',
    padding: '14px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sectionLabel: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  toolModeGroup: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  toolBtn: {
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '10px 8px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    fontWeight: '700',
    fontSize: '15px',
    fontFamily: 'var(--font-handwriting)',
  },
  sliderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sliderValue: {
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  slider: {
    width: '100%',
    accentColor: '#1a1a1e',
    cursor: 'pointer',
  },
  paletteRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    alignItems: 'center',
  },
  colorCircle: {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    cursor: 'pointer',
    transition: 'transform 0.1s ease',
  },
  customColorPicker: {
    width: '30px',
    height: '30px',
    borderRadius: '6px',
    border: '2px solid #1a1a1e',
    cursor: 'pointer',
    background: 'none',
    padding: 0,
  },
  stampTray: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
  },
  stampBtn: {
    fontSize: '14px',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '8px 4px',
    cursor: 'pointer',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    fontFamily: 'var(--font-handwriting)',
    textAlign: 'center',
  },
  navFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '2px dashed #cbd5e1',
    paddingTop: '16px',
    marginTop: '8px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backBtn: {
    padding: '10px 20px',
    fontSize: '17px',
  },
  nextBtn: {
    padding: '12px 28px',
    fontSize: '18px',
  }
};
