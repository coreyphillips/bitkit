import cloneDeep from 'lodash/cloneDeep';

import store, { RootState } from '../store';
import { TActivity } from './slices/activity';
import { TFeesState } from './slices/fees';
import { TSettings } from './slices/settings';
import { TUser } from './slices/user';
import { TUiState } from './types/ui';
import { IWalletStore } from './types/wallet';

/*
Used to retrieve the store outside of a component.
 */
export const getStore = (): RootState => {
	return cloneDeep(store.getState());
};

export const getWalletStore = (): IWalletStore => {
	return cloneDeep(store.getState().wallet);
};

export const getSettingsStore = (): TSettings => {
	return cloneDeep(store.getState().settings);
};

export const getActivityStore = (): TActivity => {
	return cloneDeep(store.getState().activity);
};

export const getFeesStore = (): TFeesState => {
	return cloneDeep(store.getState().fees);
};

export const getUiStore = (): TUiState => {
	return cloneDeep(store.getState().ui);
};

export const getUserStore = (): TUser => {
	return cloneDeep(store.getState().user);
};

/*
Used to dispatch outside of a component.
 */
export const { dispatch } = store;
