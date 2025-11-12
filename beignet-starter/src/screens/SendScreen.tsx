import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Card, Button } from '../components';

interface SendScreenProps {
  onBack: () => void;
}

export function SendScreen({ onBack }: SendScreenProps) {
  const { balance, sendTransaction } = useWallet();
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const balanceInBTC = balance / 100_000_000;

  const handleSend = async () => {
    if (!address.trim()) {
      Alert.alert('Error', 'Please enter a valid address');
      return;
    }

    const amountSats = Math.floor(parseFloat(amount) * 100_000_000);

    if (isNaN(amountSats) || amountSats <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (amountSats > balance) {
      Alert.alert('Error', 'Insufficient balance');
      return;
    }

    Alert.alert(
      'Confirm Transaction',
      `Send ${amount} BTC (${amountSats.toLocaleString()} sats) to ${address.substring(0, 20)}...?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          style: 'destructive',
          onPress: async () => {
            setLoading(true);
            try {
              const txid = await sendTransaction(address.trim(), amountSats);
              Alert.alert(
                'Success',
                `Transaction sent!\n\nTXID: ${txid}`,
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      setAddress('');
                      setAmount('');
                      onBack();
                    },
                  },
                ]
              );
            } catch (error: any) {
              Alert.alert(
                'Error',
                error.message || 'Failed to send transaction'
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleMaxAmount = () => {
    // Leave some for fees (rough estimate)
    const maxAmount = Math.max(0, balance - 1000) / 100_000_000;
    setAmount(maxAmount.toFixed(8));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Send Bitcoin</Text>
        </View>

        <Card>
          <Text style={styles.label}>Available Balance</Text>
          <Text style={styles.balance}>
            {balanceInBTC.toFixed(8)} BTC
          </Text>
          <Text style={styles.satsBalance}>
            {balance.toLocaleString()} sats
          </Text>
        </Card>

        <Card>
          <Text style={styles.label}>Recipient Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Bitcoin address"
            value={address}
            onChangeText={setAddress}
            autoCapitalize="none"
            autoCorrect={false}
            multiline
            numberOfLines={2}
          />
        </Card>

        <Card>
          <View style={styles.amountHeader}>
            <Text style={styles.label}>Amount (BTC)</Text>
            <TouchableOpacity onPress={handleMaxAmount}>
              <Text style={styles.maxButton}>MAX</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="0.00000000"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
          />
          {amount ? (
            <Text style={styles.satsAmount}>
              ≈ {Math.floor(parseFloat(amount) * 100_000_000).toLocaleString()} sats
            </Text>
          ) : null}
        </Card>

        <View style={styles.feeInfo}>
          <Text style={styles.feeText}>
            Network fee: ~1 sat/vB (adjust in code as needed)
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Send Transaction"
            onPress={handleSend}
            loading={loading}
            disabled={loading || !address || !amount}
          />
        </View>

        <View style={styles.warningBox}>
          <Text style={styles.warningText}>
            ⚠️ Double-check the address before sending. Bitcoin transactions
            cannot be reversed.
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
    marginBottom: 8,
    fontWeight: '600',
  },
  balance: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  satsBalance: {
    fontSize: 14,
    color: '#666',
  },
  input: {
    fontSize: 16,
    color: '#000',
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
  amountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  maxButton: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  satsAmount: {
    fontSize: 12,
    color: '#666',
    marginTop: 8,
  },
  feeInfo: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  feeText: {
    fontSize: 14,
    color: '#1565C0',
  },
  buttonContainer: {
    marginBottom: 16,
  },
  warningBox: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  warningText: {
    color: '#C62828',
    fontSize: 14,
    lineHeight: 20,
  },
});
