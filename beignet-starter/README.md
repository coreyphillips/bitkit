# Beignet Starter

A React Native starter app with [Beignet](https://github.com/synonymdev/beignet) for on-chain Bitcoin wallet functionality. This app works on iOS, Android, and can be extended to support Windows and macOS desktop platforms.

## Features

- ✅ **Create/Restore Wallet**: Generate a new wallet or restore from a 12-word mnemonic
- ✅ **Balance Display**: View your on-chain Bitcoin balance in BTC and satoshis
- ✅ **Receive**: Display your Bitcoin address (QR code placeholder included)
- ✅ **Send**: Send Bitcoin transactions with fee estimation
- ✅ **Transaction History**: View all your transactions with confirmations
- ✅ **Testnet Support**: Safe testing environment using Bitcoin testnet
- ✅ **Cross-Platform**: iOS, Android, with Windows & macOS desktop support available

## What is Beignet?

[Beignet](https://github.com/synonymdev/beignet) is a TypeScript Bitcoin wallet library that handles:
- On-chain wallet management
- Address generation (P2PKH, P2SH, P2WPKH, P2TR)
- Transaction creation and broadcasting
- UTXO management
- Electrum server connectivity
- Multi-network support (mainnet, testnet, regtest)

## Prerequisites

- Node.js >= 18
- npm or yarn
- For iOS: Xcode 15+ and CocoaPods
- For Android: Android Studio and JDK 17+
- For Windows: Visual Studio 2022 with UWP workload (optional)
- For macOS: Xcode 15+ (optional)

## Installation

⚠️ **Important**: This template contains the source code but requires you to initialize the iOS/Android native projects.

### Quick Start (Automated)

Run the setup script:
```bash
./setup.sh
```

This will:
- Install npm dependencies
- Generate iOS and Android native project files
- Install CocoaPods dependencies (iOS)
- Configure the projects for BeignetStarter

### Manual Setup

See [INSTALL.md](./INSTALL.md) for detailed manual installation instructions.

### Why No Native Files?

The iOS and Android native projects contain thousands of auto-generated files. By generating them fresh, you get:
- ✅ Latest React Native template
- ✅ Clean, unmodified native code
- ✅ Smaller repository size

## Running the App

### iOS
```bash
npm run ios
# or
react-native run-ios
```

### Android
```bash
npm run android
# or
react-native run-android
```

### Start Metro Bundler
```bash
npm start
# or
react-native start
```

## Adding Desktop Support

### Windows

1. **Install react-native-windows**
   ```bash
   npx react-native-windows-init --overwrite
   ```

2. **Run on Windows**
   ```bash
   npm run windows
   # or
   npx react-native run-windows
   ```

### macOS

1. **Install react-native-macos**
   ```bash
   npx react-native-macos-init
   ```

2. **Run on macOS**
   ```bash
   npm run macos
   # or
   npx react-native run-macos
   ```

## Project Structure

```
beignet-starter/
├── src/
│   ├── App.tsx                 # Main app component with navigation
│   ├── components/             # Reusable UI components
│   │   ├── Button.tsx
│   │   └── Card.tsx
│   ├── context/               # React Context for state management
│   │   └── WalletContext.tsx  # Wallet state and operations
│   ├── screens/               # Screen components
│   │   ├── WalletSetupScreen.tsx
│   │   ├── HomeScreen.tsx
│   │   ├── ReceiveScreen.tsx
│   │   ├── SendScreen.tsx
│   │   └── TransactionsScreen.tsx
│   ├── types/                 # TypeScript type definitions
│   │   └── wallet.ts
│   └── wallet/                # Beignet integration
│       ├── index.ts           # Wallet utilities
│       └── storage.ts         # Storage implementation
├── ios/                       # iOS native code
├── android/                   # Android native code
├── index.js                   # App entry point
└── package.json
```

## How Beignet is Integrated

### 1. Storage Layer (`src/wallet/storage.ts`)
Beignet requires a storage implementation that follows the `TStorage` interface:
```typescript
interface TStorage {
  getData(key: string): Promise<any>;
  setData(key: string, value: any): Promise<void>;
}
```

This app uses `AsyncStorage` as the persistence layer.

### 2. Wallet Initialization (`src/wallet/index.ts`)
The wallet is created with:
```typescript
const wallet = await Wallet.create({
  mnemonic: '12-word mnemonic phrase',
  network: 'testnet',
  addressType: 'p2wpkh',
  storage: walletStorage,
  electrumConfig: {
    servers: {
      testnet: [{ host: 'blockstream.info', port: 993, protocol: 'ssl' }]
    }
  }
});
```

### 3. State Management (`src/context/WalletContext.tsx`)
The app uses React Context to provide wallet state and operations to all components:
- `createWallet()` - Create or restore a wallet
- `refreshWallet()` - Sync with blockchain
- `sendTransaction()` - Send Bitcoin
- `getNewAddress()` - Generate new address
- `balance` - Current balance
- `transactions` - Transaction history

### 4. Event Handling
Beignet emits events that the app listens to:
```typescript
wallet.onMessage((message) => {
  switch (message.method) {
    case 'transactionReceived':
      // Handle incoming transaction
      break;
    case 'transactionSent':
      // Handle outgoing transaction
      break;
    case 'connectedToElectrum':
      // Connected to Electrum server
      break;
  }
});
```

## Key Operations

### Creating a Wallet
```typescript
import { generateMnemonic } from 'beignet';

const mnemonic = generateMnemonic(); // 12-word phrase
await createWallet(mnemonic);
```

### Sending a Transaction
```typescript
const txid = await sendTransaction(
  'tb1q...', // recipient address
  10000      // amount in satoshis
);
```

### Getting Balance
```typescript
const utxos = wallet.getUtxos();
const balance = utxos.reduce((sum, utxo) => sum + utxo.value, 0);
```

### Refreshing from Blockchain
```typescript
await wallet.refreshWallet();
```

## Configuration

### Electrum Servers
Default testnet server: `blockstream.info:993` (SSL)

To change servers, edit `src/wallet/index.ts`:
```typescript
const DEFAULT_ELECTRUM_CONFIG = {
  host: 'your-server.com',
  port: 50002,
  protocol: 'ssl'
};
```

### Network
To switch to mainnet, update `src/wallet/index.ts`:
```typescript
const wallet = await Wallet.create({
  network: 'bitcoin', // change from 'testnet'
  // ... other config
});
```

⚠️ **WARNING**: Only use mainnet with real Bitcoin if you understand the risks!

### Address Types
Supported address types:
- `p2pkh` - Legacy (1...)
- `p2sh` - Nested SegWit (3...)
- `p2wpkh` - Native SegWit (bc1q...)
- `p2tr` - Taproot (bc1p...)

Change in `src/wallet/index.ts`:
```typescript
addressType: 'p2wpkh' // or 'p2pkh', 'p2sh', 'p2tr'
```

## Extending the App

### Adding QR Code Support
Install a QR code library:
```bash
npm install react-native-qrcode-svg react-native-svg
```

Update `ReceiveScreen.tsx` to display QR codes.

### Adding Clipboard Support
```bash
npm install @react-native-clipboard/clipboard
```

Update screens to enable copying addresses and transaction IDs.

### Adding More Navigation
Consider adding React Navigation for more complex navigation:
```bash
npm install @react-navigation/native @react-navigation/stack
```

### Adding Fee Estimation
Beignet supports dynamic fee estimation. Update `SendScreen.tsx`:
```typescript
const feeRate = await wallet.getFeeRate('fast'); // or 'medium', 'slow'
```

## Development Tips

### Debugging Beignet
Enable detailed logging:
```typescript
wallet.onMessage((message) => {
  console.log('Wallet Event:', message);
});
```

### Testing with Testnet
Get testnet Bitcoin from faucets:
- https://testnet-faucet.mempool.co/
- https://bitcoinfaucet.uo1.net/

### Clearing Wallet Data
To reset the wallet during development:
```typescript
import { walletStorage } from './src/wallet/storage';
await walletStorage.clear();
```

## Security Considerations

✅ **Security Features Implemented**:

1. **Secure Mnemonic Storage**: This app uses `react-native-keychain` to store mnemonic phrases securely:
   - **iOS**: Uses Keychain Services (hardware-backed on devices with Secure Enclave)
   - **Android**: Uses Keystore System (hardware-backed on supported devices)
   - Mnemonics are **never** stored in plain text or AsyncStorage
   - Automatic encryption at rest

2. **Native Crypto Operations**: Uses `react-native-quick-crypto` for cryptographic functions:
   - Provides secure random number generation
   - Native implementation for better performance and security
   - Follows the same approach as Bitkit

3. **Native Address Generation**: Uses `react-native-address-generator` for address derivation:
   - Faster than JavaScript implementations
   - More secure with native crypto primitives
   - Integrated directly with Beignet via `customGetAddress`

4. **Network Security**: SSL/TLS for all Electrum server connections

5. **Input Validation**: All user inputs (addresses, amounts) are validated before processing

⚠️ **Additional Security Recommendations**:

1. **Testnet First**: Always test thoroughly on testnet before mainnet

2. **Backup**: Ensure users back up their recovery phrase securely offline

3. **PIN/Biometrics**: Consider adding PIN code or biometric authentication

4. **Auto-Lock**: Implement automatic screen locking for inactive sessions

5. **Secure Display**: Warn users about screenshots and screen recording when displaying sensitive information

## Troubleshooting

### iOS Build Issues
```bash
cd ios
pod deintegrate
pod install
cd ..
```

### Android Build Issues
```bash
cd android
./gradlew clean
cd ..
```

### Metro Bundler Issues
```bash
npm start -- --reset-cache
```

### Beignet Connection Issues
- Check Electrum server is reachable
- Verify network (testnet vs mainnet)
- Check firewall settings

## Resources

- [Beignet Documentation](https://github.com/synonymdev/beignet)
- [React Native Documentation](https://reactnative.dev/)
- [Bitcoin Developer Guide](https://developer.bitcoin.org/)
- [Electrum Protocol](https://electrumx.readthedocs.io/)

## Contributing

This is a starter template. Feel free to:
- Fork and customize
- Add features
- Submit improvements
- Share your projects built with this starter

## License

MIT License - feel free to use this starter for any project!

## Support

For issues specific to:
- **Beignet**: https://github.com/synonymdev/beignet/issues
- **React Native**: https://github.com/facebook/react-native/issues
- **This Starter**: Open an issue in this repository

## Acknowledgments

Built with ❤️ using:
- [Beignet](https://github.com/synonymdev/beignet) by Synonym
- [React Native](https://reactnative.dev/)
- [Bitkit](https://github.com/synonymdev/bitkit) (reference implementation)

---

**Happy Building! 🚀**
