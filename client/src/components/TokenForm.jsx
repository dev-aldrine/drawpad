import React from 'react';
import { Sparkles, Coins, HelpCircle, ExternalLink, Globe, MessageCircle } from 'lucide-react';

export const TokenForm = ({
  formData,
  onChange,
  onLaunch,
  loading,
  statusMessage,
  isWalletConnected
}) => {
  return (
    <div style={styles.container} className="glass-panel">
      <div style={styles.header}>
        <div style={styles.badge}>
          <Coins size={16} color="#06b6d4" />
          <span>Coin Information</span>
        </div>
        <span style={styles.pumpfunBadge}>
          ⚡ Pump.fun Launchpad
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
            placeholder="e.g. Pepe The Painter"
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
            Coin Ticker / Symbol <span style={styles.required}>*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. DRAW"
            value={formData.symbol}
            onChange={(e) => onChange('symbol', e.target.value.toUpperCase())}
            style={{ ...styles.input, textTransform: 'uppercase' }}
            maxLength={10}
            required
          />
        </div>

        {/* Description */}
        <div style={styles.inputGroupFull}>
          <label style={styles.label}>
            Description <span style={styles.required}>*</span>
          </label>
          <textarea
            placeholder="Tell the Solana world about your hand-drawn coin..."
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
            Initial Dev Buy (SOL)
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
          <span style={styles.helperText}>Optional: Buy your own coin upon creation</span>
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
          <span style={styles.helperText}>Default: 10% recommended for launch</span>
        </div>

        {/* Socials Divider */}
        <div style={styles.divider}>
          <span>Social Links (Optional)</span>
        </div>

        {/* Twitter / X */}
        <div style={styles.inputGroupFull}>
          <div style={styles.socialInputWrapper}>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#38bdf8' }}>𝕏</span>
            <input
              type="url"
              placeholder="Twitter / X Link (https://x.com/...)"
              value={formData.twitter}
              onChange={(e) => onChange('twitter', e.target.value)}
              style={styles.socialInput}
            />
          </div>
        </div>

        {/* Telegram */}
        <div style={styles.inputGroupFull}>
          <div style={styles.socialInputWrapper}>
            <MessageCircle size={15} color="#22c55e" />
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
            <Globe size={15} color="#a855f7" />
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
          <span style={styles.statusSpinner}>✨</span>
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Action Button */}
      <button
        type="button"
        onClick={onLaunch}
        disabled={loading || !formData.name || !formData.symbol || !formData.description}
        className="glow-btn"
        style={styles.launchButton}
      >
        {loading ? (
          <>
            <span style={styles.loaderIcon}>⏳</span>
            <span>Launching to Pump.fun...</span>
          </>
        ) : (
          <>
            <Sparkles size={18} />
            <span>{!isWalletConnected ? 'Connect Phantom to Launch' : 'Create & Launch Coin'}</span>
          </>
        )}
      </button>

      <div style={styles.footerNote}>
        <span>🔒 Powered by <strong>PumpPortal Trade API</strong> & <strong>pump.fun</strong></span>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    maxWidth: '560px',
    width: '100%',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '8px',
  },
  badge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#e2e8f0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  pumpfunBadge: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#10b981',
    background: 'rgba(16, 185, 129, 0.12)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '20px',
    padding: '4px 10px',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '14px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  inputGroupFull: {
    gridColumn: '1 / -1',
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#cbd5e1',
  },
  required: {
    color: '#ef4444',
  },
  input: {
    background: 'var(--bg-input)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  textarea: {
    background: 'var(--bg-input)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#fff',
    fontSize: '14px',
    fontFamily: 'inherit',
    outline: 'none',
    resize: 'vertical',
  },
  inputWithIcon: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  currencyTag: {
    position: 'absolute',
    right: '12px',
    fontSize: '12px',
    fontWeight: '700',
    color: '#64748b',
    fontFamily: 'var(--font-mono)',
  },
  helperText: {
    fontSize: '11px',
    color: '#64748b',
  },
  divider: {
    gridColumn: '1 / -1',
    borderTop: '1px solid rgba(255, 255, 255, 0.08)',
    paddingTop: '10px',
    marginTop: '6px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#94a3b8',
  },
  socialInputWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: 'var(--bg-input)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '10px',
    padding: '0 12px',
  },
  socialInput: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '10px 0',
    color: '#fff',
    fontSize: '13px',
    outline: 'none',
  },
  statusBox: {
    padding: '12px 16px',
    background: 'rgba(6, 182, 212, 0.1)',
    border: '1px solid rgba(6, 182, 212, 0.3)',
    borderRadius: '10px',
    fontSize: '13px',
    color: '#38bdf8',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  launchButton: {
    padding: '16px',
    fontSize: '16px',
    width: '100%',
    letterSpacing: '0.02em',
  },
  footerNote: {
    textAlign: 'center',
    fontSize: '12px',
    color: '#64748b',
  }
};
