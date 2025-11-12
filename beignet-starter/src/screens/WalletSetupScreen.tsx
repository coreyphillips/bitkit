import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Button, Card } from '../components';
import { generateMnemonic } from 'beignet';

interface WalletSetupScreenProps {
  onComplete: () => void;
}

export function WalletSetupScreen({ onComplete }: WalletSetupScreenProps) {
  const { createWallet } = useWallet();
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<'select' | 'create' | 'restore'>('select');
  const [mnemonic, setMnemonic] = useState('');
  const [generatedMnemonic, setGeneratedMnemonic] = useState('');

  const handleCreateNew = () => {
    const newMnemonic = generateMnemonic();
    setGeneratedMnemonic(newMnemonic);
    setMode('create');
  };

  const handleConfirmCreate = async () => {
    setLoading(true);
    try {
      await createWallet(generatedMnemonic);
      Alert.alert(
        'Wallet Created',
        'Your wallet has been created successfully. Make sure you have backed up your recovery phrase!',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to create wallet. Please try again.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!mnemonic.trim()) {
      Alert.alert('Error', 'Please enter a valid recovery phrase');
      return;
    }

    setLoading(true);
    try {
      await createWallet(mnemonic.trim());
      Alert.alert(
        'Wallet Restored',
        'Your wallet has been restored successfully.',
        [{ text: 'OK', onPress: onComplete }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to restore wallet. Please check your recovery phrase.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'select') {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Welcome to Beignet Starter</Text>
          <Text style={styles.subtitle}>
            A simple on-chain Bitcoin wallet powered by Beignet
          </Text>

          <View style={styles.buttonContainer}>
            <Button
              title="Create New Wallet"
              onPress={handleCreateNew}
            />
            <View style={styles.spacing} />
            <Button
              title="Restore Wallet"
              onPress={() => setMode('restore')}
              variant="secondary"
            />
          </View>
        </View>
      </View>
    );
  }

  if (mode === 'create') {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Your Recovery Phrase</Text>
          <Text style={styles.subtitle}>
            Write down these 12 words in order and keep them safe. You'll need
            them to restore your wallet.
          </Text>

          <Card>
            <Text style={styles.mnemonic}>{generatedMnemonic}</Text>
          </Card>

          <View style={styles.warningBox}>
            <Text style={styles.warningText}>
              ⚠️ Never share your recovery phrase with anyone. Anyone with
              access to this phrase can steal your funds.
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="I've Backed Up My Phrase"
              onPress={handleConfirmCreate}
              loading={loading}
              disabled={loading}
            />
            <View style={styles.spacing} />
            <Button
              title="Back"
              onPress={() => setMode('select')}
              variant="secondary"
              disabled={loading}
            />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Restore Wallet</Text>
        <Text style={styles.subtitle}>
          Enter your 12-word recovery phrase to restore your wallet
        </Text>

        <Card>
          <TextInput
            style={styles.input}
            placeholder="Enter your 12-word recovery phrase"
            value={mnemonic}
            onChangeText={setMnemonic}
            multiline
            numberOfLines={3}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Card>

        <View style={styles.buttonContainer}>
          <Button
            title="Restore Wallet"
            onPress={handleRestore}
            loading={loading}
            disabled={loading || !mnemonic.trim()}
          />
          <View style={styles.spacing} />
          <Button
            title="Back"
            onPress={() => setMode('select')}
            variant="secondary"
            disabled={loading}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  content: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
    lineHeight: 22,
  },
  buttonContainer: {
    marginTop: 24,
  },
  spacing: {
    height: 12,
  },
  mnemonic: {
    fontSize: 16,
    lineHeight: 28,
    color: '#000',
    fontFamily: 'monospace',
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
  input: {
    fontSize: 16,
    color: '#000',
    minHeight: 80,
    textAlignVertical: 'top',
  },
});
