# Beignet Integration Guide

This guide explains how Beignet is integrated into this starter app and how to work with it.

## Table of Contents

1. [What is Beignet?](#what-is-beignet)
2. [Architecture Overview](#architecture-overview)
3. [Storage Implementation](#storage-implementation)
4. [Wallet Initialization](#wallet-initialization)
5. [Core Operations](#core-operations)
6. [Event Handling](#event-handling)
7. [Advanced Usage](#advanced-usage)
8. [Best Practices](#best-practices)

## What is Beignet?

Beignet is a TypeScript Bitcoin wallet library that provides:
- **Wallet Management**: Create, restore, and manage Bitcoin wallets
- **Multiple Address Types**: Support for Legacy, SegWit, Native SegWit, and Taproot
- **Transaction Handling**: Create, sign, and broadcast transactions
- **UTXO Management**: Automatic UTXO tracking and coin selection
- **Electrum Integration**: Connect to Electrum servers for blockchain data
- **Multi-Network**: Support for mainnet, testnet, and regtest

## Architecture Overview

```
┌─────────────────────────────────────┐
│         React Components            │
│    (Screens, UI Components)         │
└──────────────┬──────────────────────┘
               │ useWallet()
               ↓
┌─────────────────────────────────────┐
│       WalletContext Provider        │
│   (State Management & Wallet API)   │
└──────────────┬──────────────────────┘
               │ createWallet()
               │ sendTransaction()
               │ etc.
               ↓
┌─────────────────────────────────────┐
│      Wallet Utilities Layer         │
│      (src/wallet/index.ts)          │
└──────────────┬──────────────────────┘
               │ Wallet.create()
               ↓
┌─────────────────────────────────────┐
│         Beignet Library             │
│    (Bitcoin Wallet Operations)      │
└──────────────┬──────────────────────┘
               │ TStorage interface
               ↓
┌─────────────────────────────────────┐
│        Storage Layer                │
│   (AsyncStorage + TStorage impl)    │
└─────────────────────────────────────┘
```

## Storage Implementation

Beignet requires a storage implementation that follows the `TStorage` interface:

### Interface Definition
```typescript
interface TStorage {
  getData(key: string): Promise<any>;
  setData(key: string, value: any): Promise<void>;
}
```

### Implementation (`src/wallet/storage.ts`)

```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TStorage } from 'beignet';

export class WalletStorage implements TStorage {
  private cache: { [key: string]: any } = {};
  private initialized = false;

  async initialize(): Promise<void> {
    const data = await AsyncStorage.getItem('beignet_wallet_data');
    if (data) {
      this.cache = JSON.parse(data);
    }
    this.initialized = true;
  }

  async getData(key: string): Promise<any> {
    if (!this.initialized) await this.initialize();
    return this.cache[key];
  }

  async setData(key: string, value: any): Promise<void> {
    if (!this.initialized) await this.initialize();
    this.cache[key] = value;
    await AsyncStorage.setItem(
      'beignet_wallet_data',
      JSON.stringify(this.cache)
    );
  }
}
```

### What Beignet Stores

Beignet stores the following data:
- **Addresses**: Generated addresses for each address type
- **Transactions**: Transaction history and details
- **UTXOs**: Unspent transaction outputs
- **Metadata**: Last used indices, sync timestamps, etc.

The data is keyed by network and address type, e.g.:
- `testnet:p2wpkh:addresses`
- `testnet:p2wpkh:transactions`
- `testnet:p2wpkh:utxos`

## Wallet Initialization

### Basic Initialization

```typescript
import { Wallet } from 'beignet';
import { walletStorage } from './storage';

const wallet = await Wallet.create({
  mnemonic: 'your twelve word recovery phrase here...',
  network: 'testnet',
  addressType: 'p2wpkh',
  storage: walletStorage,
  electrumConfig: {
    servers: {
      testnet: [{
        host: 'blockstream.info',
        port: 993,
        protocol: 'ssl'
      }]
    }
  }
});
```

### Configuration Options

#### Network
- `bitcoin` - Bitcoin mainnet
- `testnet` - Bitcoin testnet
- `regtest` - Local regression test network

#### Address Types
- `p2pkh` - Legacy addresses (1...)
- `p2sh` - Nested SegWit (3...)
- `p2wpkh` - Native SegWit (bc1q...)
- `p2tr` - Taproot (bc1p...)

#### Electrum Configuration
```typescript
electrumConfig: {
  servers: {
    testnet: [
      { host: 'blockstream.info', port: 993, protocol: 'ssl' },
      { host: 'electrum.blockstream.info', port: 60002, protocol: 'ssl' }
    ],
    bitcoin: [
      { host: 'electrum.blockstream.info', port: 50002, protocol: 'ssl' }
    ]
  }
}
```

## Core Operations

### 1. Generating a Mnemonic

```typescript
import { generateMnemonic } from 'beignet';

const mnemonic = generateMnemonic();
// Returns: "word1 word2 word3 ... word12"
```

### 2. Getting an Address

```typescript
// Get current receiving address
const address = wallet.getAddress();

// Get a specific address by index
const specificAddress = wallet.getAddress(5);
```

### 3. Getting Balance

```typescript
// Get all UTXOs
const utxos = wallet.getUtxos();

// Calculate total balance
const balance = utxos.reduce((total, utxo) => total + utxo.value, 0);

// Balance is in satoshis
const btcBalance = balance / 100_000_000;
```

### 4. Refreshing from Blockchain

```typescript
// Sync with blockchain
await wallet.refreshWallet();

// This will:
// - Connect to Electrum server
// - Check for new transactions
// - Update UTXO set
// - Update balance
```

### 5. Sending a Transaction

```typescript
const result = await wallet.send({
  address: 'recipient_address',
  amount: 50000, // in satoshis
  feeRate: 1, // sat/vB
});

if (result.isOk()) {
  const txid = result.value;
  console.log('Transaction sent:', txid);
} else {
  console.error('Send failed:', result.error);
}
```

### 6. Getting Transactions

```typescript
const transactions = wallet.getTransactions();

transactions.forEach(tx => {
  console.log('TXID:', tx.txid);
  console.log('Confirmations:', tx.status?.confirmed);
  console.log('Block height:', tx.status?.block_height);
  console.log('Inputs:', tx.vin);
  console.log('Outputs:', tx.vout);
});
```

## Event Handling

Beignet emits events for various wallet activities:

### Setting Up Event Listener

```typescript
wallet.onMessage((message) => {
  console.log('Event:', message.method);
  console.log('Data:', message.data);
});
```

### Available Events

#### 1. Transaction Received
```typescript
{
  method: 'transactionReceived',
  data: {
    txid: 'transaction_id',
    value: 50000, // satoshis
    address: 'receiving_address'
  }
}
```

#### 2. Transaction Sent
```typescript
{
  method: 'transactionSent',
  data: {
    txid: 'transaction_id',
    amount: 50000,
    fee: 200
  }
}
```

#### 3. Connected to Electrum
```typescript
{
  method: 'connectedToElectrum',
  data: {
    host: 'blockstream.info',
    port: 993
  }
}
```

#### 4. New Block
```typescript
{
  method: 'newBlock',
  data: {
    height: 2500000,
    hash: 'block_hash'
  }
}
```

#### 5. Reorg Detected
```typescript
{
  method: 'reorg',
  data: {
    oldHeight: 2500000,
    newHeight: 2499999
  }
}
```

## Advanced Usage

### 1. Multiple Address Types

```typescript
// Create wallet with Taproot
const taprootWallet = await Wallet.create({
  mnemonic,
  network: 'bitcoin',
  addressType: 'p2tr',
  storage: walletStorage
});

// You can have multiple wallet instances
// for different address types simultaneously
```

### 2. Custom Fee Rates

```typescript
// Estimate fee rate
const feeRate = await wallet.getFeeRate('fast'); // 'fast', 'medium', 'slow'

// Send with custom fee
await wallet.send({
  address: 'recipient',
  amount: 10000,
  feeRate: feeRate
});
```

### 3. Replace-By-Fee (RBF)

```typescript
// Send with RBF enabled
const result = await wallet.send({
  address: 'recipient',
  amount: 10000,
  feeRate: 1,
  rbf: true
});

// Later, bump the fee
const txid = result.value;
const bumpResult = await wallet.bumpFee(txid, 5); // new fee rate
```

### 4. Coin Control

```typescript
// Get UTXOs
const utxos = wallet.getUtxos();

// Select specific UTXOs for a transaction
const selectedUtxos = utxos.slice(0, 2);

await wallet.send({
  address: 'recipient',
  amount: 10000,
  feeRate: 1,
  selectedUtxos: selectedUtxos.map(u => u.txid)
});
```

### 5. Batch Transactions

```typescript
// Send to multiple recipients
await wallet.send({
  outputs: [
    { address: 'recipient1', amount: 10000 },
    { address: 'recipient2', amount: 20000 },
    { address: 'recipient3', amount: 30000 }
  ],
  feeRate: 1
});
```

## Best Practices

### 1. Error Handling

Always check Beignet results:
```typescript
const result = await wallet.send({ ... });

if (result.isErr()) {
  switch (result.error.code) {
    case 'INSUFFICIENT_FUNDS':
      alert('Not enough balance');
      break;
    case 'INVALID_ADDRESS':
      alert('Invalid recipient address');
      break;
    default:
      alert('Transaction failed: ' + result.error.message);
  }
  return;
}

const txid = result.value;
```

### 2. Regular Refreshing

Set up periodic wallet refreshing:
```typescript
useEffect(() => {
  const interval = setInterval(() => {
    wallet.refreshWallet();
  }, 60000); // Every minute

  return () => clearInterval(interval);
}, [wallet]);
```

### 3. Connection Status

Monitor Electrum connection:
```typescript
const [connected, setConnected] = useState(false);

wallet.onMessage((msg) => {
  if (msg.method === 'connectedToElectrum') {
    setConnected(true);
  } else if (msg.method === 'disconnectedFromElectrum') {
    setConnected(false);
  }
});
```

### 4. Mnemonic Security

Never log or display the mnemonic in production:
```typescript
// ❌ DON'T DO THIS
console.log('Mnemonic:', wallet.mnemonic);

// ✅ Only show during backup
const showMnemonicBackup = () => {
  Alert.alert(
    'Backup Required',
    'Write down your recovery phrase',
    [{ text: 'I Understand', onPress: () => navigation.navigate('Backup') }]
  );
};
```

### 5. Network Separation

Keep testnet and mainnet separate:
```typescript
// Use different storage keys
const TESTNET_KEY = 'beignet_testnet';
const MAINNET_KEY = 'beignet_mainnet';

// Visual indicators in UI
<View style={network === 'testnet' ? styles.testnet : styles.mainnet}>
  <Text>Network: {network}</Text>
</View>
```

## Troubleshooting

### "Failed to connect to Electrum"
- Check internet connection
- Try different Electrum servers
- Verify SSL certificates are valid
- Check firewall settings

### "Insufficient funds"
- Call `refreshWallet()` first
- Check `getUtxos()` to see available coins
- Verify balance includes fee

### "Invalid address"
- Validate address format
- Check network (testnet addresses start with 'tb1' or 'm'/'n')
- Use address validation before sending

### Storage Issues
- Implement proper error handling in storage layer
- Test storage read/write before wallet creation
- Clear corrupted data if needed

## Further Reading

- [Beignet GitHub](https://github.com/synonymdev/beignet)
- [Bitkit Implementation](https://github.com/synonymdev/bitkit) - Reference implementation
- [Bitcoin Developer Guide](https://developer.bitcoin.org/)
- [Electrum Protocol](https://electrumx.readthedocs.io/)

## Support

For Beignet-specific issues:
- Open an issue: https://github.com/synonymdev/beignet/issues
- Check existing issues and discussions
- Review the Bitkit codebase for examples

---

Happy building with Beignet! 🎉
