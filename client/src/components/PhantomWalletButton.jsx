import React, { useState, useRef, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { Wallet, LogOut, Copy, Check } from '@sketchyicons/react';

export const PhantomWalletButton = () => {
  const { wallet, wallets, select, connect, disconnect, connected, connecting, disconnecting, publicKey } = useWallet();
  const { setVisible } = useWalletModal();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleClick = async () => {
    if (connected) {
      setDropdownOpen((prev) => !prev);
      return;
    }

    const phantom = wallets.find((w) => w.adapter.name.toLowerCase().includes('phantom')) || wallets[0];
    if (phantom) {
      try {
        select(phantom.adapter.name);
        await phantom.adapter.connect();
        return;
      } catch (err) {
        if (
          err?.name === 'WalletConnectionError' ||
          err?.message?.includes('User rejected') ||
          err?.message?.includes('rejected the request')
        ) {
          return;
        }
        console.warn('Phantom connection attempt, opening wallet selector:', err);
      }
    }

    // Fallback: Open Solana Wallet Modal
    setVisible(true);
  };

  const handleCopy = async (e) => {
    e.stopPropagation();
    if (publicKey) {
      await navigator.clipboard.writeText(publicKey.toBase58());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const handleDisconnect = async (e) => {
    e.stopPropagation();
    setDropdownOpen(false);
    await disconnect();
  };

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}..${publicKey.toBase58().slice(-4)}`
    : '';

  return (
    <div ref={dropdownRef} style={{ position: 'relative', display: 'inline-block' }}>
      <button
        type="button"
        onClick={handleClick}
        disabled={connecting || disconnecting}
        className="wallet-adapter-button sketch-btn"
        style={{
          fontFamily: 'var(--font-handwriting)',
          fontSize: '17px',
          fontWeight: '700',
          color: '#1a1a1e',
          background: connected ? '#bbf7d0' : 'var(--marker-cyan)',
          border: '2.5px solid #1a1a1e',
          borderRadius: '10px 12px 9px 13px',
          boxShadow: '2px 2px 0px #1a1a1e',
          height: '42px',
          padding: '0 16px',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          outline: 'none',
          transition: 'all 0.15s ease'
        }}
      >
        <Wallet size={18} />
        <span>
          {connecting
            ? 'Connecting...'
            : disconnecting
            ? 'Disconnecting...'
            : connected
            ? truncatedAddress
            : 'Connect Phantom'}
        </span>
      </button>

      {/* Connected Dropdown menu */}
      {connected && dropdownOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            background: '#ffffff',
            border: '2.5px solid #1a1a1e',
            borderRadius: '10px',
            boxShadow: '3px 3px 0px #1a1a1e',
            padding: '6px',
            display: 'flex',
            flexDirection: 'column',
            gap: '4px',
            minWidth: '160px',
            zIndex: 100,
            animation: 'pulse-subtle 0.15s ease'
          }}
        >
          <button
            type="button"
            onClick={handleCopy}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-handwriting)',
              fontSize: '15px',
              fontWeight: '700',
              color: '#1a1a1e',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f1f5f9')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            {copied ? <Check size={16} color="#16a34a" /> : <Copy size={16} />}
            <span>{copied ? 'Copied!' : 'Copy Address'}</span>
          </button>

          <button
            type="button"
            onClick={handleDisconnect}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              background: 'none',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontFamily: 'var(--font-handwriting)',
              fontSize: '15px',
              fontWeight: '700',
              color: '#ef4444',
              textAlign: 'left',
              width: '100%',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#fef2f2')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
          >
            <LogOut size={16} />
            <span>Disconnect</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PhantomWalletButton;
