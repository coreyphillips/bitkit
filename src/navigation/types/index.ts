import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type { RecoveryStackParamList } from '../../screens/Recovery/RecoveryNavigator';
import type { PinStackParamList } from '../../sheets/PINNavigation';
import type { SendStackParamList } from '../../sheets/SendNavigation';
import type { OnboardingStackParamList } from '../OnboardingNavigator';
import type { SettingsStackParamList } from '../SettingsNavigator';
import type { WalletStackParamList } from '../WalletNavigator';

// TODO: move all navigation related types here
// https://reactnavigation.org/docs/typescript#organizing-types

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type RootStackParamList = {
	Wallet: NavigatorScreenParams<WalletStackParamList> | undefined;
	Biometrics: undefined;
	AppUpdate: undefined;
	Scanner: { onScan: (data: string) => void } | undefined;
	Settings: NavigatorScreenParams<SettingsStackParamList>;
	BuyBitcoin: undefined;
};

// Root Stack Navigator
export type RootStackScreenProps<T extends keyof RootStackParamList> =
	NativeStackScreenProps<RootStackParamList, T>;

export type OnboardingStackScreenProps<
	T extends keyof OnboardingStackParamList,
> = NativeStackScreenProps<OnboardingStackParamList, T>;

export type RecoveryStackScreenProps<T extends keyof RecoveryStackParamList> =
	NativeStackScreenProps<RecoveryStackParamList, T>;

// Nested Stack Navigators
export type WalletScreenProps<T extends keyof WalletStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<WalletStackParamList, T>,
		RootStackScreenProps<keyof RootStackParamList>
	>;

export type SettingsScreenProps<T extends keyof SettingsStackParamList> =
	CompositeScreenProps<
		NativeStackScreenProps<SettingsStackParamList, T>,
		RootStackScreenProps<keyof RootStackParamList>
	>;

// BottomSheet Navigators
export type PinScreenProps<T extends keyof PinStackParamList> =
	NativeStackScreenProps<PinStackParamList, T>;

export type SendScreenProps<T extends keyof SendStackParamList> =
	NativeStackScreenProps<SendStackParamList, T>;

// Backup screens (stub for remaining Backup screens)
export type BackupScreenProps<T extends string> = NativeStackScreenProps<
	Record<T, undefined>
>;
