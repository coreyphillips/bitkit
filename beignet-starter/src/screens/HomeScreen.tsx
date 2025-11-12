import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Card, Button } from '../components';

interface HomeScreenProps {
  onNavigate: (screen: 'send' | 'receive' | 'transactions') => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const { balance, address, refreshWallet } = useWallet();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await refreshWallet();
    } catch (error) {
      console.error('Failed to refresh:', error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    // Initial refresh when screen loads
    handleRefresh();
  }, []);

  // Convert satoshis to BTC
  const balanceInBTC = balance / 100_000_000;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }>
      <View style={styles.content}>
        <Text style={styles.title}>Beignet Wallet</Text>

        <Card>
          <Text style={styles.label}>Balance</Text>
          <Text style={styles.balance}>
            {balanceInBTC.toFixed(8)} BTC
          </Text>
          <Text style={styles.satsBalance}>
            {balance.toLocaleString()} sats
          </Text>
        </Card>

        <Card>
          <Text style={styles.label}>Current Address</Text>
          <TouchableOpacity onPress={() => onNavigate('receive')}>
            <Text style={styles.address} numberOfLines={1}>
              {address || 'Loading...'}
            </Text>
            <Text style={styles.tapHint}>Tap to see QR code</Text>
          </TouchableOpacity>
        </Card>

        <View style={styles.actionsContainer}>
          <View style={styles.actionRow}>
            <View style={styles.actionButton}>
              <Button
                title="Receive"
                onPress={() => onNavigate('receive')}
                variant="secondary"
              />
            </View>
            <View style={styles.actionSpacing} />
            <View style={styles.actionButton}>
              <Button
                title="Send"
                onPress={() => onNavigate('send')}
              />
            </View>
          </View>

          <View style={styles.spacing} />

          <Button
            title="View Transactions"
            onPress={() => onNavigate('transactions')}
            variant="secondary"
          />
        </View>

        <View style={styles.networkBadge}>
          <Text style={styles.networkText}>🔴 Testnet</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontWeight: '600',
  },
  balance: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 4,
  },
  satsBalance: {
    fontSize: 16,
    color: '#666',
  },
  address: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'monospace',
  },
  tapHint: {
    fontSize: 12,
    color: '#007AFF',
    marginTop: 8,
  },
  actionsContainer: {
    marginTop: 24,
  },
  actionRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
  },
  actionSpacing: {
    width: 12,
  },
  spacing: {
    height: 12,
  },
  networkBadge: {
    marginTop: 32,
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#FFF3CD',
    borderRadius: 8,
  },
  networkText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#856404',
  },
});
