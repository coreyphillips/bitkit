// Stub file - scanner functionality simplified for onchain-only wallet

import { err, ok, Result } from '@synonymdev/result';
import { EPaymentType } from 'beignet';

export type TScannerResponse = {
	type: 'bitcoinAddress' | 'bitcoinUri' | 'invalid';
	address?: string;
	amount?: number;
	message?: string;
};

export const handleScanResult = async (
	data: string,
): Promise<Result<TScannerResponse>> => {
	// Basic Bitcoin address/URI parsing
	const bitcoinMatch = data.match(/^(bitcoin:)?([a-zA-Z0-9]{26,35})/);

	if (bitcoinMatch) {
		return ok({
			type: 'bitcoinAddress' as const,
			address: bitcoinMatch[2],
		});
	}

	return err('Invalid QR code');
};

export const processUri = async (uri: string): Promise<Result<string>> => {
	return ok('URI processed');
};

export const parseUri = (uri: string): Result<{ address: string }> => {
	return ok({ address: uri });
};
