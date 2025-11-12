import { UnknownAction, combineReducers } from 'redux';

import { storage } from '../../storage';
import actions from '../actions/actions';
import activity from '../slices/activity';
import fees from '../slices/fees';
import settings from '../slices/settings';
import ui from '../slices/ui';
import user from '../slices/user';
import wallet from '../slices/wallet';

const appReducer = combineReducers({
	activity,
	fees,
	settings,
	ui,
	user,
	wallet,
});

const rootReducer = (
	state: ReturnType<typeof appReducer> | undefined,
	action: UnknownAction,
): ReturnType<typeof appReducer> => {
	if (action.type === actions.WIPE_APP) {
		console.log('Wiping app data...');
		// Clear MMKV persisted storage
		storage.clearAll();
		// Reset all stores
		return appReducer(undefined, action);
	}

	return appReducer(state, action);
};

export type RootReducer = ReturnType<typeof rootReducer>;

export default rootReducer;
