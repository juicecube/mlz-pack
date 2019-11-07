import webpack from 'webpack';
import webpackDevServer from 'webpack-dev-server';
import chalk from 'chalk';
import { BaseConfig } from '../types';

const HOST = process.env.HOST || '0.0.0.0';
export default (devConfig:BaseConfig, port:string) => {
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
