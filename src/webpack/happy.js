const HappyPack = require('happypack');
const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const getBabelConfig = require('./babel');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
  const cssLoaders = [
    {
      loader: 'css-loader',
      options: {
        modules: {
          localIdentName: config.cssScopeName,
        },
      },
    },
    // {
    //   loader: 'postcss-loader',
    //   options: {
    //     plugins: () => {
    //       const plugin = [autoprefixer()];
    //       if (config.pxtorem) {
    //         plugin.push(pxtorem(config.pxtorem));
    //       }
    //       return plugin;
    //     },
    //   },
    // },
    'sass-loader',
  ];
  if (config.isDev) {
    cssLoaders.unshift({ loader: 'style-loader' });
  }
  return {
    plugins: [
      new HappyPack({
        id: 'ts',
        threadPool: happyThreadPool,
        loaders: [{
          loader: 'babel-loader',
          options: getBabelConfig(),
        }],
      }),
      new HappyPack({
        id: 'image',
        threadPool: happyThreadPool,
        loaders: [{
          loader: 'url-loader',
          options: {
            emitFile: true,
            limit: 3 * 1024,
            name: 'images/[name]__[hash:5].[ext]',
            publicPath: config.publicPath,
          },
        }],
      }),
      new HappyPack({
        id: 'scss',
        threadPool: happyThreadPool,
        loaders: cssLoaders,
        debug: true,
      }),
    ],
  };
};