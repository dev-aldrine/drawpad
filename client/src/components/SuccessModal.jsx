import React from 'react';
import { ExternalLink, CheckCircle, Copy, Rocket, RotateCcw } from 'lucide-react';

export const SuccessModal = ({ data, onClose, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  if (!data) return null;

  const copyAddress = () => {
    if (data.mintPublicKey) {
      navigator.clipboard.writeText(data.mintPublicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal} className="sketch-card">
        {/* Tape header */}
        <div style={styles.tape}>
          <span>🎉 LAUNCH SUCCESSFUL</span>
        </div>

        <div style={styles.iconContainer}>
          <span style={{ fontSize: '48px' }}>🚀🎨</span>
        </div>

        <h2 style={styles.title}>Your Coin is Live on Pump.fun!</h2>
        <p style={styles.subtitle}>
          Your hand-drawn masterpiece is now tradable on Solana bonding curve.
        </p>

        {data.previewImage && (
          <div style={styles.tokenImageWrapper}>
            <img src={data.previewImage} alt="Token Artwork" style={styles.tokenImage} />
            <div style={styles.tokenMeta}>
              <h3 style={{ fontSize: '22px', fontFamily: 'var(--font-heading)' }}>
                {data.name} <span style={{ background: '#fef08a', padding: '0 6px', border: '1px solid #1a1a1e', borderRadius: '4px' }}>${data.symbol}</span>
              </h3>
            </div>
          </div>
        )}

        <div style={styles.detailsBox}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Mint Key:</span>
            <div style={styles.mintCopyRow}>
              <span style={styles.mintAddress}>
                {data.mintPublicKey ? `${data.mintPublicKey.slice(0, 8)}...${data.mintPublicKey.slice(-8)}` : 'Generating...'}
              </span>
              <button type="button" onClick={copyAddress} style={styles.copyBtn}>
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
          </div>

          {data.signature && (
            <div style={styles.detailRow}>
              <span style={styles.detailLabel}>Solana Tx:</span>
              <a 
                href={`https://solscan.io/tx/${data.signature}`}
                target="_blank" 
                rel="noreferrer"
                style={styles.link}
              >
                View Solscan <ExternalLink size={14} />
              </a>
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <a
            href={data.mintPublicKey ? `https://pump.fun/${data.mintPublicKey}` : 'https://pump.fun'}
            target="_blank"
            rel="noreferrer"
            className="sketch-btn sketch-btn-green"
            style={styles.pumpFunBtn}
          >
            <span>👉 View on pump.fun</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            className="sketch-btn"
            style={styles.secondaryBtn}
          >
            <RotateCcw size={16} />
            <span>Draw Another Coin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(26, 26, 30, 0.65)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    maxWidth: '480px',
    width: '100%',
    padding: '36px 28px 28px 28px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '14px',
    backgroundColor: '#ffffff',
    position: 'relative',
  },
  tape: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%) rotate(-1deg)',
    background: '#fef08a',
    border: '2px dashed #1a1a1e',
    padding: '2px 16px',
    fontFamily: 'var(--font-mono)',
    fontSize: '12px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  iconContainer: {
    margin: '4px 0',
  },
  title: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  subtitle: {
    fontSize: '16px',
    color: '#475569',
  },
  tokenImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    padding: '10px 14px',
    background: '#f8fafc',
    borderRadius: '10px',
    width: '100%',
    border: '2px solid #1a1a1e',
  },
  tokenImage: {
    width: '60px',
    height: '60px',
    borderRadius: '8px',
    objectFit: 'cover',
    border: '2px solid #1a1a1e',
    backgroundColor: '#ffffff',
  },
  tokenMeta: {
    textAlign: 'left',
  },
  detailsBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: '#f8fafc',
    padding: '12px',
    borderRadius: '10px',
    border: '2px dashed #94a3b8',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '15px',
  },
  detailLabel: {
    color: '#64748b',
    fontWeight: '700',
  },
  mintCopyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  mintAddress: {
    fontFamily: 'var(--font-mono)',
    color: '#1a1a1e',
    fontSize: '13px',
    fontWeight: '700',
  },
  copyBtn: {
    background: '#ffffff',
    border: '1.5px solid #1a1a1e',
    color: '#1a1a1e',
    borderRadius: '6px',
    padding: '2px 8px',
    fontSize: '12px',
    fontWeight: '700',
    fontFamily: 'var(--font-handwriting)',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    boxShadow: '1px 1px 0px #1a1a1e',
  },
  link: {
    color: '#16a34a',
    textDecoration: 'underline',
    fontWeight: '700',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '14px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    marginTop: '6px',
  },
  pumpFunBtn: {
    textDecoration: 'none',
    width: '100%',
    padding: '12px',
    fontSize: '18px',
  },
  secondaryBtn: {
    width: '100%',
    padding: '10px',
    fontSize: '16px',
  }
};
