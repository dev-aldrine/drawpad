import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, Play, Pause, FastForward, Check, Pen } from '@sketchyicons/react';

// Predefined vector stroke paths for iconic meme coin doodles
const PRESETS = [
  {
    id: 'doge',
    name: 'Doge Wif Hat',
    ticker: '$DOGWIF',
    color: '#ca8a04',
    accent: '#fef08a',
    tag: 'ICONIC MEME',
    paths: [
      // Doge head outline
      { d: 'M 70 130 C 60 90, 90 50, 140 50 C 190 50, 220 90, 210 130 C 225 160, 210 200, 175 210 C 140 220, 100 215, 75 190 C 55 170, 60 145, 70 130 Z', width: 4, color: '#1a1a1e' },
      // Pink / Knit Beanie Hat
      { d: 'M 85 65 Q 140 10 195 65 Q 140 85 85 65 Z', width: 4, color: '#ec4899', fill: 'rgba(244, 114, 182, 0.35)' },
      // Hat Pom-pom
      { d: 'M 140 25 C 130 18, 150 18, 140 25 Z', width: 4, color: '#ec4899' },
      // Left Eye
      { d: 'M 100 115 C 95 110, 115 110, 110 115 C 105 120, 95 120, 100 115 Z', width: 3.5, color: '#1a1a1e', fill: '#1a1a1e' },
      // Right Eye
      { d: 'M 165 115 C 160 110, 180 110, 175 115 C 170 120, 160 120, 165 115 Z', width: 3.5, color: '#1a1a1e', fill: '#1a1a1e' },
      // Eyebrows
      { d: 'M 92 102 Q 105 95 118 102', width: 3, color: '#1a1a1e' },
      { d: 'M 158 102 Q 171 95 184 102', width: 3, color: '#1a1a1e' },
      // Muzzle / Snout
      { d: 'M 120 145 Q 140 130 160 145 Q 140 175 120 145 Z', width: 3, color: '#1a1a1e', fill: '#fef08a' },
      // Nose
      { d: 'M 132 142 Q 140 135 148 142 Q 140 152 132 142 Z', width: 3, color: '#1a1a1e', fill: '#1a1a1e' },
      // Cute Smile
      { d: 'M 125 158 Q 140 168 155 158', width: 3, color: '#1a1a1e' },
      // Whiskers / Cheek blush
      { d: 'M 75 145 L 60 142', width: 2.5, color: '#ca8a04' },
      { d: 'M 75 155 L 58 158', width: 2.5, color: '#ca8a04' },
      { d: 'M 205 145 L 220 142', width: 2.5, color: '#ca8a04' },
      { d: 'M 205 155 L 222 158', width: 2.5, color: '#ca8a04' },
    ]
  },
  {
    id: 'pepe',
    name: 'Smug Pepe',
    ticker: '$PEPE',
    color: '#16a34a',
    accent: '#bbf7d0',
    tag: 'DEGEN KING',
    paths: [
      // Pepe Head
      { d: 'M 60 130 C 55 80, 110 60, 140 60 C 170 60, 225 80, 220 130 C 230 170, 200 205, 140 205 C 80 205, 50 170, 60 130 Z', width: 4, color: '#1a1a1e', fill: 'rgba(134, 239, 172, 0.25)' },
      // Big Frog Eyes - Left
      { d: 'M 75 90 C 70 65, 115 65, 110 90 C 105 110, 75 105, 75 90 Z', width: 3.5, color: '#1a1a1e', fill: '#ffffff' },
      // Big Frog Eyes - Right
      { d: 'M 170 90 C 165 65, 210 65, 205 90 C 200 110, 170 105, 170 90 Z', width: 3.5, color: '#1a1a1e', fill: '#ffffff' },
      // Pupils
      { d: 'M 92 88 C 88 84, 98 84, 96 88 C 94 92, 88 92, 92 88 Z', width: 3, color: '#1a1a1e', fill: '#1a1a1e' },
      { d: 'M 188 88 C 184 84, 194 84, 192 88 C 190 92, 184 92, 188 88 Z', width: 3, color: '#1a1a1e', fill: '#1a1a1e' },
      // Eyelids
      { d: 'M 72 82 Q 95 68 115 85', width: 3, color: '#15803d' },
      { d: 'M 165 85 Q 185 68 208 82', width: 3, color: '#15803d' },
      // Iconic Pepe Smug Lips
      { d: 'M 75 145 C 100 130, 170 130, 205 145 C 215 165, 195 180, 140 180 C 85 180, 65 165, 75 145 Z', width: 3.5, color: '#1a1a1e', fill: '#f87171' },
      // Smug Lip Line
      { d: 'M 78 152 Q 140 162 202 152', width: 3, color: '#1a1a1e' },
      // Nostrils
      { d: 'M 132 132 L 134 135', width: 3, color: '#1a1a1e' },
      { d: 'M 148 132 L 146 135', width: 3, color: '#1a1a1e' },
    ]
  },
  {
    id: 'rocket',
    name: 'To The Moon',
    ticker: '$MOON',
    color: '#0284c7',
    accent: '#bae6fd',
    tag: '100X PUMP',
    paths: [
      // Rocket Body
      { d: 'M 140 35 C 180 80, 185 150, 165 190 L 115 190 C 95 150, 100 80, 140 35 Z', width: 4, color: '#1a1a1e', fill: 'rgba(186, 230, 253, 0.3)' },
      // Rocket Nose Cone
      { d: 'M 140 35 C 160 60, 162 80, 162 80 L 118 80 C 118 80, 120 60, 140 35 Z', width: 3.5, color: '#1a1a1e', fill: '#ef4444' },
      // Window
      { d: 'M 140 110 C 125 110, 125 130, 140 130 C 155 130, 155 110, 140 110 Z', width: 3.5, color: '#1a1a1e', fill: '#67e8f9' },
      // Left Wing Fin
      { d: 'M 108 150 L 75 185 L 114 185 Z', width: 3.5, color: '#1a1a1e', fill: '#ef4444' },
      // Right Wing Fin
      { d: 'M 172 150 L 205 185 L 166 185 Z', width: 3.5, color: '#1a1a1e', fill: '#ef4444' },
      // Flame Exhaust Main
      { d: 'M 125 192 Q 140 240 155 192 Q 140 215 125 192 Z', width: 3, color: '#ea580c', fill: '#f97316' },
      // Inner Yellow Flame
      { d: 'M 132 192 Q 140 220 148 192 Z', width: 2.5, color: '#eab308', fill: '#fef08a' },
      // Stars around
      { d: 'M 60 50 L 64 62 L 76 64 L 66 72 L 68 84 L 58 76 L 48 82 L 52 70 L 42 62 L 54 62 Z', width: 2, color: '#ca8a04', fill: '#fef08a' },
      { d: 'M 215 80 L 218 88 L 226 89 L 220 95 L 221 103 L 214 98 L 207 102 L 210 94 L 203 89 L 211 89 Z', width: 2, color: '#ca8a04', fill: '#fef08a' },
    ]
  },
  {
    id: 'diamond',
    name: 'Diamond Hands',
    ticker: '$HANDS',
    color: '#8b5cf6',
    accent: '#ddd6fe',
    tag: 'HODL HARD',
    paths: [
      // Diamond Facets Outer
      { d: 'M 140 50 L 205 95 L 140 205 L 75 95 Z', width: 4, color: '#1a1a1e', fill: 'rgba(196, 181, 253, 0.35)' },
      // Diamond Table Top Line
      { d: 'M 100 95 L 180 95', width: 3, color: '#1a1a1e' },
      // Diamond Crown Angles
      { d: 'M 140 50 L 100 95', width: 3, color: '#1a1a1e' },
      { d: 'M 140 50 L 180 95', width: 3, color: '#1a1a1e' },
      // Pavilion Lines to Tip
      { d: 'M 100 95 L 140 205', width: 3, color: '#1a1a1e' },
      { d: 'M 180 95 L 140 205', width: 3, color: '#1a1a1e' },
      // Sparkle Gleams
      { d: 'M 215 60 L 225 60 M 220 55 L 220 65', width: 3, color: '#8b5cf6' },
      { d: 'M 55 120 L 67 120 M 61 114 L 61 126', width: 3, color: '#8b5cf6' },
      { d: 'M 205 160 L 217 160 M 211 154 L 211 166', width: 3, color: '#8b5cf6' },
    ]
  }
];

export const MotionDoodleShowcase = ({ onDrawYourOwn }) => {
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0); // 0 to 100
  const [pencilPos, setPencilPos] = useState({ x: 140, y: 50, angle: -35 });
  const [particles, setParticles] = useState([]);
  const [completedStamps, setCompletedStamps] = useState(false);

  const canvasRef = useRef(null);
  const animFrameRef = useRef(null);
  const startTimeRef = useRef(null);

  const currentPreset = PRESETS[selectedIdx];

  // Particle explosion & graphite dust generator
  const spawnInkBurst = useCallback((x, y, color) => {
    const newParticles = [];
    for (let i = 0; i < 6; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1.2 + Math.random() * 2.8;
      newParticles.push({
        id: Math.random(),
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2.5 + Math.random() * 3.5,
        color: color || '#1a1a1e',
        alpha: 1,
        life: 0.95
      });
    }
    setParticles((prev) => [...prev.slice(-40), ...newParticles]);
  }, []);

  // Update particles loop
  useEffect(() => {
    let partTimer = setInterval(() => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            alpha: p.alpha * p.life,
            size: p.size * 0.98
          }))
          .filter((p) => p.alpha > 0.05)
      );
    }, 28);
    return () => clearInterval(partTimer);
  }, []);

  // Main drawing animation timeline loop
  useEffect(() => {
    if (!isPlaying) return;

    let isCancelled = false;
    const durationMs = 3800; // time per sketch

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const pct = Math.min((elapsed / durationMs) * 100, 100);

      setProgress(pct);

      // Estimate current path point for pencil
      const paths = currentPreset.paths;
      const totalPaths = paths.length;
      const pathIdx = Math.min(Math.floor((pct / 100) * totalPaths), totalPaths - 1);
      
      // Calculate approximate point from current path definition
      const curPath = paths[pathIdx];
      if (curPath) {
        const matches = curPath.d.match(/-?\d+(\.\d+)?/g);
        if (matches && matches.length >= 2) {
          const numPairs = matches.length / 2;
          const subProgress = ((pct / 100) * totalPaths) - pathIdx;
          const pairIdx = Math.min(Math.floor(subProgress * numPairs) * 2, matches.length - 2);
          const targetX = parseFloat(matches[pairIdx]) || 140;
          const targetY = parseFloat(matches[pairIdx + 1]) || 120;

          setPencilPos((prev) => {
            const nextX = prev.x + (targetX - prev.x) * 0.35;
            const nextY = prev.y + (targetY - prev.y) * 0.35;
            const angle = Math.atan2(targetY - prev.y, targetX - prev.x) * (180 / Math.PI) - 45;
            return { x: nextX, y: nextY, angle: Math.max(-65, Math.min(15, angle)) };
          });

          // Spawn graphite particles occasionally
          if (Math.random() < 0.35) {
            spawnInkBurst(targetX, targetY, curPath.color);
          }
        }
      }

      if (pct >= 100) {
        setCompletedStamps(true);
        // Pause to admire sketch, then erase & switch to next
        setTimeout(() => {
          if (isCancelled) return;
          setCompletedStamps(false);
          setSelectedIdx((prev) => (prev + 1) % PRESETS.length);
          startTimeRef.current = null;
          setProgress(0);
        }, 1200);
      } else {
        animFrameRef.current = requestAnimationFrame(animate);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      isCancelled = true;
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, selectedIdx, currentPreset, spawnInkBurst]);

  // Handle interactive manual sketch on canvas hover / touch
  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (Math.random() < 0.4) {
      spawnInkBurst(x, y, currentPreset.color);
    }
  };

  const handleNextPreset = () => {
    startTimeRef.current = null;
    setProgress(0);
    setCompletedStamps(false);
    setSelectedIdx((prev) => (prev + 1) % PRESETS.length);
  };

  return (
    <div style={styles.container} className="sketch-card">
      {/* Decorative Washi Tape Header */}
      <div style={{ ...styles.tapeHeader, background: currentPreset.accent }}>
        <span>✏️ LIVE GRAPHIC MOTION • IN-APP MEME INKER</span>
      </div>

      {/* Showcase Top Control Bar */}
      <div style={styles.topControlRow}>
        <div style={styles.presetTabs}>
          {PRESETS.map((preset, idx) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setSelectedIdx(idx);
                startTimeRef.current = null;
                setProgress(0);
                setCompletedStamps(false);
              }}
              style={{
                ...styles.tabBtn,
                background: selectedIdx === idx ? preset.accent : '#ffffff',
                borderColor: selectedIdx === idx ? '#1a1a1e' : '#cbd5e1',
                boxShadow: selectedIdx === idx ? '2px 2px 0px #1a1a1e' : 'none',
                fontWeight: selectedIdx === idx ? '800' : '600',
              }}
            >
              <span>{preset.name}</span>
              <span style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', opacity: 0.75 }}>
                {preset.ticker}
              </span>
            </button>
          ))}
        </div>

        <div style={styles.actionControls}>
          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            style={styles.iconBtn}
            title={isPlaying ? 'Pause Motion' : 'Play Motion'}
          >
            {isPlaying ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button
            type="button"
            onClick={handleNextPreset}
            style={styles.iconBtn}
            title="Next Meme Preset"
          >
            <FastForward size={16} />
          </button>
        </div>
      </div>

      {/* Main Motion Canvas Screen */}
      <div
        style={styles.canvasWrapper}
        onMouseMove={handlePointerMove}
        className="sketch-card animate-wiggle-hover"
      >
        {/* Graph Paper Background Grid Lines */}
        <div style={styles.graphGridOverlay} />

        {/* Live Vector SVG Strokes Tracing */}
        <svg
          viewBox="0 0 280 260"
          style={styles.svgCanvas}
        >
          {currentPreset.paths.map((pathItem, idx) => {
            const totalPaths = currentPreset.paths.length;
            const pathThreshold = (idx / totalPaths) * 100;
            const isDrawn = progress >= pathThreshold;
            const pathLocalProgress = Math.max(0, Math.min(1, (progress - pathThreshold) / (100 / totalPaths)));

            return (
              <motion.path
                key={`${currentPreset.id}-${idx}`}
                d={pathItem.d}
                stroke={pathItem.color}
                strokeWidth={pathItem.width}
                strokeLinecap="round"
                strokeLinejoin="round"
                fill={isDrawn && pathItem.fill ? pathItem.fill : 'none'}
                initial={{ pathLength: 0, opacity: 0.2 }}
                animate={{
                  pathLength: isDrawn ? 1 : pathLocalProgress,
                  opacity: isDrawn ? 1 : pathLocalProgress > 0 ? 0.8 : 0.15,
                }}
                transition={{ duration: 0.1, ease: 'linear' }}
              />
            );
          })}
        </svg>

        {/* Floating Graphite Dust Particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            style={{
              position: 'absolute',
              left: `${p.x}px`,
              top: `${p.y}px`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              borderRadius: '50%',
              backgroundColor: p.color,
              opacity: p.alpha,
              pointerEvents: 'none',
              transform: 'translate(-50%, -50%)',
              boxShadow: `0 0 4px ${p.color}`,
            }}
          />
        ))}

        {/* Animated Sketch Pencil / Ink Pen */}
        {progress < 99 && (
          <motion.div
            style={{
              ...styles.animatedPencil,
              left: `${pencilPos.x}px`,
              top: `${pencilPos.y}px`,
              transform: `translate(-12px, -88px) rotate(${pencilPos.angle}deg)`,
            }}
            animate={{
              scale: [1, 1.05, 0.98, 1],
            }}
            transition={{ repeat: Infinity, duration: 0.24, ease: 'easeInOut' }}
          >
            {/* Hand-drawn styled yellow pencil body */}
            <div style={styles.pencilBody}>
              <div style={styles.pencilEraser} />
              <div style={styles.pencilBand} />
              <div style={styles.pencilWood} />
              <div style={styles.pencilLead} />
            </div>
            <div style={styles.pencilFrictionGlow} />
          </motion.div>
        )}

        {/* Completed Degen Verification Stamp Badge */}
        <AnimatePresence>
          {completedStamps && (
            <motion.div
              initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
              animate={{ scale: 1, opacity: 1, rotate: -6 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 14, stiffness: 220 }}
              style={styles.stampBadge}
            >
              <div style={styles.stampInner}>
                <Check size={18} />
                <span>100% HAND DRAWN</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Live Token Info Watermark */}
        <div style={styles.canvasFooterWatermark}>
          <div style={styles.watermarkTag}>
            <span style={{ color: currentPreset.color, fontWeight: '800' }}>{currentPreset.tag}</span>
            <span>•</span>
            <span>{currentPreset.ticker}</span>
          </div>
          <div style={styles.progressBarWrapper}>
            <div style={{ ...styles.progressBarFill, width: `${progress}%`, background: currentPreset.color }} />
          </div>
        </div>
      </div>

      {/* Action Banner to prompt user to draw */}
      <div style={styles.bottomPromptRow}>
        <div style={styles.promptLeft}>
          <Sparkles size={18} style={{ color: '#ca8a04', flexShrink: 0 }} />
          <span style={styles.promptText}>
            Every stroke is 100% authentic community art. Ready to sketch yours?
          </span>
        </div>
        <button
          type="button"
          onClick={onDrawYourOwn}
          className="sketch-btn sketch-btn-green"
          style={styles.drawNowBtn}
        >
          <Pen size={17} />
          <span>Draw Your Coin Now</span>
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    padding: '28px 24px 20px 24px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    marginTop: '10px',
  },
  tapeHeader: {
    position: 'absolute',
    top: '-13px',
    left: '50%',
    transform: 'translateX(-50%) rotate(-0.5deg)',
    border: '1.5px dashed #1a1a1e',
    padding: '2px 18px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '800',
    letterSpacing: '0.06em',
    color: '#1a1a1e',
  },
  topControlRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '4px',
  },
  presetTabs: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
  },
  tabBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 14px',
    borderRadius: '8px',
    border: '1.5px solid',
    cursor: 'pointer',
    fontFamily: 'var(--font-handwriting)',
    fontSize: '15px',
    color: '#1a1a1e',
    transition: 'all 0.15s ease',
  },
  actionControls: {
    display: 'flex',
    gap: '6px',
  },
  iconBtn: {
    background: '#f8fafc',
    border: '1.5px solid #1a1a1e',
    borderRadius: '8px',
    padding: '6px 10px',
    cursor: 'pointer',
    color: '#1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1px 1px 0px #1a1a1e',
  },
  canvasWrapper: {
    width: '100%',
    height: '270px',
    backgroundColor: '#fafaf9',
    position: 'relative',
    borderRadius: '14px',
    border: '2px solid #1a1a1e',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'crosshair',
    boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.04), 2px 2px 0px #1a1a1e',
  },
  graphGridOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage: `
      linear-gradient(to right, rgba(203, 213, 225, 0.35) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(203, 213, 225, 0.35) 1px, transparent 1px)
    `,
    backgroundSize: '20px 20px',
    pointerEvents: 'none',
  },
  svgCanvas: {
    width: '100%',
    height: '100%',
    maxHeight: '260px',
    filter: 'url(#pencil-stroke)',
  },
  animatedPencil: {
    position: 'absolute',
    pointerEvents: 'none',
    zIndex: 10,
    width: '24px',
    height: '96px',
    transformOrigin: 'bottom center',
    filter: 'drop-shadow(2px 4px 2px rgba(0,0,0,0.25))',
  },
  pencilBody: {
    width: '14px',
    height: '84px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  pencilEraser: {
    width: '14px',
    height: '14px',
    backgroundColor: '#f43f5e',
    borderRadius: '4px 4px 0 0',
    border: '1.5px solid #1a1a1e',
  },
  pencilBand: {
    width: '14px',
    height: '8px',
    backgroundColor: '#cbd5e1',
    borderLeft: '1.5px solid #1a1a1e',
    borderRight: '1.5px solid #1a1a1e',
    borderBottom: '1px solid #64748b',
  },
  pencilWood: {
    width: '14px',
    height: '46px',
    backgroundColor: '#f59e0b',
    borderLeft: '1.5px solid #1a1a1e',
    borderRight: '1.5px solid #1a1a1e',
    backgroundImage: 'linear-gradient(90deg, #d97706 0%, #fbbf24 50%, #b45309 100%)',
  },
  pencilLead: {
    width: 0,
    height: 0,
    borderLeft: '7px solid transparent',
    borderRight: '7px solid transparent',
    borderTop: '16px solid #fde68a',
    position: 'relative',
    borderBottom: 'none',
  },
  pencilFrictionGlow: {
    position: 'absolute',
    bottom: '-3px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '6px',
    height: '6px',
    backgroundColor: '#1a1a1e',
    borderRadius: '50%',
  },
  stampBadge: {
    position: 'absolute',
    top: '20px',
    right: '24px',
    zIndex: 20,
    pointerEvents: 'none',
  },
  stampInner: {
    background: '#dcfce7',
    border: '2.5px solid #16a34a',
    color: '#15803d',
    padding: '6px 14px',
    borderRadius: '8px',
    fontWeight: '900',
    fontFamily: 'var(--font-mono)',
    fontSize: '13px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    boxShadow: '3px 3px 0px rgba(22, 163, 74, 0.4)',
    letterSpacing: '0.05em',
  },
  canvasFooterWatermark: {
    position: 'absolute',
    bottom: '10px',
    left: '16px',
    right: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  watermarkTag: {
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(4px)',
    border: '1.5px solid #1a1a1e',
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    color: '#1a1a1e',
  },
  progressBarWrapper: {
    width: '120px',
    height: '7px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    border: '1px solid #1a1a1e',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    transition: 'width 0.1s linear',
  },
  bottomPromptRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    borderTop: '1.5px dashed #cbd5e1',
    paddingTop: '12px',
  },
  promptLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: '1 1 260px',
  },
  promptText: {
    fontSize: '15px',
    color: '#475569',
    fontWeight: '600',
    fontFamily: 'var(--font-handwriting)',
  },
  drawNowBtn: {
    padding: '9px 18px',
    fontSize: '16px',
  }
};
