import React from 'react';

export const BackgroundDoodles = () => {
  return (
    <div style={styles.container} aria-hidden="true">
      {/* Top Left: Rocket Sketch Floating */}
      <svg 
        className="animate-float-1"
        style={{ ...styles.doodle, top: '6%', left: '3%' }} 
        width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      >
        <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
        <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
        <path d="M9 12H4s.55-3.03 2-4.5c1.62-1.63 5-2 5-2"/>
        <path d="M12 15v5s3.03-.55 4.5-2c1.63-1.62 2-5 2-5"/>
      </svg>

      {/* Top Right: Sparkle Star Floating */}
      <svg 
        className="animate-float-2"
        style={{ ...styles.doodle, top: '5%', right: '4%' }} 
        width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#ea580c" strokeWidth="2" strokeLinecap="round"
      >
        <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z"/>
      </svg>

      {/* Hero Left: Curly Arrow Pointing */}
      <svg 
        className="animate-float-3"
        style={{ ...styles.doodle, top: '16%', left: '11%' }} 
        width="85" height="65" viewBox="0 0 100 80" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round"
      >
        <path d="M10,70 Q40,10 80,40" strokeDasharray="5,4"/>
        <path d="M68,28 L85,42 L70,56"/>
      </svg>

      {/* Hero Right: Lightbulb Doodle */}
      <svg 
        className="animate-float-4"
        style={{ ...styles.doodle, top: '15%', right: '10%' }} 
        width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#0284c7" strokeWidth="2" strokeLinecap="round"
      >
        <path d="M9 18h6"/>
        <path d="M10 22h4"/>
        <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/>
        <path d="M12 2v2M4.93 4.93l1.41 1.41M2 12h2M20 12h2M17.66 6.34l1.41-1.41"/>
      </svg>

      {/* Mid Left: Wooden Pencil */}
      <svg 
        className="animate-float-1"
        style={{ ...styles.doodle, top: '46%', left: '2%' }} 
        width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"
      >
        <path d="M18 2l4 4-14 14H4v-4L18 2z"/>
        <path d="M14 6l4 4"/>
      </svg>

      {/* Mid Right: Solana Orbit Coin */}
      <svg 
        className="animate-float-2"
        style={{ ...styles.doodle, top: '50%', right: '2%' }} 
        width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round"
      >
        <circle cx="12" cy="12" r="9" strokeDasharray="4,3"/>
        <path d="M8 9h8l-3 3h-5l3-3z"/>
        <path d="M8 15h8l-3-3h-5l3 3z"/>
      </svg>

      {/* Bottom Left: Steaming Mug */}
      <svg 
        className="animate-float-3"
        style={{ ...styles.doodle, bottom: '6%', left: '4%' }} 
        width="65" height="65" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round"
      >
        <path d="M18 8h1a4 4 0 0 1 0 8h-1"/>
        <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/>
        <path d="M6 1v3M10 1v3M14 1v3"/>
      </svg>

      {/* Bottom Right: Hand-drawn Crown */}
      <svg 
        className="animate-float-4"
        style={{ ...styles.doodle, bottom: '5%', right: '5%' }} 
        width="75" height="75" viewBox="0 0 24 24" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round"
      >
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
    opacity: 0.45,
    filter: 'drop-shadow(1px 1px 0px rgba(0,0,0,0.15))',
    cursor: 'pointer',
    pointerEvents: 'auto',
    transition: 'opacity 0.2s, transform 0.2s',
  }
};
