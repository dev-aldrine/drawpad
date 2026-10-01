import React, { useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Pen, Coins, Rocket, Check, ChevronDown, ArrowDown } from '@sketchyicons/react';
import RotatingText from './RotatingText';

export const ScrollIntroView = ({ onLaunchNow }) => {
  const containerRef = useRef(null);

  // Track scroll through the pinned sticky section (300vh track for 3 steps)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Calculate active step ranges with cleaner transitions
  const step1Opacity = useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0]);
  const step1Scale = useTransform(scrollYProgress, [0, 0.22, 0.33], [1, 1, 0.92]);
  const step1Y = useTransform(scrollYProgress, [0, 0.22, 0.33], [0, 0, -30]);
  const step1RotateX = useTransform(scrollYProgress, [0, 0.22, 0.33], [0, 0, -15]);

  const step2Opacity = useTransform(scrollYProgress, [0.30, 0.38, 0.58, 0.66], [0, 1, 1, 0]);
  const step2Scale = useTransform(scrollYProgress, [0.30, 0.38, 0.58, 0.66], [0.92, 1, 1, 0.92]);
  const step2Y = useTransform(scrollYProgress, [0.30, 0.38, 0.58, 0.66], [30, 0, 0, -30]);
  const step2RotateX = useTransform(scrollYProgress, [0.30, 0.38, 0.58, 0.66], [15, 0, 0, -15]);

  const step3Opacity = useTransform(scrollYProgress, [0.63, 0.72, 1], [0, 1, 1]);
  const step3Scale = useTransform(scrollYProgress, [0.63, 0.72, 1], [0.92, 1, 1]);
  const step3Y = useTransform(scrollYProgress, [0.63, 0.72, 1], [30, 0, 0]);
  const step3RotateX = useTransform(scrollYProgress, [0.63, 0.72, 1], [15, 0, 0]);

  // Track progress bar percentage
  const progressBarWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  const steps = [
    {
      num: '01',
      title: 'Doodle your Masterpiece',
      subtitle: 'Hand-drawn On-Chain Art',
      desc: 'Use the interactive sketchbook canvas to draw your coin logo. Choose pencil sizes, marker colors, erasers, and sketch stamps. No boring AI images—100% authentic community creativity.',
      highlights: ['Custom stroke widths & colors', 'Undo & clear history stack', 'PNG export with decentralized IPFS metadata'],
      badge: 'Step 1 • Canvas Studio',
      color: 'var(--marker-yellow)',
      tapeColor: '#fef08a',
      icon: <Pen size={32} />
    },
    {
      num: '02',
      title: 'Configure Token Details',
      subtitle: 'Fair & Flexible Tokenomics',
      desc: 'Give your hand-drawn coin a memorable Name, Ticker ($SYMBOL), and fun meme lore or description. You can also customize initial dev buy amount in SOL and slippage percentage.',
      highlights: ['Custom Coin Name & Ticker', 'Optional initial dev buy on bonding curve', 'Social links (Twitter/X, Telegram, Website)'],
      badge: 'Step 2 • Launch Specs',
      color: 'var(--marker-green)',
      tapeColor: '#bbf7d0',
      icon: <Coins size={32} />
    },
    {
      num: '03',
      title: 'Deploy to pump.fun via PumpPortal',
      subtitle: 'Instant Non-Custodial Bonding Curve',
      desc: 'Connect your Phantom or Solflare Solana wallet. Approve the non-custodial transaction. The bonding curve is created immediately on pump.fun and your coin is instantly tradable.',
      highlights: ['100% Non-custodial signing with Phantom', 'Direct pump.fun bonding curve integration', 'Live Solscan tx signature & instant trading link'],
      badge: 'Step 3 • Live Launch',
      color: 'var(--marker-cyan)',
      tapeColor: '#bae6fd',
      icon: <Rocket size={32} />
    },
  ];

  const faqs = [
    {
      q: 'How does DrawPad launch my coin onto pump.fun?',
      a: 'DrawPad communicates with the official PumpPortal Trade API. It uploads your hand-drawn artwork to IPFS, builds the versioned Solana transaction, and prompts your Phantom wallet for non-custodial signing.'
    },
    {
      q: 'Do I need SOL to launch a coin?',
      a: 'Yes, creating a token on pump.fun requires standard Solana network transaction fees (typically ~0.02 SOL), plus whatever amount of SOL you choose for your optional initial dev buy.'
    },
    {
      q: 'Is DrawPad non-custodial?',
      a: 'Yes! DrawPad never holds your private keys or funds. Every launch transaction is signed directly and securely inside your Phantom or Solflare wallet.'
    },
    {
      q: 'Can I download my drawing as a PNG?',
      a: 'Absolutely. The studio canvas includes a Save PNG button so you can keep and share high-resolution copies of your hand-drawn artwork.'
    }
  ];

  return (
    <div style={styles.container}>
      {/* Intro Hero with RotatingText */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={styles.introHero} 
        className="sketch-card"
      >
        <div style={styles.tapeTop}>
          <span>DRAWPAD • HOW IT WORKS</span>
        </div>

        <div style={styles.heroBadgeWrap}>
          <span style={styles.sparkleDot}>✦</span>
          <span style={styles.heroBadgeText}>The Sketch-to-Launch Solana Protocol</span>
          <span style={styles.sparkleDot}>✦</span>
        </div>

        <h1 style={styles.mainTitle}>
          Draw it.{' '}
          <span className="highlighter-tape-cyan" style={{ display: 'inline-flex', verticalAlign: 'middle' }}>
            <RotatingText
              texts={['Launch it.', 'Pump it.', 'Trade it.', 'Meme it.']}
              mainClassName="justify-center"
              staggerFrom="last"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '-120%', opacity: 0 }}
              staggerDuration={0.03}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              rotationInterval={2400}
            />
          </span>
        </h1>
        <p style={styles.heroDesc}>
          Turn rough sketches into live Solana tokens on <strong>pump.fun</strong>. Scroll down to step through each phase 1 by 1.
        </p>

        <div style={styles.scrollDownIndicator}>
          <span>Scroll down to step through</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
            <ArrowDown size={18} />
          </motion.div>
        </div>
      </motion.section>

      {/* PINNED STICKY 1-BY-1 SCROLL TRACK (300vh height track) */}
      <div ref={containerRef} style={styles.stickyTrackWrapper}>
        <div style={styles.stickyWindow}>
          {/* Progress Tracker Bar */}
          <div style={styles.progressBarTrack}>
            <motion.div style={{ ...styles.progressBarFill, width: progressBarWidth }} />
          </div>

          <div style={styles.stepPresenter}>
            {/* STEP 1 CARD */}
            <motion.div 
              style={{
                ...styles.stepCardAbsolute,
                opacity: step1Opacity,
                scale: step1Scale,
                y: step1Y,
                rotateX: step1RotateX,
                pointerEvents: 'auto'
              }}
            >
              <div style={styles.stepCard} className="sketch-card">
                <div style={{ ...styles.cardTape, background: steps[0].tapeColor }}>
                  <span>{steps[0].badge}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[0].color }}>
                    {steps[0].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[0].title}</h2>
                    <span style={styles.cardSubtitle}>{steps[0].subtitle}</span>
                  </div>
                </div>

                <p style={styles.cardDesc}>{steps[0].desc}</p>

                <div style={styles.highlightsBox}>
                  {steps[0].highlights.map((h, i) => (
                    <div key={i} style={styles.highlightRow}>
                      <div style={styles.checkIconWrap}><Check size={14} /></div>
                      <span style={styles.highlightText}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* STEP 2 CARD */}
            <motion.div 
              style={{
                ...styles.stepCardAbsolute,
                opacity: step2Opacity,
                scale: step2Scale,
                y: step2Y,
                rotateX: step2RotateX,
                pointerEvents: 'auto'
              }}
            >
              <div style={styles.stepCard} className="sketch-card">
                <div style={{ ...styles.cardTape, background: steps[1].tapeColor }}>
                  <span>{steps[1].badge}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[1].color }}>
                    {steps[1].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[1].title}</h2>
                    <span style={styles.cardSubtitle}>{steps[1].subtitle}</span>
                  </div>
                </div>

                <p style={styles.cardDesc}>{steps[1].desc}</p>

                <div style={styles.highlightsBox}>
                  {steps[1].highlights.map((h, i) => (
                    <div key={i} style={styles.highlightRow}>
                      <div style={styles.checkIconWrap}><Check size={14} /></div>
                      <span style={styles.highlightText}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* STEP 3 CARD */}
            <motion.div 
              style={{
                ...styles.stepCardAbsolute,
                opacity: step3Opacity,
                scale: step3Scale,
                y: step3Y,
                rotateX: step3RotateX,
                pointerEvents: 'auto'
              }}
            >
              <div style={styles.stepCard} className="sketch-card">
                <div style={{ ...styles.cardTape, background: steps[2].tapeColor }}>
                  <span>{steps[2].badge}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[2].color }}>
                    {steps[2].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[2].title}</h2>
                    <span style={styles.cardSubtitle}>{steps[2].subtitle}</span>
                  </div>
                </div>

                <p style={styles.cardDesc}>{steps[2].desc}</p>

                <div style={styles.highlightsBox}>
                  {steps[2].highlights.map((h, i) => (
                    <div key={i} style={styles.highlightRow}>
                      <div style={styles.checkIconWrap}><Check size={14} /></div>
                      <span style={styles.highlightText}>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Interactive FAQ Accordion Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={styles.faqSection} 
        className="sketch-card"
      >
        <div style={styles.tapeFaq}>
          <span>FREQUENTLY ASKED QUESTIONS</span>
        </div>

        <h2 style={styles.faqHeading}>Got Questions?</h2>
        <div style={styles.faqList}>
          {faqs.map((faq, idx) => (
            <details key={idx} style={styles.faqDetails}>
              <summary style={styles.faqSummary}>
                <span>{faq.q}</span>
                <ChevronDown size={18} />
              </summary>
              <p style={styles.faqAnswer}>{faq.a}</p>
            </details>
          ))}
        </div>
      </motion.section>

      {/* Bottom Launch Call To Action */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        style={styles.bottomCtaWrap} 
        className="sketch-card"
      >
        <div style={styles.bottomCtaInner}>
          <h2 style={styles.bottomCtaTitle}>Ready to launch your hand-drawn coin?</h2>
          <p style={styles.bottomCtaDesc}>Pick up your digital pencil and deploy to pump.fun in under 2 minutes.</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onLaunchNow}
            className="sketch-btn sketch-btn-green"
            style={styles.bigLaunchBtn}
          >
            <Rocket size={22} />
            <span>Open Drawing Studio</span>
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '42px',
    maxWidth: '860px',
    margin: '0 auto',
  },
  introHero: {
    padding: '40px 32px 34px 32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    position: 'relative',
    backgroundColor: '#ffffff',
  },
  tapeTop: {
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
  heroBadgeWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: '#fef9c3',
    border: '1.5px solid #1a1a1e',
    borderRadius: '16px',
    padding: '3px 14px',
    boxShadow: '1px 1px 0px #1a1a1e',
  },
  sparkleDot: {
    color: '#ca8a04',
    fontWeight: 'bold',
  },
  heroBadgeText: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  mainTitle: {
    fontSize: '44px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  heroDesc: {
    fontSize: '19px',
    color: '#475569',
    maxWidth: '620px',
    lineHeight: '1.45',
  },
  scrollDownIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#1a1a1e',
    background: '#f8fafc',
    border: '1.5px solid #1a1a1e',
    borderRadius: '20px',
    padding: '6px 16px',
    marginTop: '6px',
  },
  /* 300vh sticky scroll presenter */
  stickyTrackWrapper: {
    position: 'relative',
    height: '240vh',
    width: '100%',
  },
  stickyWindow: {
    position: 'sticky',
    top: '120px',
    height: '520px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
  },
  progressBarTrack: {
    width: '260px',
    height: '8px',
    background: '#e2e8f0',
    border: '1.5px solid #1a1a1e',
    borderRadius: '6px',
    marginBottom: '20px',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    background: '#10b981',
    borderRadius: '4px',
  },
  stepPresenter: {
    position: 'relative',
    width: '100%',
    maxWidth: '720px',
    height: '420px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepCardAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    transformStyle: 'preserve-3d',
  },
  stepCard: {
    padding: '34px 28px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '4px 4px 0px #1a1a1e',
  },
  cardTape: {
    position: 'absolute',
    top: '-12px',
    left: '24px',
    border: '1.5px dashed #1a1a1e',
    padding: '3px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    marginTop: '6px',
  },
  stepIconBox: {
    width: '56px',
    height: '56px',
    borderRadius: '12px',
    border: '2px solid #1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '2px 2px 0px #1a1a1e',
    flexShrink: 0,
  },
  cardTitle: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  cardSubtitle: {
    fontSize: '15px',
    fontWeight: '700',
    color: '#64748b',
    fontFamily: 'var(--font-mono)',
  },
  cardDesc: {
    fontSize: '18px',
    color: '#475569',
    lineHeight: '1.5',
  },
  highlightsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#f8fafc',
    border: '1.5px dashed #cbd5e1',
    borderRadius: '10px',
    padding: '14px 18px',
  },
  highlightRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  checkIconWrap: {
    background: '#bbf7d0',
    border: '1.5px solid #1a1a1e',
    borderRadius: '50%',
    width: '22px',
    height: '22px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1a1a1e',
    flexShrink: 0,
  },
  highlightText: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b',
  },
  faqSection: {
    padding: '32px 26px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
    marginTop: '20px',
  },
  tapeFaq: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%) rotate(0.5deg)',
    background: '#fed7aa',
    border: '2px dashed #1a1a1e',
    padding: '2px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  faqHeading: {
    fontSize: '28px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    textAlign: 'center',
  },
  faqList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  faqDetails: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
    padding: '14px 18px',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    cursor: 'pointer',
  },
  faqSummary: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    listStyle: 'none',
  },
  faqAnswer: {
    fontSize: '16px',
    color: '#475569',
    marginTop: '10px',
    lineHeight: '1.45',
    borderTop: '1.5px dashed #cbd5e1',
    paddingTop: '8px',
  },
  bottomCtaWrap: {
    padding: '32px 24px',
    backgroundColor: '#fef08a',
    textAlign: 'center',
    border: '2.5px solid #1a1a1e',
  },
  bottomCtaInner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
  },
  bottomCtaTitle: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  bottomCtaDesc: {
    fontSize: '18px',
    color: '#475569',
  },
  bigLaunchBtn: {
    padding: '16px 36px',
    fontSize: '22px',
    marginTop: '6px',
  }
};
