const { install } = require('react-native-quick-crypto');

// Patch global.crypto with quickcrypto and global.Buffer with react-native-buffer
install();
