#!/bin/bash

# Beignet Starter Setup Script
# This script initializes the React Native native projects (iOS & Android)

set -e

echo "🚀 Setting up Beignet Starter..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this from the beignet-starter directory."
  exit 1
fi

echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "📱 Initializing native projects..."
echo "This will create the iOS and Android native project files..."
echo ""

# Create temporary app with react-native init to get native files
TEMP_DIR=$(mktemp -d)
cd "$TEMP_DIR"

echo "Creating temporary React Native project..."
npx @react-native-community/cli init BeignetStarter --skip-install

# Copy native files back
echo "Copying iOS project files..."
cp -r BeignetStarter/ios/* "$OLDPWD/ios/" 2>/dev/null || true

echo "Copying Android project files..."
cp -r BeignetStarter/android/* "$OLDPWD/android/" 2>/dev/null || true

# Return to original directory
cd "$OLDPWD"

echo "Native projects copied successfully!"

# Clean up
rm -rf "$TEMP_DIR"

echo ""
echo "📦 Installing iOS dependencies (CocoaPods)..."
if command -v pod &> /dev/null; then
  cd ios
  pod install
  cd ..
  echo "✅ iOS pods installed"
else
  echo "⚠️  CocoaPods not found. Skipping pod install."
  echo "   Install CocoaPods: https://cocoapods.org/"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 You can now run the app:"
echo "   iOS:     npm run ios"
echo "   Android: npm run android"
echo ""
echo "📚 See README.md for more information"
