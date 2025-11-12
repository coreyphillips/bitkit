import AsyncStorage from '@react-native-async-storage/async-storage';
import type { TStorage } from 'beignet';
import type { IStorageData } from '../types/wallet';

const STORAGE_KEY = 'beignet_wallet_data';

/**
 * Storage implementation for Beignet wallet
 * Implements the TStorage interface required by Beignet
 */
export class WalletStorage implements TStorage {
  private cache: IStorageData = {};
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        this.cache = JSON.parse(data);
      }
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize storage:', error);
      this.cache = {};
      this.initialized = true;
    }
  }

  async getData(key: string): Promise<any> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.cache[key];
  }

  async setData(key: string, value: any): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }

    this.cache[key] = value;

    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error('Failed to save to storage:', error);
    }
  }

  async clear(): Promise<void> {
    this.cache = {};
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  async getAllData(): Promise<IStorageData> {
    if (!this.initialized) {
      await this.initialize();
    }
    return this.cache;
  }
}

export const walletStorage = new WalletStorage();
