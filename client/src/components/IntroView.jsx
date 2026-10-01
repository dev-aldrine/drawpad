import React from 'react';
import { Pen, Coins, Rocket, ArrowRight, Zap, Sparkles } from '@sketchyicons/react';

export const IntroView = ({ onProceed }) => {
  const steps = [
    {
      num: '01',
      icon: <Pen size={30} />,
      title: 'Doodle your Coin Artwork',
      desc: 'Use the sketchbook canvas to hand-draw your meme logo. Pick custom stroke widths, colors, and shape stamps.',
      badge: 'Step 1',
      color: 'var(--marker-yellow)',
      sticker: 'PENCIL'
    },
    {
      num: '02',
      icon: <Coins size={30} />,
      title: 'Set Token Details & Ticker',
      desc: 'Give your coin a name, ticker ($TICKER), description, and optionally set initial dev buy SOL & slippage.',
      badge: 'Step 2',
      color: 'var(--marker-green)',
      sticker: 'SOLANA'
    },
    {
      num: '03',
      icon: <Rocket size={30} />,
      title: 'Launch on Pump.fun Bonding Curve',
      desc: 'Sign the non-custodial transaction with your Phantom wallet. Metadata uploads to IPFS and the coin goes live!',
      badge: 'Step 3',
      color: 'var(--marker-cyan)',
      sticker: 'BONDING'
    }
  ];

  return (
    <div style={styles.container} className="sketch-card">
      {/* Decorative Washi Tapes */}
      <div style={styles.tape} className="animate-wiggle-hover">
        <span>WELCOME TO DRAWPAD</span>
      </div>

      <div style={styles.heroWrap}>
        <div style={styles.doodleBadgeRow} className="animate-wiggle-hover">
          <span style={styles.pinIcon}>📌</span>
          <span style={styles.handwrittenTag}>Handmade for Solana Meme Creators</span>
          <Sparkles size={16} />
        </div>
        <h2 style={styles.title}>
          How DrawPad Works
        </h2>
        <p style={styles.subtitle}>
          Launch unique, 100% hand-drawn Solana memecoins in 3 easy steps without touching complex smart contracts.
        </p>
      </div>

      {/* 3 Step Cards with Hover Spring Animations */}
      <div style={styles.stepsGrid}>
        {steps.map((s, idx) => (
          <div 
            key={idx} 
            style={{
              ...styles.stepCard,
              transform: idx === 0 ? 'rotate(-0.8deg)' : idx === 2 ? 'rotate(0.8deg)' : 'none'
            }}
            className="sketch-card animate-wiggle-hover"
          >
            <div style={styles.cardHeader}>
              <div style={styles.stepBadge}>{s.badge}</div>
              <div style={{ ...styles.iconBox, background: s.color }}>{s.icon}</div>
            </div>
            <h3 style={styles.stepTitle}>{s.title}</h3>
            <p style={styles.stepDesc}>{s.desc}</p>
            <div style={styles.stepFooterDoodle}>
              <span style={styles.stickerBadge}>#{s.sticker}</span>
              <span style={styles.scribbleLine}>~~~~~</span>
            </div>
          </div>
        ))}
      </div>

      {/* Doodled Info highlights banner */}
      <div style={styles.infoBanner}>
        <div style={styles.infoItem}>
          <Zap size={20} />
          <span>Direct pump.fun bonding curve pool</span>
        </div>
        <div style={styles.dotDivider}>•</div>
        <div style={styles.infoItem}>
          <Pen size={20} />
          <span>Decentralized IPFS artwork storage</span>
        </div>
        <div style={styles.dotDivider}>•</div>
        <div style={styles.infoItem}>
          <Rocket size={20} />
          <span>Instant Phantom non-custodial signing</span>
        </div>
      </div>

      {/* Action to proceed to Step 2 */}
      <div style={styles.actionRow}>
        <button
          type="button"
          onClick={onProceed}
          className="sketch-btn sketch-btn-green"
          style={styles.proceedBtn}
        >
          <span>Step 1: Open Drawing Studio</span>
          <ArrowRight size={22} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '38px 30px 32px 30px',
    display: 'flex',
    flexDirection: 'column',
    gap: '26px',
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
    padding: '3px 18px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#1a1a1e',
    cursor: 'pointer',
  },
  heroWrap: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '8px',
  },
  doodleBadgeRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef9c3',
    border: '1.5px solid #1a1a1e',
    borderRadius: '16px',
    padding: '4px 14px',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    cursor: 'pointer',
    transition: 'transform 0.15s ease',
  },
  pinIcon: {
    fontSize: '13px',
  },
  handwrittenTag: {
    fontFamily: 'var(--font-handwriting)',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  title: {
    fontSize: '36px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '18px',
    color: '#475569',
    maxWidth: '580px',
    margin: '0 auto',
    lineHeight: '1.4',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '20px',
  },
  stepCard: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '14px',
    padding: '22px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    boxShadow: '3px 3px 0px #1a1a1e',
    cursor: 'default',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepBadge: {
    background: '#fed7aa',
    border: '1.5px solid #1a1a1e',
    borderRadius: '6px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  iconBox: {
    width: '48px',
    height: '48px',
    borderRadius: '10px',
    border: '2px solid #1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    color: '#1a1a1e',
  },
  stepTitle: {
    fontSize: '21px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  stepDesc: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.4',
  },
  stepFooterDoodle: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTop: '1.5px dashed #cbd5e1',
    paddingTop: '8px',
    marginTop: 'auto',
  },
  stickerBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    color: '#64748b',
  },
  scribbleLine: {
    fontFamily: 'var(--font-mono)',
    color: '#cbd5e1',
    fontWeight: 'bold',
  },
  infoBanner: {
    display: 'flex',
    justifyContent: 'space-around',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '14px',
    padding: '14px 18px',
    background: '#fef08a',
    border: '2px dashed #1a1a1e',
    borderRadius: '12px',
    boxShadow: '2px 2px 0px #1a1a1e',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  dotDivider: {
    color: '#1a1a1e',
    fontWeight: 'bold',
    opacity: 0.5,
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '4px',
  },
  proceedBtn: {
    padding: '14px 34px',
    fontSize: '20px',
  }
};
