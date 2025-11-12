import { AppStateStatus } from 'react-native';
import { SendStackParamList } from '../../sheets/SendNavigation';
import { EActivityType, TOnchainActivityItem } from './activity';

// Used to ensure all sheet refs are registered
export const sheetIds: SheetId[] = [
	'appUpdate',
	'backupPrompt',
	'datePicker',
	'forgotPin',
	'highBalance',
	'pinNavigation',
	'receivedTx',
	'sendNavigation',
];

export type SheetsParamList = {
	appUpdate: undefined;
	backupPrompt: undefined;
	datePicker: undefined;
	forgotPin: undefined;
	highBalance: undefined;
	pinNavigation: { showLaterButton: boolean };
	receivedTx: { id: string; activityType: EActivityType; value: number };
	sendNavigation: { screen: keyof SendStackParamList } | undefined;
};

export type SheetId = keyof SheetsParamList;

export type TProfileLink = {
	title: string;
	url: string;
};

export type TAvailableUpdate = {
	version: string;
	buildNumber: number;
	notes: string;
	pub_date: string;
	url: string;
	critical: boolean;
};

export type TSendTransaction = {
	paymentMethod: 'onchain' | 'lightning';
	uri: string;
	fromAddressViewer?: boolean;
};

export type THealthState = 'ready' | 'pending' | 'error';

export type TUiState = {
	appState: AppStateStatus;
	availableUpdate: TAvailableUpdate | null;
	isAuthenticated: boolean;
	isConnectedToElectrum: boolean;
	isElectrumThrottled: boolean;
	isOnline: boolean;
	isLDKReady: boolean;
	language: string;
	profileLink: TProfileLink;
	timeZone: string;
	sendTransaction: TSendTransaction;
};
