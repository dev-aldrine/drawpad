import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Sparkles, RefreshCw, Pen, ExternalLink } from '@sketchyicons/react';

export const LaunchedCoinsView = ({ onStartNewCoin }) => {
  const [coins, setCoins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchCoins = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/launched-coins');
      const data = await res.json();
      if (data.coins) {
        setCoins(data.coins);
      }
    } catch (err) {
      console.error('Failed to fetch launched coins:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoins();
  }, []);

  const filteredCoins = coins.filter(
    (c) =>
      c.name.toLowerCase().includes(filter.toLowerCase()) ||
      c.symbol.toLowerCase().includes(filter.toLowerCase()) ||
      c.description.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div style={styles.container}>
      {/* Header Banner */}
      <div style={styles.headerCard} className="sketch-card">
        <div style={styles.tapeHeader}>
          <span>PUMP.FUN LIVE REGISTRY</span>
        </div>

        <div style={styles.headerContent}>
          <div>
            <div style={styles.badgeRow}>
              <Sparkles size={16} style={{ color: '#ca8a04' }} />
              <span style={styles.badgeText}>COMMUNITY SHOWCASE</span>
            </div>
            <h1 style={styles.title}>
              Launched <span className="highlighter-tape-cyan">Coins</span>
            </h1>
            <p style={styles.subtitle}>
              Browse hand-drawn coins deployed live to <strong>pump.fun</strong> via DrawPad bonding curves.
            </p>
          </div>

          <div style={styles.headerButtons}>
            <button
              type="button"
              onClick={fetchCoins}
              className="sketch-btn"
              style={styles.refreshBtn}
              title="Refresh list"
            >
              <RefreshCw size={18} />
              <span>Refresh</span>
            </button>
            <button
              type="button"
              onClick={onStartNewCoin}
              className="sketch-btn sketch-btn-green"
              style={styles.newCoinBtn}
            >
              <Pen size={18} />
              <span>Draw & Launch Coin</span>
            </button>
          </div>
        </div>

        {/* Search / Filter bar */}
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by coin name, ticker, or keyword..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={styles.searchInput}
          />
          <div style={styles.coinCountBadge}>
            <span>{filteredCoins.length} {filteredCoins.length === 1 ? 'Coin' : 'Coins'}</span>
          </div>
        </div>
      </div>

      {/* Grid of Launched Coins */}
      {loading ? (
        <div style={styles.loadingBox} className="sketch-card">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}>
            <RefreshCw size={32} />
          </motion.div>
          <span>Loading community doodle coins...</span>
        </div>
      ) : filteredCoins.length === 0 ? (
        <div style={styles.emptyBox} className="sketch-card">
          <p style={styles.emptyText}>No coins found matching "{filter}"</p>
          <button
            type="button"
            onClick={onStartNewCoin}
            className="sketch-btn sketch-btn-green"
          >
            <Pen size={18} />
            <span>Be the first to draw this!</span>
          </button>
        </div>
      ) : (
        <div style={styles.coinGrid}>
          {filteredCoins.map((coin, index) => (
            <motion.div
              key={coin.mintPublicKey || index}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
              style={styles.coinCard}
              className="sketch-card"
            >
              {/* Card Tape */}
              <div style={styles.cardTape}>
                <span>${coin.symbol}</span>
              </div>

              {/* Artwork Box */}
              <div style={styles.imageBox}>
                {coin.imageUrl ? (
                  <img
                    src={coin.imageUrl}
                    alt={coin.name}
                    style={styles.coinImg}
                  />
                ) : (
                  <div style={styles.placeholderImg}>
                    <Pen size={32} />
                  </div>
                )}
              </div>

              {/* Coin Details */}
              <div style={styles.coinInfo}>
                <div style={styles.titleRow}>
                  <h3 style={styles.coinName}>{coin.name}</h3>
                  <span style={styles.coinTicker}>${coin.symbol}</span>
                </div>

                <p style={styles.coinDesc}>{coin.description}</p>

                <div style={styles.metaRow}>
                  <span style={styles.metaLabel}>Mint:</span>
                  <span style={styles.metaValue} title={coin.mintPublicKey}>
                    {coin.mintPublicKey
                      ? `${coin.mintPublicKey.slice(0, 4)}...${coin.mintPublicKey.slice(-4)}`
                      : 'N/A'}
                  </span>
                </div>

                {coin.initialBuySol > 0 && (
                  <div style={styles.metaRow}>
                    <span style={styles.metaLabel}>Dev Buy:</span>
                    <span style={styles.metaValueGreen}>{coin.initialBuySol} SOL</span>
                  </div>
                )}

                {/* External Action Links */}
                <div style={styles.cardActions}>
                  <a
                    href={
                      coin.mintPublicKey
                        ? `https://pump.fun/${coin.mintPublicKey}`
                        : 'https://pump.fun'
                    }
                    target="_blank"
                    rel="noreferrer noopener"
                    className="sketch-btn sketch-btn-green"
                    style={styles.cardActionBtn}
                  >
                    <Rocket size={16} />
                    <span>Trade on pump.fun</span>
                  </a>

                  {coin.signature && (
                    <a
                      href={`https://solscan.io/tx/${coin.signature}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="sketch-btn"
                      style={styles.solscanBtn}
                      title="View transaction on Solscan"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    width: '100%',
    maxWidth: '920px',
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  headerCard: {
    padding: '28px 24px 22px 24px',
    backgroundColor: '#ffffff',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    borderRadius: '16px',
  },
  tapeHeader: {
    position: 'absolute',
    top: '-12px',
    left: '28px',
    background: '#bbf7d0',
    border: '1.5px dashed #1a1a1e',
    padding: '2px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  badgeRow: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#fef9c3',
    border: '1.5px solid #1a1a1e',
    borderRadius: '12px',
    padding: '2px 10px',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    marginBottom: '6px',
  },
  badgeText: {
    color: '#1a1a1e',
  },
  title: {
    fontSize: '34px',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: '#1a1a1e',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '17px',
    color: '#475569',
    marginTop: '4px',
  },
  headerButtons: {
    display: 'flex',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  refreshBtn: {
    padding: '8px 16px',
    fontSize: '16px',
    background: '#f8fafc',
  },
  newCoinBtn: {
    padding: '10px 20px',
    fontSize: '17px',
  },
  searchRow: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    fontSize: '16px',
    fontFamily: 'var(--font-handwriting)',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
    backgroundColor: '#f8fafc',
    outline: 'none',
    boxShadow: 'inset 1px 1px 2px rgba(0,0,0,0.06)',
  },
  coinCountBadge: {
    background: '#fef08a',
    border: '1.5px solid #1a1a1e',
    borderRadius: '8px',
    padding: '8px 14px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
  },
  loadingBox: {
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '14px',
    backgroundColor: '#ffffff',
    fontSize: '18px',
    fontWeight: '700',
  },
  emptyBox: {
    padding: '48px 24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '16px',
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#64748b',
  },
  coinGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
    gap: '18px',
    width: '100%',
  },
  coinCard: {
    backgroundColor: '#ffffff',
    padding: '20px 18px',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    borderRadius: '14px',
  },
  cardTape: {
    position: 'absolute',
    top: '-10px',
    right: '16px',
    background: '#fef08a',
    border: '1.5px dashed #1a1a1e',
    padding: '2px 10px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  imageBox: {
    width: '100%',
    height: '140px',
    borderRadius: '10px',
    border: '2px solid #1a1a1e',
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 1px 1px 3px rgba(0,0,0,0.05)',
  },
  coinImg: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  placeholderImg: {
    color: '#94a3b8',
  },
  coinInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  titleRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    gap: '8px',
  },
  coinName: {
    fontSize: '20px',
    fontWeight: '800',
    fontFamily: 'var(--font-heading)',
    color: '#1a1a1e',
    lineHeight: '1.2',
  },
  coinTicker: {
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
    color: '#0284c7',
  },
  coinDesc: {
    fontSize: '15px',
    color: '#475569',
    lineHeight: '1.4',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
    minHeight: '42px',
  },
  metaRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '13px',
    fontFamily: 'var(--font-mono)',
    borderTop: '1px dashed #e2e8f0',
    paddingTop: '6px',
  },
  metaLabel: {
    color: '#64748b',
    fontWeight: '600',
  },
  metaValue: {
    color: '#1a1a1e',
    fontWeight: '700',
  },
  metaValueGreen: {
    color: '#16a34a',
    fontWeight: '700',
  },
  cardActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '6px',
  },
  cardActionBtn: {
    flex: 1,
    padding: '8px 12px',
    fontSize: '15px',
    textDecoration: 'none',
  },
  solscanBtn: {
    padding: '8px 12px',
    fontSize: '15px',
    textDecoration: 'none',
    background: '#f8fafc',
  },
};
