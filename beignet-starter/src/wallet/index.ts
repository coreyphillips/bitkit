import { Wallet, generateMnemonic } from 'beignet';
import { walletStorage } from './storage';
import { AddressGenerator, type Network } from '../utils/addressGenerator';
import type { IElectrumConfig, ITransaction } from '../types/wallet';

// Default Electrum server configuration (using Blockstream's testnet server)
const DEFAULT_ELECTRUM_CONFIG: IElectrumConfig = {
  host: 'blockstream.info',
  port: 993,
  protocol: 'ssl',
};

let walletInstance: Wallet | null = null;
let addressGenerator: AddressGenerator | null = null;

/**
 * Custom address generation function for Beignet
 * Uses react-native-address-generator for native address generation
 */
const customGetAddress = async ({
  path,
  network,
}: {
  path: string;
  network: Network;
}): Promise<{ address: string; publicKey: string; scriptHash: string }> => {
  if (!addressGenerator) {
    throw new Error('Address generator not initialized');
  }

  return addressGenerator.getAddress({ path, network });
};

/**
 * Create a new wallet instance with Beignet
 */
export async function createWallet(mnemonic?: string): Promise<Wallet> {
  // Generate new mnemonic if not provided
  const walletMnemonic = mnemonic || generateMnemonic();

  // Initialize native address generator
  addressGenerator = new AddressGenerator({
    mnemonic: walletMnemonic,
    network: 'testnet',
  });

  // Create wallet instance
  const wallet = await Wallet.create({
    mnemonic: walletMnemonic,
    network: 'testnet', // Use testnet for development
    addressType: 'p2wpkh', // Native SegWit addresses
    storage: walletStorage,
    electrumConfig: {
      servers: {
        testnet: [DEFAULT_ELECTRUM_CONFIG],
      },
    },
    customGetAddress, // Use native address generation
  });

  walletInstance = wallet;
  return wallet;
}

/**
 * Get the current wallet instance
 */
export function getWallet(): Wallet | null {
  return walletInstance;
}

/**
 * Refresh wallet data from the blockchain
 */
export async function refreshWallet(wallet: Wallet): Promise<void> {
  try {
    await wallet.refreshWallet();
  } catch (error) {
    console.error('Failed to refresh wallet:', error);
    throw error;
  }
}

/**
 * Get the current wallet balance in satoshis
 */
export function getBalance(wallet: Wallet): number {
  const utxos = wallet.getUtxos();
  return utxos.reduce((total, utxo) => total + utxo.value, 0);
}

/**
 * Get a new receiving address
 */
export function getNewAddress(wallet: Wallet): string {
  return wallet.getAddress();
}

/**
 * Get wallet transactions
 */
export function getTransactions(wallet: Wallet): ITransaction[] {
  const transactions = wallet.getTransactions();

  return transactions.map((tx) => {
    // Determine if transaction is sent or received
    const outputs = tx.vout || [];
    const inputs = tx.vin || [];

    // Simple heuristic: if any input is from our wallet, it's a send
    const isSent = inputs.some((input: any) => input.prevout?.scriptpubkey_address);

    return {
      txid: tx.txid,
      confirmations: tx.status?.confirmed ? tx.status.block_height : 0,
      value: outputs.reduce((sum: number, out: any) => sum + out.value, 0),
      timestamp: tx.status?.block_time || Date.now() / 1000,
      type: isSent ? 'sent' : 'received',
    };
  });
}

/**
 * Send a transaction
 */
export async function sendTransaction(
  wallet: Wallet,
  toAddress: string,
  amountSats: number,
): Promise<string> {
  try {
    // Create transaction
    const result = await wallet.send({
      address: toAddress,
      amount: amountSats,
      feeRate: 1, // 1 sat/vB (adjust as needed)
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  } catch (error) {
    console.error('Failed to send transaction:', error);
    throw error;
  }
}

/**
 * Get wallet mnemonic (for backup purposes)
 */
export function getMnemonic(wallet: Wallet): string {
  return wallet.mnemonic;
}

/**
 * Update Electrum server configuration
 */
export function updateElectrumConfig(config: IElectrumConfig): void {
  // Note: This would require reinitializing the wallet
  // Implementation depends on your app's needs
  console.log('Update Electrum config:', config);
}
