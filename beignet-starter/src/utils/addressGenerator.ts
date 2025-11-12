import * as addressGenerator from 'react-native-address-generator';

export type Network = 'bitcoin' | 'testnet' | 'regtest';

interface GetAddressParams {
  path: string;
  network?: Network;
}

interface GetAddressResponse {
  address: string;
  publicKey: string;
  scriptHash: string;
}

/**
 * Address Generator wrapper using react-native-address-generator
 * Provides native address generation for better performance and security
 */
export class AddressGenerator {
  private mnemonic: string;
  private network: Network;

  constructor({
    mnemonic,
    network = 'testnet',
  }: {
    mnemonic: string;
    network?: Network;
  }) {
    if (!mnemonic) {
      throw new Error('No mnemonic specified in AddressGenerator');
    }
    this.mnemonic = mnemonic;
    this.network = network;
  }

  /**
   * Generate an address for a given derivation path
   * @param path - BIP32 derivation path (e.g., "m/84'/0'/0'/0/0")
   * @param network - Bitcoin network
   * @returns Promise with address details
   */
  async getAddress({
    path,
    network = this.network,
  }: GetAddressParams): Promise<GetAddressResponse> {
    if (!path) {
      throw new Error('No path specified');
    }

    const result = await addressGenerator.getAddress({
      mnemonic: this.mnemonic,
      path,
      network,
      passphrase: '', // Add support for BIP39 passphrase if needed
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return {
      address: result.value.address,
      publicKey: result.value.publicKey,
      scriptHash: result.value.scriptHash,
    };
  }

  /**
   * Get private key for a given derivation path
   * @param path - BIP32 derivation path
   * @param network - Bitcoin network
   * @returns Promise with private key
   */
  async getPrivateKey({
    path,
    network = this.network,
  }: GetAddressParams): Promise<string> {
    if (!path) {
      throw new Error('No path specified');
    }

    const result = await addressGenerator.getPrivateKey({
      mnemonic: this.mnemonic,
      path,
      network,
      passphrase: '',
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  }

  /**
   * Get script hash for a given derivation path
   * @param path - BIP32 derivation path
   * @param network - Bitcoin network
   * @returns Promise with script hash
   */
  async getScriptHash({
    path,
    network = this.network,
  }: GetAddressParams): Promise<string> {
    if (!path) {
      throw new Error('No path specified');
    }

    const result = await addressGenerator.getScriptHash({
      mnemonic: this.mnemonic,
      path,
      network,
      passphrase: '',
    });

    if (result.isErr()) {
      throw new Error(result.error.message);
    }

    return result.value;
  }
}
