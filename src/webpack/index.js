const webpack = require('webpack');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const fs = require('fs');
const path = require('path');
const ncp = require('ncp').ncp;
// const merge = require('webpack-merge');

const devCfg = require('./dev.config.js');
const prodCfg = require('./product.config');
// const happyCfg = require('./happy');
// const dllCfg = require('./webpack.dll.config');
const config = require('./config');
const Server = require('./devServer');

function build(baseCfg, cb) {
  const webpackConfig = getWebpackConfig(baseCfg);
  const compiler = webpack(webpackConfig, (err, stats) => {
    if (err) {
      console.log(err);
      process.exit(2);
    }
    console.log(stats && stats.toString({
      chunks: false,
      colors: true,
      children: false,
    }));
  });
  compiler.plugin('done', () => {
    cb && cb(compiler);
  });
}

function serve(baseCfg, cb) {
  const webpackConfig = getWebpackConfig(baseCfg);
  Server(webpackConfig, { port: config.get().devServer.port }, cb);
}

function getWebpackConfig(baseCfg) {
  if (fs.existsSync(path.join(process.cwd(), 'webpack.config.js'))) {
    const configs = require(path.join(process.cwd(), 'webpack.config.js'));
    return configs;
  }
  config.init(baseCfg);
  let webpackConfig;
  // 打包速度分析工具
  const smp = new SpeedMeasurePlugin();
  if (!baseCfg.isDev) {
    // 正式环境
    webpackConfig = prodCfg();
  } else {
    webpackConfig = devCfg();
  }
  // webpackConfig = merge(webpackConfig, happyCfg());
  webpackConfig = smp.wrap(webpackConfig);
  return webpackConfig;
}

function eject() {
  const sourcePath = __dirname;
  const destPath = path.resolve(process.cwd(), 'webpack');
  const tempFile = path.resolve(__dirname, 'webpack.config.temp');
  const destWebpackConfig = path.resolve(process.cwd(), 'webpack.config.js');
  const noEjectFiles = [
    path.resolve(process.cwd(), 'webpack/webpack.config.temp'), 
    path.resolve(process.cwd(), 'webpack/index.js'),
  ];


  ncp(sourcePath, destPath, (err) => {
    if (err) {
      return console.error(err);
    }
   
    fs.copyFile(tempFile, destWebpackConfig, (err) => {
      if (err) {throw err;}
      for (let i = 0; i < noEjectFiles.length; i++) {
        fs.unlink(noEjectFiles[i], (err) => {
          if (err) {
            console.error(err)
            return
          }
        });
      }
      console.log('Eject done!');
    });
  });
}

module.exports = { build, serve, eject };