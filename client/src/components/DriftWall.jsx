import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import './DriftWall.css';

// Hand-drawn crypto meme SVG doodles (Pepe, Doge, Wojak, Bonk, Moon Rocket, Diamond Hands, Solana Cat, etc.)
const createMemeSvg = (type, label, bg = '#fef08a') => {
  let svgContent = '';
  if (type === 'pepe') {
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Pepe Frog hand-drawn head -->
        <path d="M 20,55 C 15,35 25,18 50,18 C 75,18 85,35 80,55 C 75,68 65,72 50,72 C 35,72 25,68 20,55 Z" fill="#86efac" stroke="#1a1a1e" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Big Eyes -->
        <ellipse cx="38" cy="30" rx="14" ry="12" fill="#ffffff" stroke="#1a1a1e" stroke-width="2.2"/>
        <ellipse cx="62" cy="30" rx="14" ry="12" fill="#ffffff" stroke="#1a1a1e" stroke-width="2.2"/>
        <circle cx="42" cy="30" r="4.5" fill="#1a1a1e"/>
        <circle cx="58" cy="30" r="4.5" fill="#1a1a1e"/>
        <circle cx="44" cy="28" r="1.5" fill="#ffffff"/>
        <circle cx="60" cy="28" r="1.5" fill="#ffffff"/>
        <!-- Sad Pepe Lips -->
        <path d="M 26,52 C 38,62 62,62 74,52" fill="none" stroke="#dc2626" stroke-width="3" stroke-linecap="round"/>
        <path d="M 28,58 C 38,68 62,68 72,58" fill="none" stroke="#1a1a1e" stroke-width="2" stroke-linecap="round"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  } else if (type === 'doge') {
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Doge Head -->
        <circle cx="50" cy="42" r="26" fill="#fed7aa" stroke="#1a1a1e" stroke-width="2.5"/>
        <!-- Ears -->
        <path d="M 28,26 L 34,8 L 46,20 Z" fill="#f97316" stroke="#1a1a1e" stroke-width="2.2"/>
        <path d="M 72,26 L 66,8 L 54,20 Z" fill="#f97316" stroke="#1a1a1e" stroke-width="2.2"/>
        <!-- Snout -->
        <ellipse cx="50" cy="48" rx="12" ry="9" fill="#ffedd5" stroke="#1a1a1e" stroke-width="2"/>
        <polygon points="46,44 54,44 50,50" fill="#1a1a1e"/>
        <!-- Doge Side-Eye -->
        <circle cx="39" cy="36" r="4" fill="#1a1a1e"/>
        <circle cx="61" cy="36" r="4" fill="#1a1a1e"/>
        <path d="M 46,55 Q 50,58 54,55" fill="none" stroke="#1a1a1e" stroke-width="2"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  } else if (type === 'wojak') {
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Wojak Bald Head -->
        <ellipse cx="50" cy="40" rx="24" ry="28" fill="#f1f5f9" stroke="#1a1a1e" stroke-width="2.5"/>
        <!-- Big Teary Eyes -->
        <ellipse cx="40" cy="36" rx="6" ry="5" fill="#ffffff" stroke="#1a1a1e" stroke-width="2"/>
        <ellipse cx="60" cy="36" rx="6" ry="5" fill="#ffffff" stroke="#1a1a1e" stroke-width="2"/>
        <circle cx="41" cy="36" r="2.5" fill="#1a1a1e"/>
        <circle cx="59" cy="36" r="2.5" fill="#1a1a1e"/>
        <!-- Tears -->
        <path d="M 40,42 Q 38,50 40,54" fill="none" stroke="#38bdf8" stroke-width="2.5" stroke-linecap="round"/>
        <!-- Sad mouth -->
        <path d="M 38,58 Q 50,50 62,58" fill="none" stroke="#1a1a1e" stroke-width="2.2" stroke-linecap="round"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  } else if (type === 'rocket') {
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Rocket Body -->
        <path d="M 50,12 C 60,25 65,45 62,58 L 38,58 C 35,45 40,25 50,12 Z" fill="#bae6fd" stroke="#1a1a1e" stroke-width="2.5"/>
        <!-- Fins -->
        <path d="M 38,48 L 26,58 L 38,58 Z" fill="#f87171" stroke="#1a1a1e" stroke-width="2"/>
        <path d="M 62,48 L 74,58 L 62,58 Z" fill="#f87171" stroke="#1a1a1e" stroke-width="2"/>
        <!-- Porthole -->
        <circle cx="50" cy="34" r="6" fill="#ffffff" stroke="#1a1a1e" stroke-width="2"/>
        <!-- Fire -->
        <polygon points="44,59 50,72 56,59" fill="#f59e0b" stroke="#1a1a1e" stroke-width="1.8"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  } else if (type === 'bonk') {
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Shiba with Baseball Bat -->
        <circle cx="44" cy="42" r="20" fill="#fde047" stroke="#1a1a1e" stroke-width="2.2"/>
        <path d="M 28,30 L 32,18 L 40,26 Z" fill="#ca8a04" stroke="#1a1a1e" stroke-width="2"/>
        <path d="M 56,30 L 52,18 L 44,26 Z" fill="#ca8a04" stroke="#1a1a1e" stroke-width="2"/>
        <!-- Wooden Bat -->
        <rect x="58" y="16" width="28" height="8" rx="4" transform="rotate(35 58 16)" fill="#d97706" stroke="#1a1a1e" stroke-width="2"/>
        <!-- Eyes & Nose -->
        <circle cx="36" cy="40" r="2.5" fill="#1a1a1e"/>
        <circle cx="48" cy="40" r="2.5" fill="#1a1a1e"/>
        <polygon points="40,46 44,46 42,49" fill="#1a1a1e"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  } else {
    // Solana Diamond Hand
    svgContent = `
      <svg viewBox="0 0 100 80" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
        <rect width="100" height="80" fill="${bg}" />
        <!-- Big Diamond -->
        <polygon points="50,16 74,32 50,62 26,32" fill="#a7f3d0" stroke="#1a1a1e" stroke-width="2.5"/>
        <polygon points="50,16 62,32 50,62 38,32" fill="#6ee7b7" stroke="#1a1a1e" stroke-width="1.8"/>
        <line x1="26" y1="32" x2="74" y2="32" stroke="#1a1a1e" stroke-width="2"/>
        <!-- Sparkles -->
        <path d="M 20,20 L 22,24 L 20,28 L 18,24 Z" fill="#ca8a04"/>
        <path d="M 80,48 L 82,52 L 80,56 L 78,52 Z" fill="#ca8a04"/>
        <text x="50" y="76" font-size="8" font-weight="bold" font-family="sans-serif" text-anchor="middle" fill="#1a1a1e">${label}</text>
      </svg>
    `;
  }
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgContent.trim())}`;
};

const MEME_DOODLE_ITEMS = [
  { image: createMemeSvg('pepe', '$PEPE', '#fef08a'), title: 'Pepe Sketch' },
  { image: createMemeSvg('doge', '$DOGE', '#fed7aa'), title: 'Doge Dood' },
  { image: createMemeSvg('wojak', '$FEELS', '#fbcfe8'), title: 'Feels Guy' },
  { image: createMemeSvg('bonk', '$BONK', '#fef9c3'), title: 'Bonk Dog' },
  { image: createMemeSvg('rocket', '$PUMP', '#bae6fd'), title: 'Pump Rocket' },
  { image: createMemeSvg('diamond', '$HODL', '#bbf7d0'), title: 'Diamond Hands' },
  { image: createMemeSvg('pepe', '$FROG', '#bbf7d0'), title: 'Froggy' },
  { image: createMemeSvg('doge', '$SHIB', '#fed7aa'), title: 'Shiba Inker' },
  { image: createMemeSvg('wojak', '$MOON', '#bae6fd'), title: 'Moon Chad' },
  { image: createMemeSvg('bonk', '$SMACK', '#fef08a'), title: 'Smack' },
  { image: createMemeSvg('rocket', '$SOL', '#c4b5fd'), title: 'Solana Orbit' },
  { image: createMemeSvg('diamond', '$WAGMI', '#fbcfe8'), title: 'Wagmi Gem' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const columnFactor = (index, variance) => {
  const pseudo = ((index * 0.6180339887 + 0.35) % 1) * 2 - 1;
  return 1 + variance * pseudo;
};

const DriftWall = ({
  items = MEME_DOODLE_ITEMS,
  columns = 6,
  tileWidth = 170,
  tileHeight = 120,
  gap = 24,
  radius = 12,
  tilt = 14,
  turn = -10,
  roll = 0,
  perspective = 1800,
  depth = 60,
  speed = 34,
  direction = 'up',
  variance = 0.4,
  parallax = 0.5,
  pauseOnHover = false,
  lift = 42,
  fade = 0.45,
  dim = 0.75,
  grayscale = false,
  overlayColor = '#fbf6ea',
  className = '',
  style
}) => {
  const containerRef = useRef(null);
  const planeRef = useRef(null);
  const trackRefs = useRef([]);
  const rafRef = useRef(null);

  const offsetsRef = useRef([]);
  const velocitiesRef = useRef([]);
  const hoveredColRef = useRef(-1);
  const wallHoveredRef = useRef(false);
  const pointerRef = useRef({ x: 0, y: 0 });
  const pointerDampedRef = useRef({ x: 0, y: 0 });
  const lastTsRef = useRef(null);

  const [containerHeight, setContainerHeight] = useState(600);
  const [activeId, setActiveId] = useState(null);
  const activeIdRef = useRef(null);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = e => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const columnItems = useMemo(() => {
    const cols = Array.from({ length: columns }, () => []);
    items.forEach((item, i) => cols[i % columns].push(item));
    return cols.map(col => (col.length ? col : items.slice(0, 1)));
  }, [items, columns]);

  const columnMeta = useMemo(() => {
    const unit = tileHeight + gap;
    return columnItems.map(col => {
      const copyHeight = Math.max(unit, col.length * unit);
      const copies = Math.max(2, Math.ceil((containerHeight * 1.6) / copyHeight) + 1);
      return { copyHeight, copies };
    });
  }, [columnItems, tileHeight, gap, containerHeight]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(([entry]) => {
      setContainerHeight(entry.contentRect.height || 600);
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  const baseVelocities = useMemo(() => {
    const dirSign = direction === 'up' ? 1 : -1;
    return columnItems.map((_, c) => {
      const altSign = c % 2 === 0 ? 1 : -1;
      return speed * columnFactor(c, variance) * dirSign * altSign;
    });
  }, [columnItems, speed, direction, variance]);

  useEffect(() => {
    offsetsRef.current = columnMeta.map((meta, c) => meta.copyHeight * ((c * 0.37) % 1));
    velocitiesRef.current = columnItems.map(() => 0);
  }, [columnMeta, columnItems]);

  const applyPlaneTransform = useCallback(
    (px, py) => {
      const plane = planeRef.current;
      if (!plane) return;
      plane.style.transform =
        `translate(-50%, -50%) scale(1.18) ` +
        `rotateX(${tilt + py}deg) rotateY(${turn + px}deg) rotateZ(${roll}deg) ` +
        `translateZ(${-depth}px)`;
    },
    [tilt, turn, roll, depth]
  );

  useEffect(() => {
    const animate = ts => {
      if (lastTsRef.current === null) lastTsRef.current = ts;
      const dt = Math.min(0.05, Math.max(0, ts - lastTsRef.current) / 1000);
      lastTsRef.current = ts;

      const maxTilt = parallax * 8;
      const targetX = pointerRef.current.x * maxTilt;
      const targetY = -pointerRef.current.y * maxTilt;
      const damp = 1 - Math.exp(-dt / 0.12);
      pointerDampedRef.current.x += (targetX - pointerDampedRef.current.x) * damp;
      pointerDampedRef.current.y += (targetY - pointerDampedRef.current.y) * damp;
      applyPlaneTransform(pointerDampedRef.current.x, pointerDampedRef.current.y);

      if (!reduced) {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const meta = columnMeta[c];
          if (!meta) continue;
          const paused = wallHoveredRef.current && pauseOnHover;
          const factor = paused || hoveredColRef.current === c ? 0 : 1;
          const target = baseVelocities[c] * factor;

          const ease = 1 - Math.exp(-dt / (target === 0 ? 0.16 : 0.28));
          velocitiesRef.current[c] += (target - velocitiesRef.current[c]) * ease;
          let next = (offsetsRef.current[c] ?? 0) + velocitiesRef.current[c] * dt;
          next = ((next % meta.copyHeight) + meta.copyHeight) % meta.copyHeight;
          offsetsRef.current[c] = next;

          const el = trackRefs.current[c];
          if (el) el.style.transform = `translate3d(0, ${-next}px, 0)`;
        }
      } else {
        for (let c = 0; c < trackRefs.current.length; c++) {
          const el = trackRefs.current[c];
          const meta = columnMeta[c];
          if (el && meta) el.style.transform = `translate3d(0, ${-(offsetsRef.current[c] ?? 0)}px, 0)`;
        }
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      lastTsRef.current = null;
    };
  }, [baseVelocities, columnMeta, pauseOnHover, parallax, reduced, applyPlaneTransform]);

  const activate = useCallback((id, index) => {
    activeIdRef.current = id;
    hoveredColRef.current = index;
    setActiveId(id);
  }, []);
  const release = useCallback(() => {
    activeIdRef.current = null;
    hoveredColRef.current = -1;
    setActiveId(null);
  }, []);

  const handlePointerMove = useCallback(
    e => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      if (parallax > 0 && !reduced) {
        pointerRef.current = {
          x: (e.clientX - rect.left) / rect.width - 0.5,
          y: (e.clientY - rect.top) / rect.height - 0.5
        };
      }
      const hit = document.elementFromPoint(e.clientX, e.clientY);
      const tile = hit && hit.closest ? hit.closest('[data-tile-id]') : null;
      if (!tile) return;
      const id = tile.dataset.tileId;
      if (id === activeIdRef.current) return;
      activeIdRef.current = id;
      hoveredColRef.current = Number(tile.dataset.col);
      setActiveId(id);
    },
    [parallax, reduced]
  );

  const handlePointerLeaveWall = useCallback(() => {
    wallHoveredRef.current = false;
    pointerRef.current = { x: 0, y: 0 };
    release();
  }, [release]);

  const cssVars = useMemo(
    () => ({
      '--dw-tile-w': `${tileWidth}px`,
      '--dw-tile-h': `${tileHeight}px`,
      '--dw-gap': `${gap}px`,
      '--dw-radius': `${radius}px`,
      '--dw-perspective': `${perspective}px`,
      '--dw-lift': `${lift}px`,
      '--dw-dim': dim,
      '--dw-gray': grayscale ? 1 : 0,
      '--dw-overlay': overlayColor,
      '--dw-edge': `${Math.max(0, (1 - fade) * 100)}%`,
      ...style
    }),
    [tileWidth, tileHeight, gap, radius, perspective, lift, dim, grayscale, overlayColor, fade, style]
  );

  const renderTile = (item, id, colIndex) => {
    const inner = (
      <span className="drift-wall__inner">
        <img src={item.image} alt={item.title ?? ''} loading="lazy" decoding="async" draggable={false} />
        <span className="drift-wall__overlay" aria-hidden="true" />
      </span>
    );
    const commonProps = {
      className: `drift-wall__tile${activeId === id ? ' is-active' : ''}`,
      'data-tile-id': id,
      'data-col': colIndex,
      onFocus: () => activate(id, colIndex),
      onBlur: release
    };
    if (item.href) {
      return (
        <a key={id} href={item.href} target="_blank" rel="noreferrer noopener" {...commonProps}>
          {inner}
        </a>
      );
    }
    return (
      <div key={id} tabIndex={0} role="button" aria-label={item.title ?? 'tile'} {...commonProps}>
        {inner}
      </div>
    );
  };

  const rootClass = ['drift-wall', reduced ? 'drift-wall--reduced' : '', className].filter(Boolean).join(' ');

  return (
    <div
      ref={containerRef}
      className={rootClass}
      style={cssVars}
      onPointerMove={handlePointerMove}
      onPointerEnter={() => {
        wallHoveredRef.current = true;
      }}
      onPointerLeave={handlePointerLeaveWall}
      role="group"
      aria-label="Drifting wall of tiles"
    >
      <div ref={planeRef} className="drift-wall__plane">
        {columnItems.map((col, c) => {
          const meta = columnMeta[c];
          const copies = Array.from({ length: meta.copies });
          return (
            <div className="drift-wall__col" key={`col-${c}`}>
              <div className="drift-wall__track" ref={el => (trackRefs.current[c] = el)}>
                {copies.map((_, copyIndex) =>
                  col.map((item, itemIndex) => renderTile(item, `${c}-${copyIndex}-${itemIndex}`, c))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DriftWall;
