// Stub file - storage functionality removed for onchain-only wallet

import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV();

export const walletCache = {
	get: () => undefined,
	set: () => {},
	delete: () => {},
};

export const walletStateCache = {
	get: () => undefined,
	set: () => {},
	delete: () => {},
};

export const widgetsCache = {
	get: () => undefined,
	set: () => {},
	delete: () => {},
};

export const reduxStorage = {
	setItem: (key: string, value: string) => storage.set(key, value),
	getItem: (key: string) => storage.getString(key) ?? null,
	removeItem: (key: string) => storage.delete(key),
};

export const receivedTxIds = {
	get: () => [],
	set: () => {},
	add: () => {},
};
