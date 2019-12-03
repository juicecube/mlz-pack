const HappyPack = require('happypack');

var happyThreadPool = HappyPack.ThreadPool({ size: 5 });
const getBabelConfig = require('./babel');

module.exports = () => {
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
        id: 'sass',
        threadPool: happyThreadPool,
        loaders: ['sass-loader'],
        debug: true,
      }),
    ],
  };
};