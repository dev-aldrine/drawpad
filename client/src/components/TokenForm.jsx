import React from 'react';
import { Coins, Sparkles, Globe, MessageCircle } from 'lucide-react';

export const TokenForm = ({
  formData,
  onChange,
  onLaunch,
  loading,
  statusMessage,
  isWalletConnected
}) => {
  return (
    <div style={styles.container} className="sketch-card sketch-card-tilted-right">
      {/* Tape decoration */}
      <div style={styles.tape}>
        <span>📋 LAUNCHPAD SPECS</span>
      </div>

      <div style={styles.header}>
        <div style={styles.badge}>
          <Coins size={20} color="#1a1a1e" />
          <span>Coin Profile 🚀</span>
        </div>
        <span style={styles.pumpfunTag}>
          ⚡ pump.fun
        </span>
      </div>

      <div style={styles.formGrid}>
        {/* Token Name */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Coin Name <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Doodle Dog"
            value={formData.name}
            onChange={(e) => onChange('name', e.target.value)}
            style={styles.input}
            maxLength={32}
            required
          />
        </div>

        {/* Token Ticker */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Ticker / Symbol <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. DOODLE"
            value={formData.symbol}
            onChange={(e) => onChange('symbol', e.target.value.toUpperCase())}
            style={{ ...styles.input, textTransform: 'uppercase', fontFamily: 'var(--font-mono)' }}
            maxLength={10}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.inputGroupFull}>
          <label style={styles.label}>
            Description / Lore <span style={styles.required}>*</span>
          </label>
          <textarea
            placeholder="Write a funny story or lore for your hand-drawn coin..."
            value={formData.description}
            onChange={(e) => onChange('description', e.target.value)}
            style={styles.textarea}
            rows={3}
            maxLength={500}
            required
          />
        </div>

        {/* Initial Buy SOL */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Dev Buy (SOL)
          </label>
          <div style={styles.inputWithIcon}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={formData.initialBuySol}
              onChange={(e) => onChange('initialBuySol', e.target.value)}
              style={styles.input}
            />
            <span style={styles.currencyTag}>SOL</span>
          </div>
          <span style={styles.helperText}>First buy on bonding curve</span>
        </div>

        {/* Slippage */}
        <div style={styles.inputGroup}>
          <label style={styles.label}>
            Slippage (%)
          </label>
          <div style={styles.inputWithIcon}>
            <input
              type="number"
              min="1"
              max="50"
              placeholder="10"
              value={formData.slippage}
              onChange={(e) => onChange('slippage', e.target.value)}
              style={styles.input}
            />
            <span style={styles.currencyTag}>%</span>
          </div>
          <span style={styles.helperText}>Recommended: 10%</span>
        </div>

        {/* Socials Divider */}
        <div style={styles.divider}>
          <span>🔗 Social Links (Optional)</span>
        </div>

        {/* Twitter / X */}
        <div style={styles.inputGroupFull}>
          <div style={styles.socialInputWrapper}>
            <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#1a1a1e' }}>𝕏</span>
            <input
              type="url"
              placeholder="Twitter / X (https://x.com/...)"
              value={formData.twitter}
              onChange={(e) => onChange('twitter', e.target.value)}
              style={styles.socialInput}
            />
          </div>
        </div>

        {/* Telegram */}
        <div style={styles.inputGroupFull}>
          <div style={styles.socialInputWrapper}>
            <MessageCircle size={17} color="#16a34a" />
            <input
              type="url"
              placeholder="Telegram Link (https://t.me/...)"
              value={formData.telegram}
              onChange={(e) => onChange('telegram', e.target.value)}
              style={styles.socialInput}
            />
          </div>
        </div>

        {/* Website */}
        <div style={styles.inputGroupFull}>
          <div style={styles.socialInputWrapper}>
            <Globe size={17} color="#0284c7" />
            <input
              type="url"
              placeholder="Website Link (https://...)"
              value={formData.website}
              onChange={(e) => onChange('website', e.target.value)}
              style={styles.socialInput}
            />
          </div>
        </div>
      </div>

      {/* Status Message */}
      {statusMessage && (
        <div style={styles.statusBox}>
          <span style={{ fontSize: '18px' }}>✏️</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Launch Action Button */}
      <button
        type="button"
        onClick={onLaunch}
        disabled={loading || !formData.name || !formData.symbol || !formData.description}
        className="sketch-btn sketch-btn-green"
        style={styles.launchButton}
      >
        {loading ? (
          <>
            <span>⏳ Inscribing on Solana...</span>
          </>
        ) : (
          <>
            <Sparkles size={20} />
            <span>{!isWalletConnected ? '👉 Connect Phantom to Launch' : '🚀 Mint & Launch to Pump.fun'}</span>
          </>
        )}
      </button>

      <div style={styles.footerNote}>
        <span>⚡ Hand-signed on Phantom • Verified by PumpPortal</span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '540px',
    width: '100%',
    position: 'relative',
  },
  tape: {
    position: 'absolute',
    top: '-14px',
    left: '50%',
    transform: 'translateX(-50%) rotate(1deg)',
    background: '#bbf7d0',
    border: '2px dashed #1a1a1e',
    padding: '2px 14px',
    fontFamily: 'var(--font-mono)',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '0.08em',
    color: '#1a1a1e',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '6px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  pumpfunTag: {
    fontSize: '13px',
    fontWeight: '700',
    color: '#1a1a1e',
    background: '#fed7aa',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '2px 8px',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    fontFamily: 'var(--font-mono)',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '12px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  label: {
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1e',
  },
  required: {
    color: '#dc2626',
  },
  input: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#1a1a1e',
    fontSize: '16px',
    fontFamily: 'var(--font-handwriting)',
    outline: 'none',
    boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.05)',
  },
  textarea: {
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '8px 12px',
    color: '#1a1a1e',
    fontSize: '16px',
    fontFamily: 'var(--font-handwriting)',
    outline: 'none',
    resize: 'vertical',
    boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.05)',
  },
  inputWithIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencyTag: {
    position: 'absolute',
    right: '10px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#475569',
    fontFamily: 'var(--font-mono)',
  },
  helperText: {
    fontSize: '13px',
    color: '#64748b',
  },
  divider: {
    gridColumn: '1 / -1',
    borderTop: '2px dashed #cbd5e1',
    paddingTop: '8px',
    marginTop: '4px',
    fontSize: '15px',
    fontWeight: '700',
    color: '#334155',
  },
  socialInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    padding: '0 10px',
  },
  socialInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '8px 0',
    color: '#1a1a1e',
    fontSize: '15px',
    fontFamily: 'var(--font-handwriting)',
    outline: 'none',
  },
  statusBox: {
    padding: '10px 14px',
    background: '#fef08a',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1a1a1e',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    boxShadow: '2px 2px 0px #1a1a1e',
  },
  launchButton: {
    padding: '14px',
    fontSize: '20px',
    width: '100%',
    marginTop: '4px',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '14px',
    color: '#64748b',
    fontFamily: 'var(--font-handwriting)',
  }
};
