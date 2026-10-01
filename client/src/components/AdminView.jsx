import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { Lock, Check, ArrowLeft, RefreshCw, Sparkles, Copy, ShieldAlert } from '@sketchyicons/react';
import { PhantomWalletButton } from './PhantomWalletButton';
import logoImg from '../assets/logo.png';

const AUTHORIZED_ADMIN_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

export const AdminView = ({ onBack }) => {
  const { publicKey, connected } = useWallet();
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    return sessionStorage.getItem('drawpad_admin_auth') === 'true';
  });
  const [errorMsg, setErrorMsg] = useState('');

  const [ca, setCa] = useState('');
  const [twitter, setTwitter] = useState('');
  const [pinataJwt, setPinataJwt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const isAuthorizedWallet = connected && publicKey && publicKey.toBase58() === AUTHORIZED_ADMIN_WALLET;

  // Fetch current config on load
  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      if (data && data.success) {
        setCa(data.ca || '');
        setTwitter(data.twitter || '');
        setPinataJwt(data.pinataJwt || '');
      }
    } catch (err) {
      console.error('Failed to fetch config:', err);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!isAuthorizedWallet) {
      setErrorMsg(`Access Denied: Connected wallet is not authorized. Please switch to ${AUTHORIZED_ADMIN_WALLET}.`);
      return;
    }
    if (password === '!123!123!') {
      setIsUnlocked(true);
      sessionStorage.setItem('drawpad_admin_auth', 'true');
      setErrorMsg('');
    } else {
      setErrorMsg('Incorrect admin password! Please check again.');
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!isAuthorizedWallet) {
      setErrorMsg('Unauthorized: Connected wallet is not authorized to save settings.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          password: '!123!123!',
          adminWallet: publicKey.toBase58(),
          ca: ca.trim(),
          twitter: twitter.trim(),
          pinataJwt: pinataJwt.trim()
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to save config');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3500);
    } catch (err) {
      setErrorMsg(err.message || 'Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('drawpad_admin_auth');
    setIsUnlocked(false);
    setPassword('');
  };

  return (
    <div
      style={{
        width: '100%',
        maxWidth: '680px',
        margin: '20px auto',
        padding: '24px',
        background: '#ffffff',
        border: '3px solid #1a1a1e',
        borderRadius: '16px 14px 18px 15px',
        boxShadow: '6px 6px 0px #1a1a1e',
        position: 'relative',
        zIndex: 20
      }}
      className="sketch-card"
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '2px dashed #cbd5e1', paddingBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src={logoImg} alt="Logo" style={{ width: '32px', height: '32px' }} />
          <div>
            <h2 style={{ margin: 0, fontSize: '24px', fontFamily: 'var(--font-heading)', color: '#1a1a1e' }}>
              DrawPad <span style={{ background: '#fef08a', padding: '2px 8px', borderRadius: '6px', border: '1.5px solid #1a1a1e' }}>Admin Portal</span>
            </h2>
            <div style={{ fontSize: '13px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
              slug: /pukinginamo
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={onBack}
          className="sketch-btn"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            background: '#f1f5f9',
            border: '2px solid #1a1a1e',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '700',
            fontFamily: 'var(--font-handwriting)',
            cursor: 'pointer'
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to App</span>
        </button>
      </div>

      {/* Wallet Authorization & Password Gate */}
      {!isUnlocked ? (
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: isAuthorizedWallet ? '#dcfce7' : '#fee2e2', borderRadius: '50%', border: '2px solid #1a1a1e', marginBottom: '8px' }}>
              <Lock size={28} color={isAuthorizedWallet ? '#16a34a' : '#dc2626'} />
            </div>
            <h3 style={{ margin: '6px 0', fontSize: '20px', fontFamily: 'var(--font-heading)' }}>
              Wallet-Gated Admin Access
            </h3>
            <p style={{ margin: 0, color: '#64748b', fontSize: '14px' }}>
              Authorized Admin Wallet: <code style={{ background: '#fef08a', padding: '1px 6px', borderRadius: '4px', border: '1px solid #1a1a1e', fontWeight: 'bold' }}>{AUTHORIZED_ADMIN_WALLET.slice(0, 4)}...{AUTHORIZED_ADMIN_WALLET.slice(-4)}</code>
            </p>
          </div>

          {/* Wallet Connection Status */}
          <div style={{ padding: '12px 14px', background: isAuthorizedWallet ? '#f0fdf4' : connected ? '#fef2f2' : '#f8fafc', border: '2px solid #1a1a1e', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#64748b' }}>Connected Wallet:</div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: '700', color: isAuthorizedWallet ? '#15803d' : '#1a1a1e' }}>
                {connected ? `${publicKey.toBase58().slice(0, 6)}...${publicKey.toBase58().slice(-6)}` : 'No wallet connected'}
              </div>
            </div>
            {!isAuthorizedWallet && (
              <PhantomWalletButton />
            )}
            {isAuthorizedWallet && (
              <span style={{ background: '#bbf7d0', border: '1.5px solid #16a34a', borderRadius: '6px', padding: '2px 8px', fontSize: '12px', fontWeight: '800', color: '#166534' }}>
                ✓ Authorized Admin
              </span>
            )}
          </div>

          {connected && !isAuthorizedWallet && (
            <div style={{ padding: '10px 12px', background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontSize: '14px', fontWeight: '700' }}>
              ⛔ Access Denied: Connected wallet is not authorized. Please switch to <code>{AUTHORIZED_ADMIN_WALLET}</code> in your Phantom wallet.
            </div>
          )}

          {isAuthorizedWallet && (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '15px', fontWeight: '800', fontFamily: 'var(--font-handwriting)' }}>
                  Admin Password (2FA):
                </label>
                <input
                  type="password"
                  placeholder="Enter admin password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoFocus
                  style={{
                    padding: '10px 14px',
                    border: '2px solid #1a1a1e',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontFamily: 'var(--font-mono)',
                    outline: 'none',
                    boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.08)'
                  }}
                />
              </div>

              {errorMsg && (
                <div style={{ padding: '10px', background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontSize: '14px', fontWeight: '700' }}>
                  ⚠️ {errorMsg}
                </div>
              )}

              <button
                type="submit"
                className="sketch-btn"
                style={{
                  padding: '12px',
                  background: 'var(--marker-cyan, #a5f3fc)',
                  border: '2.5px solid #1a1a1e',
                  borderRadius: '10px',
                  fontSize: '16px',
                  fontWeight: '800',
                  fontFamily: 'var(--font-heading)',
                  cursor: 'pointer',
                  boxShadow: '2px 2px 0px #1a1a1e'
                }}
              >
                Unlock Admin Dashboard 🔓
              </button>
            </>
          )}
        </form>
      ) : (
        /* Authenticated Admin Form */
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', color: '#16a34a', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={16} /> Authenticated Session
            </span>
            <button
              type="button"
              onClick={handleLogout}
              style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '13px', fontWeight: '700', textDecoration: 'underline' }}
            >
              Lock / Logout
            </button>
          </div>

          {/* CA Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-handwriting)' }}>
              1. Solana Contract Address (CA):
            </label>
            <input
              type="text"
              placeholder="e.g. 7xKXtg2CW87d97TXJSDpbD5jBkheTqA83TZRuJosgAsU"
              value={ca}
              onChange={(e) => setCa(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '2px solid #1a1a1e',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.08)'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              This will update the live copyable CA ticker shown right under the navbar for all visitors.
            </span>
          </div>

          {/* Twitter Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-handwriting)' }}>
              2. Official 𝕏 (Twitter) Link / Handle:
            </label>
            <input
              type="text"
              placeholder="e.g. https://x.com/drawpad_sol or @drawpad_sol"
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '2px solid #1a1a1e',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.08)'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Adds a quick link to your official 𝕏 directly in the header banner.
            </span>
          </div>

          {/* Pinata IPFS JWT Field */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <label style={{ fontSize: '16px', fontWeight: '800', fontFamily: 'var(--font-handwriting)' }}>
              3. Pinata IPFS JWT (Optional / Recommended for PumpPortal):
            </label>
            <input
              type="password"
              placeholder="Paste your Pinata JWT secret key..."
              value={pinataJwt}
              onChange={(e) => setPinataJwt(e.target.value)}
              style={{
                padding: '10px 14px',
                border: '2px solid #1a1a1e',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'var(--font-mono)',
                outline: 'none',
                boxShadow: 'inset 1.5px 1.5px 0px rgba(0,0,0,0.08)'
              }}
            />
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              Used to pin hand-drawn token artwork and metadata JSON to IPFS for zero-fee PumpPortal token creation.
            </span>
          </div>

          {/* Live Preview Box */}
          <div style={{ background: '#f8fafc', border: '1.5px dashed #94a3b8', borderRadius: '10px', padding: '12px' }}>
            <div style={{ fontSize: '12px', fontWeight: '800', color: '#64748b', marginBottom: '8px', textTransform: 'uppercase' }}>
              Live Banner Preview:
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '2px solid #1a1a1e', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#fef08a', padding: '2px 6px', border: '1px solid #1a1a1e', borderRadius: '4px', fontSize: '12px', fontWeight: '800' }}>CA</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', color: ca ? '#0f172a' : '#94a3b8' }}>
                  {ca || 'No Contract Address set yet'}
                </span>
              </div>
              {twitter && (
                <span style={{ fontSize: '12px', fontWeight: '700', background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px' }}>
                  𝕏 Linked
                </span>
              )}
            </div>
          </div>

          {errorMsg && (
            <div style={{ padding: '10px', background: '#fef2f2', border: '1.5px solid #ef4444', borderRadius: '8px', color: '#b91c1c', fontSize: '14px', fontWeight: '700' }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {saveSuccess && (
            <div style={{ padding: '12px', background: '#dcfce7', border: '2px solid #16a34a', borderRadius: '8px', color: '#15803d', fontSize: '15px', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Check size={20} color="#16a34a" />
              <span>Settings saved successfully! Updated live for all users.</span>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
            <button
              type="submit"
              disabled={isLoading}
              className="sketch-btn"
              style={{
                flex: 1,
                padding: '12px',
                background: '#bbf7d0',
                border: '2.5px solid #1a1a1e',
                borderRadius: '10px',
                fontSize: '17px',
                fontWeight: '800',
                fontFamily: 'var(--font-heading)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '2px 2px 0px #1a1a1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <>
                  <RefreshCw size={18} className="animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Check size={18} />
                  <span>Publish & Update Live 🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AdminView;
