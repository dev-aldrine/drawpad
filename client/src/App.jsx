import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import { DrawingCanvas } from './components/DrawingCanvas';
import { TokenForm } from './components/TokenForm';
import { SuccessModal } from './components/SuccessModal';
import { Sparkles, Palette, Zap, ShieldCheck, Flame, ExternalLink, Activity } from 'lucide-react';

export function App() {
  const { publicKey, signTransaction, connected } = useWallet();

  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
    description: '',
    initialBuySol: '0',
    slippage: '10',
    twitter: '',
    telegram: '',
    website: ''
  });

  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLaunch = async () => {
    if (!connected || !publicKey) {
      alert('Please connect your Phantom or Solana wallet first!');
      return;
    }

    if (!imageDataUrl) {
      alert('Please draw an artwork for your coin on the canvas!');
      return;
    }

    if (!formData.name || !formData.symbol || !formData.description) {
      alert('Please fill in coin name, symbol, and description.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('1/3 Uploading drawing & metadata to IPFS...');

      // Convert data URL to Blob for multipart upload
      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const metaPayload = new FormData();
      metaPayload.append('file', blob, 'drawpad-token.png');
      metaPayload.append('name', formData.name);
      metaPayload.append('symbol', formData.symbol);
      metaPayload.append('description', formData.description);
      if (formData.twitter) metaPayload.append('twitter', formData.twitter);
      if (formData.telegram) metaPayload.append('telegram', formData.telegram);
      if (formData.website) metaPayload.append('website', formData.website);

      const ipfsRes = await fetch('/api/upload-metadata', {
        method: 'POST',
        body: metaPayload,
      });

      const ipfsData = await ipfsRes.json();
      if (!ipfsRes.ok || !ipfsData.metadataUri) {
        throw new Error(ipfsData.details || ipfsData.error || 'Failed to upload image to IPFS');
      }

      setStatusMessage('2/3 Preparing token launch transaction via PumpPortal...');

      // Create Launch Transaction
      const launchTxRes = await fetch('/api/create-launch-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          publicKey: publicKey.toBase58(),
          tokenMetadata: {
            name: formData.name,
            symbol: formData.symbol,
            uri: ipfsData.metadataUri,
          },
          initialBuySol: Number(formData.initialBuySol) || 0,
          slippage: Number(formData.slippage) || 10,
          priorityFee: 0.0005,
        }),
      });

      const launchTxData = await launchTxRes.json();
      if (!launchTxRes.ok || !launchTxData.transactionBase64) {
        throw new Error(launchTxData.details || launchTxData.error || 'Failed to build transaction');
      }

      setStatusMessage('3/3 Please approve the transaction in your Phantom wallet...');

      // Deserialize transaction for user signature
      const txBuffer = Buffer.from(launchTxData.transactionBase64, 'base64');
      const transaction = VersionedTransaction.deserialize(txBuffer);

      // Sign with Phantom Wallet
      const signedTransaction = await signTransaction(transaction);
      const signedTxBase64 = Buffer.from(signedTransaction.serialize()).toString('base64');

      setStatusMessage('Broadcasting launch to Solana Mainnet...');

      // Send signed transaction to server to broadcast to Solana
      const broadcastRes = await fetch('/api/broadcast-tx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          signedTxBase64,
        }),
      });

      const broadcastData = await broadcastRes.json();
      if (!broadcastRes.ok || !broadcastData.signature) {
        throw new Error(broadcastData.details || broadcastData.error || 'Transaction broadcast failed');
      }

      // Trigger Celebration
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });

      setSuccessData({
        name: formData.name,
        symbol: formData.symbol,
        mintPublicKey: launchTxData.mintPublicKey,
        signature: broadcastData.signature,
        previewImage: imageDataUrl,
      });

      setStatusMessage('');
    } catch (err) {
      console.error('Launch Error:', err);
      alert(`Error launching coin: ${err.message}`);
      setStatusMessage('');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSuccessData(null);
    setFormData({
      name: '',
      symbol: '',
      description: '',
      initialBuySol: '0',
      slippage: '10',
      twitter: '',
      telegram: '',
      website: ''
    });
  };

  return (
    <div style={styles.appContainer}>
      {/* Navigation Header */}
      <header style={styles.navbar}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Palette size={24} color="#10b981" />
          </div>
          <div>
            <div style={styles.brandTitle}>
              Draw<span className="gradient-text">Pad</span>
            </div>
            <div style={styles.brandSubtitle}>Hand-drawn coins on pump.fun</div>
          </div>
        </div>

        <div style={styles.navActions}>
          <div style={styles.networkBadge}>
            <span style={styles.activeDot}></span>
            <span>Solana Mainnet</span>
          </div>
          <WalletMultiButton />
        </div>
      </header>

      {/* Hero Banner */}
      <section style={styles.heroSection}>
        <div style={styles.heroBadge}>
          <Sparkles size={14} color="#f59e0b" />
          <span>The First Draw-to-Launch Solana Memepad</span>
        </div>
        <h1 style={styles.mainTitle}>
          Draw It. Mint It. <span className="gradient-text">Pump It.</span>
        </h1>
        <p style={styles.heroDescription}>
          Create unique hand-drawn memecoins and launch them directly onto <strong>pump.fun</strong> via PumpPortal in seconds.
        </p>
      </section>

      {/* Main Studio Area */}
      <main style={styles.studioGrid}>
        {/* Left: Canvas Studio */}
        <DrawingCanvas 
          onImageExport={(dataUrl) => setImageDataUrl(dataUrl)} 
          previewUrl={imageDataUrl}
        />

        {/* Right: Token Details & Launchpad */}
        <TokenForm
          formData={formData}
          onChange={handleFormChange}
          onLaunch={handleLaunch}
          loading={loading}
          statusMessage={statusMessage}
          isWalletConnected={connected}
        />
      </main>

      {/* Feature Highlights Footer */}
      <footer style={styles.featuresFooter}>
        <div style={styles.featureCard} className="glass-panel">
          <Zap size={22} color="#10b981" />
          <h4>Instant Bonding Curve</h4>
          <p>Launches directly into pump.fun liquidity pool via PumpPortal.</p>
        </div>
        <div style={styles.featureCard} className="glass-panel">
          <Palette size={22} color="#06b6d4" />
          <h4>100% On-Chain Artwork</h4>
          <p>Export your hand-drawn canvas directly to IPFS metadata.</p>
        </div>
        <div style={styles.featureCard} className="glass-panel">
          <ShieldCheck size={22} color="#8b5cf6" />
          <h4>Phantom Non-Custodial</h4>
          <p>You sign directly with your Solana wallet. Safe and secure.</p>
        </div>
      </footer>

      {/* Success Launch Modal */}
      {successData && (
        <SuccessModal
          data={successData}
          onClose={() => setSuccessData(null)}
          onReset={handleReset}
        />
      )}
    </div>
  );
}

const styles = {
  appContainer: {
    maxWidth: '1240px',
    margin: '0 auto',
    padding: '24px 20px 60px 20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '36px',
    width: '100%',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    background: 'rgba(15, 23, 42, 0.65)',
    backdropFilter: 'blur(16px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    background: 'rgba(16, 185, 129, 0.12)',
    padding: '10px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: '22px',
    fontWeight: '900',
    letterSpacing: '-0.03em',
    color: '#f8fafc',
  },
  brandSubtitle: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '500',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  networkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '20px',
    padding: '6px 12px',
    fontSize: '12px',
    fontWeight: '600',
    color: '#cbd5e1',
  },
  activeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#10b981',
    boxShadow: '0 0 8px #10b981',
  },
  heroSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '12px',
    margin: '10px 0',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: 'rgba(245, 158, 11, 0.1)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#fbbf24',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  mainTitle: {
    fontSize: '44px',
    fontWeight: '900',
    letterSpacing: '-0.04em',
    color: '#f8fafc',
    lineHeight: '1.15',
  },
  heroDescription: {
    fontSize: '16px',
    color: '#94a3b8',
    maxWidth: '580px',
    lineHeight: '1.5',
  },
  studioGrid: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: '24px',
    width: '100%',
  },
  featuresFooter: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '16px',
    marginTop: '20px',
  },
  featureCard: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
  }
};

export default App;
