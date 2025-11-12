import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Card, Button } from '../components';

interface ReceiveScreenProps {
  onBack: () => void;
}

export function ReceiveScreen({ onBack }: ReceiveScreenProps) {
  const { address, getNewAddress } = useWallet();

  const handleCopyAddress = () => {
    // Note: For a production app, you'd use @react-native-clipboard/clipboard
    Alert.alert('Address', address, [
      { text: 'OK', style: 'default' }
    ]);
  };

  const handleNewAddress = () => {
    try {
      const newAddr = getNewAddress();
      Alert.alert(
        'New Address Generated',
        `New address: ${newAddr}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate new address');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Receive Bitcoin</Text>
        </View>

        <Card>
          <Text style={styles.label}>Your Address</Text>
          <View style={styles.addressContainer}>
            <Text style={styles.address}>{address}</Text>
          </View>
        </Card>

        <View style={styles.qrPlaceholder}>
          <Text style={styles.qrText}>📱</Text>
          <Text style={styles.qrLabel}>QR Code Placeholder</Text>
          <Text style={styles.qrHint}>
            Add react-native-qrcode-svg for QR code generation
          </Text>
        </View>

        <View style={styles.instructions}>
          <Text style={styles.instructionsTitle}>How to receive:</Text>
          <Text style={styles.instructionsText}>
            1. Share your address with the sender{'\n'}
            2. Wait for the transaction to be confirmed{'\n'}
            3. The balance will update automatically
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Copy Address"
            onPress={handleCopyAddress}
          />
          <View style={styles.spacing} />
          <Button
            title="Generate New Address"
            onPress={handleNewAddress}
            variant="secondary"
          />
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ This wallet is on testnet. Only send testnet Bitcoin to this address.
          </Text>
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
  header: {
    marginBottom: 24,
  },
  backButton: {
    marginBottom: 16,
  },
  backText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontWeight: '600',
  },
  addressContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  address: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
    lineHeight: 20,
  },
  qrPlaceholder: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 40,
    marginVertical: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
    borderStyle: 'dashed',
  },
  qrText: {
    fontSize: 64,
    marginBottom: 16,
  },
  qrLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  qrHint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
  instructions: {
    backgroundColor: '#E3F2FD',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: '#1565C0',
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  spacing: {
    height: 12,
  },
  warningBox: {
    backgroundColor: '#FFF3CD',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFC107',
  },
  warningText: {
    color: '#856404',
    fontSize: 14,
    lineHeight: 20,
  },
});
