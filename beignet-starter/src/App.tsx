import React, { useState } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import { WalletProvider, useWallet } from './context/WalletContext';
import {
  WalletSetupScreen,
  HomeScreen,
  ReceiveScreen,
  SendScreen,
  TransactionsScreen,
} from './screens';

type Screen = 'setup' | 'home' | 'send' | 'receive' | 'transactions';

function AppContent() {
  const { wallet } = useWallet();
  const [currentScreen, setCurrentScreen] = useState<Screen>(
    wallet ? 'home' : 'setup'
  );

  const handleWalletSetupComplete = () => {
    setCurrentScreen('home');
  };

  const handleNavigate = (screen: Screen) => {
    setCurrentScreen(screen);
  };

  const handleBack = () => {
    setCurrentScreen('home');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'setup':
        return <WalletSetupScreen onComplete={handleWalletSetupComplete} />;
      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;
      case 'receive':
        return <ReceiveScreen onBack={handleBack} />;
      case 'send':
        return <SendScreen onBack={handleBack} />;
      case 'transactions':
        return <TransactionsScreen onBack={handleBack} />;
      default:
        return <HomeScreen onNavigate={handleNavigate} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      {renderScreen()}
    </SafeAreaView>
  );
}

function App() {
  return (
    <WalletProvider>
      <AppContent />
    </WalletProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
});

export default App;
