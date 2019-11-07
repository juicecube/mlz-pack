const webpack = require('webpack');
const webpackDevServer = require('webpack-dev-server');
const chalk = require('chalk');

const HOST = process.env.HOST || '0.0.0.0';
module.exports = (devConfig, port) => {
  const compiler = webpack(devConfig);
  const devServer = new webpackDevServer(compiler, {
    noInfo: true,
    hot: true,
    inline: true,
    historyApiFallback: true,
    stats: 'errors-only',
    open: true,
  });
  devServer.listen(port, HOST, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(chalk.cyan('\nStarting the development server...\n'));
  });
};
