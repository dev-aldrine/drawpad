import React from 'react';

// Floating sketchy background doodles with soft organic rotation and animations
export const BackgroundDoodles = () => {
  return (
    <div style={styles.container} aria-hidden="true">
      {/* Top Left Doodle: Rocket Sketch */}
      <svg style={{ ...styles.doodle, top: '5%', left: '3%', transform: 'rotate(-12deg)' }} width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2"/>
        <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5"/>
      </svg>

      {/* Top Right Doodle: Star & Swirls */}
      <svg style={{ ...styles.doodle, top: '4%', right: '4%', transform: 'rotate(18deg)' }} width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="1.8" strokeLinecap="round">
        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
      </svg>

      {/* Hero Left: Curly Arrow Pointing */}
      <svg style={{ ...styles.doodle, top: '18%', left: '12%', transform: 'rotate(25deg)' }} width="80" height="60" viewBox="0 0 100 80" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round">
        <path d="M10,70 Q40,10 80,40" strokeDasharray="4,4"/>
        <path d="M70,30 L85,42 L72,55"/>
      </svg>

      {/* Hero Right: Lightbulb Doodle */}
      <svg style={{ ...styles.doodle, top: '16%', right: '10%', transform: 'rotate(-15deg)' }} width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="1.8" strokeLinecap="round">
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
        <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M20 12h2M17.66 6.34l1.41-1.41"/>
      </svg>

      {/* Mid Left: Pencil Doodle */}
      <svg style={{ ...styles.doodle, top: '48%', left: '2%', transform: 'rotate(35deg)' }} width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 2l4 4-14 14H4v-4L18 2z"/>
        <path d="M14 6l4 4"/>
      </svg>

      {/* Mid Right: Solana Coin Doodle */}
      <svg style={{ ...styles.doodle, top: '52%', right: '2%', transform: 'rotate(-20deg)' }} width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="9" strokeDasharray="3,2"/>
        <path d="M8 9h8l-3 3h-5l3-3z"/>
        <path d="M8 15h8l-3-3h-5l3 3z"/>
      </svg>

      {/* Bottom Left: Coffee Mug Doodle */}
      <svg style={{ ...styles.doodle, bottom: '6%', left: '4%', transform: 'rotate(-8deg)' }} width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round">
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <path d="M6 1v3M10 1v3M14 1v3"/>
      </svg>

      {/* Bottom Right: Hand-drawn Crown & Sparkles */}
      <svg style={{ ...styles.doodle, bottom: '5%', right: '5%', transform: 'rotate(12deg)' }} width="68" height="68" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round">
        <path d="M2 4l3 12h14l3-12-6 7-4-7-4 7-6-7z"/>
        <path d="M4 18h16"/>
      </svg>
    </div>
  );
};

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: 0,
    overflow: 'hidden',
  },
  doodle: {
    position: 'absolute',
    opacity: 0.35,
    transition: 'opacity 0.3s ease',
  }
};
