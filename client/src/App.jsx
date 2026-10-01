import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { PhantomWalletButton } from './components/PhantomWalletButton';
import { VersionedTransaction, Transaction, SystemProgram, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import confetti from 'canvas-confetti';
import ClickSpark from './components/ClickSpark';
import DriftWall from './components/DriftWall';
import { StepNavigation } from './components/StepNavigation';
import { ScrollIntroView } from './components/ScrollIntroView';
import { DrawingCanvas } from './components/DrawingCanvas';
import { TokenForm } from './components/TokenForm';
import { LaunchedCoinsView } from './components/LaunchedCoinsView';
import { SuccessModal } from './components/SuccessModal';
import RubberSegment from './components/RubberSegment';
import { ContractBar } from './components/ContractBar';
import { AdminView } from './components/AdminView';
import { Pen, Sparkles, BookOpen, Rocket, Coins } from '@sketchyicons/react';
import logoImg from './assets/logo.png';

const PROTOCOL_FEE_SOL = 0.02;
const TREASURY_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

export function App() {
  const { publicKey, signTransaction, sendTransaction, connected } = useWallet();
  const { connection } = useConnection();

  // Navigation mode: 1 = How It Works (Scrollable Intro), 2 = Studio Canvas, 3 = Token Form & Launch, 4 = Launched Coins
  const [currentStep, setCurrentStep] = useState(1);

  // Admin routing for /pukinginamo
  const [isAdminRoute, setIsAdminRoute] = useState(() => {
    return typeof window !== 'undefined' && window.location.pathname.toLowerCase().includes('pukinginamo');
  });

  const [siteConfig, setSiteConfig] = useState({ ca: '', twitter: '' });

  // Handle URL history / popstate
  useEffect(() => {
    const checkRoute = () => {
      setIsAdminRoute(window.location.pathname.toLowerCase().includes('pukinginamo'));
    };
    window.addEventListener('popstate', checkRoute);
    return () => window.removeEventListener('popstate', checkRoute);
  }, []);

  // Poll /api/config for live updates across all clients
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) return;
        const data = await res.json();
        if (data && data.success) {
          setSiteConfig({
            ca: data.ca || '',
            twitter: data.twitter || ''
          });
        }
      } catch (err) {
        // silent fallback
      }
    };

    fetchConfig();
    const interval = setInterval(fetchConfig, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigateTo = (path) => {
    window.history.pushState({}, '', path);
    setIsAdminRoute(path.toLowerCase().includes('pukinginamo'));
  };

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

    if (!formData.name || !formData.symbol) {
      alert('Please fill in coin name and ticker symbol.');
      return;
    }

    try {
      setLoading(true);

      // Step 1: Execute 0.02 SOL DrawPad protocol fee to the Treasury Wallet
      setStatusMessage('1/4 Confirming 0.02 SOL DrawPad protocol fee in Phantom...');
      const feeTx = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: publicKey,
          toPubkey: new PublicKey(TREASURY_WALLET),
          lamports: Math.round(PROTOCOL_FEE_SOL * LAMPORTS_PER_SOL), // 20,000,000 lamports = 0.02 SOL
        })
      );

      // Fetch latest blockhash from server proxy or wallet connection
      let blockhash, lastValidBlockHeight;
      try {
        const bhRes = await fetch('/api/latest-blockhash');
        if (bhRes.ok) {
          const bhData = await bhRes.json();
          if (bhData.blockhash) {
            blockhash = bhData.blockhash;
            lastValidBlockHeight = bhData.lastValidBlockHeight;
          }
        }
      } catch (e) {}

      if (!blockhash) {
        const latest = await connection.getLatestBlockhash('confirmed');
        blockhash = latest.blockhash;
        lastValidBlockHeight = latest.lastValidBlockHeight;
      }

      feeTx.recentBlockhash = blockhash;
      feeTx.feePayer = publicKey;

      const feeSignature = await sendTransaction(feeTx, connection);
      setStatusMessage('Verifying 0.02 SOL protocol fee on Solana...');
      try {
        await connection.confirmTransaction({ signature: feeSignature, blockhash, lastValidBlockHeight }, 'confirmed');
      } catch (confirmErr) {
        console.warn('Confirmation check skipped/proceeded:', confirmErr.message);
      }

      // Step 2: Upload metadata & artwork to IPFS
      setStatusMessage('2/4 Preparing artwork & metadata for pump.fun...');

      const res = await fetch(imageDataUrl);
      const blob = await res.blob();

      const metaPayload = new FormData();
      metaPayload.append('file', blob, 'drawpad-token.png');
      metaPayload.append('name', formData.name);
      metaPayload.append('symbol', formData.symbol);
      metaPayload.append('description', formData.description || 'Hand-drawn coin on DrawPad ✏️');
      if (formData.twitter) metaPayload.append('twitter', formData.twitter);
      if (formData.telegram) metaPayload.append('telegram', formData.telegram);
      if (formData.website) metaPayload.append('website', formData.website);

      const ipfsRes = await fetch('/api/upload-metadata', {
        method: 'POST',
        body: metaPayload,
      });

      const ipfsRaw = await ipfsRes.text();
      let ipfsData;
      try {
        ipfsData = JSON.parse(ipfsRaw);
      } catch (e) {
        throw new Error(ipfsRaw || 'Failed to upload artwork to metadata host');
      }

      if (!ipfsRes.ok || !ipfsData.metadataUri) {
        throw new Error(ipfsData.details || ipfsData.error || 'Failed to prepare token metadata');
      }

      // Step 3: Generate PumpPortal bonding curve transaction
      setStatusMessage('3/4 Generating PumpPortal bonding curve transaction...');

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

      const launchTxRaw = await launchTxRes.text();
      let launchTxData;
      try {
        launchTxData = JSON.parse(launchTxRaw);
      } catch (e) {
        throw new Error(launchTxRaw || 'Failed to construct token creation transaction');
      }

      if (!launchTxRes.ok || !launchTxData.transactionBase64) {
        throw new Error(launchTxData.details || launchTxData.error || 'Failed to build transaction');
      }

      // Step 4: Sign & Broadcast pump.fun launch
      setStatusMessage('4/4 Approve the launch transaction in Phantom wallet...');

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
          tokenInfo: {
            name: formData.name,
            symbol: formData.symbol,
            description: formData.description || 'Hand-drawn coin on DrawPad ✏️',
            mintPublicKey: launchTxData.mintPublicKey,
            imageUrl: imageDataUrl,
            initialBuySol: Number(formData.initialBuySol) || 0,
            creator: publicKey.toBase58()
          }
        }),
      });

      const broadcastRaw = await broadcastRes.text();
      let broadcastData;
      try {
        broadcastData = JSON.parse(broadcastRaw);
      } catch (e) {
        throw new Error(broadcastRaw || 'Transaction broadcast failed');
      }

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
        {/* Interactive 3D Drifting Meme Wall Background */}
        <div style={styles.driftWallBackgroundWrapper} aria-hidden="true">
          <DriftWall
            tileWidth={220}
            tileHeight={220}
            gap={48}
            tilt={16}
            turn={-14}
            perspective={2400}
            depth={30}
            speed={38}
            direction="up"
            variance={0.45}
            parallax={0.6}
            lift={140}
            fade={0.15}
            dim={1}
            overlayColor="#060010"
            roll={2}
          />
        </div>

        {/* Foreground Container */}
        <div style={styles.appContainer}>
          {/* Navigation Bar */}
          <header style={styles.navbar} className="sketch-card">
            <div style={styles.logoGroup} onClick={() => setCurrentStep(1)} style={{ cursor: 'pointer', ...styles.logoGroup }}>
              <div style={styles.logoIcon}>
                <img src={logoImg} alt="DrawPad Pencil Logo" style={{ width: '28px', height: '28px', objectFit: 'contain' }} />
              </div>
              <div>
                <div style={styles.brandTitle}>
                  Draw<span className="highlighter-tape-cyan">Pad</span>
                </div>
                <div style={styles.brandSubtitle}>Hand-drawn coins on pump.fun • 0.02 SOL Launch</div>
              </div>
            </div>

            <div style={styles.navActions}>
              <RubberSegment
                items={[
                  { value: 'how-it-works', label: 'How It Works' },
                  { value: 'studio', label: 'Launchpad Studio' },
                  {
                    value: 'launched-coins',
                    label: 'Launched Coins',
                    icon: <Coins size={15} />
                  }
                ]}
                value={
                  currentStep === 1
                    ? 'how-it-works'
                    : currentStep === 4
                    ? 'launched-coins'
                    : 'studio'
                }
                onChange={(val) => {
                  if (val === 'how-it-works') setCurrentStep(1);
                  else if (val === 'launched-coins') setCurrentStep(4);
                  else setCurrentStep(2);
                }}
                trackColor="#f8fafc"
                thumbColor="#fef08a"
                textColor="#64748b"
                activeTextColor="#1a1a1e"
                size="md"
                radius={10}
                inset={3}
                equalSlots={true}
                stretch={100}
                squash={3}
                speed={1}
                glide={75}
                draggable
              />

              <PhantomWalletButton />
            </div>
          </header>

          {/* Quick Copy Contract Address Bar below Navigation */}
          {!isAdminRoute && (
            <ContractBar
              ca={siteConfig.ca}
              twitter={siteConfig.twitter}
            />
          )}

          {/* Admin Panel View for /pukinginamo */}
          {isAdminRoute ? (
            <AdminView onBack={() => navigateTo('/')} />
          ) : (
            <>
              {/* Header Stepper (visible on step 2 and 3) */}
              {(currentStep === 2 || currentStep === 3) && (
                <StepNavigation
                  currentStep={currentStep}
                  onStepChange={(step) => setCurrentStep(step)}
                  canProceedToStep2={true}
                  canProceedToStep3={!!imageDataUrl}
                />
              )}

              {/* Wizard Main Area */}
              <main
                style={{
                  ...styles.wizardMain,
                  justifyContent: currentStep === 1 ? 'center' : 'flex-start',
                  paddingTop: currentStep === 1 ? '0px' : '10px'
                }}
              >
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

                {/* STEP 4: Launched Coins Live Showcase */}
                {currentStep === 4 && (
                  <LaunchedCoinsView onStartNewCoin={() => setCurrentStep(2)} />
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
            </>
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
  driftWallBackgroundWrapper: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    zIndex: 0,
    opacity: 0.88,
    pointerEvents: 'none',
    overflow: 'hidden',
  },
  appContainer: {
    maxWidth: '1080px',
    margin: '0 auto',
    padding: '14px 16px 24px 16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
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
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '1.5px 1.5px 0px #1a1a1e',
    width: '38px',
    height: '38px',
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
  wizardMain: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    minHeight: 0,
  }
};

export default App;
