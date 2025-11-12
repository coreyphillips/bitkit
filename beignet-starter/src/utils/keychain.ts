import Keychain from 'react-native-keychain';

/**
 * Securely store a value in the device keychain/keystore
 * @param key - The key to store the value under
 * @param value - The value to store
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const setKeychainValue = async ({
  key,
  value,
}: {
  key: string;
  value: string;
}): Promise<boolean> => {
  try {
    await Keychain.setGenericPassword(key, value, { service: key });
    return true;
  } catch (error) {
    console.error('Error storing credentials:', error);
    return false;
  }
};

/**
 * Retrieve a value from the device keychain/keystore
 * @param key - The key to retrieve
 * @returns Promise<string | null> - The stored value or null if not found
 */
export const getKeychainValue = async (
  key: string,
): Promise<string | null> => {
  try {
    const result = await Keychain.getGenericPassword({ service: key });
    if (!result || !result.password) {
      return null;
    }
    return result.password;
  } catch (error) {
    console.error('Error retrieving credentials:', error);
    return null;
  }
};

/**
 * Remove a value from the device keychain/keystore
 * @param key - The key to remove
 * @returns Promise<boolean> - true if successful, false otherwise
 */
export const resetKeychainValue = async (
  key: string,
): Promise<boolean> => {
  try {
    const result = await Keychain.resetGenericPassword({ service: key });
    return result;
  } catch (error) {
    console.error('Error resetting credentials:', error);
    return false;
  }
};

/**
 * Wipes all known device keychain data
 * WARNING: This will delete all stored credentials
 * @returns Promise<void>
 */
export const wipeKeychain = async (): Promise<void> => {
  try {
    const services = await Keychain.getAllGenericPasswordServices();
    await Promise.all(services.map((key) => resetKeychainValue(key)));
  } catch (error) {
    console.error('Error wiping keychain:', error);
  }
};

/**
 * Store the wallet mnemonic securely in the keychain
 * @param mnemonic - The 12-word mnemonic phrase
 * @returns Promise<boolean>
 */
export const storeMnemonic = async (mnemonic: string): Promise<boolean> => {
  return setKeychainValue({ key: 'wallet_mnemonic', value: mnemonic });
};

/**
 * Retrieve the wallet mnemonic from the keychain
 * @returns Promise<string | null>
 */
export const getMnemonic = async (): Promise<string | null> => {
  return getKeychainValue('wallet_mnemonic');
};

/**
 * Remove the wallet mnemonic from the keychain
 * @returns Promise<boolean>
 */
export const removeMnemonic = async (): Promise<boolean> => {
  return resetKeychainValue('wallet_mnemonic');
};
