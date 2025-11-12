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
npx @react-native-community/cli init TempBeignetStarter --skip-install --version 0.76.5

# Copy native files back
echo "Copying iOS project files..."
cp -r TempBeignetStarter/ios/* "$OLDPWD/ios/" 2>/dev/null || true

echo "Copying Android project files..."
cp -r TempBeignetStarter/android/* "$OLDPWD/android/" 2>/dev/null || true

# Rename the app in native files
cd "$OLDPWD"

echo "Configuring iOS project..."
# Rename in iOS files
find ios -type f -name "*.pbxproj" -o -name "*.plist" -o -name "*.m" -o -name "*.h" | while read file; do
  sed -i.bak 's/TempBeignetStarter/BeignetStarter/g' "$file"
  rm "${file}.bak" 2>/dev/null || true
done

echo "Configuring Android project..."
# Rename in Android files
find android -type f -name "*.gradle" -o -name "*.xml" -o -name "*.java" -o -name "*.kt" | while read file; do
  sed -i.bak 's/TempBeignetStarter/BeignetStarter/g' "$file"
  sed -i.bak 's/tempbeignetstarter/beignetstarter/g' "$file"
  rm "${file}.bak" 2>/dev/null || true
done

# Rename Android package directories
if [ -d "android/app/src/main/java/com/tempbeignetstarter" ]; then
  mv android/app/src/main/java/com/tempbeignetstarter android/app/src/main/java/com/beignetstarter
fi

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
