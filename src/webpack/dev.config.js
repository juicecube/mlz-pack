const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');


const commonCfg = require('./common.config');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const baseConfig = commonCfg();
  const devConfig = merge({
    mode: 'development',
    output: {
      filename: 'js/[name].js',
      chunkFilename: 'js/[name].js',
      pathinfo: false,
    },
    devtool: 'cheap-module-eval-source-map',
    module: {
      rules: [
        {
          test: /\.css$/,
          include: /node_modules/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  return [
                    autoprefixer(),
                  ];
                },
              },
            },
            'sass-loader',
          ],
        },
        {
          test: /\.s?css$/,
          exclude: /node_modules/,
          use: [
            'cache-loader',
            { loader: 'style-loader' },
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: config.cssScopeName,
                },
              },
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => {
                  const plugin = [autoprefixer()];
                  if (config.pxtorem) {
                    plugin.push(pxtorem(config.pxtorem));
                  }
                  return plugin;
                },
              },
            },
            'sass-loader',
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        // inject: true,
        loading: config.loading,
        ...config.htmlPlugin,
      }),
    ],
  }, baseConfig);
  return devConfig;
};