// Stub file - settings utilities simplified for onchain-only wallet

import { Result, ok } from '@synonymdev/result';

export const resetAllSettings = async (): Promise<Result<string>> => {
	return ok('Settings reset not supported in onchain-only wallet');
};

export const resetPinAndPassword = async (): Promise<Result<string>> => {
	return ok('Reset complete');
};
