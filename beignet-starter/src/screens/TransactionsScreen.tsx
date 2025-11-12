import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useWallet } from '../context/WalletContext';
import { Card } from '../components';
import type { ITransaction } from '../types/wallet';

interface TransactionsScreenProps {
  onBack: () => void;
}

export function TransactionsScreen({ onBack }: TransactionsScreenProps) {
  const { transactions } = useWallet();

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatAmount = (value: number): string => {
    const btc = value / 100_000_000;
    return btc.toFixed(8);
  };

  const renderTransaction = (tx: ITransaction) => {
    const isSent = tx.type === 'sent';
    const amountColor = isSent ? '#EF5350' : '#4CAF50';
    const amountPrefix = isSent ? '-' : '+';

    return (
      <Card key={tx.txid}>
        <View style={styles.txHeader}>
          <Text style={styles.txType}>
            {isSent ? '📤 Sent' : '📥 Received'}
          </Text>
          <Text style={[styles.txAmount, { color: amountColor }]}>
            {amountPrefix}{formatAmount(tx.value)} BTC
          </Text>
        </View>

        <View style={styles.txDetails}>
          <Text style={styles.txLabel}>Transaction ID:</Text>
          <Text style={styles.txId} numberOfLines={1}>
            {tx.txid}
          </Text>
        </View>

        <View style={styles.txDetails}>
          <Text style={styles.txLabel}>Date:</Text>
          <Text style={styles.txValue}>{formatDate(tx.timestamp)}</Text>
        </View>

        <View style={styles.txDetails}>
          <Text style={styles.txLabel}>Confirmations:</Text>
          <Text style={styles.txValue}>
            {tx.confirmations > 0 ? tx.confirmations : 'Unconfirmed'}
          </Text>
        </View>

        {tx.confirmations === 0 && (
          <View style={styles.pendingBadge}>
            <Text style={styles.pendingText}>⏳ Pending</Text>
          </View>
        )}
      </Card>
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Transactions</Text>
        </View>

        {transactions.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📭</Text>
            <Text style={styles.emptyTitle}>No Transactions Yet</Text>
            <Text style={styles.emptyText}>
              Your transaction history will appear here once you send or receive Bitcoin.
            </Text>
          </View>
        ) : (
          <>
            <Text style={styles.count}>
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
            </Text>
            {transactions.map(renderTransaction)}
          </>
        )}
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
  count: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  txHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  txType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  txAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  txDetails: {
    marginTop: 8,
  },
  txLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  txValue: {
    fontSize: 14,
    color: '#000',
  },
  txId: {
    fontSize: 12,
    color: '#000',
    fontFamily: 'monospace',
  },
  pendingBadge: {
    marginTop: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#FFF3CD',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  pendingText: {
    fontSize: 12,
    color: '#856404',
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 40,
  },
});
