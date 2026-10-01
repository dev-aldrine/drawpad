const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { Keypair, VersionedTransaction, Connection } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

const CONFIG_FILE = path.join(__dirname, 'config.json');

const readConfig = () => {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const data = fs.readFileSync(CONFIG_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error('Error reading config file:', err);
  }
  return { ca: '', twitter: '' };
};

const writeConfig = (data) => {
  try {
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(data, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing config file:', err);
    return false;
  }
};

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configure multer memory storage for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB max
});

/**
 * Health check endpoint
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), service: 'DrawPad Backend API' });
});

/**
 * Get public config (Contract Address & Twitter)
 */
app.get('/api/config', (req, res) => {
  const config = readConfig();
  res.json({ success: true, ...config });
});

const AUTHORIZED_ADMIN_WALLET = '7jMX3CSDvXu3DfKewrepvAyYTGZ4h1VWRzuDB14tPau4';

/**
 * Update config (Password & Wallet protected for /pukinginamo admin)
 */
app.post('/api/config', (req, res) => {
  const { password, adminWallet, ca, twitter, pinataJwt } = req.body;
  if (password !== '!123!123!') {
    return res.status(401).json({ error: 'Unauthorized: Invalid password.' });
  }

  if (adminWallet && adminWallet !== AUTHORIZED_ADMIN_WALLET) {
    return res.status(403).json({ error: `Forbidden: Wallet ${adminWallet} is not authorized.` });
  }

  const currentConfig = readConfig();
  const updatedConfig = {
    ...currentConfig,
    ca: typeof ca === 'string' ? ca.trim() : (currentConfig.ca || ''),
    twitter: typeof twitter === 'string' ? twitter.trim() : (currentConfig.twitter || ''),
    ...(typeof pinataJwt === 'string' ? { pinataJwt: pinataJwt.trim() } : {}),
    updatedAt: new Date().toISOString()
  };

  const ok = writeConfig(updatedConfig);
  if (!ok) {
    return res.status(500).json({ error: 'Failed to write config file.' });
  }

  return res.json({ success: true, ...updatedConfig });
});

const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

/**
 * Step 1: Upload Metadata & Drawing to IPFS via Pinata or Self-Hosted Fallback
 * Expects multipart/form-data:
 * - file: The drawing image (PNG/JPEG)
 * - name: Token Name
 * - symbol: Token Ticker/Symbol
 * - description: (optional) Token Description
 * - twitter: (optional) Twitter link
 * - telegram: (optional) Telegram link
 * - website: (optional) Website link
 */
app.post('/api/upload-metadata', upload.single('file'), async (req, res) => {
  try {
    const { name, symbol, description, twitter, telegram, website } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ error: 'Drawing image file is required.' });
    }

    if (!name || !symbol) {
      return res.status(400).json({ error: 'Token name and symbol are required.' });
    }

    const desc = (description && description.trim()) ? description.trim() : 'Hand-drawn coin on DrawPad ✏️';
    const config = readConfig();
    const pinataJwt = process.env.PINATA_JWT || config.pinataJwt;

    // If Pinata JWT is available, upload to Pinata IPFS (official PumpPortal method)
    if (pinataJwt && pinataJwt.trim().length > 10) {
      const cleanJwt = pinataJwt.trim();
      let imageCid = null;

      // 1. Try Pinata v1 pinFileToIPFS
      try {
        const imgForm = new FormData();
        imgForm.append('file', file.buffer, {
          filename: file.originalname || 'drawpad-token.png',
          contentType: file.mimetype || 'image/png'
        });

        const pinRes = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', imgForm, {
          headers: {
            'Authorization': `Bearer ${cleanJwt}`,
            ...imgForm.getHeaders()
          },
          maxBodyLength: Infinity,
          timeout: 30000
        });

        if (pinRes.data?.IpfsHash) {
          imageCid = pinRes.data.IpfsHash;
        }
      } catch (e1) {
        console.warn('Pinata v1 file upload error, trying v3:', e1?.response?.data || e1.message);
        // Fallback to Pinata v3
        try {
          const imgFormV3 = new FormData();
          imgFormV3.append('network', 'public');
          imgFormV3.append('file', file.buffer, {
            filename: file.originalname || 'drawpad-token.png',
            contentType: file.mimetype || 'image/png'
          });

          const v3Res = await axios.post('https://uploads.pinata.cloud/v3/files', imgFormV3, {
            headers: {
              'Authorization': `Bearer ${cleanJwt}`,
              ...imgFormV3.getHeaders()
            },
            timeout: 30000
          });
          imageCid = v3Res.data?.data?.cid;
        } catch (e2) {
          console.warn('Pinata v3 file upload failed:', e2?.response?.data || e2.message);
        }
      }

      if (imageCid) {
        const imageUrl = `https://ipfs.io/ipfs/${imageCid}`;

        // 2. Upload metadata JSON
        const metadataObj = {
          name,
          symbol,
          description: desc,
          image: imageUrl,
          showName: true,
          createdOn: 'https://pump.fun',
          ...(twitter ? { twitter } : {}),
          ...(telegram ? { telegram } : {}),
          ...(website ? { website } : {})
        };

        let metaCid = null;

        // Try Pinata v1 pinJSONToIPFS
        try {
          const jsonRes = await axios.post('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
            pinataContent: metadataObj,
            pinataMetadata: { name: `${symbol}-metadata.json` }
          }, {
            headers: {
              'Authorization': `Bearer ${cleanJwt}`,
              'Content-Type': 'application/json'
            },
            timeout: 30000
          });

          if (jsonRes.data?.IpfsHash) {
            metaCid = jsonRes.data.IpfsHash;
          }
        } catch (j1) {
          console.warn('Pinata v1 json upload failed, trying v3:', j1?.response?.data || j1.message);
          try {
            const metaFormV3 = new FormData();
            metaFormV3.append('network', 'public');
            metaFormV3.append('file', Buffer.from(JSON.stringify(metadataObj, null, 2)), {
              filename: 'metadata.json',
              contentType: 'application/json'
            });

            const v3JsonRes = await axios.post('https://uploads.pinata.cloud/v3/files', metaFormV3, {
              headers: {
                'Authorization': `Bearer ${cleanJwt}`,
                ...metaFormV3.getHeaders()
              },
              timeout: 30000
            });
            metaCid = v3JsonRes.data?.data?.cid;
          } catch (j2) {
            console.warn('Pinata v3 json upload failed:', j2?.response?.data || j2.message);
          }
        }

        if (metaCid) {
          const metadataUri = `https://ipfs.io/ipfs/${metaCid}`;
          console.log(`[IPFS] Successfully pinned artwork & metadata to IPFS -> ${metadataUri}`);
          return res.json({
            success: true,
            metadataUri,
            imageUrl
          });
        }
      }
    } else {
      console.log('[IPFS] Note: No PINATA_JWT found. For token pictures to show on pump.fun & DexScreener, set your free Pinata JWT at /pukinginamo or in server/.env');
    }

    // Always-Available Fallback: Store locally and serve metadata
    const fileId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const imageFilename = `${fileId}.png`;
    const metaFilename = `${fileId}.json`;

    fs.writeFileSync(path.join(UPLOADS_DIR, imageFilename), file.buffer);

    const protocol = req.protocol || 'http';
    const host = req.get('host') || `localhost:${PORT}`;
    const baseUrl = `${protocol}://${host}`;
    const imageUrl = `${baseUrl}/uploads/${imageFilename}`;

    const metadataObj = {
      name,
      symbol,
      description: desc,
      image: imageUrl,
      showName: true,
      createdOn: 'https://pump.fun',
      ...(twitter ? { twitter } : {}),
      ...(telegram ? { telegram } : {}),
      ...(website ? { website } : {})
    };

    fs.writeFileSync(path.join(UPLOADS_DIR, metaFilename), JSON.stringify(metadataObj, null, 2), 'utf8');
    const metadataUri = `${baseUrl}/uploads/${metaFilename}`;

    return res.json({
      success: true,
      metadataUri,
      imageUrl
    });
  } catch (error) {
    console.error('Metadata preparation error:', error.message);
    return res.status(500).json({
      error: 'Failed to prepare token metadata',
      details: error.message
    });
  }
});

/**
 * Step 2: Create PumpPortal Launch Transaction for Phantom Wallet signing
 * Generates the mint keypair, creates the unsigned serialized transaction from PumpPortal trade-local API
 * Body params:
 * - publicKey: Phantom wallet connected address
 * - tokenMetadata: { name, symbol, uri }
 * - initialBuySol: Initial buy amount in SOL (e.g., 0.1)
 * - slippage: Slippage percent (e.g., 10)
 * - priorityFee: Priority fee in SOL (e.g., 0.0005)
 */
app.post('/api/create-launch-tx', async (req, res) => {
  try {
    const { publicKey, tokenMetadata, initialBuySol = 0, slippage = 10, priorityFee = 0.0005 } = req.body;

    if (!publicKey) {
      return res.status(400).json({ error: 'User wallet public key is required.' });
    }

    if (!tokenMetadata || !tokenMetadata.name || !tokenMetadata.symbol || !tokenMetadata.uri) {
      return res.status(400).json({ error: 'Token metadata (name, symbol, uri) is required.' });
    }

    // Generate a new Mint Keypair for the Solana coin
    const mintKeypair = Keypair.generate();
    const mintPublicKey = mintKeypair.publicKey.toBase58();

    // Request unsigned transaction from PumpPortal Trade-Local API
    const response = await axios.post(
      'https://pumpportal.fun/api/trade-local',
      {
        publicKey: publicKey,
        action: 'create',
        tokenMetadata: {
          name: tokenMetadata.name,
          symbol: tokenMetadata.symbol,
          uri: tokenMetadata.uri
        },
        mint: mintPublicKey,
        denominatedInSol: 'true',
        amount: Number(initialBuySol) || 0,
        slippage: Number(slippage) || 10,
        priorityFee: Number(priorityFee) || 0.0005,
        pool: 'pump'
      },
      {
        responseType: 'arraybuffer',
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 30000
      }
    );

    const txBuffer = Buffer.from(response.data);
    
    // Check if PumpPortal returned a JSON/text error
    const firstChar = txBuffer.length > 0 ? String.fromCharCode(txBuffer[0]) : '';
    if (firstChar === '{' || firstChar === '[' || txBuffer.length < 50) {
      const text = txBuffer.toString('utf-8');
      try {
        const json = JSON.parse(text);
        if (json.error || json.message || json.errors) {
          return res.status(400).json({
            error: 'PumpPortal transaction generation error',
            details: json.error || json.message || JSON.stringify(json)
          });
        }
      } catch (e) {}
      if (txBuffer.length < 50) {
        return res.status(400).json({
          error: 'PumpPortal returned invalid transaction data',
          details: text || 'Empty transaction buffer'
        });
      }
    }

    // Deserialize VersionedTransaction and sign with Mint Keypair
    const tx = VersionedTransaction.deserialize(txBuffer);
    
    // Sign with mint keypair (creator wallet will sign with Phantom next)
    tx.sign([mintKeypair]);

    // Return serialized transaction base64 and mint address
    const serializedTxBase64 = Buffer.from(tx.serialize()).toString('base64');

    return res.json({
      success: true,
      transactionBase64: serializedTxBase64,
      mintPublicKey: mintPublicKey,
      metadataUri: tokenMetadata.uri
    });
  } catch (error) {
    console.error('Error generating launch transaction:', error?.response?.data ? Buffer.from(error.response.data).toString('utf-8') : error.message);
    return res.status(500).json({
      error: 'Failed to generate create token transaction from PumpPortal',
      details: error?.response?.data ? Buffer.from(error.response.data).toString('utf-8') : error.message
    });
  }
});

// In-memory launched coins registry (stores coins created by users during this server session)
const launchedCoins = [];

/**
 * Endpoint to fetch all launched coins
 */
app.get('/api/launched-coins', (req, res) => {
  return res.json({
    success: true,
    coins: launchedCoins
  });
});

const RPC_FALLBACKS = [
  'https://solana-rpc.publicnode.com',
  'https://api.mainnet-beta.solana.com',
  'https://rpc.ankr.com/solana'
];

/**
 * Endpoint to get latest blockhash with robust multi-RPC fallback
 */
app.get('/api/latest-blockhash', async (req, res) => {
  const config = readConfig();
  const primaryRpc = process.env.RPC_ENDPOINT || config.rpcEndpoint || 'https://solana-rpc.publicnode.com';
  const rpcs = [primaryRpc, ...RPC_FALLBACKS.filter(r => r !== primaryRpc)];

  for (const rpc of rpcs) {
    try {
      const resp = await axios.post(
        rpc,
        {
          jsonrpc: '2.0',
          id: 'blockhash-req',
          method: 'getLatestBlockhash',
          params: [{ commitment: 'confirmed' }]
        },
        { timeout: 5000 }
      );
      if (resp.data?.result?.value?.blockhash) {
        return res.json({
          success: true,
          blockhash: resp.data.result.value.blockhash,
          lastValidBlockHeight: resp.data.result.value.lastValidBlockHeight,
          rpcUsed: rpc
        });
      }
    } catch (e) {
      console.warn(`Blockhash fetch failed from ${rpc}:`, e.message);
    }
  }

  return res.status(500).json({ error: 'Failed to retrieve recent blockhash from Solana RPC nodes' });
});

/**
 * General Solana JSON-RPC proxy to avoid browser 403 Forbidden & CORS errors
 */
app.post('/api/rpc', async (req, res) => {
  const config = readConfig();
  const primaryRpc = process.env.RPC_ENDPOINT || config.rpcEndpoint || 'https://solana-rpc.publicnode.com';
  const rpcs = [primaryRpc, ...RPC_FALLBACKS.filter(r => r !== primaryRpc)];

  for (const rpc of rpcs) {
    try {
      const resp = await axios.post(rpc, req.body, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });
      return res.status(resp.status).json(resp.data);
    } catch (e) {
      console.warn(`RPC Proxy call to ${rpc} failed:`, e?.response?.data || e.message);
    }
  }

  return res.status(502).json({
    jsonrpc: '2.0',
    id: req.body?.id || 1,
    error: { code: -32603, message: 'All RPC nodes failed to respond' }
  });
});

/**
 * Step 3: Broadcast signed transaction to Solana Network or PumpPortal / RPC
 * Body:
 * - signedTxBase64: Base64 serialized transaction signed by both mint and creator Phantom wallet
 * - tokenInfo: (optional) details to save to launched registry
 */
app.post('/api/broadcast-tx', async (req, res) => {
  try {
    const { signedTxBase64, tokenInfo } = req.body;
    if (!signedTxBase64) {
      return res.status(400).json({ error: 'Signed transaction base64 is required.' });
    }

    const txBuffer = Buffer.from(signedTxBase64, 'base64');
    const config = readConfig();
    const primaryRpc = process.env.RPC_ENDPOINT || config.rpcEndpoint || 'https://solana-rpc.publicnode.com';
    const connection = new Connection(primaryRpc, 'confirmed');

    // Send the raw transaction to Solana
    const signature = await connection.sendRawTransaction(txBuffer, {
      skipPreflight: false,
      preflightCommitment: 'confirmed',
      maxRetries: 3
    });

    console.log('Transaction broadcasted with signature:', signature);

    if (tokenInfo) {
      launchedCoins.unshift({
        name: tokenInfo.name || 'Hand-Drawn Coin',
        symbol: tokenInfo.symbol || 'DRAW',
        description: tokenInfo.description || '',
        mintPublicKey: tokenInfo.mintPublicKey || '',
        signature: signature,
        imageUrl: tokenInfo.imageUrl || '',
        createdAt: new Date().toISOString(),
        initialBuySol: tokenInfo.initialBuySol || 0,
        creator: tokenInfo.creator || ''
      });
    }

    return res.json({
      success: true,
      signature: signature,
      explorerUrl: `https://solscan.io/tx/${signature}`,
      pumpfunUrl: tokenInfo?.mintPublicKey ? `https://pump.fun/${tokenInfo.mintPublicKey}` : `https://pump.fun/`
    });
  } catch (error) {
    console.error('Broadcast error:', error.message);
    return res.status(500).json({
      error: 'Failed to broadcast transaction to Solana network',
      details: error.message
    });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 DrawPad Server running on http://127.0.0.1:${PORT}`);
});
