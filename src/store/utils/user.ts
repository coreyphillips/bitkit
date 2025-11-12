// Stub file - user utilities simplified for onchain-only wallet

import { Result, ok } from '@synonymdev/result';

export const setupOnDeviceStorage = async (): Promise<Result<string>> => {
	return ok('Device storage setup complete');
};
