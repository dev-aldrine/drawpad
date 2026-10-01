import React, { useState } from 'react';
import { Copy, Check } from '@sketchyicons/react';

export const ContractBar = ({ ca, twitter, onRefresh }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!ca) return;
    try {
      await navigator.clipboard.writeText(ca);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy CA:', err);
    }
  };

  const truncatedCA = ca
    ? `${ca.slice(0, 6)}...${ca.slice(-6)}`
    : 'Not launched yet';

  return (
    <div
      className="sketch-card"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '10px',
        padding: '7px 16px',
        background: '#ffffff',
        border: '2.5px solid #1a1a1e',
        borderRadius: '10px 14px 9px 12px',
        boxShadow: '3px 3px 0px #1a1a1e',
        position: 'relative',
        zIndex: 10,
        margin: '0 0 6px 0'
      }}
    >
      {/* CA Address Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <div
          style={{
            background: '#fef08a',
            border: '1.5px solid #1a1a1e',
            borderRadius: '6px',
            padding: '2px 8px',
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '13px',
            fontWeight: '800',
            color: '#1a1a1e',
            letterSpacing: '0.04em',
            boxShadow: '1px 1px 0px #1a1a1e'
          }}
        >
          CA
        </div>

        <div
          onClick={handleCopy}
          title={ca ? 'Click to copy full CA' : 'No CA set'}
          style={{
            fontFamily: 'var(--font-mono, monospace)',
            fontSize: '14px',
            fontWeight: '700',
            color: ca ? '#0f172a' : '#94a3b8',
            cursor: ca ? 'pointer' : 'default',
            padding: '3px 8px',
            borderRadius: '6px',
            background: ca ? '#f8fafc' : 'transparent',
            border: ca ? '1px dashed #94a3b8' : 'none',
            userSelect: 'all',
            transition: 'all 0.15s ease'
          }}
        >
          {ca || 'CA will appear here once coin is live'}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {ca && (
          <button
            type="button"
            onClick={handleCopy}
            className="sketch-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: copied ? '#bbf7d0' : 'var(--marker-cyan, #a5f3fc)',
              border: '2px solid #1a1a1e',
              borderRadius: '8px',
              boxShadow: '1.5px 1.5px 0px #1a1a1e',
              fontSize: '14px',
              fontWeight: '800',
              fontFamily: 'var(--font-handwriting, inherit)',
              cursor: 'pointer',
              color: '#1a1a1e',
              outline: 'none',
              transition: 'all 0.15s ease'
            }}
          >
            {copied ? (
              <>
                <Check size={16} color="#16a34a" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={16} />
                <span>Copy CA</span>
              </>
            )}
          </button>
        )}

        {twitter && (
          <a
            href={twitter.startsWith('http') ? twitter : `https://x.com/${twitter.replace('@', '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="sketch-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              background: '#ffffff',
              border: '2px solid #1a1a1e',
              borderRadius: '8px',
              boxShadow: '1.5px 1.5px 0px #1a1a1e',
              fontSize: '14px',
              fontWeight: '800',
              fontFamily: 'var(--font-handwriting, inherit)',
              color: '#1a1a1e',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            {/* Custom 𝕏 icon */}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>Follow 𝕏</span>
          </a>
        )}
      </div>
    </div>
  );
};

export default ContractBar;
