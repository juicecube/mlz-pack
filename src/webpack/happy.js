const HappyPack = require('happypack');

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
  ];
  // if (config.isDev) {
  //   cssLoaders.unshift({ loader: 'style-loader' });
  // }
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
        id: 'css',
        threadPool: happyThreadPool,
        loaders: cssLoaders,
        debug: true,
      }),
      new HappyPack({
        id: 'sass',
        threadPool: happyThreadPool,
        loaders: ['sass-loader'],
        debug: true,
      }),
    ],
  };
};