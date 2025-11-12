import { EPaymentType } from 'beignet';

export enum EActivityType {
	onchain = 'onchain',
}

export type IActivityItem = TOnchainActivityItem;

export type TOnchainActivityItem = {
	id: string;
	activityType: EActivityType.onchain;
	txType: EPaymentType;
	txId: string;
	value: number;
	fee: number;
	feeRate: number;
	address: string;
	confirmed: boolean;
	timestamp: number;
	isBoosted: boolean;
	exists: boolean; // Used to determine if the transaction exists on the blockchain or if it was reorg'd/bumped from the mempool.
	confirmTimestamp?: number;
	transferTxId?: string;
	isTransfer?: boolean;
};
