import { createShallowEqualSelector } from './utils';
import { onChainBalanceSelector } from './wallet';

export type TBalance = {
	/** Total onchain funds */
	onchainBalance: number;
	/** Total spendable funds (onchain only) */
	spendableBalance: number;
	/** Total funds (onchain only) */
	totalBalance: number;
};

export const balanceSelector = createShallowEqualSelector(
	[onChainBalanceSelector],
	(onchainBalance): TBalance => {
		return {
			onchainBalance,
			spendableBalance: onchainBalance,
			totalBalance: onchainBalance,
		};
	},
);
