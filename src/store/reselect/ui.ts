import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '..';
import { THealthState, TProfileLink, TSendTransaction } from '../types/ui';

export const profileLinkSelector = (state: RootState): TProfileLink => {
	return state.ui.profileLink;
};

export const isAuthenticatedSelector = (state: RootState): boolean => {
	return state.ui.isAuthenticated;
};

export const isOnlineSelector = (state: RootState): boolean => {
	return state.ui.isOnline;
};

export const isLDKReadySelector = (state: RootState): boolean => {
	return state.ui.isLDKReady;
};

export const isConnectedToElectrumSelector = (state: RootState): boolean => {
	return state.ui.isConnectedToElectrum;
};

export const isElectrumThrottledSelector = (state: RootState): boolean => {
	return state.ui.isElectrumThrottled;
};

export const appStateSelector = (state: RootState) => {
	return state.ui.appState;
};

export const availableUpdateSelector = (state: RootState) => {
	return state.ui.availableUpdate;
};

export const criticalUpdateSelector = (state: RootState): boolean => {
	return state.ui.availableUpdate?.critical ?? false;
};

export const timeZoneSelector = (state: RootState): string => {
	return state.ui.timeZone;
};

export const languageSelector = (state: RootState): string => {
	return state.ui.language;
};

export const sendTransactionSelector = (state: RootState): TSendTransaction => {
	return state.ui.sendTransaction;
};

export const internetStatusSelector = (state: RootState): THealthState => {
	return state.ui.isOnline ? 'ready' : 'error';
};

export const electrumStatusSelector = (state: RootState): THealthState => {
	const { isOnline, isConnectedToElectrum, isElectrumThrottled } = state.ui;
	if (isOnline && !isConnectedToElectrum && !isElectrumThrottled) {
		return 'pending';
	}
	return isConnectedToElectrum ? 'ready' : 'error';
};

export const nodeStatusSelector = (state: RootState): THealthState => {
	// Lightning not supported in onchain-only wallet
	return 'error';
};

export const channelsStatusSelector = (state: RootState): THealthState => {
	// Lightning not supported in onchain-only wallet
	return 'error';
};

export const backupStatusSelector = (): THealthState => {
	// Backup not supported in onchain-only wallet
	return 'error';
};

/**
 * Returns a combined status of all app components.
 * Returns 'ready' if all components are ready,
 * 'pending' if any component is pending and none are in error,
 * 'error' if any component is in error state.
 * // NOTE: We ignore channels for the global app status
 */
export const appStatusSelector = createSelector(
	[
		internetStatusSelector,
		electrumStatusSelector,
		nodeStatusSelector,
		backupStatusSelector,
	],
	(internetState, electrumState, nodeState, backupState): THealthState => {
		const states = [internetState, electrumState, nodeState, backupState];

		if (states.some((state) => state === 'error')) {
			return 'error';
		}
		if (states.some((state) => state === 'pending')) {
			return 'pending';
		}
		return 'ready';
	},
);
