import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Pen, Coins, Rocket, Check, ChevronDown, Sparkles } from '@sketchyicons/react';
import RotatingText from './RotatingText';

// Scroll-Driven Step Item that unfolds precisely based on scroll position
const ScrollDrivenStep = ({ step, index, total }) => {
  const targetRef = useRef(null);
  
  // Track scroll progress of this specific section
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ['start end', 'center center'],
  });

  // Smooth spring physics for fluid interpolation
  const smoothProgress = useSpring(scrollYProgress, { stiffness: 120, damping: 25, restDelta: 0.001 });

  // 3D Unfold Transformations driven directly by scroll position:
  // 1. rotateX: starts folded back at 45deg, unfolds flat to 0deg
  const rotateX = useTransform(smoothProgress, [0, 1], [40, 0]);
  // 2. rotateY: subtle organic paper tilt
  const rotateY = useTransform(smoothProgress, [0, 1], [index % 2 === 0 ? -12 : 12, 0]);
  // 3. scale: unfolds from 0.82 to full size 1.0
  const scale = useTransform(smoothProgress, [0, 1], [0.85, 1]);
  // 4. opacity: fades in from 0 to 1
  const opacity = useTransform(smoothProgress, [0, 0.4, 1], [0.1, 0.7, 1]);
  // 5. y: slides up gracefully
  const y = useTransform(smoothProgress, [0, 1], [80, 0]);
  // 6. badge scale spring
  const badgeScale = useTransform(smoothProgress, [0, 0.6, 1], [0.4, 1.15, 1]);

  return (
    <div ref={targetRef} style={styles.scrollStepContainer}>
      <div style={styles.timelineItem}>
        {/* Timeline Node with Scroll-driven Scale */}
        <div style={styles.timelineNodeCol}>
          <motion.div 
            style={{ 
              ...styles.timelineNodeBadge, 
              background: step.color,
              scale: badgeScale,
            }}
          >
            {step.num}
          </motion.div>
          {index < total - 1 && <div style={styles.timelineLine} />}
        </div>

        {/* 3D Unfolding Card */}
        <div style={styles.stepCardWrap}>
          <motion.div
            style={{
              perspective: 1200,
              transformStyle: 'preserve-3d',
              rotateX,
              rotateY,
              scale,
              opacity,
              y,
            }}
          >
            <div style={styles.stepCard} className="sketch-card">
              <div style={{ ...styles.cardTape, background: step.tapeColor }}>
                <span>{step.badge}</span>
              </div>

              <div style={styles.cardHeader}>
                <div>
                  <h2 style={styles.cardTitle}>{step.title}</h2>
                  <span style={styles.cardSubtitle}>{step.subtitle}</span>
                </div>
              </div>

              <p style={styles.cardDesc}>{step.desc}</p>

              {/* Highlights list */}
              <div style={styles.highlightsBox}>
                {step.highlights.map((h, i) => (
                  <div key={i} style={styles.highlightRow}>
                    <div style={styles.checkIconWrap}>
                      <Check size={14} />
                    </div>
                    <span style={styles.highlightText}>{h}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export const ScrollIntroView = ({ onLaunchNow }) => {
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
          Turn rough sketches into real live Solana tokens on <strong>pump.fun</strong> in 3 interactive steps. Scroll down to watch each step 3D unfold in real-time.
        </p>

        <div style={styles.heroCtaGroup}>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="button"
            onClick={onLaunchNow}
            className="sketch-btn sketch-btn-green"
            style={styles.heroLaunchBtn}
          >
            <Pen size={20} />
            <span>Launch a Coin Now</span>
          </motion.button>
        </div>
      </motion.section>

      {/* Scroll-Driven Unfolding Steps Timeline */}
      <div style={styles.stepsTimeline}>
        {steps.map((step, idx) => (
          <ScrollDrivenStep 
            key={idx} 
            step={step} 
            index={idx} 
            total={steps.length} 
          />
        ))}
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
  heroCtaGroup: {
    marginTop: '10px',
  },
  heroLaunchBtn: {
    padding: '14px 32px',
    fontSize: '20px',
  },
  stepsTimeline: {
    display: 'flex',
    flexDirection: 'column',
    gap: '48px',
    position: 'relative',
    padding: '10px 0',
  },
  scrollStepContainer: {
    width: '100%',
  },
  timelineItem: {
    display: 'flex',
    gap: '24px',
    alignItems: 'stretch',
  },
  timelineNodeCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '54px',
    flexShrink: 0,
  },
  timelineNodeBadge: {
    width: '52px',
    height: '52px',
    borderRadius: '14px',
    border: '2.5px solid #1a1a1e',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'var(--font-heading)',
    fontSize: '22px',
    fontWeight: '800',
    color: '#1a1a1e',
    boxShadow: '2.5px 2.5px 0px #1a1a1e',
    zIndex: 2,
  },
  timelineLine: {
    flex: 1,
    width: '3px',
    borderLeft: '3px dashed #1a1a1e',
    margin: '10px 0',
  },
  stepCardWrap: {
    flex: 1,
  },
  stepCard: {
    padding: '30px 26px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    boxShadow: '4px 4px 0px #1a1a1e',
  },
  cardTape: {
    position: 'absolute',
    top: '-12px',
    left: '20px',
    border: '1.5px dashed #1a1a1e',
    padding: '2px 12px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '4px',
  },
  cardTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  cardSubtitle: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#64748b',
    fontFamily: 'var(--font-mono)',
  },
  cardDesc: {
    fontSize: '17px',
    color: '#475569',
    lineHeight: '1.45',
  },
  highlightsBox: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    background: '#f8fafc',
    border: '1.5px dashed #cbd5e1',
    borderRadius: '10px',
    padding: '12px 16px',
    marginTop: '4px',
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
    width: '20px',
    height: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#1a1a1e',
    flexShrink: 0,
  },
  highlightText: {
    fontSize: '15px',
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
