import React, { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { VersionedTransaction } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import ClickSpark from './components/ClickSpark';
import Cubes from './components/Cubes';
import { BackgroundDoodles } from './components/BackgroundDoodles';
import { StepNavigation } from './components/StepNavigation';
import { ScrollIntroView } from './components/ScrollIntroView';
import { DrawingCanvas } from './components/DrawingCanvas';
import { TokenForm } from './components/TokenForm';
import { SuccessModal } from './components/SuccessModal';
import { Pen, Sparkles, BookOpen, Rocket } from '@sketchyicons/react';

export function App() {
  const { publicKey, signTransaction, connected } = useWallet();

  // Navigation mode: 1 = How It Works (Scrollable Intro), 2 = Studio Canvas, 3 = Token Form & Launch
  const [currentStep, setCurrentStep] = useState(1);

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
      alert('Please draw an artwork for your coin in Step 2!');
      setCurrentStep(2);
      return;
    }

    if (!formData.name || !formData.symbol || !formData.description) {
      alert('Please fill in coin name, symbol, and description.');
      return;
    }

    try {
      setLoading(true);
      setStatusMessage('1/3 Uploading hand-drawn artwork to IPFS...');

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
    setCurrentStep(1);
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
    <ClickSpark
      sparkColor="#1a1a1e"
      sparkCount={7}
      sparkRadius={20}
      sparkSize={12}
      duration={420}
    >
      <div style={styles.appWrapper}>
        {/* Interactive 3D Cubes Grid Background */}
        <div style={styles.cubesBackgroundWrapper} aria-hidden="true">
          <Cubes 
            gridSize={10}
            maxAngle={55}
            radius={4}
            borderStyle="2px solid rgba(26, 26, 30, 0.28)"
            faceColor="#f2e9d2"
            rippleColor="#fde047"
            rippleSpeed={2.2}
            autoAnimate={true}
            rippleOnClick={true}
            shadow="0 2px 8px rgba(0,0,0,0.06)"
          />
        </div>

        {/* Floating Animated Background Doodles */}
        <BackgroundDoodles />

        {/* Foreground Container */}
        <div style={styles.appContainer}>
          {/* Navigation Bar */}
          <header style={styles.navbar} className="sketch-card">
            <div style={styles.logoGroup} onClick={() => setCurrentStep(1)} style={{ cursor: 'pointer', ...styles.logoGroup }}>
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
              <div style={styles.navTabs}>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  style={{
                    ...styles.navTabBtn,
                    background: currentStep === 1 ? 'var(--marker-yellow)' : 'transparent',
                    borderColor: currentStep === 1 ? '#1a1a1e' : 'transparent',
                  }}
                >
                  <span>How It Works</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  style={{
                    ...styles.navTabBtn,
                    background: currentStep >= 2 ? 'var(--marker-green)' : 'transparent',
                    borderColor: currentStep >= 2 ? '#1a1a1e' : 'transparent',
                  }}
                >
                  <span>Launchpad Studio</span>
                </button>
              </div>

              <div style={styles.networkBadge}>
                <span style={styles.activeDot}></span>
                <span>Solana Mainnet</span>
              </div>
              <WalletMultiButton />
            </div>
          </header>

          {/* Header Stepper (visible on step 2 and 3) */}
          {currentStep > 1 && (
            <StepNavigation
              currentStep={currentStep}
              onStepChange={(step) => setCurrentStep(step)}
              canProceedToStep2={true}
              canProceedToStep3={!!imageDataUrl}
            />
          )}

          {/* Wizard Main Area */}
          <main style={styles.wizardMain}>
            {/* STEP 1: Ideapad-style Scrollable Step-by-Step Intro & FAQs */}
            {currentStep === 1 && (
              <ScrollIntroView onLaunchNow={() => setCurrentStep(2)} />
            )}

            {/* STEP 2: Dedicated Canvas Studio */}
            {currentStep === 2 && (
              <DrawingCanvas
                initialImage={imageDataUrl}
                onImageExport={(dataUrl) => setImageDataUrl(dataUrl)}
                onNext={() => setCurrentStep(3)}
                onBack={() => setCurrentStep(1)}
              />
            )}

            {/* STEP 3: Dedicated Token Information & Launch Form */}
            {currentStep === 3 && (
              <TokenForm
                formData={formData}
                onChange={handleFormChange}
                onLaunch={handleLaunch}
                onBack={() => setCurrentStep(2)}
                onEditArtwork={() => setCurrentStep(2)}
                previewImage={imageDataUrl}
                loading={loading}
                statusMessage={statusMessage}
                isWalletConnected={connected}
              />
            )}
          </main>

          {/* Success Launch Modal */}
          {successData && (
            <SuccessModal
              data={successData}
              onClose={() => setSuccessData(null)}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </ClickSpark>
  );
}

const styles = {
  appWrapper: {
    position: 'relative',
    height: '100vh',
    width: '100vw',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  cubesBackgroundWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    opacity: 0.85,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appContainer: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '16px 16px 20px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    width: '100%',
    height: '100%',
    position: 'relative',
    zIndex: 2,
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 20px',
    backgroundColor: '#ffffff',
    flexWrap: 'wrap',
    gap: '12px',
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
  navTabs: {
    display: 'flex',
    gap: '6px',
    background: '#f8fafc',
    border: '1.5px solid #1a1a1e',
    borderRadius: '10px',
    padding: '3px',
  },
  navTabBtn: {
    border: '1.5px solid transparent',
    borderRadius: '8px',
    padding: '5px 12px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'var(--font-handwriting)',
    color: '#1a1a1e',
    transition: 'all 0.15s ease',
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
  wizardMain: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  }
};

export default App;
