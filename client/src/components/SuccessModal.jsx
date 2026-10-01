import React from 'react';
import { ExternalLink, CheckCircle2, Copy, Rocket, RefreshCw } from 'lucide-react';

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
      <div style={styles.modal} className="glass-panel">
        <div style={styles.iconContainer}>
          <CheckCircle2 size={56} color="#10b981" />
        </div>

        <h2 style={styles.title}>Coin Launched to Pump.fun! 🚀</h2>
        <p style={styles.subtitle}>
          Your hand-drawn coin is now live on Solana bonding curve!
        </p>

        {data.previewImage && (
          <div style={styles.tokenImageWrapper}>
            <img src={data.previewImage} alt="Token Artwork" style={styles.tokenImage} />
            <div style={styles.tokenMeta}>
              <h3>{data.name} (${data.symbol})</h3>
            </div>
          </div>
        )}

        <div style={styles.detailsBox}>
          <div style={styles.detailRow}>
            <span style={styles.detailLabel}>Mint Address:</span>
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
              <span style={styles.detailLabel}>Tx Signature:</span>
              <a 
                href={`https://solscan.io/tx/${data.signature}`}
                target="_blank" 
                rel="noreferrer"
                style={styles.link}
              >
                View on Solscan <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>

        <div style={styles.buttonGroup}>
          <a
            href={data.mintPublicKey ? `https://pump.fun/${data.mintPublicKey}` : 'https://pump.fun'}
            target="_blank"
            rel="noreferrer"
            className="glow-btn"
            style={styles.pumpFunBtn}
          >
            <Rocket size={18} />
            <span>Open on Pump.fun</span>
          </a>

          <button
            type="button"
            onClick={onReset}
            style={styles.secondaryBtn}
          >
            <RefreshCw size={16} />
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    padding: '20px',
  },
  modal: {
    maxWidth: '480px',
    width: '100%',
    padding: '32px',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    boxShadow: '0 20px 50px rgba(0, 0, 0, 0.9), 0 0 30px rgba(16, 185, 129, 0.3)',
    border: '1px solid rgba(16, 185, 129, 0.4)',
  },
  iconContainer: {
    animation: 'bounce 1s infinite alternate',
  },
  title: {
    fontSize: '24px',
    fontWeight: '800',
    color: '#f8fafc',
  },
  subtitle: {
    fontSize: '14px',
    color: '#94a3b8',
  },
  tokenImageWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    padding: '12px 18px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '14px',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  tokenImage: {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    objectFit: 'cover',
    border: '2px solid #10b981',
  },
  tokenMeta: {
    textAlign: 'left',
  },
  detailsBox: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    background: 'var(--bg-input)',
    padding: '14px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.06)',
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: '13px',
  },
  detailLabel: {
    color: '#64748b',
  },
  mintCopyRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  mintAddress: {
    fontFamily: 'var(--font-mono)',
    color: '#38bdf8',
    fontSize: '12px',
  },
  copyBtn: {
    background: 'rgba(255, 255, 255, 0.08)',
    border: 'none',
    color: '#cbd5e1',
    borderRadius: '6px',
    padding: '4px 8px',
    fontSize: '11px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  link: {
    color: '#10b981',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '12px',
  },
  buttonGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    width: '100%',
    marginTop: '8px',
  },
  pumpFunBtn: {
    padding: '14px',
    textDecoration: 'none',
    width: '100%',
    fontSize: '15px',
  },
  secondaryBtn: {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: '#e2e8f0',
    borderRadius: '12px',
    padding: '12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '600',
  }
};
