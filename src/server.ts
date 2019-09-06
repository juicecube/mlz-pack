import express from 'express';
import historyApiFallback from 'connect-history-api-fallback';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import { BaseConfig } from './types';
const app = express();
export default (devConfig:BaseConfig, port:string) => {
  const compiler = webpack(devConfig);
  const webpackDevServer = webpackDevMiddleware(compiler, {
    noInfo: false,
    hot: true,
    color: true,
    stats: 'errors-only',
  });
  app.use(historyApiFallback({ verbose: false }));
  app.use(webpackDevServer);
  app.use(webpackHotMiddleware(compiler));
  app.listen(port, function() {
    console.log(`listening on http://127.0.0.1:${port}`);
  });
};
