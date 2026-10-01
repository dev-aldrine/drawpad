import React, { useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import { DrawingCanvas } from './components/DrawingCanvas';
import { TokenForm } from './components/TokenForm';
import { SuccessModal } from './components/SuccessModal';
import { Pen, Zap, Shield, Sparkles, Rocket } from '@sketchyicons/react';

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
      alert('Please draw an artwork for your coin on the sketchpad!');
      return;
    }

    if (!formData.name || !formData.symbol || !formData.description) {
      alert('Please fill in coin name, symbol, and description.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('1/3 Uploading your hand-drawn sketch to IPFS...');

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

      setStatusMessage('2/3 Generating PumpPortal bonding curve transaction...');

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

      setStatusMessage('3/3 Approve the launch transaction in Phantom wallet...');

      const txBuffer = Buffer.from(launchTxData.transactionBase64, 'base64');
      const transaction = VersionedTransaction.deserialize(txBuffer);

      const signedTransaction = await signTransaction(transaction);
      const signedTxBase64 = Buffer.from(signedTransaction.serialize()).toString('base64');

      setStatusMessage('Broadcasting token launch to Solana Mainnet...');

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

      confetti({
        particleCount: 140,
        spread: 90,
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
      {/* Navigation Bar */}
      <header style={styles.navbar} className="sketch-card">
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <Pen size={22} />
          </div>
          <div>
            <div style={styles.brandTitle}>
              Draw<span className="highlighter-tape-cyan">Pad</span>
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
          <Sparkles size={14} />
          <span>THE HAND-DRAWN SOLANA LAUNCHPAD</span>
        </div>
        <h1 style={styles.mainTitle}>
          Draw it. <span className="highlighter-tape-cyan">Launch it.</span>
        </h1>
        <p style={styles.heroDescription}>
          Doodle your coin on the canvas, fill in the details, and launch directly to <strong>pump.fun</strong> in seconds.
        </p>
      </section>

      {/* Main Studio Area */}
      <main style={styles.studioGrid}>
        {/* Left: Hand-drawn Canvas Studio */}
        <DrawingCanvas 
          onImageExport={(dataUrl) => setImageDataUrl(dataUrl)} 
          previewUrl={imageDataUrl}
        />

        {/* Right: Token Details & Launch Form */}
        <TokenForm
          formData={formData}
          onChange={handleFormChange}
          onLaunch={handleLaunch}
          loading={loading}
          statusMessage={statusMessage}
          isWalletConnected={connected}
        />
      </main>

      {/* Sketchy Feature Cards */}
      <footer style={styles.featuresFooter}>
        <div style={styles.featureCard} className="sketch-card">
          <div style={styles.featureIconWrap}>
            <Zap size={22} />
          </div>
          <h4 style={styles.featureTitle}>Instant Bonding Curve</h4>
          <p style={styles.featureText}>Directly creates pump.fun token pool via PumpPortal API.</p>
        </div>
        <div style={styles.featureCard} className="sketch-card">
          <div style={styles.featureIconWrap}>
            <Pen size={22} />
          </div>
          <h4 style={styles.featureTitle}>100% Hand-Drawn Art</h4>
          <p style={styles.featureText}>Your drawing is uploaded directly to decentralized IPFS metadata.</p>
        </div>
        <div style={styles.featureCard} className="sketch-card">
          <div style={styles.featureIconWrap}>
            <Shield size={22} />
          </div>
          <h4 style={styles.featureTitle}>Phantom Non-Custodial</h4>
          <p style={styles.featureText}>You sign every launch transaction securely with your wallet.</p>
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
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '24px 16px 60px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '28px',
    width: '100%',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#ffffff',
  },
  logoGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  logoIcon: {
    background: '#fef08a',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
    padding: '6px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  brandTitle: {
    fontSize: '26px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.1',
  },
  brandSubtitle: {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  },
  navActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  networkBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    background: '#f8fafc',
    border: '2px solid #1a1a1e',
    borderRadius: '10px',
    padding: '4px 10px',
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a1e',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  activeDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    backgroundColor: '#16a34a',
    boxShadow: '0 0 4px #16a34a',
  },
  heroSection: {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    margin: '6px 0',
  },
  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    background: '#fed7aa',
    border: '2px dashed #1a1a1e',
    color: '#1a1a1e',
    borderRadius: '20px',
    padding: '4px 16px',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'var(--font-mono)',
  },
  mainTitle: {
    fontSize: '46px',
    fontWeight: '800',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
    lineHeight: '1.2',
  },
  heroDescription: {
    fontSize: '20px',
    color: '#475569',
    maxWidth: '620px',
    lineHeight: '1.4',
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: '16px',
    marginTop: '16px',
  },
  featureCard: {
    padding: '18px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
    backgroundColor: '#ffffff',
  },
  featureIconWrap: {
    background: '#fef08a',
    border: '2px solid #1a1a1e',
    borderRadius: '8px',
    width: '38px',
    height: '38px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
  },
  featureTitle: {
    fontSize: '18px',
    fontWeight: '700',
    color: '#1a1a1e',
    fontFamily: 'var(--font-heading)',
  },
  featureText: {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.4',
  }
};

export default App;
