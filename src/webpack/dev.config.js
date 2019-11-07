const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
// const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');

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
        ...config.htmlPlugin,
      }),
      // TODO 的环境dll加速build
      // new webpack.DllReferencePlugin({
      //   context: path.join(__dirname, 'dll'),
      //   manifest: require('./dll/vender-manifest.json'),
      // }),
      // new CopyWebpackPlugin([{
      //   from: path.resolve(__dirname, 'dll'),
      //   to: 'dll',
      // }]),
      // new HtmlWebpackTagsPlugin({
      //   tags: ['dll/vender.dll.js'],
      //   append: false,
      // }),
    ],
  }, baseConfig);
  return devConfig;
};