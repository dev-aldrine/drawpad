# DrawPad 🎨🚀

**DrawPad** is a decentralized Solana launchpad that lets users draw their memecoin artwork on an interactive canvas, fill in coin details, and launch directly to **pump.fun** via the **PumpPortal Trade API**.

---

## 🌟 Features

- 🖌️ **Interactive Studio Canvas**: Hand-draw your memecoin logo directly in the browser with brush tools, stickers/emojis, custom color pickers, and undo actions.
- 🔗 **Non-Custodial Phantom Wallet Connection**: Connect with Phantom / Solflare using standard Solana Wallet Adapter.
- ⚡ **PumpPortal & Pump.fun Integration**: 
  - Direct metadata & artwork upload to IPFS.
  - Bonding curve creation on pump.fun.
  - Optional initial developer buy with customized slippage and priority fees.
- 🚀 **Live Solscan & Pump.fun Links**: View the live transaction on Solscan and bonding curve page on pump.fun right after minting.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, `@solana/wallet-adapter-react`, `@solana/web3.js`, Lucide Icons, Canvas Confetti.
- **Backend**: Node.js, Express, Multer, FormData, Axios, `@solana/web3.js`, bs58.
- **Blockchain**: Solana Mainnet-Beta, PumpPortal Trade-Local API, Pump.fun IPFS.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Phantom Wallet browser extension installed and set to Solana Mainnet with some SOL balance (for launch transaction fees & initial buy).

### 2. Run the Entire Project (Server + Client)
From the root directory:
```bash
npm run dev
```
- **React Frontend**: `http://localhost:5173`
- **Express Backend**: `http://localhost:5001`

---

## ⚙️ Architecture & Flow

```
1. User connects Phantom Wallet
2. User draws token logo on the interactive canvas
3. User enters coin Name, Symbol ($TICKER), Description & optional dev buy amount
4. Frontend sends Drawing Blob + Details to Backend (/api/upload-metadata) -> IPFS
5. Backend calls PumpPortal API (https://pumpportal.fun/api/trade-local) to build the Create Coin Transaction
6. Backend signs transaction with newly generated Mint Keypair
7. Frontend prompts Phantom Wallet for the creator signature
8. Backend broadcasts the signed transaction to Solana Mainnet
9. Success! Token is live on pump.fun
```
