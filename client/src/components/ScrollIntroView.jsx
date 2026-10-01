import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pen, Coins, Rocket, Check, ArrowDown, ArrowUp, ChevronDown, Sparkles } from '@sketchyicons/react';
import RotatingText from './RotatingText';
import BounceCards from './BounceCards';

import dogeImg from '../../draw/doge.jpeg';
import spodermanImg from '../../draw/spoderman.jpeg';
import dogwiphapImg from '../../draw/dogwiphap.jpeg';
import trompImg from '../../draw/tromp.jpeg';
import solonoImg from '../../draw/solono.png';

const BOUNCE_IMAGES = [
  dogeImg,
  spodermanImg,
  dogwiphapImg,
  trompImg,
  solonoImg
];

const BOUNCE_TRANSFORMS = [
  'rotate(10deg) translate(-140px)',
  'rotate(5deg) translate(-70px)',
  'rotate(-3deg)',
  'rotate(-10deg) translate(70px)',
  'rotate(2deg) translate(140px)'
];

export const ScrollIntroView = ({ onLaunchNow }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const isTransitioningRef = useRef(false);
  const touchStartYRef = useRef(0);

  const totalSlides = 5;

  const goToSlide = (index) => {
    if (index >= 0 && index < totalSlides) {
      setActiveSlide(index);
    }
  };

  const nextSlide = () => {
    if (activeSlide < totalSlides - 1) {
      goToSlide(activeSlide + 1);
    }
  };

  const prevSlide = () => {
    if (activeSlide > 0) {
      goToSlide(activeSlide - 1);
    }
  };

  // Wheel listener with debounce and preventDefault
  useEffect(() => {
    const handleWheel = (e) => {
      // Prevent browser from dragging/scrolling the whole window
      e.preventDefault();

      if (isTransitioningRef.current) return;

      if (Math.abs(e.deltaY) > 15) {
        isTransitioningRef.current = true;
        if (e.deltaY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 550);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        prevSlide();
      }
    };

    const handleTouchStart = (e) => {
      touchStartYRef.current = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (isTransitioningRef.current) return;
      const touchEndY = e.changedTouches[0].clientY;
      const diffY = touchStartYRef.current - touchEndY;

      if (Math.abs(diffY) > 30) {
        isTransitioningRef.current = true;
        if (diffY > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
        setTimeout(() => {
          isTransitioningRef.current = false;
        }, 550);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [activeSlide]);

  const slideVariants = {
    enter: (direction) => ({
      opacity: 0,
      scale: 0.95,
      rotateX: direction > 0 ? 8 : -8,
      y: direction > 0 ? 20 : -20,
    }),
    center: {
      opacity: 1,
      scale: 1,
      rotateX: 0,
      y: 0,
      transition: {
        duration: 0.35,
        ease: [0.16, 1, 0.3, 1],
      },
    },
    exit: (direction) => ({
      opacity: 0,
      scale: 0.95,
      rotateX: direction > 0 ? -8 : 8,
      y: direction > 0 ? -20 : 20,
      transition: {
        duration: 0.25,
        ease: [0.16, 1, 0.3, 1],
      },
    }),
  };

  const steps = [
    {
      num: '01',
      title: 'Doodle your Masterpiece',
      subtitle: 'Step 1 • Canvas Studio',
      desc: 'Use the interactive sketchbook canvas to draw your coin logo. Choose pencil sizes, marker colors, erasers, and sketch stamps. No boring AI images—100% authentic community creativity.',
      highlights: ['Custom stroke widths & colors', 'Undo & clear history stack', 'PNG export with decentralized IPFS metadata'],
      color: 'var(--marker-yellow)',
      tapeColor: '#fef08a',
      icon: <Pen size={32} />
    },
    {
      num: '02',
      title: 'Configure Token Details',
      subtitle: 'Step 2 • Launch Specs',
      desc: 'Give your hand-drawn coin a memorable Name, Ticker ($SYMBOL), and fun meme lore or description. You can also customize initial dev buy amount in SOL and slippage percentage.',
      highlights: ['Custom Coin Name & Ticker', 'Optional initial dev buy on bonding curve', 'Social links (Twitter/X, Telegram, Website)'],
      color: 'var(--marker-green)',
      tapeColor: '#bbf7d0',
      icon: <Coins size={32} />
    },
    {
      num: '03',
      title: 'Deploy to pump.fun & Fee Buybacks',
      subtitle: 'Step 3 • Live Launch & Tokenomics',
      desc: 'Connect your Phantom Solana wallet. Approve the non-custodial launch. All creator trading fees generated across every coin launched on DrawPad are automatically redirected to buy back the main DrawPad token.',
      highlights: ['100% Non-custodial signing with Phantom', 'Trading fees redirected to buy back the main launchpad coin', 'Live Solscan tx signature & instant trading link'],
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
      q: 'How does the Buyback & Fee redirection work?',
      a: 'All platform fees accumulated from tokens launched through DrawPad are programmatically redirected to purchase and buy back the main DrawPad ecosystem coin, driving continuous volume and utility.'
    },
    {
      q: 'Do I need SOL to launch a coin?',
      a: 'Yes, creating a token on pump.fun requires standard Solana network transaction fees (typically ~0.02 SOL), plus whatever amount of SOL you choose for your optional initial dev buy.'
    },
    {
      q: 'Is DrawPad non-custodial?',
      a: 'Yes! DrawPad never holds your private keys or funds. Every launch transaction is signed directly and securely inside your Phantom wallet.'
    }
  ];

  return (
    <div style={styles.deckWrapper}>
      {/* Slide Navigation Pagination Dots */}
      <div style={styles.paginationSidebar}>
        {[0, 1, 2, 3, 4].map((idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => goToSlide(idx)}
            style={{
              ...styles.dotBtn,
              background: activeSlide === idx ? 'var(--ink-black)' : '#e2e8f0',
              transform: activeSlide === idx ? 'scale(1.3)' : 'scale(1)',
              borderColor: activeSlide === idx ? '#1a1a1e' : '#94a3b8',
            }}
            title={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Main Single-Screen Slide Container */}
      <div style={styles.slideDisplayBox}>
        <AnimatePresence mode="wait" custom={1}>
          {/* SLIDE 0: HERO INTRO */}
          {activeSlide === 0 && (
            <motion.div
              key="slide-0"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={styles.cardContainer}
            >
              <div style={styles.slideCard} className="sketch-card">
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
                  Turn rough sketches into live Solana tokens on <strong>pump.fun</strong>. All fees generated from launched coins are redirected to buy back the main DrawPad token.
                </p>

                <div style={styles.slideActionsRow}>
                  <button
                    type="button"
                    onClick={nextSlide}
                    className="sketch-btn sketch-btn-green"
                    style={styles.actionBtn}
                  >
                    <span>Explore Steps (Scroll Down)</span>
                    <ArrowDown size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={onLaunchNow}
                    className="sketch-btn"
                    style={{ ...styles.actionBtn, background: 'var(--marker-cyan)' }}
                  >
                    <Rocket size={18} />
                    <span>Skip to Studio</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 1: STEP 1 */}
          {activeSlide === 1 && (
            <motion.div
              key="slide-1"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={styles.cardContainer}
            >
              <div style={styles.slideCard} className="sketch-card">
                <div style={{ ...styles.tapeTop, background: steps[0].tapeColor }}>
                  <span>{steps[0].subtitle}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[0].color }}>
                    {steps[0].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[0].title}</h2>
                    <span style={styles.cardStepNum}>Phase 01 of 03</span>
                  </div>
                </div>

                <div style={styles.stepOneContentWrapper}>
                  <div style={styles.stepOneLeft}>
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

                  <div style={styles.bounceCardsWrapper}>
                    <BounceCards
                      images={BOUNCE_IMAGES}
                      containerWidth={340}
                      containerHeight={170}
                      animationDelay={0.15}
                      animationStagger={0.06}
                      easeType="elastic.out(1, 0.6)"
                      transformStyles={BOUNCE_TRANSFORMS}
                      enableHover={false}
                    />
                  </div>
                </div>

                <div style={styles.navigationControls}>
                  <button type="button" onClick={prevSlide} className="sketch-btn" style={styles.miniBtn}>
                    <ArrowUp size={16} /> Back
                  </button>
                  <button type="button" onClick={nextSlide} className="sketch-btn sketch-btn-green" style={styles.miniBtn}>
                    Next: Token Setup <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 2: STEP 2 */}
          {activeSlide === 2 && (
            <motion.div
              key="slide-2"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={styles.cardContainer}
            >
              <div style={styles.slideCard} className="sketch-card">
                <div style={{ ...styles.tapeTop, background: steps[1].tapeColor }}>
                  <span>{steps[1].subtitle}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[1].color }}>
                    {steps[1].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[1].title}</h2>
                    <span style={styles.cardStepNum}>Phase 02 of 03</span>
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

                <div style={styles.navigationControls}>
                  <button type="button" onClick={prevSlide} className="sketch-btn" style={styles.miniBtn}>
                    <ArrowUp size={16} /> Back
                  </button>
                  <button type="button" onClick={nextSlide} className="sketch-btn sketch-btn-green" style={styles.miniBtn}>
                    Next: Live Deploy <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 3: STEP 3 */}
          {activeSlide === 3 && (
            <motion.div
              key="slide-3"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={styles.cardContainer}
            >
              <div style={styles.slideCard} className="sketch-card">
                <div style={{ ...styles.tapeTop, background: steps[2].tapeColor }}>
                  <span>{steps[2].subtitle}</span>
                </div>

                <div style={styles.cardHeader}>
                  <div style={{ ...styles.stepIconBox, background: steps[2].color }}>
                    {steps[2].icon}
                  </div>
                  <div>
                    <h2 style={styles.cardTitle}>{steps[2].title}</h2>
                    <span style={styles.cardStepNum}>Phase 03 of 03</span>
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

                <div style={styles.navigationControls}>
                  <button type="button" onClick={prevSlide} className="sketch-btn" style={styles.miniBtn}>
                    <ArrowUp size={16} /> Back
                  </button>
                  <button type="button" onClick={nextSlide} className="sketch-btn sketch-btn-green" style={styles.miniBtn}>
                    Got Questions? <ArrowDown size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SLIDE 4: FAQS & READY TO LAUNCH */}
          {activeSlide === 4 && (
            <motion.div
              key="slide-4"
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={styles.cardContainer}
            >
              <div style={styles.slideCard} className="sketch-card">
                <div style={{ ...styles.tapeTop, background: '#fed7aa' }}>
                  <span>GOT QUESTIONS? • FAQ & LAUNCH</span>
                </div>

                <h2 style={{ ...styles.cardTitle, textAlign: 'center', marginTop: '4px' }}>
                  Ready to launch your hand-drawn coin?
                </h2>

                <div style={styles.faqListCompact}>
                  {faqs.map((faq, idx) => (
                    <div key={idx} style={styles.faqItemCompact}>
                      <div style={styles.faqQ}>
                        <Sparkles size={16} style={{ color: '#ca8a04', flexShrink: 0 }} />
                        <span>{faq.q}</span>
                      </div>
                      <div style={styles.faqA}>{faq.a}</div>
                    </div>
                  ))}
                </div>

                <div style={styles.ctaBottomRow}>
                  <button type="button" onClick={prevSlide} className="sketch-btn" style={styles.miniBtn}>
                    <ArrowUp size={16} /> Back
                  </button>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    type="button"
                    onClick={onLaunchNow}
                    className="sketch-btn sketch-btn-green"
                    style={styles.bigLaunchBtn}
                  >
                    <Rocket size={22} />
                    <span>Open Drawing Studio</span>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Slide Navigation Hint Footer */}
      <div style={styles.bottomHint}>
        <span>Slide {activeSlide + 1} of {totalSlides} • Scroll or use arrow keys / dots to navigate</span>
      </div>
    </div>
  );
};

const styles = {
  deckWrapper: {
    width: '100%',
    maxWidth: '820px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 'calc(100vh - 160px)',
  },
  paginationSidebar: {
    position: 'absolute',
    right: '-36px',
    top: '50%',
    transform: 'translateY(-50%)',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    zIndex: 10,
  },
  dotBtn: {
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    border: '2px solid',
    cursor: 'pointer',
    padding: 0,
    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    boxShadow: '1px 1px 0px rgba(0,0,0,0.2)',
  },
  slideDisplayBox: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    perspective: '1200px',
    minHeight: '480px',
  },
  cardContainer: {
    width: '100%',
    transformStyle: 'preserve-3d',
  },
  slideCard: {
    padding: '36px 30px 28px 30px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    boxShadow: '4px 4px 0px #1a1a1e',
    borderRadius: '16px',
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
    display: 'inline-flex',
    alignSelf: 'center',
    alignItems: 'center',
    gap: '8px',
    background: '#fef9c3',
    border: '1.5px solid #1a1a1e',
    borderRadius: '16px',
    padding: '3px 14px',
    boxShadow: '1px 1px 0px #1a1a1e',
    marginTop: '4px',
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
    fontSize: '42px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
    textAlign: 'center',
  },
  heroDesc: {
    fontSize: '19px',
    color: '#475569',
    textAlign: 'center',
    maxWidth: '620px',
    margin: '0 auto',
    lineHeight: '1.45',
  },
  slideActionsRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '14px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  actionBtn: {
    padding: '12px 24px',
    fontSize: '18px',
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
  cardStepNum: {
    fontSize: '14px',
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
  stepOneContentWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    flexWrap: 'wrap',
  },
  stepOneLeft: {
    flex: '1 1 300px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  bounceCardsWrapper: {
    flex: '0 0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '10px 0',
  },
  navigationControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '8px',
  },
  miniBtn: {
    padding: '8px 18px',
    fontSize: '16px',
  },
  faqListCompact: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  faqItemCompact: {
    background: '#f8fafc',
    border: '1.5px solid #1a1a1e',
    borderRadius: '10px',
    padding: '12px 16px',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  faqQ: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontWeight: '700',
    fontSize: '17px',
    fontFamily: 'var(--font-heading)',
    color: '#1a1a1e',
  },
  faqA: {
    fontSize: '15px',
    color: '#475569',
    marginTop: '4px',
    paddingLeft: '24px',
    lineHeight: '1.4',
  },
  ctaBottomRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '10px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  bigLaunchBtn: {
    padding: '12px 28px',
    fontSize: '19px',
  },
  bottomHint: {
    marginTop: '16px',
    fontSize: '15px',
    color: '#ffffff',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    textAlign: 'center',
    textShadow: '2px 2px 0px #000000, -1px -1px 0px #000000, 1px -1px 0px #000000, -1px 1px 0px #000000, 0px 2px 0px #000000, 2px 0px 0px #000000',
    letterSpacing: '0.5px',
  },
};

