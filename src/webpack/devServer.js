const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');

const config = require('./config');

module.exports = (devConfig, option, cb) => {
  const devServerConfig = config.get().devServer;
  const compiler = webpack(devConfig);
  compiler.hooks.done.tap('done', () => {
    cb && cb(devServer);
  });

  const serverConfig = {
    hot: true,
    historyApiFallback: true,
    open: true,
    allowedHosts: ['*'],
    ...devServerConfig,
  };
  const devServer = new webpackDevServer(compiler, serverConfig);

  devServer.start();
};
