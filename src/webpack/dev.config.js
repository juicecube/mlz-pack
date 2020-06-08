const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');


const commonCfg = require('./common.config');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const baseConfig = commonCfg();
  const devConfig = merge(baseConfig, {
    mode: 'development',
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
      pathinfo: false,
    },
    devtool: 'cheap-module-eval-source-map',
    plugins: [
      new HtmlWebpackPlugin({
        // inject: true,
        cache: false,
        loading: config.loading,
        ...config.htmlPlugin,
      }),
    ],
  });
  return devConfig;
};