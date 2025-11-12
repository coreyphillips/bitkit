const path = require('path');
const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  resolver: {
    extraNodeModules: {
      // Alias crypto to react-native-quick-crypto for secure native crypto operations
      crypto: path.resolve(__dirname, './node_modules/react-native-quick-crypto'),
      // Alias buffer to react-native-buffer for proper Buffer support
      buffer: path.resolve(__dirname, './node_modules/@craftzdog/react-native-buffer'),
    },
  },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
