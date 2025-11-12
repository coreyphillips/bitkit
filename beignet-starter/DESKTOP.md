# Desktop Support Guide

This guide explains how to add Windows and macOS desktop support to the Beignet Starter app using react-native-windows and react-native-macos.

## Overview

React Native supports desktop platforms through:
- **react-native-windows**: For Windows 10+ (UWP)
- **react-native-macos**: For macOS 10.14+

Both platforms share the same JavaScript codebase and can use most React Native components.

## Adding Windows Support

### Prerequisites

1. **Windows 10 or 11** (64-bit)
2. **Visual Studio 2022** with:
   - Desktop development with C++
   - Universal Windows Platform development
3. **Node.js** 18+
4. **Yarn** (recommended for Windows)

### Installation Steps

1. **Install react-native-windows CLI**
   ```bash
   npm install -g react-native-windows-init
   ```

2. **Initialize Windows project**
   ```bash
   npx react-native-windows-init --overwrite
   ```

   This command:
   - Adds `windows/` directory with native Windows code
   - Updates `package.json` with Windows scripts
   - Configures build tools

3. **Verify Installation**
   ```bash
   cd windows
   # Check that BeignetStarter.sln exists
   dir
   cd ..
   ```

### Running on Windows

1. **Build and run**
   ```bash
   npm run windows
   # or
   npx react-native run-windows
   ```

2. **Run in Release mode**
   ```bash
   npx react-native run-windows --release
   ```

3. **Open in Visual Studio**
   ```bash
   start windows/BeignetStarter.sln
   ```
   Then press F5 to build and run.

### Windows-Specific Considerations

#### 1. Storage
AsyncStorage works on Windows through `@react-native-async-storage/async-storage`. No changes needed!

#### 2. Networking
Windows UWP requires network capability declarations. Already configured in the template.

#### 3. Crypto Libraries
The `react-native-get-random-values` polyfill works on Windows. No changes needed!

#### 4. Window Size
You can set initial window size in `windows/BeignetStarter/App.cpp`:
```cpp
void App::OnLaunched(LaunchActivatedEventArgs const &e) {
  // Set window size
  ApplicationView::GetForCurrentView().TryResizeView(Size(1200, 800));
}
```

### Troubleshooting Windows

#### Build Failed
```bash
# Clean build
cd windows
MSBuild.exe /t:Clean
cd ..
npx react-native run-windows --clean
```

#### VS2022 Not Found
Make sure Visual Studio 2022 is installed with UWP workload:
```bash
# Check Visual Studio installation
"C:\Program Files\Microsoft Visual Studio\2022\Community\Common7\IDE\devenv.exe" /?
```

#### Metro Bundler Issues
```bash
# Reset Metro
npx react-native start --reset-cache
```

## Adding macOS Support

### Prerequisites

1. **macOS 10.14+**
2. **Xcode 15+**
3. **CocoaPods**
4. **Node.js** 18+

### Installation Steps

1. **Install react-native-macos CLI**
   ```bash
   npm install -g react-native-macos-init
   ```

2. **Initialize macOS project**
   ```bash
   npx react-native-macos-init
   ```

   This command:
   - Adds `macos/` directory with native macOS code
   - Updates `package.json` with macOS scripts
   - Configures build tools

3. **Install CocoaPods dependencies**
   ```bash
   cd macos
   pod install
   cd ..
   ```

### Running on macOS

1. **Build and run**
   ```bash
   npm run macos
   # or
   npx react-native run-macos
   ```

2. **Run in Release mode**
   ```bash
   npx react-native run-macos --configuration Release
   ```

3. **Open in Xcode**
   ```bash
   open macos/BeignetStarter.xcworkspace
   ```
   Then press Cmd+R to build and run.

### macOS-Specific Considerations

#### 1. Storage
AsyncStorage works on macOS. No changes needed!

#### 2. Networking
macOS apps require entitlements for network access. Already configured in the template.

#### 3. App Sandbox
macOS apps run in a sandbox by default. If you need file system access, update entitlements:
```xml
<!-- macos/BeignetStarter/BeignetStarter.entitlements -->
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
```

#### 4. Window Configuration
Set window size in `macos/BeignetStarter/AppDelegate.m`:
```objc
- (void)applicationDidFinishLaunching:(NSNotification *)notification {
  // Set window size
  NSWindow *window = [[NSApp windows] firstObject];
  [window setFrame:NSMakeRect(100, 100, 1200, 800) display:YES];
}
```

### Troubleshooting macOS

#### Build Failed
```bash
# Clean CocoaPods
cd macos
pod deintegrate
pod install
cd ..

# Clean Xcode build
npx react-native run-macos --clean
```

#### Code Signing Issues
In Xcode:
1. Select the BeignetStarter target
2. Go to "Signing & Capabilities"
3. Select your development team
4. Check "Automatically manage signing"

#### Metro Bundler Issues
```bash
# Reset Metro
npx react-native start --reset-cache
```

## Platform-Specific Code

If you need platform-specific code, use `Platform.OS`:

```typescript
import { Platform } from 'react-native';

if (Platform.OS === 'windows') {
  // Windows-specific code
} else if (Platform.OS === 'macos') {
  // macOS-specific code
} else if (Platform.OS === 'ios') {
  // iOS-specific code
} else if (Platform.OS === 'android') {
  // Android-specific code
}
```

### Platform-Specific Files

You can create platform-specific files:
```
Button.tsx          # Shared
Button.windows.tsx  # Windows-specific
Button.macos.tsx    # macOS-specific
Button.ios.tsx      # iOS-specific
Button.android.tsx  # Android-specific
```

React Native will automatically load the correct file.

## Desktop UI Considerations

### 1. Larger Screens
Desktop apps have more screen real estate. Consider:
- Multi-column layouts
- Side navigation
- Larger fonts and buttons

```typescript
const styles = StyleSheet.create({
  container: {
    maxWidth: Platform.OS === 'web' || Platform.OS === 'windows' || Platform.OS === 'macos'
      ? 1200
      : '100%',
    marginHorizontal: 'auto',
  },
});
```

### 2. Mouse & Keyboard Input
Desktop users expect:
- Hover states
- Keyboard shortcuts
- Right-click context menus

```typescript
import { Pressable } from 'react-native';

<Pressable
  onPress={handlePress}
  onHoverIn={() => setHovered(true)}
  onHoverOut={() => setHovered(false)}
  style={({ hovered }) => [
    styles.button,
    hovered && styles.buttonHovered
  ]}>
  <Text>Click Me</Text>
</Pressable>
```

### 3. Window Controls
Add custom title bar, minimize/maximize buttons:

```typescript
// Windows
import { View, Text, Button } from 'react-native';

function TitleBar() {
  return (
    <View style={styles.titleBar}>
      <Text>Beignet Wallet</Text>
      <View style={styles.windowControls}>
        <Button title="−" onPress={minimize} />
        <Button title="□" onPress={maximize} />
        <Button title="×" onPress={close} />
      </View>
    </View>
  );
}
```

## Distribution

### Windows Distribution

1. **Build Release**
   ```bash
   npx react-native run-windows --release
   ```

2. **Create APPX Package**
   - Open `windows/BeignetStarter.sln` in Visual Studio
   - Right-click project → "Publish" → "Create App Packages"
   - Follow the wizard to create MSIX/APPX

3. **Sideloading**
   - Users need to enable Developer Mode
   - Install the certificate
   - Double-click the APPX file

### macOS Distribution

1. **Build Release**
   ```bash
   npx react-native run-macos --configuration Release
   ```

2. **Create DMG**
   ```bash
   # Build archive
   xcodebuild -workspace macos/BeignetStarter.xcworkspace \
     -scheme BeignetStarter \
     -configuration Release \
     archive -archivePath build/BeignetStarter.xcarchive

   # Export
   xcodebuild -exportArchive \
     -archivePath build/BeignetStarter.xcarchive \
     -exportPath build \
     -exportOptionsPlist exportOptions.plist
   ```

3. **Code Signing**
   - Enroll in Apple Developer Program ($99/year)
   - Create certificates in Xcode
   - Notarize the app for distribution outside Mac App Store

## Testing Desktop Apps

### Unit Tests
Same tests work across all platforms:
```bash
npm test
```

### Integration Tests
Consider platform-specific test files:
```
__tests__/
  App.test.tsx          # Shared tests
  App.windows.test.tsx  # Windows-specific tests
  App.macos.test.tsx    # macOS-specific tests
```

### Manual Testing Checklist

- [ ] App launches successfully
- [ ] Wallet creation works
- [ ] Balance displays correctly
- [ ] Send transaction works
- [ ] Receive address displays
- [ ] Transaction history loads
- [ ] Window resizing works properly
- [ ] Keyboard navigation works
- [ ] App persists data on restart

## Performance Optimization

### 1. Native Modules
Desktop platforms can benefit from native optimizations:
- Windows: C++/WinRT modules
- macOS: Swift/Objective-C modules

### 2. Bundling
Optimize JavaScript bundle:
```bash
# Create optimized bundle
npx react-native bundle --platform windows --dev false
npx react-native bundle --platform macos --dev false
```

### 3. Lazy Loading
Use lazy loading for screens:
```typescript
const HomeScreen = React.lazy(() => import('./screens/HomeScreen'));
const SendScreen = React.lazy(() => import('./screens/SendScreen'));
```

## Resources

### Windows
- [React Native Windows Docs](https://microsoft.github.io/react-native-windows/)
- [React Native Windows GitHub](https://github.com/microsoft/react-native-windows)
- [Windows API Reference](https://microsoft.github.io/react-native-windows/docs/windowsbrush-and-theme)

### macOS
- [React Native macOS Docs](https://microsoft.github.io/react-native-windows/docs/rnm-getting-started)
- [React Native macOS GitHub](https://github.com/microsoft/react-native-macos)

### General
- [React Native Docs](https://reactnative.dev/)
- [Platform-Specific Code](https://reactnative.dev/docs/platform-specific-code)

## Getting Help

- **Windows Issues**: https://github.com/microsoft/react-native-windows/issues
- **macOS Issues**: https://github.com/microsoft/react-native-macos/issues
- **General React Native**: https://github.com/facebook/react-native/issues

---

Happy Desktop Development! 🖥️
