const express = require('express');
const cors = require('cors');
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios');
const { Keypair, VersionedTransaction, Connection } = require('@solana/web3.js');
const bs58 = require('bs58');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;
const RPC_ENDPOINT = process.env.RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';

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
 * Step 1: Upload Metadata & Drawing to IPFS via PumpPortal / IPFS API
 * Expects multipart/form-data:
 * - file: The drawing image (PNG/JPEG)
 * - name: Token Name
 * - symbol: Token Ticker/Symbol
 * - description: Token Description
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

    if (!name || !symbol || !description) {
      return res.status(400).json({ error: 'Token name, symbol, and description are required.' });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, {
      filename: file.originalname || 'drawpad-token.png',
      contentType: file.mimetype || 'image/png'
    });
    formData.append('name', name);
    formData.append('symbol', symbol);
    formData.append('description', description);
    formData.append('showName', 'true');

    if (twitter) formData.append('twitter', twitter);
    if (telegram) formData.append('telegram', telegram);
    if (website) formData.append('website', website);

    const ipfsResponse = await axios.post('https://pump.fun/api/ipfs', formData, {
      headers: {
        ...formData.getHeaders()
      },
      timeout: 30000
    });

    return res.json({
      success: true,
      metadataUri: ipfsResponse.data.metadataUri || ipfsResponse.data.metadata || ipfsResponse.data,
      data: ipfsResponse.data
    });
  } catch (error) {
    console.error('IPFS upload error:', error?.response?.data || error.message);
    return res.status(500).json({
      error: 'Failed to upload metadata to IPFS via pump.fun',
      details: error?.response?.data || error.message
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

    if (response.status !== 200) {
      return res.status(response.status).json({
        error: 'PumpPortal API returned an error',
        details: response.data ? Buffer.from(response.data).toString('utf-8') : 'Unknown error'
      });
    }

    // Deserialize VersionedTransaction and sign with Mint Keypair
    const txBuffer = Buffer.from(response.data);
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
    const connection = new Connection(RPC_ENDPOINT, 'confirmed');

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

app.listen(PORT, () => {
  console.log(`🚀 DrawPad Server running on http://localhost:${PORT}`);
});
