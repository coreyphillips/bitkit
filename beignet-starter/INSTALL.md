# Installation Instructions

Due to the size of iOS and Android native project files (thousands of files), this starter template requires you to initialize the native projects yourself.

## Quick Setup (5 minutes)

### Step 1: Initialize React Native Project

```bash
# In a temporary directory
cd /tmp
npx @react-native-community/cli init BeignetStarterNative --skip-install

# Copy the native project files to beignet-starter
cp -r BeignetStarterNative/ios /path/to/beignet-starter/
cp -r BeignetStarterNative/android /path/to/beignet-starter/

# Clean up
rm -rf BeignetStarterNative
```

### Step 2: Install Dependencies

```bash
cd /path/to/beignet-starter
npm install
```

### Step 3: Install iOS Pods (macOS only)

```bash
cd ios
pod install
cd ..
```

### Step 4: Run the App

```bash
# iOS
npm run ios

# Android
npm run android
```

## Alternative: Manual Setup

If you prefer, you can also:

1. Create a new React Native project:
   ```bash
   npx @react-native-community/cli init MyBitcoinWallet
   ```

2. Copy the `src/` directory from beignet-starter into your project

3. Copy these configuration files:
   - `package.json` (merge dependencies)
   - `metro.config.js`
   - `shim.js`
   - `index.js`
   - `tsconfig.json`
   - `babel.config.js`

4. Install the dependencies and run

## Why This Approach?

The iOS and Android native projects contain thousands of automatically-generated files that would bloat the repository. By having you generate them fresh, you get:

- ✅ The latest React Native template
- ✅ Clean, unmodified native code
- ✅ Smaller repository size
- ✅ No merge conflicts with outdated native files

## Need Help?

- See [SETUP.md](./SETUP.md) for detailed setup instructions
- See [README.md](./README.md) for full documentation
- Open an issue if you encounter problems
