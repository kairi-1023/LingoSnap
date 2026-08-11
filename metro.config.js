const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

// Prioritize react-native/module conditions over import in exports resolution.
// This avoids .mjs ESM builds (e.g. zustand) that use import.meta.env.MODE
// which browsers cannot parse in non-module scripts.
config.resolver.unstable_conditionNames = [
  'react-native',
  'module',
  'browser',
  'require',
  'import',
  'default',
];

// SVG support via react-native-svg-transformer
config.transformer.babelTransformerPath = require.resolve('react-native-svg-transformer');
config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== 'svg');
config.resolver.sourceExts = [...config.resolver.sourceExts, 'svg'];

module.exports = withNativeWind(config, { input: './src/global.css' });
