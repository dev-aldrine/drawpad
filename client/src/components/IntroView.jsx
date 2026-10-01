import React from 'react';
import { Pen, Coins, Rocket, ArrowRight, Sparkles, ShieldCheck, Zap } from '@sketchyicons/react';

export const IntroView = ({ onProceed }) => {
  const steps = [
    {
      num: '01',
      icon: <Pen size={28} />,
      title: 'Doodle your Coin Artwork',
      desc: 'Use the sketchbook canvas to hand-draw your meme logo. Pick custom stroke widths, colors, and shape stamps.',
      badge: 'Step 1'
    },
    {
      num: '02',
      icon: <Coins size={28} />,
      title: 'Set Token Details & Ticker',
      desc: 'Give your coin a name, ticker ($TICKER), description, and optionally set initial dev buy SOL & slippage.',
      badge: 'Step 2'
    },
    {
      num: '03',
      icon: <Rocket size={28} />,
      title: 'Launch on Pump.fun Bonding Curve',
      desc: 'Sign the non-custodial transaction with your Phantom wallet. Metadata uploads to IPFS and the coin goes live!',
      badge: 'Step 3'
    }
  ];

  return (
    <div style={styles.container} className="sketch-card">
      <div style={styles.tape}>
        <span>WELCOME TO DRAWPAD</span>
      </div>

      <div style={styles.heroWrap}>
        <h2 style={styles.title}>
          How DrawPad Works
        </h2>
        <p style={styles.subtitle}>
          Launch unique, 100% hand-drawn Solana memecoins in 3 easy steps without touching complex smart contracts.
        </p>
      </div>

      {/* 3 Step Cards */}
      <div style={styles.stepsGrid}>
        {steps.map((s, idx) => (
          <div key={idx} style={styles.stepCard}>
            <div style={styles.cardHeader}>
              <div style={styles.stepBadge}>{s.badge}</div>
              <div style={styles.iconBox}>{s.icon}</div>
            </div>
            <h3 style={styles.stepTitle}>{s.title}</h3>
            <p style={styles.stepDesc}>{s.desc}</p>
          </div>
        ))}
      </div>

      {/* Info highlights banner */}
      <div style={styles.infoBanner}>
        <div style={styles.infoItem}>
          <Zap size={18} />
          <span>Direct pump.fun liquidity pool</span>
        </div>
        <div style={styles.infoItem}>
          <Pen size={18} />
          <span>Decentralized IPFS artwork storage</span>
        </div>
        <div style={styles.infoItem}>
          <Rocket size={18} />
          <span>Instant Phantom wallet signing</span>
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
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '36px 28px 30px 28px',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
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
  },
  heroWrap: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  title: {
    fontSize: '34px',
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
    gap: '18px',
  },
  stepCard: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '12px',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    boxShadow: '2px 2px 0px #1a1a1e',
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
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  iconBox: {
    width: '44px',
    height: '44px',
    borderRadius: '10px',
    border: '2px solid #1a1a1e',
    background: 'var(--marker-yellow)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  stepTitle: {
    fontSize: '20px',
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
  infoBanner: {
    display: 'flex',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    gap: '12px',
    padding: '14px',
    background: '#fef08a',
    border: '2px dashed #1a1a1e',
    borderRadius: '10px',
  },
  infoItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  actionRow: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '6px',
  },
  proceedBtn: {
    padding: '14px 32px',
    fontSize: '20px',
  }
};
