const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

const config = require('./config');

const HOST = process.env.HOST || '0.0.0.0';
module.exports = (devConfig, option, cb) => {
  const devServerConfig = config.get().devServer;
  const compiler = webpack(devConfig);
  compiler.plugin('done', () => {
    cb && cb(devServer);
  });

  const serverConfig = {
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: 'errors-only',
    open: true,
    ...devServerConfig,
  };
  const devServer = new webpackDevServer(compiler, serverConfig);

  devServer.listen(devServerConfig.port, HOST, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.cyan(`\nStarting the development server at http://${HOST}:${devServerConfig.port}\n`));
  });
};
