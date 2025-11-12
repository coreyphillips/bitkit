import type { Wallet } from 'beignet';

export interface IWalletContext {
  wallet: Wallet | null;
  isInitialized: boolean;
  balance: number;
  address: string;
  transactions: ITransaction[];
  createWallet: (mnemonic?: string) => Promise<void>;
  refreshWallet: () => Promise<void>;
  sendTransaction: (address: string, amount: number) => Promise<string>;
  getNewAddress: () => string;
}

export interface ITransaction {
  txid: string;
  confirmations: number;
  value: number;
  timestamp: number;
  type: 'sent' | 'received';
}

export interface IStorageData {
  [key: string]: any;
}

export interface IElectrumConfig {
  host: string;
  port: number;
  protocol: 'ssl' | 'tcp';
}
