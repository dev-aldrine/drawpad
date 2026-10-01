import React from 'react';
import { Pen, Coins, Rocket, ArrowDown } from '@sketchyicons/react';

export const HowItWorks = ({ onStartDrawing }) => {
  const steps = [
    {
      num: '01',
      icon: <Pen size={28} />,
      title: 'Draw Your Artwork',
      desc: 'Use the sketchbook canvas to doodle your coin PFP. Pick colors, stroke sizes, and hand-drawn stamps.',
      color: 'var(--marker-yellow)',
    },
    {
      num: '02',
      icon: <Coins size={28} />,
      title: 'Fill Coin Info',
      desc: 'Name your coin, pick a ticker symbol, and add an optional lore/description or initial dev buy.',
      color: 'var(--marker-green)',
    },
    {
      num: '03',
      icon: <Rocket size={28} />,
      title: 'Launch on pump.fun',
      desc: 'Approve the non-custodial transaction with Phantom. Your coin is live instantly on the bonding curve.',
      color: 'var(--marker-cyan)',
    },
  ];

  return (
    <section style={styles.container} className="sketch-card">
      <div style={styles.tape}>
        <span>HOW IT WORKS</span>
      </div>

      <div style={styles.headingWrap}>
        <h2 style={styles.title}>How to launch your hand-drawn coin</h2>
        <p style={styles.subtitle}>
          Three simple steps from blank paper to a live token on Solana bonding curve.
        </p>
      </div>

      <div style={styles.stepsGrid}>
        {steps.map((step, idx) => (
          <div key={idx} style={styles.stepCard}>
            <div style={{ ...styles.stepIconWrap, background: step.color }}>
              {step.icon}
            </div>
            <div style={styles.stepNumBadge}>{step.num}</div>
            <h3 style={styles.stepTitle}>{step.title}</h3>
            <p style={styles.stepDesc}>{step.desc}</p>
          </div>
        ))}
      </div>

      <div style={styles.ctaWrap}>
        <button
          type="button"
          onClick={onStartDrawing}
          className="sketch-btn sketch-btn-green"
          style={styles.ctaBtn}
        >
          <span>Start Drawing Now</span>
          <ArrowDown size={18} />
        </button>
      </div>
    </section>
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
    margin: '10px 0',
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
  headingWrap: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '17px',
    color: '#64748b',
    maxWidth: '540px',
    margin: '0 auto',
  },
  stepsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginTop: '6px',
  },
  stepCard: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '12px',
    padding: '22px 18px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    gap: '10px',
    position: 'relative',
    boxShadow: '2px 2px 0px #1a1a1e',
  },
  stepIconWrap: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    border: '2px solid #1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    color: '#1a1a1e',
  },
  stepNumBadge: {
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    background: '#1a1a1e',
    color: '#ffffff',
    padding: '2px 8px',
    borderRadius: '6px',
    letterSpacing: '0.05em',
  },
  stepTitle: {
    fontSize: '21px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  stepDesc: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.4',
  },
  ctaWrap: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '6px',
  },
  ctaBtn: {
    padding: '12px 28px',
    fontSize: '19px',
  }
};
