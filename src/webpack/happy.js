const HappyPack = require('happypack');

var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const getBabelConfig = require('./babel');
const configs = require('./config');

module.exports = () => {
  const config = configs.get();
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
        id: 'css',
        threadPool: happyThreadPool,
        loaders: [{
          loader: 'css-loader',
          options: {
            modules: {
              localIdentName: config.cssScopeName,
              context: process.cwd(),
            },
            importLoaders: 3,
            sourceMap: false,
          },
        }],
      }),
    ],
  };
};