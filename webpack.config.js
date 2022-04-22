const path = require('path');
const webpack = require('webpack');

module.exports = (env, { edition, distDir, browser, instanceUrl }) => {
  if (!(edition && browser && instanceUrl)) {
    throw new Error('edition, browser, and instanceUrl arguments are required');

    return { bail: true };
  }

  return {
    entry: {
      background: `./src/background/entryPoints/${browser}.js`,
      popup: `./src/popup/entryPoints/${browser}.js`,
      data_injector: './src/data_injector.js',
      options: './src/options.js'
    },
    output: {
      filename: '[name].js',
      path: path.resolve(__dirname, distDir)
    },
    plugins: [
      new webpack.DefinePlugin({
        __DEFAULT_INSTANCE__: JSON.stringify(instanceUrl)
      })
    ]
  };
};
