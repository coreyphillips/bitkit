import cloneDeep from 'lodash/cloneDeep';
import assert from 'node:assert';

import '../src/utils/i18n';
import store, { RootState } from '../src/store';
import { dispatch } from '../src/store/helpers';
import { updateWallet } from '../src/store/slices/wallet';
import { TBalance, balanceSelector } from '../src/store/reselect/aggregations';
import { EAvailableNetwork } from '../src/utils/networks';
import { createNewWallet } from '../src/utils/startup';

describe('Reselect', () => {
	let s: RootState;

	beforeAll(async () => {
		let res = await createNewWallet();
		if (res.isErr()) {
			throw res.error;
		}
		dispatch(
			updateWallet({ selectedNetwork: EAvailableNetwork.bitcoinRegtest }),
		);
		s = store.getState();
	});

	describe('balanceSelector', () => {
		it('should return zeros by default', () => {
			const state = cloneDeep(s);

			const balance: TBalance = {
				onchainBalance: 0,
				spendableBalance: 0,
				totalBalance: 0,
			};

			assert.deepEqual(balanceSelector(state), balance);
		});

		it('should return onchain balance for current wallet', () => {
			const state = cloneDeep(s);
			state.wallet.wallets.wallet0.balance.bitcoinRegtest = 1;

			const balance: TBalance = {
				onchainBalance: 1,
				spendableBalance: 1,
				totalBalance: 1,
			};

			assert.deepEqual(balanceSelector(state), balance);
		});
	});
});
