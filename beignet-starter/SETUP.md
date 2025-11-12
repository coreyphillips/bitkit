# Quick Setup Guide

This guide will help you get the Beignet Starter app running in 5 minutes.

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ npm or yarn installed (`npm --version`)
- ✅ Git installed (`git --version`)

### For iOS Development:
- ✅ macOS computer
- ✅ Xcode 15+ installed
- ✅ CocoaPods installed (`pod --version`)

### For Android Development:
- ✅ Android Studio installed
- ✅ Android SDK (API 23+) installed
- ✅ JDK 17+ installed (`java --version`)
- ✅ ANDROID_HOME environment variable set

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd beignet-starter

# Install npm dependencies
npm install

# For iOS: Install CocoaPods dependencies
cd ios && pod install && cd ..
```

### 2. Start Metro Bundler

Open a new terminal and run:
```bash
npm start
```

Keep this terminal open. It's the Metro bundler that serves your JavaScript code.

### 3. Run on Your Platform

#### iOS (macOS only)
In a new terminal:
```bash
npm run ios
```

Or open in Xcode:
```bash
open ios/BeignetStarter.xcworkspace
```
Then click the "Run" button in Xcode.

#### Android
In a new terminal:
```bash
npm run android
```

Make sure you have either:
- An Android emulator running, or
- An Android device connected via USB with USB debugging enabled

### 4. First Time Setup

When the app launches:
1. You'll see the "Welcome to Beignet Starter" screen
2. Tap "Create New Wallet"
3. **IMPORTANT**: Write down the 12-word recovery phrase shown
4. Tap "I've Backed Up My Phrase"
5. The wallet is now created and ready to use!

### 5. Get Test Bitcoin

Since this app uses Bitcoin testnet:
1. Tap "Receive" on the home screen
2. Copy your address
3. Visit a testnet faucet:
   - https://testnet-faucet.mempool.co/
   - https://bitcoinfaucet.uo1.net/
4. Paste your address and request testnet BTC
5. Wait a few minutes and refresh the app to see your balance

## Common Issues

### iOS: "Command PhaseScriptExecution failed"
```bash
cd ios
pod deintegrate
pod install
cd ..
npm start -- --reset-cache
```

### Android: "SDK location not found"
Create `android/local.properties`:
```
sdk.dir=/Users/YOUR_USERNAME/Library/Android/sdk
# On Windows: sdk.dir=C:\\Users\\YOUR_USERNAME\\AppData\\Local\\Android\\Sdk
# On Linux: sdk.dir=/home/YOUR_USERNAME/Android/Sdk
```

### Metro: "Port 8081 already in use"
```bash
# Kill existing Metro process
npx react-native start --reset-cache
```

### Beignet: "Failed to connect to Electrum"
This usually resolves itself. If it persists:
1. Check your internet connection
2. Try refreshing the wallet
3. Wait a minute and try again

## Development Tools

### Enable Debug Menu

- **iOS**: Press `Cmd + D` in the simulator
- **Android**: Press `Cmd + M` (Mac) or `Ctrl + M` (Windows/Linux)

### Useful Debug Commands

```bash
# Reset Metro cache
npm start -- --reset-cache

# Clean iOS build
cd ios && xcodebuild clean && cd ..

# Clean Android build
cd android && ./gradlew clean && cd ..

# Clear wallet data (development only)
# Delete the app from device/emulator and reinstall
```

## Next Steps

Now that your app is running:

1. **Explore the Code**:
   - Check out `src/App.tsx` to see the main app structure
   - Look at `src/wallet/index.ts` to see how Beignet is used
   - Examine the screens in `src/screens/`

2. **Customize**:
   - Change colors in the StyleSheet of each screen
   - Add your app name in `app.json`
   - Modify the wallet features in `src/context/WalletContext.tsx`

3. **Extend**:
   - Add QR code support
   - Implement clipboard functionality
   - Add more transaction details
   - Integrate price feeds

## Getting Help

- **Read the main README.md** for detailed documentation
- **Check Beignet docs**: https://github.com/synonymdev/beignet
- **React Native docs**: https://reactnative.dev/
- **Open an issue** if you find bugs

Happy coding! 🎉
