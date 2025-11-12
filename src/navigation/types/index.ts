import type {
	CompositeScreenProps,
	NavigatorScreenParams,
} from '@react-navigation/native';
import {
	NativeStackNavigationProp,
	NativeStackScreenProps,
} from '@react-navigation/native-stack';

import type { RecoveryStackParamList } from '../../screens/Recovery/RecoveryNavigator';
import type { BackupStackParamList } from '../../sheets/BackupNavigation';
import type { GiftStackParamList } from '../../sheets/GiftNavigation';
import type { PinStackParamList } from '../../sheets/PINNavigation';
import type { ReceiveStackParamList } from '../../sheets/ReceiveNavigation';
import type { SendStackParamList } from '../../sheets/SendNavigation';
import type { IActivityItem } from '../../store/types/activity';
import type { OnboardingStackParamList } from '../OnboardingNavigator';
import type { SettingsStackParamList } from '../SettingsNavigator';
import type { WalletStackParamList } from '../WalletNavigator';

// TODO: move all navigation related types here
// https://reactnavigation.org/docs/typescript#organizing-types

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type RootStackParamList = {
	Wallet: NavigatorScreenParams<WalletStackParamList> | undefined;
	Biometrics: undefined;
	ActivityDetail: { id: IActivityItem['id']; extended?: boolean };
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
export type BackupScreenProps<T extends keyof BackupStackParamList> =
	NativeStackScreenProps<BackupStackParamList, T>;

export type PinScreenProps<T extends keyof PinStackParamList> =
	NativeStackScreenProps<PinStackParamList, T>;

export type ReceiveScreenProps<T extends keyof ReceiveStackParamList> =
	NativeStackScreenProps<ReceiveStackParamList, T>;

export type SendScreenProps<T extends keyof SendStackParamList> =
	NativeStackScreenProps<SendStackParamList, T>;

export type GiftScreenProps<T extends keyof GiftStackParamList> =
	NativeStackScreenProps<GiftStackParamList, T>;
