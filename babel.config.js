module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@config': './src/config',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@types': './src/types',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
