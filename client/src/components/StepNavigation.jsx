import React from 'react';
import { Pen, Coins, Rocket, Check, ArrowRight, ArrowLeft } from '@sketchyicons/react';

export const StepNavigation = ({ currentStep, onStepChange, canProceedToStep2, canProceedToStep3 }) => {
  const steps = [
    { id: 1, title: '1. How It Works', subtitle: 'Quick Intro', icon: <Rocket size={18} /> },
    { id: 2, title: '2. Draw Artwork', subtitle: 'Canvas Studio', icon: <Pen size={18} /> },
    { id: 3, title: '3. Token Details', subtitle: 'Launch Settings', icon: <Coins size={18} /> }
  ];

  return (
    <div style={styles.container} className="sketch-card">
      <div style={styles.stepsRow}>
        {steps.map((s, idx) => {
          const isActive = currentStep === s.id;
          const isPassed = currentStep > s.id;
          const isDisabled = 
            (s.id === 2 && false) ||
            (s.id === 3 && !canProceedToStep3);

          return (
            <React.Fragment key={s.id}>
              <button
                type="button"
                onClick={() => onStepChange(s.id)}
                disabled={isDisabled}
                style={{
                  ...styles.stepBtn,
                  background: isActive ? 'var(--marker-yellow)' : isPassed ? 'var(--marker-green)' : '#ffffff',
                  boxShadow: isActive ? '2px 2px 0px #1a1a1e' : 'none',
                  cursor: isDisabled ? 'not-allowed' : 'pointer',
                  opacity: isDisabled ? 0.6 : 1
                }}
              >
                <div style={styles.stepIconBadge}>
                  {isPassed ? <Check size={16} /> : s.icon}
                </div>
                <div style={styles.stepTextCol}>
                  <span style={styles.stepTitle}>{s.title}</span>
                  <span style={styles.stepSubtitle}>{s.subtitle}</span>
                </div>
              </button>

              {idx < steps.length - 1 && (
                <div style={styles.connectorArrow}>
                  <ArrowRight size={18} />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '12px 16px',
    backgroundColor: '#ffffff',
    width: '100%',
    marginBottom: '8px',
  },
  stepsRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '10px',
    flexWrap: 'wrap',
  },
  stepBtn: {
    flex: 1,
    minWidth: '180px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '10px 14px',
    border: '2px solid #1a1a1e',
    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
    transition: 'all 0.15s ease',
    textAlign: 'left',
    fontFamily: 'var(--font-handwriting)',
  },
  stepIconBadge: {
    width: '32px',
    height: '32px',
    borderRadius: '255px 15px 225px 15px/15px 225px 15px 255px',
    border: '1.5px solid #1a1a1e',
    background: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1px 1px 0px #1a1a1e',
  },
  stepTextCol: {
    display: 'flex',
    flexDirection: 'column',
  },
  stepTitle: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  stepSubtitle: {
    fontSize: '13px',
    color: '#64748b',
  },
  connectorArrow: {
    color: '#94a3b8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }
};
