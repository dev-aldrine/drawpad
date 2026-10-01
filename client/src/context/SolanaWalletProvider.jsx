import React, { useMemo, useCallback } from 'react';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

export const SolanaWalletProvider = ({ children }) => {
  // Use high-performance, CORS-enabled Solana Mainnet RPC
  const endpoint = useMemo(() => {
    return 'https://solana-rpc.publicnode.com';
  }, []);

  // Use empty wallets array so Standard Wallets (Phantom, Solflare, etc.) are registered natively without duplicate warnings
  const wallets = useMemo(() => [], []);

  const onError = useCallback((error) => {
    // Suppress expected user cancellations or popup closes
    if (
      error?.name === 'WalletConnectionError' ||
      error?.message?.includes('User rejected') ||
      error?.message?.includes('rejected the request')
    ) {
      return;
    }
    console.warn('Solana Wallet error:', error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect={false} onError={onError}>
        <WalletModalProvider>
          {children}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
