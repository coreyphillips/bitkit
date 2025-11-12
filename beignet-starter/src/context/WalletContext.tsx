import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { Wallet } from 'beignet';
import * as WalletUtils from '../wallet';
import { walletStorage } from '../wallet/storage';
import { getMnemonic, storeMnemonic } from '../utils/keychain';
import type { IWalletContext, ITransaction } from '../types/wallet';

const WalletContext = createContext<IWalletContext | undefined>(undefined);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState('');
  const [transactions, setTransactions] = useState<ITransaction[]>([]);

  // Initialize storage and check for existing wallet
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        await walletStorage.initialize();

        // Try to restore wallet from keychain
        const storedMnemonic = await getMnemonic();
        if (storedMnemonic) {
          console.log('Found existing wallet in keychain, attempting to restore...');
          try {
            const restoredWallet = await WalletUtils.createWallet(storedMnemonic);
            setWallet(restoredWallet);
            await refreshWalletData(restoredWallet);
          } catch (error) {
            console.error('Failed to restore wallet:', error);
          }
        }

        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize wallet:', error);
        setIsInitialized(true);
      }
    };

    initializeWallet();
  }, []);

  // Create a new wallet
  const createWallet = useCallback(async (mnemonic?: string) => {
    try {
      const newWallet = await WalletUtils.createWallet(mnemonic);
      setWallet(newWallet);

      // Store mnemonic securely in keychain
      const walletMnemonic = WalletUtils.getMnemonic(newWallet);
      await storeMnemonic(walletMnemonic);

      // Set up message handler for wallet events
      newWallet.onMessage((message) => {
        console.log('Wallet message:', message);

        switch (message.method) {
          case 'transactionReceived':
            console.log('Transaction received:', message.data);
            refreshWalletData(newWallet);
            break;
          case 'transactionSent':
            console.log('Transaction sent:', message.data);
            refreshWalletData(newWallet);
            break;
          case 'connectedToElectrum':
            console.log('Connected to Electrum');
            refreshWalletData(newWallet);
            break;
          default:
            console.log('Unhandled wallet message:', message.method);
        }
      });

      // Initial refresh
      await refreshWalletData(newWallet);
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw error;
    }
  }, []);

  // Refresh wallet data
  const refreshWalletData = async (walletInstance: Wallet) => {
    try {
      await WalletUtils.refreshWallet(walletInstance);

      const newBalance = WalletUtils.getBalance(walletInstance);
      const newAddress = WalletUtils.getNewAddress(walletInstance);
      const newTransactions = WalletUtils.getTransactions(walletInstance);

      setBalance(newBalance);
      setAddress(newAddress);
      setTransactions(newTransactions);
    } catch (error) {
      console.error('Failed to refresh wallet:', error);
    }
  };

  // Refresh current wallet
  const refreshWallet = useCallback(async () => {
    if (wallet) {
      await refreshWalletData(wallet);
    }
  }, [wallet]);

  // Send transaction
  const sendTransaction = useCallback(
    async (toAddress: string, amount: number): Promise<string> => {
      if (!wallet) {
        throw new Error('Wallet not initialized');
      }

      const txid = await WalletUtils.sendTransaction(wallet, toAddress, amount);
      await refreshWalletData(wallet);
      return txid;
    },
    [wallet]
  );

  // Get new address
  const getNewAddress = useCallback((): string => {
    if (!wallet) {
      throw new Error('Wallet not initialized');
    }
    return WalletUtils.getNewAddress(wallet);
  }, [wallet]);

  const value: IWalletContext = {
    wallet,
    isInitialized,
    balance,
    address,
    transactions,
    createWallet,
    refreshWallet,
    sendTransaction,
    getNewAddress,
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet(): IWalletContext {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
