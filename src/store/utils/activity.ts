import { Result, ok } from '@synonymdev/result';

import { onChainTransactionToActivityItem } from '../../utils/activity';
import { formatBoostedActivityItems } from '../../utils/boost';
import { getCurrentWallet } from '../../utils/wallet';
import { dispatch } from '../helpers';
import { updateActivityItems } from '../slices/activity';

/**
 * Updates activity list with all wallet stores
 * @returns {Result<string>}
 */
export const updateActivityList = (): Result<string> => {
	updateOnChainActivityList();
	return ok('Activity items updated');
};

/**
 * Converts on-chain transactions to activity items and saves them to store
 * @returns {Result<string>}
 */
export const updateOnChainActivityList = async (): Promise<Result<string>> => {
	const { currentWallet } = getCurrentWallet();
	if (!currentWallet) {
		console.warn(
			'No wallet found. Cannot update activity list with transactions.',
		);
		return ok('');
	}
	const { selectedNetwork } = getCurrentWallet();
	const boostedTransactions =
		currentWallet.boostedTransactions[selectedNetwork];

	const transactions = currentWallet.transactions[selectedNetwork];
	const promises = Object.values(transactions).map(async (tx) => {
		return onChainTransactionToActivityItem({ transaction: tx });
	});
	const activityItems = await Promise.all(promises);

	const boostFormattedItems = await formatBoostedActivityItems({
		items: activityItems,
		boostedTransactions,
	});
	dispatch(updateActivityItems(boostFormattedItems));

	return ok('On chain transaction activity items updated');
};
